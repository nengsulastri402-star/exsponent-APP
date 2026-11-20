import { useState } from 'react'
import { simpanTes } from '../lib/data'
import { useSiswa } from '../lib/siswaContext'
import Latihan from './Latihan.jsx'
import Tombol from './Tombol.jsx'

// Menjalankan satu tes (pretest, posttest, diagnostik): soal berurutan tanpa
// petunjuk dan tanpa umpan balik, lalu skor disimpan ke tabel `tes`.
// onSelesai({ skor, maks }) dipanggil setelah skor berhasil disimpan.
export default function TesRunner({ daftar, jenis, onSelesai }) {
  const { siswa } = useSiswa()
  const [i, setI] = useState(0)
  const [skor, setSkor] = useState(0)
  const [status, setStatus] = useState('jalan') // 'jalan' | 'menyimpan' | 'gagal'

  async function simpan(skorAkhir) {
    setStatus('menyimpan')
    const r = await simpanTes(siswa, jenis, skorAkhir, daftar.length)
    if (r.ok) onSelesai({ skor: skorAkhir, maks: daftar.length })
    else setStatus('gagal')
  }

  function lanjut({ benar }) {
    const baru = skor + (benar ? 1 : 0)
    setSkor(baru)
    if (i + 1 >= daftar.length) simpan(baru)
    else setI(i + 1)
  }

  if (status === 'menyimpan') {
    return <p className="py-8 text-center text-lg text-teks-pelan">Menyimpan…</p>
  }
  if (status === 'gagal') {
    return (
      <div className="space-y-3 py-6 text-center">
        <p className="text-lg text-perhatian">Hasilnya belum tersimpan. Periksa internetmu.</p>
        <Tombol onClick={() => simpan(skor)}>Coba simpan lagi</Tombol>
      </div>
    )
  }

  return (
    <Latihan
      key={daftar[i].id}
      soal={daftar[i]}
      mode="tes"
      nomor={i + 1}
      total={daftar.length}
      onSelesai={lanjut}
    />
  )
}
