# Belajar Eksponen

Aplikasi web (PWA) untuk belajar bilangan berpangkat kelas VIII, dirancang untuk mengelola cognitive load siswa. Konteks lengkap ada di `CLAUDE.md` dan berkas rencana lain (PRD, DESIGN, ARCHITECTURE, FEATURES, CONTENT, ROADMAP, TESTING).

## Menjalankan di komputer

Butuh Node.js 20 atau lebih baru.

```bash
npm install
npm run dev        # buka alamat yang tampil (biasanya http://localhost:5173)
```

Tanpa database, buka `/masuk` lalu pilih **Coba tanpa database** untuk melihat tampilan. Halaman `/tipografi` menampilkan uji komponen `Pangkat`.

## Menyambungkan Supabase

1. Buat proyek di https://supabase.com.
2. Authentication → Providers → aktifkan **Allow anonymous sign-ins**.
3. SQL Editor → jalankan isi `supabase/migrations/0001_skema.sql`, lalu `supabase/seed.sql` (membuat kode P01 dan P02).
4. Salin `.env.example` menjadi `.env`, isi `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY` (Project Settings → API). Jangan memakai atau menyimpan service_role key di proyek ini.
5. Jalankan ulang `npm run dev`, lalu masuk dengan kode `P01`.

## Perintah

| Perintah | Fungsi |
|---|---|
| `npm run dev` | Server pengembangan |
| `npm run lint` | Periksa kode (oxlint) |
| `npm run uji` | Uji otomatis pemeriksa jawaban dan seluruh kunci soal |
| `npm run build` | Build produksi + service worker PWA |
| `npm run preview` | Coba hasil build |

## Privasi

Siswa hanya dikenal dengan kode (P01, P02, ...). Jangan memasukkan nama, foto, kontak, atau transkrip wawancara berisi identitas ke repositori.

## Python (analisis)

```bash
cd analysis
pip install -r requirements.txt
python verifikasi_soal.py     # periksa semua kunci soal
python ringkasan.py --demo    # coba dengan data palsu, lihat hasil di analysis/output/demo
python ekspor_data.py         # tarik data asli dari Supabase (butuh kunci service_role di variabel lingkungan)
python ringkasan.py           # ringkasan data asli
```

## Isi aplikasi

Modul 1 (perkalian), Modul 2 (pembagian), Modul 3 (pangkat nol dan negatif), cek dasar, pretest, posttest, angket beban belajar, halaman hasil. Fitur: pembongkar konsep, penemu pola, petunjuk 3 tingkat, umpan balik miskonsepsi, penanda soal cerita, uji angka kecil, rumus dan contoh di layar yang sama.

## Pembimbing AI dan Tanya Kak AI (opsional)

Dua fitur AI: tombol **Tanya pembimbing** setelah salah menjawab, dan obrolan bebas **Tanya Kak AI** (tombol melayang di modul dan menu di beranda). Keduanya memakai kunci yang sama.

Isi `GEMINI_API_KEY` di `.env` (komputer) atau di Environment Variables Vercel. Kunci hanya dibaca fungsi server `api/tanya.js`. Tanpa kunci, pembimbing memakai pertanyaan bawaan. Rincian model pembelajaran: `RMT.md`.
