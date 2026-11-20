import Matematika from './Matematika.jsx'
import Tombol from './Tombol.jsx'

// F5 — Petunjuk bertingkat 1 → 2 → 3. Siswa membuka sendiri; tidak ada yang
// terbuka otomatis. Tingkat tertinggi yang dibuka dicatat oleh pemanggil.
export default function TombolPetunjuk({ petunjuk, tingkat, onNaik, nonaktif = false }) {
  if (!petunjuk || petunjuk.length === 0) return null
  return (
    <div className="space-y-2">
      {petunjuk.slice(0, tingkat).map((p, i) => (
        <div
          key={i}
          className="rounded-xl border border-basis/30 bg-basis-lembut px-3 py-2 text-teks"
        >
          <p className="text-sm font-bold text-basis">Petunjuk {i + 1}</p>
          <Matematika teks={p} />
        </div>
      ))}
      {tingkat < petunjuk.length && (
        <Tombol
          varian="lembut"
          penuh
          disabled={nonaktif}
          onClick={() => onNaik(tingkat + 1)}
          aria-label={`Buka petunjuk ${tingkat + 1}`}
        >
          Butuh petunjuk {tingkat + 1}?
        </Tombol>
      )}
    </div>
  )
}
