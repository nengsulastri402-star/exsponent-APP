import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import Halaman from '../components/Halaman.jsx'
import Tombol from '../components/Tombol.jsx'
import TesRunner from '../components/TesRunner.jsx'
import soal from '../data/soal.json'

const KONFIG = {
  pretest: { judul: 'Tes awal', daftar: soal.pretest },
  posttest: { judul: 'Tes akhir', daftar: soal.posttest },
}

// Pretest dan posttest: tanpa petunjuk dan tanpa umpan balik. Skor disimpan,
// tetapi tidak ditampilkan agar siswa tidak merasa dinilai.
export default function TesPage() {
  const { jenis } = useParams()
  const k = KONFIG[jenis]
  const [tahap, setTahap] = useState('intro')

  if (!k) return <Navigate to="/tes" replace />

  return (
    <Halaman judul={k.judul} kembali="/tes" kembaliTeks="Kembali ke daftar tes">
      {tahap === 'intro' && (
        <div className="space-y-4">
          <p className="text-lg text-teks">
            {k.daftar.length} soal. Kerjakan sendiri, tanpa petunjuk. Kalau belum tahu, boleh dilewati.
          </p>
          <p className="rounded-xl bg-latar p-3 text-teks-pelan">
            Tulis pangkat dengan tombol ^ (contoh: 5^5). Pecahan dengan / (contoh: 1/8).
          </p>
          <Tombol penuh onClick={() => setTahap('tes')}>
            Mulai
          </Tombol>
        </div>
      )}

      {tahap === 'tes' && (
        <TesRunner key={jenis} daftar={k.daftar} jenis={jenis} onSelesai={() => setTahap('selesai')} />
      )}

      {tahap === 'selesai' && (
        <div className="space-y-4 text-center">
          <p className="text-5xl" aria-hidden="true">✅</p>
          <p className="text-lg text-teks">Terima kasih! Jawabanmu sudah tersimpan.</p>
          {jenis === 'posttest' && (
            <Link
              to="/leppink"
              className="flex min-h-12 w-full items-center justify-center rounded-xl bg-basis px-4 text-lg font-bold text-white"
            >
              Lanjut: isi angket beban belajar
            </Link>
          )}
          <Link
            to="/"
            className="flex min-h-12 w-full items-center justify-center rounded-xl border-2 border-garis bg-kartu px-4 text-lg font-bold text-teks"
          >
            Kembali ke beranda
          </Link>
        </div>
      )}
    </Halaman>
  )
}
