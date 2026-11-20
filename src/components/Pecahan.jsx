// Menampilkan "1/8" sebagai pecahan bersusun. Teks lain ditampilkan apa adanya.
export default function Pecahan({ teks, className = '' }) {
  const s = String(teks)
  const m = s.match(/^(-?)(\d+)\/(\d+)$/)
  if (!m) return <span className={className}>{s.replace(/^-/, '−')}</span>
  return (
    <span
      role="math"
      aria-label={`${m[1] ? 'min ' : ''}${m[2]} per ${m[3]}`}
      className={`inline-flex items-center align-middle ${className}`}
    >
      {m[1] && <span aria-hidden="true" className="mr-1">−</span>}
      <span aria-hidden="true" className="inline-flex flex-col items-center leading-tight">
        <span className="px-1">{m[2]}</span>
        <span className="h-0.5 w-full bg-current" />
        <span className="px-1">{m[3]}</span>
      </span>
    </span>
  )
}
