import Pangkat from '../components/Pangkat.jsx'

// Halaman uji F3 (kriteria penerimaan di FEATURES.md):
// - basis dan pangkat terbedakan tanpa warna (uji grayscale)
// - pangkat ≥ 18 px di layar ponsel
// - (−3)² dan −3² tampil berbeda jelas
// Buka di /tipografi, lalu coba mode hitam-putih dan lebar layar 360 px.

const Op = ({ children }) => (
  <span aria-hidden="true" className="mx-2 text-3xl text-teks">
    {children}
  </span>
)

function Baris({ judul, children }) {
  return (
    <section className="rounded-2xl border border-garis bg-kartu p-4">
      <h2 className="mb-3 text-sm font-semibold text-teks-pelan">{judul}</h2>
      <div className="flex flex-wrap items-center gap-y-3">{children}</div>
    </section>
  )
}

export default function Tipografi() {
  return (
    <main className="mx-auto min-h-dvh max-w-2xl space-y-4 px-4 py-6">
      <h1 className="text-2xl font-bold text-teks">Uji tipografi pangkat</h1>

      <Baris judul="Pangkat bilangan bulat">
        <Pangkat basis="3" pangkat="4" />
        <Op>=</Op>
        <span className="text-3xl font-bold text-teks">81</span>
      </Baris>

      <Baris judul="Perkalian basis sama">
        <Pangkat basis="5" pangkat="3" />
        <Op>×</Op>
        <Pangkat basis="5" pangkat="2" />
      </Baris>

      <Baris judul="Variabel">
        <Pangkat basis="m" pangkat="4" />
        <Op>×</Op>
        <Pangkat basis="m" pangkat="5" />
      </Baris>

      <Baris judul="Tanda minus: dua hal yang berbeda">
        <div className="mr-8">
          <Pangkat basis="3" pangkat="2" kurung awalan="" />
          <p className="mt-2 text-sm text-teks-pelan">
            kurung ikut dipangkatkan
          </p>
        </div>
        <div>
          <Pangkat basis="3" pangkat="2" awalan="-" />
          <p className="mt-2 text-sm text-teks-pelan">
            hanya 3 yang dipangkatkan
          </p>
        </div>
      </Baris>

      <Baris judul="(−3)² dengan basis negatif">
        <Pangkat basis="-3" pangkat="2" kurung />
        <Op>=</Op>
        <span className="text-3xl font-bold text-teks">9</span>
      </Baris>

      <Baris judul="Pangkat nol dan negatif">
        <Pangkat basis="9" pangkat="0" />
        <Op>,</Op>
        <Pangkat basis="10" pangkat="-3" />
      </Baris>

      <Baris judul="Ukuran minimum (md): basis 32 px, pangkat 20 px">
        <Pangkat basis="7" pangkat="6" ukuran="md" />
        <Op>÷</Op>
        <Pangkat basis="7" pangkat="4" ukuran="md" />
      </Baris>
    </main>
  )
}
