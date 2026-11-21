import { Link } from 'react-router-dom'
import { useSiswa } from '../lib/siswaContext'

const panggilanDi = (kode) => {
  try {
    return localStorage.getItem(`eksponen.panggilan.${kode}`) || ''
  } catch {
    return ''
  }
}

// DESIGN.md §4 menganjurkan pilihan beranda sesedikit mungkin; "Tanya Kak AI"
// ditambahkan atas permintaan peneliti. Tes dan angket ada di tautan kecil di bawah.
const MENU = [
  { ke: '/belajar', judul: 'Mulai belajar', ket: 'Perkalian, pembagian, pangkat nol dan negatif' },
  { ke: '/tanya', judul: 'Tanya Kak AI', ket: 'Tanyakan apa saja tentang bilangan berpangkat' },
  { ke: '/diagnostik', judul: 'Cek dasar', ket: '5 soal singkat sebelum mulai' },
  { ke: '/hasil', judul: 'Hasil saya', ket: 'Lihat kemajuanmu' },
]

export default function Beranda() {
  const { siswa, keluar } = useSiswa()

  return (
    <main className="mx-auto min-h-dvh max-w-2xl px-4 pt-6 pb-24">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-teks">Halo{panggilanDi(siswa.kode) ? `, ${panggilanDi(siswa.kode)}` : ''}!</h1>
          <p className="text-teks-pelan">
            Kode: <strong className="text-teks">{siswa.kode}</strong>
            {siswa.pratinjau && ' (pratinjau)'}
          </p>
        </div>
        <button
          type="button"
          onClick={keluar}
          aria-label="Keluar dari aplikasi"
          className="min-h-11 rounded-lg border-2 border-garis px-4 font-semibold text-teks"
        >
          Keluar
        </button>
      </header>

      <ul className="space-y-3">
        {MENU.map((m) => (
          <li key={m.ke}>
            <Link
              to={m.ke}
              className="flex min-h-16 flex-col justify-center rounded-2xl border border-garis bg-kartu px-4 py-3"
            >
              <span className="text-lg font-bold text-teks">{m.judul}</span>
              <span className="text-sm text-teks-pelan">{m.ket}</span>
            </Link>
          </li>
        ))}
      </ul>

      <p className="mt-8 text-center text-sm">
        <Link to="/tes" className="inline-flex min-h-11 items-center px-3 text-teks-pelan underline">
          Untuk kakak peneliti: tes dan angket
        </Link>
      </p>
    </main>
  )
}
