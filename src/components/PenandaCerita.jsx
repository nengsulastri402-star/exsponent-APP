import { useState } from 'react'
import { catatJawaban } from '../lib/logger'
import Matematika from './Matematika.jsx'
import Tombol from './Tombol.jsx'

// F8 — Penanda informasi pada soal cerita. Siswa mengetuk bagian teks lalu
// memilih perannya (jumlah awal, basis, banyak kali, total waktu, ...).
// Penanda memakai KATA di samping warna. Hasil tanda dicatat.

const WARNA = [
  'bg-basis-lembut border-basis',
  'bg-pangkat-lembut border-pangkat',
  'bg-benar-lembut border-benar',
  'bg-perhatian-lembut border-perhatian',
]

export default function PenandaCerita({ soal, cerita, onSelesai }) {
  const [ditandai, setDitandai] = useState({}) // indeks bagian → id peran
  const [dipilih, setDipilih] = useState(null)
  const [umpan, setUmpan] = useState('')
  const [hitungBenar, setHitungBenar] = useState(!cerita.hitung)

  const wajib = cerita.bagian.map((b, i) => (b.peran ? i : null)).filter((i) => i !== null)
  const semuaTertanda = wajib.every((i) => ditandai[i])
  const selesai = semuaTertanda && hitungBenar
  const warnaPeran = (id) => WARNA[cerita.peran.findIndex((p) => p.id === id) % WARNA.length]
  const labelPeran = (id) => cerita.peran.find((p) => p.id === id)?.label

  function pilihPeran(peranId) {
    const bagian = cerita.bagian[dipilih]
    const benar = bagian.peran === peranId
    catatJawaban({
      modul: soal.modul,
      butir: `${soal.id}-tanda`,
      jawaban: `${bagian.t.trim()} → ${peranId}`,
      benar,
    })
    if (benar) {
      setDitandai((d) => ({ ...d, [dipilih]: peranId }))
      setDipilih(null)
      setUmpan('')
    } else {
      setUmpan(bagian.catatan || 'Bukan itu. Coba peran yang lain.')
    }
  }

  function pilihHitung(p) {
    const benar = p === cerita.hitung.benar
    catatJawaban({
      modul: soal.modul,
      butir: `${soal.id}-hitung`,
      jawaban: p,
      benar,
    })
    if (benar) {
      setHitungBenar(true)
      setUmpan('')
    } else {
      setUmpan(cerita.hitung.catatan)
    }
  }

  return (
    <div className="space-y-4">
      <p className="font-semibold text-teks">Ketuk bagian yang bergaris putus-putus, lalu pilih perannya.</p>

      <p className="rounded-xl bg-kartu p-4 text-lg text-teks ring-1 ring-garis">
        {cerita.bagian.map((b, i) =>
          b.peran ? (
            <span key={i} className="inline-block align-baseline">
              <button
                type="button"
                onClick={() => {
                  if (!ditandai[i]) {
                    setDipilih(i)
                    setUmpan('')
                  }
                }}
                aria-label={`Bagian: ${b.t}${ditandai[i] ? `, sudah ditandai ${labelPeran(ditandai[i])}` : ''}`}
                className={`min-h-9 rounded-lg border-2 px-1.5 font-semibold ${
                  ditandai[i]
                    ? warnaPeran(ditandai[i])
                    : `border-dashed ${dipilih === i ? 'border-basis bg-basis-lembut' : 'border-garis'}`
                }`}
              >
                <Matematika teks={b.t} />
              </button>
              {ditandai[i] && (
                <span className="ml-1 text-xs font-bold text-teks-pelan">[{labelPeran(ditandai[i])}]</span>
              )}
            </span>
          ) : (
            <span key={i}>
              <Matematika teks={b.t} />
            </span>
          ),
        )}
      </p>

      {dipilih !== null && (
        <div role="group" aria-label="Pilih peran" className="space-y-2">
          <p className="font-semibold text-teks">Bagian ini adalah…</p>
          <div className="grid gap-2">
            {cerita.peran.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => pilihPeran(p.id)}
                className="min-h-12 rounded-xl border-2 border-garis bg-kartu px-3 text-left font-semibold text-teks"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {semuaTertanda && cerita.hitung && !hitungBenar && (
        <div role="group" aria-label={cerita.hitung.tanya} className="space-y-2">
          <p className="font-semibold text-teks">{cerita.hitung.tanya}</p>
          <div className="grid grid-cols-3 gap-2">
            {cerita.hitung.pilihan.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => pilihHitung(p)}
                className="min-h-12 rounded-xl border-2 border-garis bg-kartu text-xl font-bold text-teks"
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      )}

      {umpan && (
        <p role="alert" className="rounded-lg bg-perhatian-lembut px-3 py-2 text-perhatian">
          {umpan}
        </p>
      )}

      {selesai && (
        <div className="space-y-3">
          <div role="status" className="rounded-xl bg-benar-lembut px-4 py-3 text-center">
            <p className="text-sm font-semibold text-benar">
              Semua bagian sudah benar. Bentuknya: {cerita.rumusKata}
            </p>
            <Matematika teks={cerita.rumus} gaya="soal" />
          </div>
          <Tombol penuh onClick={onSelesai}>
            Lanjut ke soal
          </Tombol>
        </div>
      )}
    </div>
  )
}
