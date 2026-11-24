// Pembantu bersama untuk fungsi server (awalan _ berarti bukan alamat publik di Vercel).
// Kunci API hanya dibaca dari GEMINI_API_KEY di server; jangan pakai awalan VITE_.

export const potong = (v, n) => String(v ?? '').replace(/\s+/g, ' ').trim().slice(0, n)

export function kirim(res, status, isi) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.setHeader('Cache-Control', 'no-store')
  res.end(JSON.stringify(isi))
}

export async function bacaBadan(req) {
  if (req.body !== undefined && req.body !== null) {
    return typeof req.body === 'string' ? JSON.parse(req.body) : req.body
  }
  const bagian = []
  let total = 0
  for await (const b of req) {
    total += b.length
    if (total > 30000) throw new Error('terlalu_besar')
    bagian.push(b)
  }
  return JSON.parse(Buffer.concat(bagian).toString('utf8') || '{}')
}

// true bila permintaan datang dari situs lain.
export function asalDitolak(req) {
  const asal = req.headers.origin
  if (!asal) return false
  try {
    return new URL(asal).host !== req.headers.host
  } catch {
    return true
  }
}

// Pembatas kecepatan sederhana per IP dan per fungsi (berlaku per instans server).
const catatan = new Map()
export function terlaluSering(req, nama, maks) {
  const ip = String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'x').split(',')[0].trim()
  const kunci = `${nama}:${ip}`
  const sekarang = Date.now()
  const daftar = (catatan.get(kunci) || []).filter((t) => sekarang - t < 10 * 60 * 1000)
  if (daftar.length >= maks) {
    catatan.set(kunci, daftar)
    return true
  }
  daftar.push(sekarang)
  catatan.set(kunci, daftar)
  if (catatan.size > 5000) catatan.clear()
  return false
}

// Penyedia AI: hanya Gemini (Google), lewat endpoint yang kompatibel dengan format
// "chat completions". Kunci dibaca dari GEMINI_API_KEY di server.
// Nama model sering berganti, jadi beberapa nama dicoba berurutan dan yang berhasil diingat.
// Spasi, baris baru, dan tanda petik di tepi kunci (sering terbawa saat menempel) dibuang.
const bersihKunci = (k) => String(k ?? '').trim().replace(/^["']+|["']+$/g, '').trim()

function penyedia() {
  const e = process.env
  return {
    nama: 'gemini',
    kunci: bersihKunci(e.GEMINI_API_KEY),
    alamat: e.GEMINI_URL || 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions',
    model: [e.GEMINI_MODEL, 'gemini-3.5-flash', 'gemini-3.1-flash-lite', 'gemini-3.8-flash', 'gemini-3.5-flash-lite', 'gemini-flash-latest'],
    // Model Gemini "berpikir" dulu. 'low' menjaga cepat; bila model menolak, parameter ini dibuang otomatis.
    tambahan: { reasoning_effort: e.GEMINI_BERPIKIR || 'low' },
    kaliToken: 3,
  }
}

export const adaKunci = () => Boolean(penyedia().kunci)

const terbukti = {}
const tanpaBerpikir = new Set()

// Memanggil penyedia AI. Mengembalikan { teks } atau { galat, status }.
// Galat khusus: kuota_habis (429), kunci_tidak_valid, model_tidak_ada.
export async function tanyaAI({ messages, maxTokens, temperature = 0.3, waktuMs = 20000 }) {
  const p = penyedia()
  const daftar = [...new Set([p.model[0], terbukti[p.nama], ...p.model.slice(1)].filter(Boolean))]
  const mulai = Date.now()
  let terakhir = 0
  let macet = false
  const jatahMs = Number(process.env.GEMINI_JATAH_MS) || 9000
  for (const model of daftar) {
    const sisa = waktuMs - (Date.now() - mulai)
    if (sisa < 2000) return { galat: 'waktu_habis', status: 504 }
    const batas = new AbortController()
    // Tiap model diberi jatah terbatas; bila macet, pindah ke model berikutnya.
    const timer = setTimeout(() => batas.abort(), Math.min(sisa, jatahMs))
    try {
      const r = await fetch(p.alamat, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${p.kunci}` },
        body: JSON.stringify({
          model,
          temperature,
          max_tokens: maxTokens * p.kaliToken,
          messages,
          ...(tanpaBerpikir.has(model) ? {} : p.tambahan),
        }),
        signal: batas.signal,
      })
      if (r.status === 401 || r.status === 403) return { galat: 'kunci_tidak_valid', status: 503 }
      if (r.status === 429) return { galat: 'kuota_habis', status: 429 }
      if (r.status === 400 || r.status === 404 || r.status === 422) {
        const isi = await r.text().catch(() => '')
        if (/api[_ ]key/i.test(isi)) return { galat: 'kunci_tidak_valid', status: 503 }
        if (r.status === 400 && !tanpaBerpikir.has(model)) {
          tanpaBerpikir.add(model) // model ini menolak parameter berpikir: ulangi tanpa itu
          daftar.splice(daftar.indexOf(model) + 1, 0, model)
        }
        continue // nama model atau parameter mungkin tidak dikenal
      }
      if (!r.ok) {
        // Galat 5xx dari Google (mis. model sedang sibuk): coba model berikutnya.
        terakhir = r.status
        continue
      }
      const data = await r.json()
      const teks = data?.choices?.[0]?.message?.content
      if (!teks) return { galat: 'balasan_kosong', status: 502 }
      terbukti[p.nama] = model
      return { teks }
    } catch (err) {
      if (err?.name === 'AbortError') {
        macet = true
        continue // model ini terlalu lama: coba yang lain
      }
      return { galat: 'jaringan_gagal', status: 502 }
    } finally {
      clearTimeout(timer)
    }
  }
  if (macet) return { galat: 'waktu_habis', status: 504 }
  if (terakhir) return { galat: 'penyedia_gagal', status: 502, kodeAsal: terakhir }
  return { galat: 'model_tidak_ada', status: 502 }
}

// Versi mengalir: teks dikirim sepotong demi sepotong lewat `saatTeks` begitu Google
// mulai menulis, jadi siswa melihat kata pertama dalam 1-2 detik. Mengembalikan { teks }
// atau { galat, status } (galat hanya bila belum ada teks yang terkirim).
export async function tanyaAIAlir({ messages, maxTokens, temperature = 0.3, waktuMs = 28000 }, saatTeks) {
  const p = penyedia()
  const daftar = [...new Set([p.model[0], terbukti[p.nama], ...p.model.slice(1)].filter(Boolean))]
  const mulai = Date.now()
  const jatahMs = Number(process.env.GEMINI_JATAH_MS) || 9000
  let terakhir = 0
  let macet = false
  for (const model of daftar) {
    const sisa = waktuMs - (Date.now() - mulai)
    if (sisa < 2000) break
    const batas = new AbortController()
    // Sampai kata pertama datang, jatahnya terbatas; sesudahnya boleh sampai waktu total habis.
    let timer = setTimeout(() => batas.abort(), Math.min(sisa, jatahMs))
    let penuh = ''
    try {
      const r = await fetch(p.alamat, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${p.kunci}` },
        body: JSON.stringify({
          model,
          temperature,
          max_tokens: maxTokens * p.kaliToken,
          messages,
          stream: true,
          ...(tanpaBerpikir.has(model) ? {} : p.tambahan),
        }),
        signal: batas.signal,
      })
      if (r.status === 401 || r.status === 403) return { galat: 'kunci_tidak_valid', status: 503 }
      if (r.status === 429) return { galat: 'kuota_habis', status: 429 }
      if (r.status === 400 || r.status === 404 || r.status === 422) {
        const isi = await r.text().catch(() => '')
        if (/api[_ ]key/i.test(isi)) return { galat: 'kunci_tidak_valid', status: 503 }
        if (r.status === 400 && !tanpaBerpikir.has(model)) {
          tanpaBerpikir.add(model)
          daftar.splice(daftar.indexOf(model) + 1, 0, model)
        }
        continue
      }
      if (!r.ok) {
        terakhir = r.status
        continue
      }
      const baca = r.body.getReader()
      const dekode = new TextDecoder()
      let sisaBaris = ''
      let selesai = false
      while (!selesai) {
        const { done, value } = await baca.read()
        if (done) break
        sisaBaris += dekode.decode(value, { stream: true })
        const baris = sisaBaris.split('\n')
        sisaBaris = baris.pop()
        for (const b of baris) {
          const t = b.trim()
          if (!t.startsWith('data:')) continue
          const isi = t.slice(5).trim()
          if (isi === '[DONE]') {
            selesai = true
            break
          }
          let potongan = ''
          try {
            potongan = JSON.parse(isi)?.choices?.[0]?.delta?.content || ''
          } catch {
            continue
          }
          if (!potongan) continue
          if (!penuh) {
            clearTimeout(timer)
            timer = setTimeout(() => batas.abort(), Math.max(1000, waktuMs - (Date.now() - mulai)))
          }
          penuh += potongan
          saatTeks(potongan)
        }
      }
      if (penuh) {
        terbukti[p.nama] = model
        return { teks: penuh }
      }
      continue // aliran kosong: coba model berikutnya
    } catch (err) {
      if (penuh) return { teks: penuh, terpotong: true }
      if (err?.name === 'AbortError') {
        macet = true
        continue
      }
      return { galat: 'jaringan_gagal', status: 502 }
    } finally {
      clearTimeout(timer)
    }
  }
  if (macet) return { galat: 'waktu_habis', status: 504 }
  if (terakhir) return { galat: 'penyedia_gagal', status: 502, kodeAsal: terakhir }
  return { galat: 'model_tidak_ada', status: 502 }
}

// Pemeriksaan untuk peneliti (api/status.js). Tidak pernah menampilkan kunci utuh.
export async function diagnosa() {
  const p = penyedia()
  const mentah = process.env.GEMINI_API_KEY
  const aman = (t) => String(t ?? '').split(p.kunci || '\u0000').join('***').replace(/\s+/g, ' ').slice(0, 300)
  const hasil = {
    penyedia: p.nama,
    kunciTerisi: Boolean(p.kunci),
    kunciPanjang: p.kunci.length,
    kunciAwal: p.kunci ? p.kunci.slice(0, 3) + '…' : '',
    kunciAdaSpasiAtauPetik: /^\s|\s$|^["']|["']$/.test(String(mentah ?? '')),
    percobaan: [],
  }
  if (!p.kunci) return { ...hasil, kesimpulan: 'Kunci belum terbaca di server. Isi variabel kunci lalu mulai ulang atau Redeploy.' }
  const daftar = [...new Set([p.model[0], ...p.model.slice(1)].filter(Boolean))]
  for (const model of daftar) {
    const catat = { model }
    try {
      const batas = new AbortController()
      const timer = setTimeout(() => batas.abort(), 12000)
      const r = await fetch(p.alamat, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${p.kunci}` },
        body: JSON.stringify({
          model,
          max_tokens: 20 * p.kaliToken,
          messages: [{ role: 'user', content: 'Balas satu kata: ok' }],
          ...p.tambahan,
        }),
        signal: batas.signal,
      }).finally(() => clearTimeout(timer))
      catat.status = r.status
      const isi = await r.text().catch(() => '')
      if (r.ok) {
        catat.hasil = 'BERHASIL'
        hasil.percobaan.push(catat)
        return { ...hasil, kesimpulan: `Berhasil dengan model ${model}. Isi GEMINI_MODEL=${model} bila ingin memaksa model ini.` }
      }
      catat.pesan = aman(isi)
      if (r.status === 400) {
        const ulang = await fetch(p.alamat, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${p.kunci}` },
          body: JSON.stringify({ model, max_tokens: 200, messages: [{ role: 'user', content: 'Balas satu kata: ok' }] }),
        }).catch(() => null)
        if (ulang?.ok) {
          catat.hasil = 'BERHASIL tanpa parameter berpikir'
          hasil.percobaan.push(catat)
          return { ...hasil, kesimpulan: `Berhasil dengan model ${model} (tanpa parameter berpikir).` }
        }
      }
    } catch (err) {
      catat.status = 0
      catat.pesan = err?.name === 'AbortError' ? 'waktu habis' : `server tidak bisa menghubungi penyedia: ${aman(err?.cause?.message || err?.message)}`
    }
    hasil.percobaan.push(catat)
  }
  return { ...hasil, kesimpulan: 'Semua percobaan gagal. Lihat status dan pesan pada tiap percobaan.' }
}

