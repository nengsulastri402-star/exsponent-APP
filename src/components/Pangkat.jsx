// Komponen F3: basis dan pangkat harus tampak berbeda (DESIGN.md §2).
// - Basis: besar, tebal, biru tua, bergaris bawah.
// - Pangkat: lebih kecil tetapi tetap terbaca (≥ 18 px), oranye, dalam kapsul
//   berbingkai, dengan jarak aman dari basis.
// Pembeda tidak hanya warna (ukuran, garis bawah, kapsul), jadi tetap jelas
// pada layar hitam-putih.

const UKURAN = {
  md: { basis: 'text-[32px]', pangkat: 'text-[20px]' },
  lg: { basis: 'text-[44px]', pangkat: 'text-[26px]' },
  xl: { basis: 'text-[56px]', pangkat: 'text-[32px]' },
}

const MINUS = '−' // tanda minus sungguhan, bukan tanda hubung

const rapikan = (teks) => String(teks).replace(/-/g, MINUS)
const bacaSuara = (teks) => String(teks).replace(/[-−]/g, 'min ')

/**
 * <Pangkat basis="3" pangkat="4" />          → 3⁴
 * <Pangkat basis="−3" pangkat="2" kurung />  → (−3)²
 * <Pangkat basis="3" pangkat="2" awalan="−" /> → −3²  (minus di luar pangkat)
 * <Pangkat basis="10" pangkat="−3" />        → 10⁻³
 */
export default function Pangkat({
  basis,
  pangkat,
  awalan = '',
  kurung = false,
  ukuran = 'lg',
}) {
  const u = UKURAN[ukuran] ?? UKURAN.lg
  const teksBasis = kurung ? `(${rapikan(basis)})` : rapikan(basis)

  const label = [
    awalan ? 'min dari' : '',
    kurung ? 'kurung' : '',
    bacaSuara(basis),
    kurung ? 'tutup kurung' : '',
    'pangkat',
    bacaSuara(pangkat),
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <span
      role="math"
      aria-label={label}
      className="inline-flex items-start align-middle leading-none font-bold whitespace-nowrap"
    >
      {awalan && (
        <span aria-hidden="true" className={`${u.basis} mr-1 text-teks`}>
          {rapikan(awalan)}
        </span>
      )}
      <span
        aria-hidden="true"
        className={`${u.basis} text-basis underline decoration-basis/40 decoration-2 underline-offset-[6px]`}
      >
        {teksBasis}
      </span>
      <span
        aria-hidden="true"
        className={`${u.pangkat} ml-1.5 -mt-1 rounded-full border-2 border-pangkat bg-pangkat-lembut px-2 py-0.5 text-pangkat`}
      >
        {rapikan(pangkat)}
      </span>
    </span>
  )
}
