import { useState } from 'react'
import { Link } from 'react-router-dom'
import Halaman from '../components/Halaman.jsx'
import Matematika from '../components/Matematika.jsx'
import Tombol from '../components/Tombol.jsx'
import TesRunner from '../components/TesRunner.jsx'
import soal from '../data/soal.json'

// F6 — Diagnostik prasyarat (5 soal). Bila skor < 4, ditawarkan penyegaran
// singkat (3 layar) lalu diagnostik ulang. Nada tetap mendukung.

function GarisBilangan({ dari, geser }) {
  const min = -8
  const max = 10
  const x = (v) => 20 + ((v - min) * 320) / (max - min)
  const ke = dari + geser
  const angka = []
  for (let v = min; v <= max; v++) angka.push(v)
  return (
    <svg viewBox="0 0 360 80" role="img" aria-label={`Garis bilangan: mulai di ${dari}, geser ${geser}, sampai ${ke}`} className="w-full">
      <line x1="10" y1="40" x2="350" y2="40" stroke="#475569" strokeWidth="2" />
      {angka.map((v) => (
        <g key={v}>
          <line x1={x(v)} y1="35" x2={x(v)} y2="45" stroke="#475569" strokeWidth="1.5" />
          {v % 2 === 0 && (
            <text x={x(v)} y="62" textAnchor="middle" fontSize="12" fill="#0f172a">
              {String(v).replace('-', '−')}
            </text>
          )}
        </g>
      ))}
      <line x1={x(dari)} y1="22" x2={x(ke)} y2="22" stroke="#c2410c" strokeWidth="3" />
      <circle cx={x(dari)} cy="22" r="5" fill="#1e3a8a" />
      <circle cx={x(ke)} cy="22" r="6" fill="#c2410c" />
    </svg>
  )
}

const PENYEGARAN = [
  {
    judul: 'Perkalian itu penjumlahan berulang',
    isi: (
      <div className="space-y-3 text-center">
        <div className="rounded-xl bg-kartu p-4 text-3xl font-bold text-teks ring-1 ring-garis">
          4 × 3 = 4 + 4 + 4 = 12
        </div>
        <p className="text-lg text-teks">Kalau lupa hasilnya, jumlahkan berulang. Makin sering berlatih, makin cepat.</p>
      </div>
    ),
  },
  {
    judul: 'Menjumlah dan mengurang bilangan bulat',
    isi: (
      <div className="space-y-3">
        <div className="rounded-xl bg-kartu p-3 ring-1 ring-garis">
          <p className="text-center text-2xl font-bold text-teks">−5 + 8 = 3</p>
          <GarisBilangan dari={-5} geser={8} />
        </div>
        <div className="rounded-xl bg-kartu p-3 ring-1 ring-garis">
          <p className="text-center text-2xl font-bold text-teks">3 − 7 = −4</p>
          <GarisBilangan dari={3} geser={-7} />
        </div>
        <p className="text-lg text-teks">Menjumlah: geser ke kanan. Mengurang: geser ke kiri.</p>
      </div>
    ),
  },
  {
    judul: 'Perkalian berulang',
    isi: (
      <div className="space-y-3 text-center">
        <div className="rounded-xl bg-kartu p-4 text-3xl font-bold text-teks ring-1 ring-garis">
          2 × 2 × 2 × 2 = 16
        </div>
        <p className="text-lg text-teks">
          Perkalian berulang seperti ini nanti ditulis <Matematika teks="2^4" /> (dua pangkat empat).
        </p>
      </div>
    ),
  },
]

export default function Diagnostik() {
  const [tahap, setTahap] = useState('intro')
  const [skor, setSkor] = useState(null)
  const [skor2, setSkor2] = useState(null)
  const [langkah, setLangkah] = useState(0)

  const tautanBelajar = (
    <Link
      to="/belajar"
      className="flex min-h-12 w-full items-center justify-center rounded-xl bg-basis px-4 text-lg font-bold text-white"
    >
      Mulai Modul 1
    </Link>
  )

  return (
    <Halaman judul="Cek dasar" kembali="/" kembaliTeks="Kembali ke beranda">
      {tahap === 'intro' && (
        <div className="space-y-4">
          <p className="text-lg text-teks">
            5 soal singkat untuk melihat apakah dasarnya sudah siap. Bukan ujian, tidak ada nilai yang dihukum.
          </p>
          <Tombol penuh onClick={() => setTahap('tes1')}>
            Mulai
          </Tombol>
        </div>
      )}

      {tahap === 'tes1' && (
        <TesRunner
          daftar={soal.diagnostik}
          jenis="diagnostik"
          onSelesai={({ skor: s }) => {
            setSkor(s)
            setTahap('hasil1')
          }}
        />
      )}

      {tahap === 'hasil1' && (
        <div className="space-y-4 text-center">
          <p className="rounded-xl bg-kartu p-4 text-xl text-teks ring-1 ring-garis">
            Skormu: <b>{skor}</b> dari <b>5</b>
          </p>
          {skor >= 4 ? (
            <>
              <p className="rounded-xl bg-benar-lembut p-3 font-semibold text-benar">
                Dasarnya sudah siap. Ayo mulai belajar eksponen!
              </p>
              {tautanBelajar}
            </>
          ) : (
            <>
              <p className="text-lg text-teks">
                Tidak apa-apa. Penyegaran singkat 3 layar bisa membantu sebelum mulai.
              </p>
              <Tombol penuh onClick={() => { setLangkah(0); setTahap('segar') }}>
                Lihat penyegaran
              </Tombol>
              <Link
                to="/belajar"
                className="flex min-h-12 w-full items-center justify-center rounded-xl border-2 border-garis bg-kartu px-4 text-lg font-bold text-teks"
              >
                Langsung ke Modul 1
              </Link>
            </>
          )}
        </div>
      )}

      {tahap === 'segar' && (
        <div className="space-y-4">
          <p className="text-sm font-semibold text-teks-pelan">
            Penyegaran {langkah + 1} dari {PENYEGARAN.length}
          </p>
          <h2 className="text-2xl font-bold text-teks">{PENYEGARAN[langkah].judul}</h2>
          {PENYEGARAN[langkah].isi}
          <Tombol
            penuh
            onClick={() => (langkah + 1 < PENYEGARAN.length ? setLangkah(langkah + 1) : setTahap('tes2'))}
          >
            {langkah + 1 < PENYEGARAN.length ? 'Lanjut' : 'Cek lagi (5 soal)'}
          </Tombol>
        </div>
      )}

      {tahap === 'tes2' && (
        <TesRunner
          daftar={soal.diagnostikUlang}
          jenis="diagnostik"
          onSelesai={({ skor: s }) => {
            setSkor2(s)
            setTahap('hasil2')
          }}
        />
      )}

      {tahap === 'hasil2' && (
        <div className="space-y-4 text-center">
          <p className="rounded-xl bg-kartu p-4 text-xl text-teks ring-1 ring-garis">
            Skor pertama: <b>{skor}</b> dari 5<br />
            Skor sekarang: <b>{skor2}</b> dari 5
          </p>
          <p className="text-lg text-teks">
            {skor2 > skor ? 'Nilaimu naik. Bagus!' : 'Kamu sudah berusaha. Kita pelan-pelan saja.'}
          </p>
          {tautanBelajar}
        </div>
      )}
    </Halaman>
  )
}
