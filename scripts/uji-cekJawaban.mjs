// Uji otomatis pemeriksa jawaban: jalankan dengan `npm run uji`.
// Memastikan setiap kunci diterima, setiap jawaban miskonsepsi dikenali (dan
// bukan jawaban benar), dan beberapa kasus penulisan lain.
import soal from '../src/data/soal.json' with { type: 'json' }
import katalog from '../src/data/miskonsepsi.json' with { type: 'json' }
import { analisis, periksa, ujiAngkaKecil } from '../src/lib/cekJawaban.js'

let gagal = 0
let lulus = 0
const cek = (ok, pesan) => {
  if (ok) lulus++
  else {
    gagal++
    console.error('GAGAL:', pesan)
  }
}

const semua = Object.values(soal).flat()

for (const s of semua) {
  for (const k of s.kunci) {
    const h = periksa(s, k)
    cek(h.status === 'benar', `${s.id}: kunci "${k}" harus benar, dapat ${JSON.stringify(h)}`)
  }
  for (const [jawab, kode] of Object.entries(s.miskonsepsi || {})) {
    cek(Boolean(katalog[kode]), `${s.id}: kode ${kode} tidak ada di katalog`)
    // Jawaban miskonsepsi tidak boleh sama dengan kunci.
    const a = analisis(jawab)
    cek(
      !s.kunci.some((k) => analisis(k).normal === a.normal),
      `${s.id}: "${jawab}" ternyata sama dengan kunci`,
    )
  }
}

// Penulisan lain yang harus diterima.
const uji = (id, jawab, harapan) => {
  const s = semua.find((x) => x.id === id)
  const h = periksa(s, jawab)
  cek(h.status === harapan, `${id} "${jawab}": harapan ${harapan}, dapat ${h.status}`)
}
uji('pre-1', '5^5', 'benar')
uji('pre-1', '5⁵', 'benar')
uji('pre-1', '3125', 'benar')
uji('pre-1', '5^3*5^2', 'benar')
uji('pre-6', '0.001', 'benar')
uji('pre-6', '10^-3', 'format')
uji('pre-5', '9/10', 'salah')
uji('pre-5', '1,1111', 'salah')
uji('m1-01', '2^5', 'benar')
uji('m1-01', '32', 'format')
uji('m1-01', '2^6', 'salah')
uji('m1-03', 'a^5', 'benar')
uji('m1-03', 'A ^ 5', 'benar')
uji('m1-03', 'a⁵', 'benar')
uji('m1-03', '', 'kosong')
uji('m1-03', 'a^', 'format')
uji('m3-06', '9', 'benar')
uji('m3-06', '-9', 'salah')
uji('m3-07', '-9', 'benar')
uji('m3-07', '−9', 'benar')
uji('m3-07', '9', 'salah')
uji('m3-02', '1/10', 'benar')
uji('m3-02', '0,1', 'benar')
uji('m3-02', '1/0', 'format')
uji('diag-4', '-4', 'benar')
uji('diag-1', '7*8', 'format')

// Miskonsepsi yang terdeteksi benar-benar mengembalikan kodenya.
const m = (id, jawab, kode) => {
  const s = semua.find((x) => x.id === id)
  const h = periksa(s, jawab)
  cek(h.status === 'salah' && h.kode === kode, `${id} "${jawab}": harapan ${kode}, dapat ${JSON.stringify(h)}`)
}
m('m1-01', '2^6', 'M2')
m('m1-01', '4^5', 'M4')
m('m1-04', '2^4', 'M9')
m('m1-05', '2^6', 'M10')
m('m2-01', '5^11', 'M3')
m('m3-01', '0', 'M6')
m('m3-06', '-9', 'M5')

// F10
const f10 = ujiAngkaKecil('a^2 × a^3', 'a^5', 2)
cek(f10 && f10.cocok && f10.soal === '32', 'uji angka kecil benar')
const f10b = ujiAngkaKecil('a^2 × a^3', 'a^6', 2)
cek(f10b && !f10b.cocok, 'uji angka kecil salah')

console.log(`${lulus} lulus, ${gagal} gagal (dari ${semua.length} soal)`)
process.exit(gagal ? 1 : 0)
