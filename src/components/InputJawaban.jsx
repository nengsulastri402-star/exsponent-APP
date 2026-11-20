import { useRef } from 'react'
import Matematika from './Matematika.jsx'

// Kolom jawaban dengan tombol bantu (^, /, −, kurung, ×) karena papan ketik
// ponsel sering tidak punya simbol pangkat. Pratinjau menampilkan jawaban
// sebagai pangkat sungguhan agar siswa bisa memeriksa tulisannya.
const TOMBOL = [
  ['^', 'pangkat'],
  ['/', 'garis pecahan'],
  ['-', 'minus'],
  ['(', 'kurung buka'],
  [')', 'kurung tutup'],
  ['×', 'kali'],
]

export default function InputJawaban({ nilai, onUbah, onKirim, nonaktif = false, id = 'jawaban' }) {
  const ref = useRef(null)

  function sisip(c) {
    const el = ref.current
    const a = el?.selectionStart ?? nilai.length
    const b = el?.selectionEnd ?? a
    onUbah(nilai.slice(0, a) + c + nilai.slice(b))
    requestAnimationFrame(() => {
      el?.focus()
      el?.setSelectionRange(a + c.length, a + c.length)
    })
  }

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block font-semibold text-teks">
        Jawabanmu
      </label>
      <input
        id={id}
        ref={ref}
        value={nilai}
        disabled={nonaktif}
        onChange={(e) => onUbah(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault()
            onKirim?.()
          }
        }}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="none"
        spellCheck={false}
        enterKeyHint="done"
        placeholder="mis. 5^5 atau 1/8"
        className="min-h-12 w-full rounded-xl border-2 border-garis px-4 text-xl focus:border-basis disabled:bg-latar"
      />
      <div className="grid grid-cols-6 gap-1.5" role="group" aria-label="Tombol simbol">
        {TOMBOL.map(([c, nama]) => (
          <button
            key={c}
            type="button"
            disabled={nonaktif}
            onClick={() => sisip(c)}
            aria-label={`Sisipkan ${nama}`}
            className="min-h-11 rounded-lg border-2 border-garis bg-kartu text-xl font-bold text-teks disabled:opacity-40"
          >
            {c === '-' ? '−' : c}
          </button>
        ))}
      </div>
      {nilai.trim() !== '' && (
        <p className="text-sm text-teks-pelan">
          Terbaca: <Matematika teks={nilai} />
        </p>
      )}
    </div>
  )
}
