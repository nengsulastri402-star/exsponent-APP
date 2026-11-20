import Matematika from '../../components/Matematika.jsx'
import PetaMediasi from '../../components/PetaMediasi.jsx'
import Pembongkar from '../../components/Pembongkar.jsx'
import soal from '../../data/soal.json'

// Modul 2 — Pembagian basis sama.
const Teks = ({ children }) => <p className="mt-4 text-lg text-teks">{children}</p>

const rumus = <Matematika gaya="soal" teks="a^m ÷ a^n = a^(m−n)" />
const contoh = <Matematika teks="7^6 ÷ 7^4 = 7^(6−4) = 7^2" />

export default {
  id: 2,
  judul: 'Pembagian',
  ringkas: 'Basis sama dibagi: pangkat dikurangi.',
  langkah: [
    {
      tipe: 'tampil',
      judul: 'Tujuan hari ini',
      isi: () => (
        <PetaMediasi
          tujuan="Kamu akan tahu cara membagi bilangan berpangkat yang basisnya sama."
          makna="Pembagian adalah kebalikan dari perkalian, jadi kamu bisa memeriksa hasil yang satu dengan yang lain."
        />
      ),
    },
    {
      tipe: 'tampil',
      judul: 'Ingat perkalian tadi',
      isi: () => (
        <div className="space-y-3 text-center">
          <div className="rounded-xl bg-kartu p-4 ring-1 ring-garis">
            <Matematika gaya="soal" teks="5^3 × 5^2 = 5^5" />
          </div>
          <Teks>Pada perkalian, banyak faktor bertambah. Pada pembagian, apa yang terjadi?</Teks>
        </div>
      ),
    },
    {
      tipe: 'tampil',
      judul: 'Membagi basis yang sama',
      perluSiap: true,
      isi: ({ onSiap }) => (
        <>
          <Pembongkar
            mode="bagi"
            pilihan={[
              { basis: 7, m: 6, n: 4 },
              { basis: 5, m: 5, n: 2 },
              { basis: 2, m: 6, n: 3 },
            ]}
            onSelesai={onSiap}
          />
          <Teks>Faktor yang sama di atas dan di bawah dicoret.</Teks>
        </>
      ),
    },
    {
      tipe: 'refleksi',
      id: 'm2-refleksi-1',
      judul: 'Mengapa begitu?',
      tanya: 'Mengapa pangkatnya dikurangi?',
      pilihan: [
        {
          id: 'a',
          teks: 'Karena faktor yang sama dicoret, jadi sisa 6 − 4 faktor.',
          benar: true,
          umpan: 'Tepat! Faktor yang dicoret membuat banyak faktor berkurang.',
        },
        {
          id: 'b',
          teks: 'Karena basisnya yang dikurangi.',
          umpan: 'Basisnya tetap sama. Yang berkurang hanya banyak faktornya.',
        },
        {
          id: 'c',
          teks: 'Karena pangkat dijumlahkan seperti perkalian.',
          umpan: 'Itu untuk perkalian. Pada pembagian, faktor justru dicoret.',
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
          <PetaMediasi lanjut="Basis apa pun. Pembagian dan perkalian sama-sama menghitung banyak faktor." />
        </div>
      ),
    },
    { tipe: 'latihan', judul: 'Latihan', soal: soal.modul2, rumus, contoh },
  ],
}
