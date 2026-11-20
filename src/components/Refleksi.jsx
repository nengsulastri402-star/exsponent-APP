import { useState } from 'react'
import { catatJawaban } from '../lib/logger'
import Matematika from './Matematika.jsx'

// Pertanyaan penjelasan singkat setelah pembuktian (mis. "Mengapa pangkatnya
// dijumlahkan?"). Jawaban dicatat. onSiap dipanggil saat siswa memilih yang benar.
export default function Refleksi({ id, modul, tanya, pilihan, onSiap }) {
  const [terpilih, setTerpilih] = useState(null)
  const [mulai] = useState(() => Date.now())
  const p = pilihan.find((x) => x.id === terpilih)

  function pilih(x) {
    setTerpilih(x.id)
    catatJawaban({
      modul,
      butir: id,
      jawaban: x.id,
      benar: Boolean(x.benar),
      waktuMs: Date.now() - mulai,
    })
    if (x.benar) onSiap?.()
  }

  return (
    <div className="space-y-3">
      <p className="text-lg font-bold text-teks">{tanya}</p>
      <div className="grid gap-2" role="group" aria-label={tanya}>
        {pilihan.map((x) => (
          <button
            key={x.id}
            type="button"
            onClick={() => pilih(x)}
            aria-pressed={terpilih === x.id}
            className={`min-h-14 rounded-xl border-2 px-3 py-2 text-left text-teks ${
              terpilih === x.id
                ? x.benar
                  ? 'border-benar bg-benar-lembut'
                  : 'border-perhatian bg-perhatian-lembut'
                : 'border-garis bg-kartu'
            }`}
          >
            <Matematika teks={x.teks} />
          </button>
        ))}
      </div>
      {p && (
        <p
          role="status"
          className={`rounded-lg px-3 py-2 ${p.benar ? 'bg-benar-lembut text-benar' : 'bg-perhatian-lembut text-perhatian'}`}
        >
          <span aria-hidden="true">{p.benar ? '✔ ' : '✎ '}</span>
          <Matematika teks={p.umpan} />
        </p>
      )}
    </div>
  )
}
