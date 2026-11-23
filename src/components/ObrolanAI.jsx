import { useEffect, useRef, useState } from 'react'
import { getKonteks } from '../lib/konteks.js'
import { useSiswa } from '../lib/siswaContext.js'
import Matematika from './Matematika.jsx'

// Obrolan bebas siswa dengan AI (Gemini lewat /api/chat). Riwayat disimpan
// hanya di perangkat siswa (localStorage), bukan di database.

const CONTOH = ['Apa arti 3^4?', 'Kenapa a^0 = 1?', 'Apa bedanya 2^3 dan 2 × 3?']
const MAKS_RIWAYAT = 30

// Penjelasan untuk peneliti, ditampilkan kecil di bawah pesan galat siswa.
const INFO_GALAT = {
  belum_diatur: 'Kunci AI belum terbaca di server. Isi GEMINI_API_KEY: di komputer lewat .env lalu mulai ulang npm run dev; di Vercel lewat Environment Variables lalu Redeploy.',
  kunci_tidak_valid: 'Kunci AI terbaca tetapi ditolak penyedia. Buat kunci baru, tempel tanpa spasi atau tanda petik, lalu mulai ulang atau Redeploy.',
  model_tidak_ada: 'Nama model AI tidak dikenal. Isi GEMINI_MODEL dengan nama model dari AI Studio.',
  jaringan_gagal: 'Server tidak bisa menghubungi penyedia AI. Buka /api/status untuk melihat penyebabnya.',
  penyedia_gagal: 'Penyedia AI sedang bermasalah. Coba lagi sebentar.',
  waktu_habis: 'Penyedia AI terlalu lama menjawab. Coba lagi.',
  kuota_habis: 'Batas pemakaian gratis penyedia AI tercapai. Tunggu beberapa saat.',
  asal_ditolak: 'Permintaan ditolak karena berasal dari alamat lain.',
}

const PESAN_GALAT = {
  503: 'Kak AI belum diaktifkan. Beri tahu kakak peneliti.',
  402: 'Kak AI sedang tidak tersedia. Beri tahu kakak peneliti.',
  429: 'Terlalu banyak pertanyaan dalam waktu singkat. Tunggu sebentar, lalu coba lagi.',
}

function Teks({ teks }) {
  return (
    <>
      {teks.split('\n').map((baris, i) => (
        <p key={i} className={i ? 'mt-2' : ''}>
          <Matematika teks={baris} />
        </p>
      ))}
    </>
  )
}

export default function ObrolanAI({ modul }) {
  const { siswa } = useSiswa()
  const kunci = `eksponen.obrolan.${siswa.kode}`
  const [pesan, setPesan] = useState(() => {
    try {
      const v = JSON.parse(localStorage.getItem(kunci) || '[]')
      return Array.isArray(v) ? v.slice(-MAKS_RIWAYAT) : []
    } catch {
      return []
    }
  })
  const [isi, setIsi] = useState('')
  const [memuat, setMemuat] = useState(false)
  const [galat, setGalat] = useState('')
  const [info, setInfo] = useState('')
  const [sedang, setSedang] = useState('') // teks yang sedang ditulis AI
  const ujung = useRef(null)

  useEffect(() => {
    try {
      localStorage.setItem(kunci, JSON.stringify(pesan.slice(-MAKS_RIWAYAT)))
    } catch {
      // abaikan
    }
    ujung.current?.scrollIntoView?.({ block: 'end' })
  }, [pesan, memuat, galat, kunci, sedang])

  async function minta(daftar) {
    setMemuat(true)
    setGalat('')
    setInfo('')
    try {
      const k = getKonteks()
      const r = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pesan: daftar.slice(-8), modul, konteks: k, alir: true }),
      })
      if (!r.ok) {
        setGalat(PESAN_GALAT[r.status] || 'Belum bisa menjawab. Periksa internetmu, lalu coba lagi.')
        const badan = await r.json().catch(() => null)
        setInfo(
          (INFO_GALAT[badan?.error] ? INFO_GALAT[badan.error] + (badan?.kode ? ` (kode dari Google: ${badan.kode})` : '') : '') ||
            (r.status === 404
              ? 'Fungsi /api/chat tidak ditemukan. Di Vercel, pastikan folder api ikut terunggah ke GitHub.'
              : `Kode respons ${r.status}. Buka /api/status untuk melihat penyebabnya.`),
        )
        return
      }
      if ((r.headers.get('content-type') || '').includes('text/plain') && r.body) {
        const baca = r.body.getReader()
        const dekode = new TextDecoder()
        let penuh = ''
        for (;;) {
          const { done, value } = await baca.read()
          if (done) break
          penuh += dekode.decode(value, { stream: true })
          setSedang(penuh.replace(/\n{3,}/g, '\n\n').slice(0, 2500))
        }
        const akhir = penuh.replace(/\n{3,}/g, '\n\n').trim().slice(0, 2500)
        if (akhir) setPesan((p) => [...p, { dari: 'ai', teks: akhir }])
        return
      }
      const { teks } = await r.json()
      setPesan((p) => [...p, { dari: 'ai', teks }])
    } catch {
      setGalat('Belum bisa menjawab. Periksa internetmu, lalu coba lagi.')
      setInfo('Tidak sampai ke server. Periksa internet, atau pastikan npm run dev masih berjalan.')
    } finally {
      setSedang('')
      setMemuat(false)
    }
  }

  function kirim(teks) {
    const t = teks.trim()
    if (!t || memuat) return
    const baru = [...pesan, { dari: 'siswa', teks: t.slice(0, 400) }]
    setPesan(baru)
    setIsi('')
    minta(baru)
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div role="log" aria-live="polite" className="min-h-0 flex-1 space-y-3 overflow-y-auto px-1 pb-3">
        {pesan.length === 0 && (
          <div className="space-y-3 rounded-xl bg-kartu p-4 ring-1 ring-garis">
            <p className="text-lg text-teks">
              Halo! Aku Kak AI. Tanyakan apa saja tentang bilangan berpangkat, ya.
            </p>
            <div className="flex flex-wrap gap-2">
              {CONTOH.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => kirim(c)}
                  className="min-h-11 rounded-xl border-2 border-garis bg-latar px-3 text-left text-teks"
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}

        {pesan.map((p, i) =>
          p.dari === 'siswa' ? (
            <div key={i} className="ml-8 rounded-2xl rounded-br-sm bg-basis px-4 py-2 text-lg text-white">
              {p.teks}
            </div>
          ) : (
            <div key={i} className="mr-8 rounded-2xl rounded-bl-sm bg-kartu px-4 py-2 text-lg text-teks ring-1 ring-garis">
              <p className="text-sm font-bold text-basis">Kak AI</p>
              <Teks teks={p.teks} />
            </div>
          ),
        )}

        {memuat && sedang && (
          <div className="mr-8 rounded-2xl rounded-bl-sm bg-kartu px-4 py-2 text-lg text-teks ring-1 ring-garis">
            <p className="text-sm font-bold text-basis">Kak AI</p>
            <Teks teks={sedang} />
          </div>
        )}
        {memuat && !sedang && (
          <p className="mr-8 rounded-2xl bg-kartu px-4 py-2 text-teks-pelan ring-1 ring-garis">
            Kak AI sedang menulis…
          </p>
        )}
        {galat && (
          <div role="alert" className="rounded-xl bg-perhatian-lembut px-4 py-3 text-perhatian ring-1 ring-perhatian/40">
            <p>{galat}</p>
            {info && <p className="mt-2 border-t border-perhatian/30 pt-2 text-sm">Info untuk peneliti: {info}</p>}
            {pesan.length > 0 && pesan[pesan.length - 1].dari === 'siswa' && (
              <button
                type="button"
                onClick={() => minta(pesan)}
                disabled={memuat}
                className="mt-2 min-h-11 rounded-lg border-2 border-perhatian px-4 font-semibold"
              >
                Coba lagi
              </button>
            )}
          </div>
        )}
        <div ref={ujung} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          kirim(isi)
        }}
        className="space-y-2 border-t border-garis pt-3"
      >
        <label htmlFor="tanya-ai" className="sr-only">
          Pertanyaanmu
        </label>
        <textarea
          id="tanya-ai"
          value={isi}
          onChange={(e) => setIsi(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
              e.preventDefault()
              kirim(isi)
            }
          }}
          maxLength={400}
          rows={2}
          placeholder="Tulis pertanyaanmu di sini"
          className="w-full resize-none rounded-xl border-2 border-garis bg-kartu px-3 py-2 text-lg text-teks"
        />
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={memuat || !isi.trim()}
            aria-label="Kirim pertanyaan"
            className="min-h-12 flex-1 rounded-xl bg-basis px-4 text-lg font-bold text-white disabled:opacity-40"
          >
            Kirim
          </button>
          {pesan.length > 0 && (
            <button
              type="button"
              onClick={() => {
                setPesan([])
                setGalat('')
                setInfo('')
              }}
              aria-label="Hapus obrolan"
              className="min-h-12 rounded-xl border-2 border-garis bg-kartu px-4 font-semibold text-teks"
            >
              Hapus
            </button>
          )}
        </div>
        <p className="text-sm text-teks-pelan">
          AI bisa keliru. Cocokkan dengan penjelasan di modul. Jangan menulis nama atau nomor HP.
        </p>
      </form>
    </div>
  )
}
