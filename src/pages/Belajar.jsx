import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Halaman from '../components/Halaman.jsx'
import Matematika from '../components/Matematika.jsx'
import { muatProgres } from '../lib/data'
import { useSiswa } from '../lib/siswaContext'
import { MODUL, URUTAN } from '../modules/daftar'

// Daftar modul dengan penguncian: modul berikutnya terbuka setelah modul sebelumnya selesai.
export default function Belajar() {
  const { siswa } = useSiswa()
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

  if (!progres) return <p className="p-8 text-center text-teks-pelan">Memuat…</p>

  return (
    <Halaman judul="Pilih modul" kembali="/" kembaliTeks="Kembali ke beranda">
      <ul className="space-y-3">
        {URUTAN.map((id) => {
          const m = MODUL[id]
          const p = progres[id] || {}
          const terbuka = Boolean(p.terbuka)
          const selesai = Boolean(p.selesai)
          const isi = (
            <>
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-teks-pelan">Modul {id}</span>
                <span className="block text-lg font-bold text-teks">{m.judul}</span>
                <span className="block text-sm text-teks-pelan">
                  {terbuka ? <Matematika teks={m.ringkas} /> : `Selesaikan Modul ${id - 1} dulu.`}
                </span>
              </span>
              <span
                className={`ml-3 shrink-0 rounded-full px-3 py-1 text-xs font-bold ${
                  selesai
                    ? 'bg-benar-lembut text-benar'
                    : terbuka
                      ? 'bg-basis-lembut text-basis'
                      : 'bg-latar text-teks-pelan'
                }`}
              >
                {selesai ? '✔ Selesai' : terbuka ? 'Mulai' : '🔒 Terkunci'}
              </span>
            </>
          )
          return (
            <li key={id}>
              {terbuka ? (
                <Link
                  to={`/belajar/${id}`}
                  className="flex min-h-16 items-center justify-between rounded-2xl border border-garis bg-kartu px-4 py-3"
                >
                  {isi}
                </Link>
              ) : (
                <div
                  aria-disabled="true"
                  className="flex min-h-16 items-center justify-between rounded-2xl border border-garis bg-kartu px-4 py-3 opacity-60"
                >
                  {isi}
                </div>
              )}
            </li>
          )
        })}
      </ul>
    </Halaman>
  )
}
