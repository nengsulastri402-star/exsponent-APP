import { useState } from 'react'
import Pangkat from './Pangkat.jsx'
import Pecahan from './Pecahan.jsx'
import { catatJawaban } from '../lib/logger'

// F4 — Penemu pola pangkat nol dan negatif.
// Baris pangkat turun satu-satu; tiap turun satu pangkat, hasilnya dibagi basis.
// Siswa menebak nilai baris berikutnya SEBELUM nilainya terbuka.
// Props: basis (3), dari (pangkat awal), sampai (pangkat akhir), tampilAwal (baris yang sudah terbuka)

const nilaiTeks = (basis, p) =>
  p >= 0 ? (BigInt(basis) ** BigInt(p)).toString() : `1/${BigInt(basis) ** BigInt(-p)}`

function pilihanUntuk(basis, p) {
  const benar = nilaiTeks(basis, p)
  const k = Math.abs(p)
  const besar = (BigInt(basis) ** BigInt(k)).toString()
  const daftar =
    p === 0
      ? [benar, '0', String(basis)]
      : [benar, `-${besar}`, besar]
  // Urutan diputar supaya jawaban benar tidak selalu di tempat yang sama.
  const geser = (Math.abs(p) + 1) % 3
  return [...daftar.slice(geser), ...daftar.slice(0, geser)]
}

export default function PenemuPola({
  basis = 3,
  dari = 3,
  sampai = 0,
  tampilAwal = 3,
  modul = 3,
  onSelesai,
}) {
  const baris = []
  for (let p = dari; p >= sampai; p--) baris.push(p)

  const [terbuka, setTerbuka] = useState(tampilAwal)
  const [umpan, setUmpan] = useState('')
  const selesai = terbuka >= baris.length
  const berikut = baris[terbuka]

  function tebak(pilihan) {
    const benar = pilihan === nilaiTeks(basis, berikut)
    catatJawaban({
      modul,
      butir: `f4-${basis}-${berikut}`,
      jawaban: pilihan,
      benar,
    })
    if (benar) {
      setUmpan('')
      const baru = terbuka + 1
      setTerbuka(baru)
      if (baru >= baris.length) onSelesai?.()
    } else {
      setUmpan(`Belum tepat. Ingat: tiap turun satu pangkat, hasilnya dibagi ${basis}.`)
    }
  }

  return (
    <div className="space-y-3">
      <ul className="space-y-2">
        {baris.slice(0, terbuka).map((p, i) => (
          <li key={p}>
            {i > 0 && (
              <p className="mb-1 text-center text-sm font-semibold text-pangkat" aria-hidden="true">
                ↓ dibagi {basis}
              </p>
            )}
            <div className="flex items-center justify-center gap-3 rounded-xl bg-kartu px-3 py-2 ring-1 ring-garis">
              <Pangkat basis={String(basis)} pangkat={String(p)} ukuran="md" />
              <span aria-hidden="true" className="text-2xl font-bold">=</span>
              <Pecahan teks={nilaiTeks(basis, p)} className="text-2xl font-bold text-teks" />
            </div>
          </li>
        ))}

        {!selesai && (
          <li>
            <p className="mb-1 text-center text-sm font-semibold text-pangkat" aria-hidden="true">
              ↓ dibagi {basis}
            </p>
            <div className="flex items-center justify-center gap-3 rounded-xl border-2 border-dashed border-pangkat px-3 py-2">
              <Pangkat basis={String(basis)} pangkat={String(berikut)} ukuran="md" />
              <span aria-hidden="true" className="text-2xl font-bold">=</span>
              <span className="text-2xl font-bold text-pangkat">?</span>
            </div>
          </li>
        )}
      </ul>

      {!selesai && (
        <div>
          <p className="mb-2 text-center font-semibold text-teks">Tebak: berapa nilainya?</p>
          <div className="grid grid-cols-3 gap-2" role="group" aria-label="Pilihan nilai">
            {pilihanUntuk(basis, berikut).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => tebak(p)}
                aria-label={`Pilih ${p}`}
                className="min-h-14 rounded-xl border-2 border-garis bg-kartu text-2xl font-bold text-teks"
              >
                <Pecahan teks={p} />
              </button>
            ))}
          </div>
          {umpan && (
            <p role="status" className="mt-3 rounded-lg bg-perhatian-lembut px-3 py-2 text-perhatian">
              {umpan}
            </p>
          )}
        </div>
      )}

      {selesai && (
        <p role="status" className="rounded-lg bg-benar-lembut px-3 py-2 text-center font-semibold text-benar">
          Polanya sudah kelihatan.
        </p>
      )}
    </div>
  )
}
