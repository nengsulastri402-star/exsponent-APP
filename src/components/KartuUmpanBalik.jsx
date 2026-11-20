import katalog from '../data/miskonsepsi.json'
import Matematika from './Matematika.jsx'
import Pangkat from './Pangkat.jsx'

// F9 — Umpan balik berbasis miskonsepsi. Tidak membuka kunci jawaban.
// Memakai kata, ikon, dan warna sekaligus (tidak hanya warna).

function BandingM5() {
  return (
    <div className="mt-2 grid grid-cols-2 gap-2 text-center">
      <div className="rounded-lg bg-kartu p-2 ring-1 ring-garis">
        <Pangkat basis="-3" pangkat="2" kurung ukuran="md" />
        <p className="mt-1 text-sm text-teks">(−3) × (−3) = 9</p>
      </div>
      <div className="rounded-lg bg-kartu p-2 ring-1 ring-garis">
        <Pangkat basis="3" pangkat="2" awalan="-" ukuran="md" />
        <p className="mt-1 text-sm text-teks">−(3 × 3) = −9</p>
      </div>
    </div>
  )
}

export default function KartuUmpanBalik({ status, kode, pesan }) {
  if (!status) return null
  const m = kode ? katalog[kode] : null

  if (status === 'benar') {
    return (
      <div role="status" className="rounded-xl border-2 border-benar bg-benar-lembut px-4 py-3 text-benar">
        <p className="text-lg font-bold">
          <span aria-hidden="true">✔ </span>Benar!
        </p>
      </div>
    )
  }

  if (status === 'kosong' || status === 'format') {
    return (
      <div role="alert" className="rounded-xl border-2 border-perhatian bg-perhatian-lembut px-4 py-3 text-perhatian">
        <p className="font-semibold">{pesan}</p>
      </div>
    )
  }

  // salah
  return (
    <div role="alert" className="rounded-xl border-2 border-perhatian bg-perhatian-lembut px-4 py-3 text-teks">
      <p className="font-bold text-perhatian">
        <span aria-hidden="true">✎ </span>Hampir! Cek lagi.
      </p>
      {m ? (
        <>
          <p className="mt-1 font-semibold">{m.nama}</p>
          <p className="mt-1">
            <Matematika teks={m.penjelasan} />
          </p>
          {m.visual === 'm5' && <BandingM5 />}
          <p className="mt-2 text-sm font-semibold text-perhatian">Coba: {m.langkah}</p>
        </>
      ) : (
        <p className="mt-1">
          Jawabanmu belum tepat. Baca soalnya pelan-pelan, atau buka petunjuk.
        </p>
      )}
    </div>
  )
}
