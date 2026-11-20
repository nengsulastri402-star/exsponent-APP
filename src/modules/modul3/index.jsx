import Matematika from '../../components/Matematika.jsx'
import PetaMediasi from '../../components/PetaMediasi.jsx'
import PenemuPola from '../../components/PenemuPola.jsx'
import soal from '../../data/soal.json'

// Modul 3 — Pangkat nol dan pangkat negatif (F4). Polanya ditemukan siswa
// sendiri sebelum aturannya disebutkan.
const Teks = ({ children }) => <p className="mt-4 text-lg text-teks">{children}</p>

const rumus = (
  <div className="space-y-1 text-center">
    <Matematika gaya="soal" teks="a^0 = 1" />
    <br />
    <Matematika gaya="soal" teks="a^-n = 1/a^n" />
  </div>
)
const contoh = <Matematika teks="3^-2 = 1/3^2 = 1/9" />

export default {
  id: 3,
  judul: 'Pangkat nol dan negatif',
  ringkas: 'Temukan polanya: a^0 dan a^-n.',
  langkah: [
    {
      tipe: 'tampil',
      judul: 'Tujuan hari ini',
      isi: () => (
        <PetaMediasi
          tujuan="Kamu akan menemukan sendiri arti pangkat nol dan pangkat negatif lewat pola."
          makna="Dengan arti ini, pangkat tidak harus berhenti di 1: polanya bisa dilanjutkan ke 0 dan ke bawahnya."
        />
      ),
    },
    {
      tipe: 'tampil',
      judul: 'Menuju pangkat nol',
      perluSiap: true,
      isi: ({ onSiap }) => (
        <>
          <PenemuPola basis={3} dari={3} sampai={0} tampilAwal={3} onSelesai={onSiap} />
          <Teks>Setiap turun satu pangkat, hasilnya dibagi 3.</Teks>
        </>
      ),
    },
    {
      tipe: 'refleksi',
      id: 'm3-refleksi-1',
      judul: 'Kesimpulan pertama',
      tanya: 'Jadi, berapa nilai a^0 (a bukan nol)?',
      pilihan: [
        { id: 'a', teks: '0', umpan: 'Lihat polanya: 3^1 = 3, lalu dibagi 3. Hasilnya bukan 0.' },
        {
          id: 'b',
          teks: '1',
          benar: true,
          umpan: 'Tepat! 3^1 = 3, dibagi 3 menjadi 3^0 = 1. Ini berlaku untuk semua basis.',
        },
        { id: 'c', teks: 'a', umpan: 'Lihat polanya: 3^1 = 3, tetapi 3^0 sudah dibagi 3 lagi.' },
      ],
    },
    {
      tipe: 'tampil',
      judul: 'Lanjut ke pangkat negatif',
      perluSiap: true,
      isi: ({ onSiap }) => (
        <>
          <PenemuPola basis={3} dari={3} sampai={-3} tampilAwal={4} onSelesai={onSiap} />
          <Teks>Teruskan polanya: terus dibagi 3.</Teks>
        </>
      ),
    },
    {
      tipe: 'refleksi',
      id: 'm3-refleksi-2',
      judul: 'Kesimpulan kedua',
      tanya: '3^-2 sama dengan…',
      pilihan: [
        { id: 'a', teks: '−9', umpan: 'Pangkat negatif bukan berarti hasilnya negatif.' },
        {
          id: 'b',
          teks: '1/9',
          benar: true,
          umpan: 'Tepat! Pangkat negatif berarti kebalikan: 3^-2 = 1/3^2 = 1/9.',
        },
        { id: 'c', teks: '−6', umpan: '3^-2 bukan 3 × (−2). Lihat lagi polanya.' },
      ],
    },
    {
      tipe: 'tampil',
      judul: 'Aturannya',
      isi: () => (
        <div className="space-y-3 text-center">
          <div className="rounded-xl bg-kartu p-4 ring-1 ring-garis">{rumus}</div>
          <div className="rounded-xl bg-latar p-3">{contoh}</div>
          <Teks>Pangkat negatif artinya kebalikan, bukan bilangan negatif.</Teks>
          <PetaMediasi lanjut="Basis apa pun selain nol. Aturan perkalian dan pembagian tadi tetap berlaku." />
        </div>
      ),
    },
    { tipe: 'latihan', judul: 'Latihan', soal: soal.modul3, rumus, contoh },
  ],
}
