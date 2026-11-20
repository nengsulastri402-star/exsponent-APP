import { Link } from 'react-router-dom'
import Halaman from '../components/Halaman.jsx'

// Halaman untuk kakak peneliti: pretest, posttest, dan skala beban belajar.
const ITEM = [
  { ke: '/tes/pretest', judul: 'Tes awal (pretest)', ket: '7 soal, sebelum belajar' },
  { ke: '/tes/posttest', judul: 'Tes akhir (posttest)', ket: '7 soal, setelah belajar' },
  { ke: '/leppink', judul: 'Beban belajar', ket: '9 pernyataan, setelah belajar' },
]

export default function TesMenu() {
  return (
    <Halaman judul="Tes dan angket" kembali="/" kembaliTeks="Kembali ke beranda">
      <ul className="space-y-3">
        {ITEM.map((x) => (
          <li key={x.ke}>
            <Link
              to={x.ke}
              className="flex min-h-16 flex-col justify-center rounded-2xl border border-garis bg-kartu px-4 py-3"
            >
              <span className="text-lg font-bold text-teks">{x.judul}</span>
              <span className="text-sm text-teks-pelan">{x.ket}</span>
            </Link>
          </li>
        ))}
      </ul>
    </Halaman>
  )
}
