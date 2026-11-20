# CLAUDE.md — Konteks Proyek untuk Asisten AI

Baca file ini terlebih dahulu di setiap sesi. Dokumen rujukan lain: PRD.md, DESIGN.md, ARCHITECTURE.md, FEATURES.md, CONTENT.md, ROADMAP.md, TESTING.md.

## Ringkasan Proyek
Aplikasi web responsif (PWA) untuk belajar **bilangan berpangkat (eksponen) kelas VIII**, dirancang untuk **menekan extraneous load, mengelola intrinsic load, dan mengoptimalkan germane load** (Cognitive Load Theory, Balance Model) demi membangun **literasi matematis** siswa SMP.

Proyek ini tugas kuliah S1 Pendidikan Matematika dengan model ADDIE. Analysis dan Design sudah selesai (berdasarkan wawancara dua siswa, kode S01 dan S02). Sekarang masuk Development.

## Ruang Lingkup (JANGAN DILEBARKAN)
Tiga modul saja:
1. Perkalian basis sama
2. Pembagian basis sama
3. Pangkat nol dan pangkat negatif

DI LUAR cakupan: pangkat dari pangkat, notasi ilmiah, pangkat pecahan. Jangan menambahkannya, bahkan sebagai "bonus".

## Bahasa Pemrograman (WAJIB: JavaScript dan Python)
Proyek ini memakai **dua bahasa utama**, dengan pembagian tugas yang jelas:

| Bahasa | Dipakai untuk | Lokasi |
|---|---|---|
| **JavaScript** (JSX, ES modules) | Seluruh aplikasi yang dipakai siswa: tampilan, interaksi, logika pengecekan jawaban, pencatatan, PWA | `src/`, `vite.config.js` |
| **Python 3.11+** | Alat bantu peneliti di luar aplikasi: verifikasi kunci soal, ekspor data, analisis deskriptif, grafik untuk laporan | `analysis/` |
| SQL (pendukung) | Skema database dan RLS Supabase | `supabase/` |

Aturan pembagian:
- Python **tidak berjalan di aplikasi siswa** (browser/ponsel). Python hanya dijalankan mahasiswa di laptop.
- Logika yang dipakai siswa (mis. `cekJawaban.js`) ditulis dengan **JavaScript**, bukan TypeScript.
- Data dari aplikasi ke Python lewat **ekspor CSV** atau pembacaan tabel Supabase memakai kunci rahasia yang hanya ada di laptop (lihat `analysis/README.md`); kunci itu tidak boleh masuk repositori.
- Setiap skrip Python harus bisa dijalankan dari terminal dengan satu perintah dan menulis hasil ke `analysis/output/`.

## Tech Stack
- Frontend: React.js (Vite, JavaScript) + Tailwind CSS, dipasang sebagai PWA (vite-plugin-pwa)
- Backend/DB: Supabase (PostgreSQL + Auth sederhana + Row Level Security)
- Olah data: skrip Python (pandas, matplotlib) di folder `analysis/`
- Target perangkat: browser Android (Chrome) dan Windows; prioritas layar ponsel 360–412 px

## Prinsip Desain yang Wajib Dipatuhi
1. **Satu sifat per layar/langkah.** Jangan menampilkan semua sifat eksponen sekaligus.
2. **Konkret sebelum rumus.** Selalu tampilkan penjabaran (3⁴ = 3×3×3×3) sebelum rumus umum.
3. **Basis dan pangkat harus tampak berbeda:** basis besar dan tebal, pangkat kecil tetapi cukup besar untuk dibaca, warna berbeda DAN tidak hanya warna (ukuran, posisi, garis bawah).
4. **Rumus, contoh, dan langkah berdampingan** dalam satu layar. Tidak boleh pindah halaman di tengah soal.
5. **Minim dekorasi.** Tanpa animasi atau grafik latar yang tidak mengajarkan sesuatu. Animasi hanya untuk pembuktian konsep.
6. **Teks penjelasan pendek.** Maksimal sekitar 2 kalimat per blok.
7. **Petunjuk bertingkat (3 level)**, makin lama makin berkurang (fading).
8. **Umpan balik berbasis miskonsepsi**, bukan sekadar "salah".

## Model Pembelajaran: RMT
Aplikasi mengikuti Rigorous Mathematical Thinking (Vygotsky + Feuerstein). Lihat `RMT.md`. Ada dua fitur AI (Gemini): tombol **Tanya pembimbing** setelah jawaban salah (`api/tanya.js`, pertanyaan terpimpin) dan obrolan bebas **Tanya Kak AI** (`api/chat.js`, tombol melayang di modul dan menu di beranda). Kak AI menjawab langsung seperti guru privat (langkah lengkap sampai jawaban bila diminta); mode membimbing tanpa hasil akhir tersedia lewat variabel `KAKAI_MODE=mediasi`. Tidak tersedia di pretest/posttest. Kunci API hanya di server (`GEMINI_API_KEY`), tidak pernah di kode frontend.

## Etika dan Privasi (WAJIB)
- Siswa hanya diidentifikasi dengan **kode** (mis. P01, P02). Tidak ada nama, foto, email, atau nomor kontak di database, kode, prompt, atau repositori.
- Akses data dibatasi dengan Row Level Security.
- Jangan pernah memasukkan transkrip wawancara asli yang berisi identitas ke repositori.
- Ke penyedia AI hanya dikirim teks soal, jawaban atau pertanyaan siswa, dan tahap berpikir. Tanpa kode siswa. Server menyamarkan nomor telepon dan email di pertanyaan siswa. Riwayat obrolan hanya tersimpan di perangkat siswa.

## Konvensi Kode
- Bahasa UI: **Bahasa Indonesia** sederhana, sesuai usia SMP.
- Nama variabel dan fungsi: bahasa Inggris; komentar boleh Indonesia.
- Komponen React fungsional dengan hooks; tidak memakai class component.
- Setiap komponen interaktif harus punya `aria-label` dan bisa dipakai dengan sentuhan (target sentuh minimal 44×44 px).
- Notasi matematika dirender dengan KaTeX atau komponen `<Pangkat basis="3" pangkat="4" />` buatan sendiri (lihat DESIGN.md).
- Setiap jawaban siswa dicatat: modul, butir, jawaban, benar/salah, tingkat petunjuk, waktu (ms).

## Cara Bekerja dengan Asisten AI (Vibe Coding)
- Kerjakan **satu fitur per sesi** sesuai urutan ROADMAP.md.
- Sebelum menulis kode, rujuk FEATURES.md untuk kriteria penerimaan fitur terkait.
- Setelah selesai, jalankan `npm run lint` dan `npm run build`.
- Mahasiswa mendokumentasikan interaksi AI sebagai tangkapan layar untuk laporan. Beri ringkasan singkat di akhir tiap sesi tentang apa yang dibuat.
- Jika ada keputusan yang belum tercantum di dokumen, tanyakan, jangan menebak.

## Peta Dokumen
| File | Isi |
|---|---|
| PRD.md | Kebutuhan produk, pengguna, tujuan, kriteria keberhasilan |
| DESIGN.md | Panduan UI/UX, tipografi, warna, tata letak |
| ARCHITECTURE.md | Struktur folder, skema database, RLS, alur data |
| FEATURES.md | Spesifikasi F1–F10 dan kriteria penerimaan |
| CONTENT.md | Soal, kunci, petunjuk, umpan balik miskonsepsi |
| ROADMAP.md | Urutan pembangunan dan jadwal sesi |
| RMT.md | Model Rigorous Mathematical Thinking dan pemetaannya ke fitur |
| TESTING.md | Pretest, posttest, skala Leppink, analisis |
