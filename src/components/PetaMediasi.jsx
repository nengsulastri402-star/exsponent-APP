import Matematika from './Matematika.jsx'

// Tiga kriteria Pengalaman Belajar Ter-mediasi (MLE, Feuerstein) dalam bahasa siswa:
//  - tujuan (intensionalitas): apa yang dipelajari sekarang,
//  - makna: mengapa ini penting,
//  - lanjut (transendensi): aturan ini juga berlaku di mana lagi.
// Hanya baris yang diisi yang tampil, supaya layar tetap singkat.
export default function PetaMediasi({ tujuan, makna, lanjut }) {
  const baris = [
    ['🎯', 'Tujuan', tujuan],
    ['💡', 'Mengapa penting', makna],
    ['🔗', 'Berlaku juga di', lanjut],
  ].filter((b) => b[2])
  return (
    <ul className="space-y-3 text-left">
      {baris.map(([ikon, label, isi]) => (
        <li key={label} className="rounded-xl bg-kartu p-4 ring-1 ring-garis">
          <p className="text-sm font-bold text-basis">
            <span aria-hidden="true">{ikon} </span>
            {label}
          </p>
          <p className="mt-1 text-lg text-teks">
            <Matematika teks={isi} />
          </p>
        </li>
      ))}
    </ul>
  )
}
