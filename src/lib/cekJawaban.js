// Pemeriksa jawaban (F9): membaca jawaban siswa, membandingkan dengan kunci,
// dan mengenali miskonsepsi dari jawaban salah (data/miskonsepsi.json).
//
// Bentuk jawaban yang dikenali (siswa boleh mengetik ^ atau superskrip ⁵):
//   5^5   (5)^5   (-3)^2   10^-3        → pangkat
//   m^9   a                              → pangkat dengan variabel
//   3125  -4  1/8  0.125                 → angka
//   9/8   1+1/8   5^3*5^2                → ekspresi (dihitung)

import {
  bagi,
  kali,
  kurang,
  rasional,
  sama,
  tambah,
  teks as teksRasional,
  pangkat as pangkatRasional,
} from './rasional.js'

const SUPERSKRIP = {
  '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4',
  '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9', '⁻': '-',
}

/** Samakan penulisan: superskrip → ^, ×·→*, ÷:→/, minus panjang → -, hapus spasi. */
export function normalisasi(mentah) {
  let s = String(mentah ?? '')
  s = s.replace(/[⁻⁰¹²³⁴⁵⁶⁷⁸⁹]+/g, (m) => '^' + [...m].map((c) => SUPERSKRIP[c]).join(''))
  s = s
    .replace(/[−–—]/g, '-')
    .replace(/[×·]/g, '*')
    .replace(/[÷:]/g, '/')
    .replace(/,/g, '.')
    .replace(/\s+/g, '')
    .toLowerCase()
  return s
}

function dariAngka(str) {
  if (!/^\d+(\.\d+)?$/.test(str)) throw new Error('angka')
  const [bulat, desimal = ''] = str.split('.')
  return rasional(BigInt(bulat + desimal), 10n ** BigInt(desimal.length))
}

function tokenisasi(s) {
  const token = []
  let i = 0
  while (i < s.length) {
    const c = s[i]
    if (/[0-9.]/.test(c)) {
      let j = i
      while (j < s.length && /[0-9.]/.test(s[j])) j++
      token.push({ j: 'num', v: s.slice(i, j) })
      i = j
    } else if ('+-*/^()'.includes(c)) {
      token.push({ j: c })
      i++
    } else {
      throw new Error('karakter')
    }
  }
  return token
}

// Penghitung: tambah/kurang < kali/bagi < minus depan < pangkat.
// Jadi -3^2 = -(3^2) = -9 sedangkan (-3)^2 = 9.
function hitungToken(token) {
  let i = 0
  const intip = () => token[i]
  const ambil = () => token[i++]

  function ekspresi() {
    let kiri = suku()
    while (intip() && (intip().j === '+' || intip().j === '-')) {
      const op = ambil().j
      const kanan = suku()
      kiri = op === '+' ? tambah(kiri, kanan) : kurang(kiri, kanan)
    }
    return kiri
  }
  function suku() {
    let kiri = unary()
    while (intip() && (intip().j === '*' || intip().j === '/')) {
      const op = ambil().j
      const kanan = unary()
      kiri = op === '*' ? kali(kiri, kanan) : bagi(kiri, kanan)
    }
    return kiri
  }
  function unary() {
    if (intip()?.j === '-') {
      ambil()
      const x = unary()
      return rasional(-x.n, x.d)
    }
    return berpangkat()
  }
  function berpangkat() {
    const dasar = atom()
    if (intip()?.j === '^') {
      ambil()
      return pangkatRasional(dasar, unary())
    }
    return dasar
  }
  function atom() {
    const t = ambil()
    if (!t) throw new Error('kurang')
    if (t.j === 'num') return dariAngka(t.v)
    if (t.j === '(') {
      const x = ekspresi()
      if (ambil()?.j !== ')') throw new Error('kurung')
      return x
    }
    throw new Error('atom')
  }

  const hasil = ekspresi()
  if (i !== token.length) throw new Error('sisa')
  return hasil
}

/** Hitung nilai ekspresi yang sudah dinormalisasi. Melempar galat bila tidak valid. */
export function hitungNilai(normal) {
  return hitungToken(tokenisasi(normal))
}

/**
 * Kenali bentuk jawaban.
 * kind: 'kosong' | 'simbolik' | 'pangkat' | 'angka' | 'ekspresi' | 'tak-valid'
 */
export function analisis(mentah) {
  const normal = normalisasi(mentah)
  if (!normal) return { kind: 'kosong', normal }

  let m = normal.match(/^([a-z])(?:\^(-?\d+|\(-?\d+\)))?$/)
  if (m) {
    const e = BigInt((m[2] ?? '1').replace(/[()]/g, ''))
    return { kind: 'simbolik', normal, v: m[1], e }
  }

  try {
    const nilai = hitungNilai(normal)
    m = normal.match(/^(\(-?\d+\)|\d+)\^(\(-?\d+\)|-?\d+)$/)
    if (m) {
      return {
        kind: 'pangkat',
        normal,
        nilai,
        basis: BigInt(m[1].replace(/[()]/g, '')),
        eks: BigInt(m[2].replace(/[()]/g, '')),
      }
    }
    if (/^-?\d+(\.\d+)?$/.test(normal) || /^-?\d+\/\d+$/.test(normal)) {
      return { kind: 'angka', normal, nilai }
    }
    return { kind: 'ekspresi', normal, nilai }
  } catch {
    return { kind: 'tak-valid', normal }
  }
}

function samaBentuk(a, k) {
  if (a.kind === 'simbolik' && k.kind === 'simbolik') return a.v === k.v && a.e === k.e
  if (a.kind === 'pangkat' && k.kind === 'pangkat') return a.basis === k.basis && a.eks === k.eks
  return false
}

function cariMiskonsepsi(soal, a) {
  const peta = soal.miskonsepsi || {}
  if (peta[a.normal]) return peta[a.normal]
  if (a.nilai) {
    const kunciNilai = teksRasional(a.nilai)
    if (peta[kunciNilai]) return peta[kunciNilai]
  }
  return null
}

/**
 * Periksa jawaban siswa untuk satu soal.
 * Mengembalikan { status, pesan?, kode? } dengan status:
 *   'kosong' | 'format' (belum bisa dinilai) | 'benar' | 'salah' (+ kode miskonsepsi)
 */
export function periksa(soal, jawaban) {
  const a = analisis(jawaban)
  if (a.kind === 'kosong') return { status: 'kosong', pesan: 'Tulis jawabanmu dulu.' }
  if (a.kind === 'tak-valid') {
    return {
      status: 'format',
      pesan: 'Jawabanmu belum bisa dibaca. Contoh penulisan: 5^5 atau 1/8.',
    }
  }

  const kunci = soal.kunci.map(analisis)

  if (soal.bentuk === 'pangkat') {
    if (a.kind !== 'pangkat' && a.kind !== 'simbolik') {
      return {
        status: 'format',
        pesan: 'Tulis dalam bentuk pangkat, contoh: 5^5 (pakai tombol ^).',
      }
    }
    if (kunci.some((k) => samaBentuk(a, k))) return { status: 'benar' }
    return { status: 'salah', kode: cariMiskonsepsi(soal, a) }
  }

  // bentuk "nilai"
  if (a.kind === 'simbolik') {
    return { status: 'format', pesan: 'Jawaban soal ini berupa angka, bukan huruf.' }
  }
  if (soal.hanyaAngka && a.kind !== 'angka') {
    return {
      status: 'format',
      pesan: 'Tulis hasil akhirnya saja, contoh: 56 atau 1/8.',
    }
  }
  if (kunci.some((k) => k.nilai && sama(a.nilai, k.nilai))) return { status: 'benar' }
  return { status: 'salah', kode: cariMiskonsepsi(soal, a) }
}

/**
 * F10: uji dengan angka kecil. Ganti semua huruf dengan `nilai`, lalu hitung
 * soal dan jawaban siswa. Mengembalikan null bila tidak bisa dihitung.
 */
export function ujiAngkaKecil(soalTeks, jawabanTeks, nilai) {
  const ganti = (t) => normalisasi(t).replace(/[a-z]/g, `(${nilai})`)
  try {
    const a = hitungNilai(ganti(soalTeks))
    const b = hitungNilai(ganti(jawabanTeks))
    return { soal: teksRasional(a), jawaban: teksRasional(b), cocok: sama(a, b) }
  } catch {
    return null
  }
}

export { teksRasional }
