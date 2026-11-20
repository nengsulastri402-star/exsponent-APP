import Matematika from '../../components/Matematika.jsx'
import PetaMediasi from '../../components/PetaMediasi.jsx'
import Pembongkar from '../../components/Pembongkar.jsx'
import soal from '../../data/soal.json'

// Modul 1 — Perkalian basis sama (F1, F2). Satu gagasan per layar.
const Teks = ({ children }) => <p className="mt-4 text-lg text-teks">{children}</p>

const rumus = <Matematika gaya="soal" teks="a^m × a^n = a^(m+n)" />
const contoh = <Matematika teks="5^3 × 5^2 = 5^(3+2) = 5^5" />

export default {
  id: 1,
  judul: 'Perkalian',
  ringkas: 'Basis sama dikalikan: pangkat dijumlahkan.',
  langkah: [
    {
      tipe: 'tampil',
      judul: 'Tujuan hari ini',
      isi: () => (
        <PetaMediasi
          tujuan="Kamu akan tahu cara mengalikan bilangan berpangkat yang basisnya sama."
          makna="Dengan aturan ini, bilangan besar seperti 2^10 bisa ditulis dan dihitung dengan singkat."
        />
      ),
    },
    {
      tipe: 'tampil',
      judul: 'Apa arti pangkat?',
      perluSiap: true,
      isi: ({ onSiap }) => (
        <>
          <Pembongkar basis={3} pangkat={4} onSelesai={onSiap} />
          <Teks>Pangkat memberi tahu berapa kali basis dikalikan dengan dirinya sendiri.</Teks>
        </>
      ),
    },
    {
      tipe: 'tampil',
      judul: 'Coba bongkar sendiri',
      perluSiap: true,
      isi: ({ onSiap }) => (
        <>
          <Pembongkar
            pilihan={[
              { basis: 2, pangkat: 5 },
              { basis: 5, pangkat: 2 },
              { basis: 10, pangkat: 4 },
            ]}
            onSelesai={onSiap}
          />
          <Teks>Pilih contoh, lalu bongkar sampai habis.</Teks>
        </>
      ),
    },
    {
      tipe: 'tampil',
      judul: 'Mengalikan basis yang sama',
      perluSiap: true,
      isi: ({ onSiap }) => (
        <>
          <Pembongkar mode="bukti" basis={5} m={3} n={2} onSelesai={onSiap} />
          <Teks>Hitung semua faktor 5 yang ada.</Teks>
        </>
      ),
    },
    {
      tipe: 'refleksi',
      id: 'm1-refleksi-1',
      judul: 'Mengapa begitu?',
      tanya: 'Mengapa pangkatnya dijumlahkan?',
      pilihan: [
        {
          id: 'a',
          teks: 'Karena banyak faktor 5 bertambah: 3 faktor + 2 faktor.',
          benar: true,
          umpan: 'Tepat! Faktor 5 yang dikalikan menjadi 3 + 2 = 5 buah.',
        },
        {
          id: 'b',
          teks: 'Karena pangkatnya harus dikalikan.',
          umpan: 'Coba hitung lagi: (5×5×5) × (5×5) hanya punya 5 faktor, bukan 6.',
        },
        {
          id: 'c',
          teks: 'Karena basisnya ikut dijumlahkan.',
          umpan: 'Basisnya tetap 5. Yang bertambah hanya banyak faktornya.',
        },
      ],
    },
    {
      tipe: 'tampil',
      judul: 'Aturannya',
      isi: () => (
        <div className="space-y-3 text-center">
          <div className="rounded-xl bg-kartu p-4 ring-1 ring-garis">{rumus}</div>
          <div className="rounded-xl bg-latar p-3">{contoh}</div>
          <Teks>Syaratnya: basisnya harus sama.</Teks>
          <PetaMediasi lanjut="Basis apa pun: 2, 5, 10, atau bilangan lain. Aturan ini akan dipakai lagi pada pembagian." />
        </div>
      ),
    },
    { tipe: 'latihan', judul: 'Latihan', soal: soal.modul1, rumus, contoh },
  ],
}
