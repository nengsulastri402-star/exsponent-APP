import Pangkat from './Pangkat.jsx'

// Mengubah teks seperti "5^3 × 5^2" atau "(-3)^2" menjadi tampilan dengan
// komponen <Pangkat /> (F3). Dipakai di SEMUA tempat angka berpangkat muncul.
//   gaya="soal"  : huruf besar dan tebal (untuk soal dan rumus)
//   gaya="prosa" : huruf biasa di dalam kalimat (pangkat tetap ≥ 18 px)

const POLA = /(\((?:-|−)?[0-9]+\)|[0-9]+|[a-z])\^(?:\(([^)]*)\)|((?:-|−)?(?:[0-9]+|[a-z])))/g

// Minus di depan angka/kurung/huruf dijadikan tanda minus sungguhan (−).
const rapikan = (s) => s.replace(/(^|[\s(])-(?=[0-9(a-z])/g, '$1−')

export default function Matematika({ teks, gaya = 'prosa', className = '' }) {
  const s = String(teks ?? '')
  const besar = gaya === 'soal'
  const bagian = []
  let akhir = 0
  const pola = new RegExp(POLA.source, 'g')
  let m
  while ((m = pola.exec(s)) !== null) {
    if (m.index > akhir) bagian.push({ t: s.slice(akhir, m.index) })
    let basis = m[1]
    let kurung = false
    if (basis.startsWith('(')) {
      kurung = true
      basis = basis.slice(1, -1)
    }
    bagian.push({ basis, kurung, pangkat: m[2] ?? m[3] })
    akhir = pola.lastIndex
  }
  if (akhir < s.length) bagian.push({ t: s.slice(akhir) })

  // Jarak baris lebih longgar hanya bila ada pangkat (kapsul pangkat butuh ruang).
  const adaPangkat = bagian.some((b) => b.basis !== undefined)

  return (
    <span
      className={`${
        besar
          ? 'text-[32px] leading-[1.6] font-bold text-teks'
          : adaPangkat
            ? 'leading-[2.1]'
            : 'leading-relaxed'
      } ${className}`}
    >
      {bagian.map((b, i) =>
        b.t !== undefined ? (
          <span key={i}>{rapikan(b.t)}</span>
        ) : (
          <Pangkat
            key={i}
            basis={b.basis}
            pangkat={b.pangkat}
            kurung={b.kurung}
            ukuran="md"
          />
        ),
      )}
    </span>
  )
}
