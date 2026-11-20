// Tombol dasar: target sentuh ≥ 44 px (DESIGN.md §9).
const GAYA = {
  utama: 'bg-basis text-white disabled:opacity-40',
  sekunder: 'border-2 border-garis bg-kartu text-teks disabled:opacity-40',
  lembut: 'bg-basis-lembut text-basis disabled:opacity-40',
}

export default function Tombol({
  varian = 'utama',
  penuh = false,
  className = '',
  type = 'button',
  children,
  ...sisa
}) {
  return (
    <button
      type={type}
      className={`min-h-12 rounded-xl px-4 text-lg font-bold ${penuh ? 'w-full' : ''} ${GAYA[varian]} ${className}`}
      {...sisa}
    >
      {children}
    </button>
  )
}
