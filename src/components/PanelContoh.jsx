// F7 — Rumus dan contoh acuan berada di layar yang sama dengan soal.
// Memakai <details> bawaan browser: membuka/menutup tidak menghapus jawaban
// yang sedang diketik, dan tidak perlu pindah halaman.
// Tiga langkah kerja di bawahnya mengikuti Learning Activity (RMT):
// analisis tugas, perencanaan tindakan, refleksi.
export default function PanelContoh({ rumus, contoh, terbuka = false }) {
  if (!rumus && !contoh) return null
  return (
    <details
      open={terbuka}
      className="mb-4 rounded-xl border border-garis bg-kartu px-4 py-2"
    >
      <summary className="flex min-h-11 cursor-pointer items-center font-semibold text-basis">
        Rumus dan contoh
      </summary>
      <div className="space-y-2 pb-2 text-teks">
        {rumus && <div>{rumus}</div>}
        {contoh && <div className="rounded-lg bg-latar px-3 py-2">{contoh}</div>}
        <ol className="list-decimal space-y-1 pl-6 text-base">
          <li>Baca: apa basisnya, apa pangkatnya?</li>
          <li>Rencanakan: jabarkan menjadi perkalian berulang.</li>
          <li>Periksa: apakah hasilnya masuk akal?</li>
        </ol>
      </div>
    </details>
  )
}
