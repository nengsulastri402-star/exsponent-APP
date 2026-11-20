import { useEffect, useState } from 'react'
import Pangkat from './Pangkat.jsx'
import Tombol from './Tombol.jsx'

// F1 — Pembongkar konsep. Siswa mengetuk untuk membongkar pangkat menjadi
// perkalian berulang, satu langkah per ketukan (tanpa putar otomatis).
//   mode="jabar" : 3^4 → 3 × 3 × 3 × 3
//   mode="bukti" : 5^3 × 5^2 → (5×5×5) × (5×5) → hitung faktor → 5^5
//   mode="bagi"  : 7^6 ÷ 7^4 → faktor dicoret sepasang-sepasang → 7^2
// `pilihan` (opsional) menampilkan beberapa contoh yang bisa dipilih siswa.

const Kali = () => (
  <span aria-hidden="true" className="mx-0.5 text-xl font-bold text-teks-pelan">
    ×
  </span>
)

function Faktor({ basis, tampil = true, coret = false, sisa = false }) {
  return (
    <span
      aria-hidden={!tampil}
      className={`inline-flex min-h-10 min-w-7 items-center justify-center rounded-lg px-1 text-2xl font-bold transition-opacity duration-300 ${
        tampil ? 'text-basis' : 'border border-dashed border-garis text-transparent'
      } ${coret ? 'line-through decoration-2 opacity-40' : ''} ${sisa ? 'bg-benar-lembut' : ''}`}
    >
      {basis}
    </span>
  )
}

function Deret({ basis, jumlah, tampilSampai = jumlah, dicoret = 0, sisaDari = null }) {
  return (
    <span className="flex flex-wrap items-center justify-center gap-y-1">
      {Array.from({ length: jumlah }).map((_, i) => (
        <span key={i} className="inline-flex items-center">
          {i > 0 && <Kali />}
          <Faktor
            basis={basis}
            tampil={i < tampilSampai}
            coret={i < dicoret}
            sisa={sisaDari !== null && i >= sisaDari}
          />
        </span>
      ))}
    </span>
  )
}

function Garis({ children, className = '' }) {
  return <div className={`rounded-xl bg-latar px-3 py-2 text-center ${className}`}>{children}</div>
}

// ---------------------------------------------------------------- jabar

function Jabar({ basis, pangkat, onSelesai }) {
  const [n, setN] = useState(0)
  useEffect(() => {
    if (n === pangkat) onSelesai?.()
  }, [n, pangkat, onSelesai])
  const nilai = (BigInt(basis) ** BigInt(pangkat)).toString()

  return (
    <div className="space-y-4 text-center">
      <button
        type="button"
        onClick={() => setN((v) => Math.min(v + 1, pangkat))}
        disabled={n >= pangkat}
        aria-label={`Ketuk untuk membongkar ${basis} pangkat ${pangkat}`}
        className="mx-auto block min-h-16 rounded-2xl border-2 border-garis bg-kartu px-8 py-4"
      >
        <Pangkat basis={String(basis)} pangkat={String(pangkat)} ukuran="xl" />
      </button>

      <div aria-live="polite" className="min-h-14">
        <Deret basis={basis} jumlah={pangkat} tampilSampai={n} />
      </div>

      <p className="min-h-6 text-teks-pelan">
        {n === 0 && 'Ketuk pangkatnya untuk membongkar.'}
        {n > 0 && n < pangkat && `Sudah ${n} faktor ${basis}.`}
        {n === pangkat && (
          <>
            basis <b className="text-basis">{basis}</b> dipakai{' '}
            <b className="text-pangkat">{pangkat}</b> kali, hasilnya{' '}
            <b className="text-teks">{nilai}</b>.
          </>
        )}
      </p>

      <div className="flex gap-3">
        <Tombol
          penuh
          onClick={() => setN((v) => Math.min(v + 1, pangkat))}
          disabled={n >= pangkat}
        >
          {n === 0 ? 'Bongkar' : 'Ketuk lagi'}
        </Tombol>
        <Tombol varian="sekunder" onClick={() => setN(0)} disabled={n === 0}>
          Ulang
        </Tombol>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------- bukti

function Bukti({ basis, m, n, onSelesai }) {
  const [l, setL] = useState(0)
  useEffect(() => {
    if (l === 3) onSelesai?.()
  }, [l, onSelesai])
  const label = ['Bongkar jadi perkalian', 'Hitung semua faktor', 'Tulis hasilnya', 'Selesai']
  const b = String(basis)

  return (
    <div className="space-y-3 text-center">
      <Garis>
        <Pangkat basis={b} pangkat={String(m)} ukuran="lg" />
        <span aria-hidden="true" className="mx-2 text-2xl font-bold text-teks-pelan">×</span>
        <Pangkat basis={b} pangkat={String(n)} ukuran="lg" />
      </Garis>

      {l >= 1 && (
        <Garis>
          <span className="inline-flex flex-wrap items-center justify-center gap-1">
            <span className="rounded-lg border-2 border-basis/40 px-2">
              <Deret basis={basis} jumlah={m} />
            </span>
            <Kali />
            <span className="rounded-lg border-2 border-pangkat/40 px-2">
              <Deret basis={basis} jumlah={n} />
            </span>
          </span>
        </Garis>
      )}

      {l >= 2 && (
        <Garis>
          <p className="text-lg text-teks">
            Faktor {b}: <b className="text-basis">{m}</b> + <b className="text-pangkat">{n}</b> ={' '}
            <b className="text-teks">{m + n}</b> faktor
          </p>
        </Garis>
      )}

      {l >= 3 && (
        <Garis className="bg-benar-lembut">
          <Pangkat basis={b} pangkat={String(m + n)} ukuran="lg" />
        </Garis>
      )}

      <div className="flex gap-3">
        <Tombol penuh onClick={() => setL((v) => Math.min(v + 1, 3))} disabled={l >= 3}>
          {label[l]}
        </Tombol>
        <Tombol varian="sekunder" onClick={() => setL(0)} disabled={l === 0}>
          Ulang
        </Tombol>
      </div>
    </div>
  )
}

// ----------------------------------------------------------------- bagi

function Bagi({ basis, m, n, onSelesai }) {
  const [l, setL] = useState(0)
  const akhir = n + 2
  useEffect(() => {
    if (l === akhir) onSelesai?.()
  }, [l, akhir, onSelesai])
  const b = String(basis)
  const dicoret = l >= 2 ? Math.min(l - 1, n) : 0
  const label =
    l === 0 ? 'Bongkar jadi faktor' : l <= n ? 'Coret sepasang' : l === n + 1 ? 'Tulis hasilnya' : 'Selesai'

  return (
    <div className="space-y-3 text-center">
      <Garis>
        <span className="inline-flex flex-col items-center">
          {l === 0 ? (
            <Pangkat basis={b} pangkat={String(m)} ukuran="lg" />
          ) : (
            <Deret basis={basis} jumlah={m} dicoret={dicoret} sisaDari={l >= n + 1 ? n : null} />
          )}
          <span className="my-1 h-0.5 w-full bg-teks" />
          {l === 0 ? (
            <Pangkat basis={b} pangkat={String(n)} ukuran="lg" />
          ) : (
            <Deret basis={basis} jumlah={n} dicoret={dicoret} />
          )}
        </span>
      </Garis>

      <p className="min-h-6 text-teks-pelan" aria-live="polite">
        {l === 0 && 'Pembagian ditulis sebagai pecahan.'}
        {l >= 1 && l <= n && `Faktor yang sama di atas dan bawah dicoret. Sudah ${dicoret} pasang.`}
        {l === n + 1 && (
          <>
            Sisa <b className="text-basis">{m - n}</b> faktor {b} ({m} − {n}).
          </>
        )}
      </p>

      {l >= akhir && (
        <Garis className="bg-benar-lembut">
          <Pangkat basis={b} pangkat={String(m - n)} ukuran="lg" />
        </Garis>
      )}

      <div className="flex gap-3">
        <Tombol penuh onClick={() => setL((v) => Math.min(v + 1, akhir))} disabled={l >= akhir}>
          {label}
        </Tombol>
        <Tombol varian="sekunder" onClick={() => setL(0)} disabled={l === 0}>
          Ulang
        </Tombol>
      </div>
    </div>
  )
}

// ------------------------------------------------------------ pembungkus

export default function Pembongkar({ mode = 'jabar', pilihan, onSelesai, ...props }) {
  const [idx, setIdx] = useState(0)
  const aktif = pilihan ? pilihan[idx] : props
  const kunci = `${mode}-${idx}`
  const Isi = mode === 'bukti' ? Bukti : mode === 'bagi' ? Bagi : Jabar

  return (
    <div className="space-y-4">
      {pilihan && (
        <div className="flex flex-wrap justify-center gap-2" role="group" aria-label="Pilih contoh">
          {pilihan.map((p, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIdx(i)}
              aria-pressed={i === idx}
              aria-label={`Contoh ${i + 1}`}
              className={`min-h-11 rounded-xl border-2 px-3 ${
                i === idx ? 'border-basis bg-basis-lembut' : 'border-garis bg-kartu'
              }`}
            >
              {mode === 'bagi' ? (
                <>
                  <Pangkat basis={String(p.basis)} pangkat={String(p.m)} ukuran="md" />
                  <span aria-hidden="true" className="mx-1 font-bold">÷</span>
                  <Pangkat basis={String(p.basis)} pangkat={String(p.n)} ukuran="md" />
                </>
              ) : (
                <Pangkat basis={String(p.basis)} pangkat={String(p.pangkat)} ukuran="md" />
              )}
            </button>
          ))}
        </div>
      )}
      <Isi key={kunci} {...aktif} onSelesai={onSelesai} />
    </div>
  )
}
