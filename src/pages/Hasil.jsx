import { useEffect, useState } from 'react'
import Halaman from '../components/Halaman.jsx'
import { ambilJawaban, ambilTes, muatProgres, ringkasPerModul } from '../lib/data'
import { useSiswa } from '../lib/siswaContext'
import { MODUL, URUTAN } from '../modules/daftar'

const NAMA_TES = { pretest: 'Tes awal', posttest: 'Tes akhir', diagnostik: 'Cek dasar' }

export default function Hasil() {
  const { siswa } = useSiswa()
  const [data, setData] = useState(null)

  useEffect(() => {
    let batal = false
    Promise.all([muatProgres(siswa), ambilTes(siswa), ambilJawaban(siswa)]).then(
      ([progres, tes, jawaban]) => {
        if (!batal) setData({ progres, tes, rekap: ringkasPerModul(jawaban) })
      },
    )
    return () => {
      batal = true
    }
  }, [siswa])

  if (!data) return <p className="p-8 text-center text-teks-pelan">Memuat…</p>

  return (
    <Halaman judul="Hasil saya" kembali="/" kembaliTeks="Kembali ke beranda">
      <h2 className="mb-2 text-lg font-bold text-teks">Kemajuan modul</h2>
      <ul className="mb-6 space-y-2">
        {URUTAN.map((id) => {
          const p = data.progres[id] || {}
          const r = data.rekap[id]
          return (
            <li key={id} className="rounded-xl border border-garis bg-kartu p-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-teks">
                  Modul {id}: {MODUL[id].judul}
                </span>
                <span className={`text-sm font-bold ${p.selesai ? 'text-benar' : 'text-teks-pelan'}`}>
                  {p.selesai ? '✔ Selesai' : p.terbuka ? 'Sedang belajar' : '🔒 Terkunci'}
                </span>
              </div>
              {r.butir > 0 && (
                <p className="mt-1 text-sm text-teks-pelan">
                  Soal dikerjakan: {r.butir}, benar: {r.benar}
                  {r.rataPetunjuk !== null && ` · rata-rata petunjuk: ${r.rataPetunjuk.toFixed(1)}`}
                </p>
              )}
            </li>
          )
        })}
      </ul>

      <h2 className="mb-2 text-lg font-bold text-teks">Tes</h2>
      {data.tes.length === 0 ? (
        <p className="rounded-xl bg-latar p-3 text-teks-pelan">Belum ada tes yang dikerjakan.</p>
      ) : (
        <ul className="space-y-2">
          {data.tes.map((t, i) => (
            <li key={i} className="flex justify-between rounded-xl border border-garis bg-kartu p-3 text-teks">
              <span className="font-bold">{NAMA_TES[t.jenis] ?? t.jenis}</span>
              <span>
                {t.skor} / {t.skor_maks}
              </span>
            </li>
          ))}
        </ul>
      )}
    </Halaman>
  )
}
