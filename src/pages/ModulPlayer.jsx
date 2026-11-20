import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import Halaman from '../components/Halaman.jsx'
import LatihanBlok from '../components/LatihanBlok.jsx'
import Refleksi from '../components/Refleksi.jsx'
import Tombol from '../components/Tombol.jsx'
import { muatProgres, selesaikanModul } from '../lib/data'
import { useSiswa } from '../lib/siswaContext'
import { MODUL } from '../modules/daftar'

// F2 — Rangka modul: satu langkah per layar, pacing dikendalikan siswa
// ("Lanjut"), bilah progres sederhana, dan modul berikutnya terbuka setelah
// modul ini selesai (tersimpan di progres_modul).

function Pemain({ modul, siswa }) {
  const kunciLangkah = `eksponen.langkah.${siswa.kode}.${modul.id}`
  const langkah = useMemo(
    () => [...modul.langkah, { tipe: 'selesai', judul: 'Selesai!' }],
    [modul],
  )
  const [idx, setIdx] = useState(() => {
    try {
      const v = Number(localStorage.getItem(kunciLangkah))
      return Number.isInteger(v) && v >= 0 && v < langkah.length - 1 ? v : 0
    } catch {
      return 0
    }
  })
  const [siap, setSiap] = useState(false)
  const [hasil, setHasil] = useState([])
  const siapkan = useCallback(() => setSiap(true), [])
  const L = langkah[idx]
  const total = langkah.length - 1

  useEffect(() => {
    try {
      localStorage.setItem(kunciLangkah, String(idx))
    } catch {
      // abaikan
    }
  }, [idx, kunciLangkah])

  useEffect(() => {
    if (L.tipe !== 'selesai') return
    selesaikanModul(siswa, modul.id)
    try {
      localStorage.removeItem(kunciLangkah)
    } catch {
      // abaikan
    }
  }, [L.tipe, siswa, modul.id, kunciLangkah])

  function maju() {
    setSiap(false)
    setIdx((i) => Math.min(i + 1, langkah.length - 1))
    window.scrollTo?.(0, 0)
  }
  function mundur() {
    setSiap(false)
    setIdx((i) => Math.max(i - 1, 0))
    window.scrollTo?.(0, 0)
  }

  const bolehLanjut = L.tipe === 'refleksi' ? siap : L.perluSiap ? siap : true
  const tampilBilah = L.tipe !== 'selesai'

  return (
    <Halaman judul={`Modul ${modul.id}: ${modul.judul}`} kembali="/belajar" kembaliTeks="Kembali ke daftar modul">
      {tampilBilah && (
        <div className="mb-4">
          <p className="mb-1 text-sm font-semibold text-teks-pelan">
            Langkah {idx + 1} dari {total}
          </p>
          <div
            role="progressbar"
            aria-valuemin={1}
            aria-valuemax={total}
            aria-valuenow={idx + 1}
            className="h-2 overflow-hidden rounded-full bg-garis"
          >
            <div
              className="h-full rounded-full bg-basis transition-[width] duration-300"
              style={{ width: `${((idx + 1) / total) * 100}%` }}
            />
          </div>
        </div>
      )}

      <section key={idx} aria-labelledby="judul-langkah">
        <h2 id="judul-langkah" className="mb-4 text-2xl font-bold text-teks">
          {L.judul}
        </h2>

        {L.tipe === 'tampil' && L.isi({ onSiap: siapkan })}

        {L.tipe === 'refleksi' && (
          <Refleksi
            id={L.id}
            modul={modul.id}
            tanya={L.tanya}
            pilihan={L.pilihan}
            onSiap={siapkan}
          />
        )}

        {L.tipe === 'latihan' && (
          <LatihanBlok
            daftar={L.soal}
            rumus={L.rumus}
            contoh={L.contoh}
            onSelesai={(h) => {
              setHasil(h)
              maju()
            }}
          />
        )}

        {L.tipe === 'selesai' && <Ringkasan modul={modul} hasil={hasil} />}
      </section>

      {L.tipe !== 'latihan' && L.tipe !== 'selesai' && (
        <div className="mt-6 flex gap-3">
          {idx > 0 && (
            <Tombol varian="sekunder" onClick={mundur} aria-label="Langkah sebelumnya">
              ←
            </Tombol>
          )}
          <Tombol penuh disabled={!bolehLanjut} onClick={maju}>
            Lanjut
          </Tombol>
        </div>
      )}
      <div className="h-16" aria-hidden="true" />
    </Halaman>
  )
}

function Ringkasan({ modul, hasil }) {
  const n = hasil.length
  const pertama = hasil.filter((h) => h.pertamaBenar).length
  const petunjuk = hasil.reduce((a, h) => a + (h.tingkat || 0), 0)
  const berikut = modul.id < 3 ? modul.id + 1 : null

  return (
    <div className="space-y-4 text-center">
      <p className="text-5xl" aria-hidden="true">🎉</p>
      <p className="text-lg text-teks">
        Kamu menyelesaikan <b>Modul {modul.id}</b>.
      </p>
      {n > 0 && (
        <p className="rounded-xl bg-kartu p-4 text-teks ring-1 ring-garis">
          Benar di percobaan pertama: <b>{pertama}</b> dari <b>{n}</b> soal.
          <br />
          Petunjuk yang kamu buka: <b>{petunjuk}</b>.
        </p>
      )}
      {berikut ? (
        <Link
          to={`/belajar/${berikut}`}
          className="flex min-h-12 w-full items-center justify-center rounded-xl bg-basis px-4 text-lg font-bold text-white"
        >
          Lanjut ke Modul {berikut}
        </Link>
      ) : (
        <p className="rounded-xl bg-benar-lembut p-3 font-semibold text-benar">
          Semua modul sudah selesai. Hebat!
        </p>
      )}
      <Link
        to="/belajar"
        className="flex min-h-12 w-full items-center justify-center rounded-xl border-2 border-garis bg-kartu px-4 text-lg font-bold text-teks"
      >
        Kembali ke daftar modul
      </Link>
    </div>
  )
}

function MuatModul({ id }) {
  const { siswa } = useSiswa()
  const modul = MODUL[id]
  const [progres, setProgres] = useState(null)

  useEffect(() => {
    let batal = false
    muatProgres(siswa).then((p) => {
      if (!batal) setProgres(p)
    })
    return () => {
      batal = true
    }
  }, [siswa])

  if (!modul) return <Navigate to="/belajar" replace />
  if (!progres) return <p className="p-8 text-center text-teks-pelan">Memuat…</p>
  if (!progres[id]?.terbuka) return <Navigate to="/belajar" replace />
  return <Pemain modul={modul} siswa={siswa} />
}

export default function ModulPlayer() {
  const { id } = useParams()
  // key={id}: tiap modul memuat progresnya sendiri dari awal (tidak memakai data lama).
  return <MuatModul key={id} id={id} />
}
