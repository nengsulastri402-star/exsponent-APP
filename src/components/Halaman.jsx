import { Link } from 'react-router-dom'

// Kerangka halaman: judul satu baris dan tombol kembali (DESIGN.md §4).
export default function Halaman({ judul, kembali, kembaliTeks = 'Kembali', children }) {
  return (
    <main className="mx-auto min-h-dvh max-w-2xl px-4 pt-4 pb-24">
      <header className="mb-4 flex items-center gap-3">
        {kembali && (
          <Link
            to={kembali}
            aria-label={kembaliTeks}
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border-2 border-garis px-3 font-semibold text-teks"
          >
            <span aria-hidden="true">←</span>
          </Link>
        )}
        <h1 className="text-xl font-bold text-teks">{judul}</h1>
      </header>
      {children}
    </main>
  )
}
