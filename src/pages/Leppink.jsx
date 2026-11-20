import { useState } from 'react'
import { Link } from 'react-router-dom'
import Halaman from '../components/Halaman.jsx'
import Tombol from '../components/Tombol.jsx'
import leppink from '../data/leppink.json'
import { simpanSkala } from '../lib/data'
import { useSiswa } from '../lib/siswaContext'

// Angket beban kognitif (Leppink dkk., 2013) skala 0–10. Butir ada di
// data/leppink.json (draf terjemahan, periksa dengan artikel aslinya).
const ANGKA = Array.from({ length: 11 }, (_, i) => i)

export default function Leppink() {
  const { siswa } = useSiswa()
  const [nilai, setNilai] = useState({})
  const [status, setStatus] = useState('isi') // isi | menyimpan | gagal | selesai
  const lengkap = leppink.butir.every((b) => nilai[b.id] !== undefined)

  async function kirim() {
    setStatus('menyimpan')
    const r = await simpanSkala(siswa, nilai)
    setStatus(r.ok ? 'selesai' : 'gagal')
  }

  if (status === 'selesai') {
    return (
      <Halaman judul="Beban belajar">
        <div className="space-y-4 text-center">
          <p className="text-5xl" aria-hidden="true">🙏</p>
          <p className="text-lg text-teks">Terima kasih sudah mengisi!</p>
          <Link
            to="/"
            className="flex min-h-12 w-full items-center justify-center rounded-xl bg-basis px-4 text-lg font-bold text-white"
          >
            Kembali ke beranda
          </Link>
        </div>
      </Halaman>
    )
  }

  return (
    <Halaman judul="Beban belajar" kembali="/tes" kembaliTeks="Kembali ke daftar tes">
      <p className="mb-4 text-lg text-teks">
        Pilih angka 0 sampai 10 untuk tiap pernyataan.{' '}
        <b>0 = {leppink.kiri.toLowerCase()}</b>, <b>10 = {leppink.kanan.toLowerCase()}</b>.
      </p>

      <ol className="space-y-4">
        {leppink.butir.map((b, i) => (
          <li key={b.id} className="rounded-2xl border border-garis bg-kartu p-4">
            <p id={`q-${b.id}`} className="mb-3 text-lg text-teks">
              {i + 1}. {b.teks}
            </p>
            <div className="grid grid-cols-6 gap-1.5" role="radiogroup" aria-labelledby={`q-${b.id}`}>
              {ANGKA.map((a) => (
                <button
                  key={a}
                  type="button"
                  role="radio"
                  aria-checked={nilai[b.id] === a}
                  aria-label={`${a}`}
                  onClick={() => setNilai((n) => ({ ...n, [b.id]: a }))}
                  className={`min-h-11 rounded-lg border-2 text-lg font-bold ${
                    nilai[b.id] === a
                      ? 'border-basis bg-basis text-white'
                      : 'border-garis bg-kartu text-teks'
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          </li>
        ))}
      </ol>

      {status === 'gagal' && (
        <p role="alert" className="mt-4 rounded-lg bg-perhatian-lembut px-3 py-2 text-perhatian">
          Belum tersimpan. Periksa internetmu, lalu coba lagi.
        </p>
      )}

      <div className="mt-6">
        <Tombol penuh disabled={!lengkap || status === 'menyimpan'} onClick={kirim}>
          {status === 'menyimpan' ? 'Menyimpan…' : lengkap ? 'Kirim' : `Isi semua dulu (${Object.keys(nilai).length}/${leppink.butir.length})`}
        </Tombol>
      </div>
    </Halaman>
  )
}
