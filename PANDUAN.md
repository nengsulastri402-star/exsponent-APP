# PANDUAN.md — Dari Nol sampai Aplikasi Berjalan di Ponsel Siswa

Panduan ini berurutan. Kerjakan dari Tahap 1 dan jangan melompat. Setiap tahap punya **tanda selesai** supaya Anda tahu kapan boleh lanjut.

Gambaran besar:

```
Tahap 1  Siapkan laptop
Tahap 2  Jalankan aplikasi (sudah Anda capai)
Tahap 3  Sambungkan database Supabase
Tahap 4  Bangun fitur (Sprint 1–3) bersama asisten AI
Tahap 5  Siapkan Python untuk analisis
Tahap 6  Online-kan aplikasi (deploy)
Tahap 7  Uji di ponsel dan Windows
Tahap 8  Uji coba dengan dua siswa
Tahap 9  Olah data dan tulis laporan
```

---

## Tahap 1 — Siapkan Laptop

| Alat | Untuk apa | Cara memeriksa |
|---|---|---|
| Node.js LTS (v20 atau lebih baru) | Menjalankan aplikasi JavaScript | `node -v` |
| Python 3.11 atau lebih baru | Analisis data | `python --version` |
| VS Code | Editor | — |
| Git | Menyimpan riwayat dan deploy | `git --version` |
| Akun GitHub, Supabase, Vercel (gratis) | Repositori, database, hosting | — |

**Tanda selesai:** ketiga perintah pemeriksaan menampilkan nomor versi.

---

## Tahap 2 — Jalankan Aplikasi

1. Ekstrak `exponent-app-sprint0.zip`.
2. Buka folder `exponent-app` di VS Code (File → Open Folder).
3. Buka terminal VS Code (Terminal → New Terminal), lalu:
   ```bash
   npm install
   npm run dev
   ```
4. Buka alamat yang tampil (biasanya `http://localhost:5173`).

**Tanda selesai:** halaman "Belajar Eksponen" tampil. Kotak kuning dan tombol Masuk yang pudar itu normal selama database belum tersambung.

Untuk menghentikan server, tekan `Ctrl + C` di terminal.

---

## Tahap 3 — Sambungkan Database Supabase

### 3.1 Buat proyek
1. Daftar di https://supabase.com, lalu **New project**.
2. Isi nama (mis. `eksponen`), buat **Database Password** dan simpan di tempat aman, pilih region terdekat (Singapore), lalu **Create**. Tunggu sampai selesai (1–2 menit).

### 3.2 Aktifkan masuk anonim
Aplikasi memakai sesi anonim yang dikaitkan ke kode siswa.
1. Menu **Authentication** → **Sign In / Providers** (di tampilan lama: **Providers**).
2. Cari **Anonymous Sign-Ins**, aktifkan, lalu **Save**.

### 3.3 Jalankan SQL
1. Menu **SQL Editor** → **New query**.
2. Buka `supabase/migrations/0001_skema.sql` di VS Code, salin seluruh isinya, tempel, lalu **Run**. Harus muncul "Success".
3. Buat query baru, salin isi `supabase/seed.sql`, lalu **Run**. Ini membuat kode **P01** dan **P02**.
4. Periksa di **Table Editor**: tabel `siswa` berisi dua baris (P01 dan P02).

### 3.4 Ambil kunci dan isi `.env`
1. **Project Settings** → **API** (atau **Data API / API Keys**).
2. Salin **Project URL** dan kunci **anon public** (di tampilan baru bisa bernama *publishable key*).
3. Di folder proyek, salin `.env.example` menjadi `.env` (nama persis `.env`), lalu isi:
   ```
   VITE_SUPABASE_URL=https://xxxxxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=kunci-anon-anda
   ```
4. **Jangan** memakai kunci `service_role` di file ini.
5. Hentikan server (`Ctrl + C`) dan jalankan lagi `npm run dev`. File `.env` hanya terbaca saat server dimulai.

### 3.5 Coba masuk
Buka `/masuk`, ketik `P01`, lalu klik **Masuk**.

**Tanda selesai:** Anda masuk ke Beranda dan kotak kuning hilang. Di Supabase → Table Editor → `sesi` muncul satu baris baru.

**Jika gagal:** lihat tabel "Masalah Umum" di bagian bawah.

---

## Tahap 4 — Bangun Fitur Bersama Asisten AI

Ikuti `ROADMAP.md`. Aturan kerja:
- **Satu langkah per sesi.** Jangan minta semuanya sekaligus.
- Mulai tiap sesi dengan meminta asisten membaca `CLAUDE.md`.
- Setelah tiap langkah: jalankan `npm run dev`, coba di browser (dan mode ponsel: F12 lalu ikon ponsel), baru lanjut.
- **Tangkap layar** prompt dan hasilnya untuk laporan.
- Setelah satu langkah beres, simpan riwayatnya:
  ```bash
  git add .
  git commit -m "Sprint 1.1: rangka modul"
  ```

### Contoh prompt per langkah

| Langkah | Prompt yang bisa Anda pakai |
|---|---|
| 1.1 | "Baca CLAUDE.md, ROADMAP.md, FEATURES.md (F2). Kerjakan Sprint 1.1: rangka modul dengan navigasi langkah, bilah progres, dan penguncian modul yang tersimpan di progres_modul. Jangan mengerjakan langkah lain." |
| 1.2 | "Kerjakan Sprint 1.2: komponen Pembongkar (F1) dan langkah belajar Modul 1. Ikuti kriteria penerimaan F1 di FEATURES.md. Rumus baru muncul setelah penjabaran selesai." |
| 1.3 | "Kerjakan Sprint 1.3: latihan Modul 1 dengan petunjuk 3 tingkat (F5). Soal dari CONTENT.md, simpan ke src/data/soal.json, catat jawaban lewat logger.js." |
| 1.3b | "Tulis analysis/verifikasi_soal.py yang menghitung ulang semua kunci di src/data/soal.json dengan fractions.Fraction dan melaporkan yang tidak cocok." |
| 1.4 | "Kerjakan Sprint 1.4: Modul 2 (pembagian) memakai komponen yang sama dengan Modul 1." |
| 1.5 | "Kerjakan Sprint 1.5: PenemuPola (F4) dan Modul 3." |
| 2.1–2.4 | Satu prompt per fitur: F9, F7, F6, F8, selalu menyebut nama fitur dan "ikuti FEATURES.md". |
| 3.1 | "Kerjakan Sprint 3.1: halaman Pretest, Posttest, dan skala Leppink. Soal dari CONTENT.md; butir Leppink akan saya berikan." |

### Memeriksa hasil tiap fitur
Buka `FEATURES.md`, cari fitur yang baru dibuat, lalu centang **Kriteria penerimaan** satu per satu sambil mencobanya. Jika ada yang gagal, minta asisten memperbaikinya sebelum lanjut.

### Hal yang harus Anda siapkan sendiri
- **Butir skala Leppink** (Leppink dkk., 2013): ambil dari artikel aslinya dan terjemahkan.
- **Soal posttest dan kunci** di `CONTENT.md`: periksa dan setujui sendiri sebagai calon guru matematika.
- **Izin** siswa dan orang tua sebelum uji coba.

**Tanda selesai Tahap 4:** semua fitur F1 sampai F9 lolos kriteria penerimaannya, `npm run lint` dan `npm run build` lulus.

---

## Tahap 5 — Siapkan Python (Analisis)

Python dijalankan di laptop Anda, bukan di aplikasi siswa.

```bash
cd analysis
python -m venv .venv
.venv\Scripts\activate          # Windows
# source .venv/bin/activate     # Mac/Linux
pip install -r requirements.txt
```

Tiga skrip dibuat bersama asisten AI:
1. `verifikasi_soal.py` (Sprint 1.3b): jalankan setiap soal berubah.
2. `ekspor_data.py` (Sprint 3.2): menarik data dari Supabase menjadi CSV. Butuh kunci `service_role` yang disimpan **hanya** sebagai variabel lingkungan di laptop:
   ```bash
   # Windows PowerShell
   $env:SUPABASE_URL="https://xxxx.supabase.co"
   $env:SUPABASE_SERVICE_KEY="kunci-service-role"
   ```
3. `ringkasan.py` (Sprint 3.2): tabel dan grafik deskriptif ke `analysis/output/`.

**Tanda selesai:** `python verifikasi_soal.py` menampilkan semua kunci cocok.

---

## Tahap 6 — Online-kan Aplikasi (Deploy)

Siswa membuka aplikasi lewat tautan, jadi aplikasi harus online. Pakai Vercel (gratis).

### 6.1 Naikkan kode ke GitHub
1. Di GitHub, buat repositori baru, sebaiknya **Private**.
2. Di terminal proyek:
   ```bash
   git init
   git add .
   git commit -m "Versi awal"
   git branch -M main
   git remote add origin https://github.com/USERNAME/exponent-app.git
   git push -u origin main
   ```
3. Periksa di GitHub: file `.env` **tidak boleh** ada di sana. (Sudah masuk `.gitignore`.)

### 6.2 Deploy di Vercel
1. Masuk ke https://vercel.com dengan akun GitHub → **Add New → Project** → pilih repositori `exponent-app` → **Import**.
2. Framework otomatis terdeteksi sebagai **Vite**. Biarkan pengaturan bawaan (build `npm run build`, output `dist`).
3. Buka **Environment Variables**, tambahkan dua variabel yang sama dengan `.env`:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Klik **Deploy**. Setelah selesai Anda mendapat alamat seperti `https://exponent-app-xxxx.vercel.app`.

File `vercel.json` di proyek sudah mengatur agar halaman seperti `/masuk` tidak menampilkan "404" saat dibuka langsung atau di-refresh.

### 6.3 Izinkan alamat di Supabase
Untuk masuk anonim dengan Supabase tidak perlu pengaturan URL tambahan. Jika nanti memakai fitur Auth lain, tambahkan alamat Vercel di **Authentication → URL Configuration**.

**Tanda selesai:** alamat Vercel terbuka di ponsel Anda dan Anda bisa masuk dengan `P01`.

Setiap kali Anda `git push`, Vercel otomatis memperbarui aplikasi.

---

## Tahap 7 — Uji di Ponsel dan Windows

Gunakan daftar di `TESTING.md` §1. Ringkasannya:

| Uji | Cara |
|---|---|
| Ukuran layar | Chrome: F12 → ikon ponsel → pilih 360 px dan 412 px |
| Ponsel Android asli | Buka alamat Vercel di Chrome |
| Pasang sebagai aplikasi | Chrome Android → menu ⋮ → **Instal aplikasi / Tambahkan ke layar utama** |
| Windows | Chrome atau Edge → ikon instal di bilah alamat |
| Hitam-putih | Aktifkan filter grayscale (pengaturan aksesibilitas), lalu pastikan basis dan pangkat masih terbedakan |
| Jawaban tercatat | Kerjakan 5 soal, lalu lihat tabel `jawaban` di Supabase |
| Keamanan (RLS) | Masuk sebagai P01, pastikan tidak bisa membaca data P02 |
| Offline ringan | Matikan internet saat menjawab, nyalakan lagi, data harus tersinkron |
| Privasi | Pastikan tidak ada nama atau kontak di kode maupun database |

**Tanda selesai:** semua baris lulus, dan Anda sudah menguji di setidaknya satu ponsel asli.

---

## Tahap 8 — Uji Coba dengan Dua Siswa

Ikuti urutan di `ROADMAP.md` (Fase Implementation).

**Sebelum hari uji:**
- [ ] Izin siswa dan orang tua sudah ada
- [ ] Kode dibagikan: P01 untuk siswa pertama, P02 untuk siswa kedua. Catat pasangannya di buku catatan pribadi, **bukan** di repositori
- [ ] Aplikasi sudah online dan diuji di ponsel siswa atau ponsel pinjaman
- [ ] Internet stabil di lokasi
- [ ] Soal pretest, posttest, dan butir Leppink final

**Urutan:**
1. Pretest.
2. Sesi 1: diagnostik dan Modul 1.
3. Sesi 2: Modul 2 dan 3.
4. Sesi 3 (opsional): latihan campuran.
5. Pertemuan 4: Anda memfasilitasi dan mencatat observasi (di mana siswa tersendat, pembongkar dan petunjuk dipakai atau tidak).
6. Posttest dan skala Leppink.

Saat siswa mengerjakan, **jangan membantu** kecuali macet total. Catat kapan Anda terpaksa membantu.

---

## Tahap 9 — Olah Data dan Tulis Laporan

1. `python ekspor_data.py` → CSV di `analysis/data/`.
2. `python ringkasan.py` → tabel dan grafik di `analysis/output/`.
3. Analisis **deskriptif** (n = 2): selisih posttest dikurangi pretest, subskala Leppink, tren petunjuk, waktu, miskonsepsi yang tersisa (lihat `TESTING.md` §4).
4. Tulis keterbatasan (`TESTING.md` §6): n = 2, tanpa kelompok kontrol, terjemahan Leppink belum divalidasi, satu pengode.
5. Lampirkan dokumentasi: tangkapan layar prompt AI, foto kegiatan (wajah dikaburkan), grafik.

---

## Masalah Umum

| Gejala | Penyebab | Perbaikan |
|---|---|---|
| Tombol Masuk pudar, ada kotak kuning | `.env` belum terisi atau server belum dimulai ulang | Isi `.env`, `Ctrl + C`, `npm run dev` |
| "Kode tidak ditemukan" | `seed.sql` belum dijalankan, atau kode salah ketik | Cek tabel `siswa`; kode berbentuk `P01` |
| "Ada masalah saat masuk" | Anonymous sign-ins belum aktif, atau SQL belum dijalankan | Ulangi 3.2 dan 3.3 |
| `permission denied` / data tidak tersimpan | RLS aktif tetapi sesi belum terkait kode | Keluar, masuk ulang dengan kode |
| `npm` tidak dikenali | Node.js belum terpasang | Pasang Node LTS, buka ulang terminal |
| Layar putih setelah deploy | Variabel lingkungan belum diisi di Vercel | Isi di Vercel → Settings → Environment Variables, lalu **Redeploy** |
| Halaman 404 saat refresh di Vercel | Pengaturan rewrite hilang | Pastikan `vercel.json` ada, lalu push ulang |
| Aplikasi tidak berubah setelah update (PWA) | Service worker menyimpan versi lama | Tutup semua tab lalu buka lagi; atau DevTools → Application → Service Workers → Unregister |
| `git push` ditolak | Belum login GitHub | Login lewat VS Code atau `gh auth login` |
| Data tidak muncul di Supabase | Mode "Coba tanpa database" aktif (data hanya lokal) | Keluar, lalu masuk dengan kode sungguhan |

Jika masih macet, salin **pesan error lengkap** dari terminal atau konsol browser (F12 → Console) dan kirim ke asisten.

---

## Daftar Periksa Akhir

- [ ] Aplikasi online dan terbuka di ponsel
- [ ] Masuk dengan P01 dan P02 berhasil
- [ ] Semua fitur wajib (F1–F5) dan penting (F6–F9) lolos kriteria penerimaan
- [ ] Jawaban, petunjuk, waktu, dan miskonsepsi tercatat di Supabase
- [ ] `.env` dan kunci `service_role` tidak ada di GitHub
- [ ] Tidak ada nama atau kontak siswa di kode dan database
- [ ] `verifikasi_soal.py` lulus
- [ ] Izin siswa dan orang tua ada
- [ ] Pretest dan posttest siap
- [ ] Dokumentasi prompt AI terkumpul

## Tambahan: Menyalakan AI Gemini (Kak AI dan Pembimbing)

Gemini punya paket gratis. Tanpa kunci, tombol Pembimbing memakai pertanyaan bawaan dan Kak AI menampilkan pesan belum aktif.

1. Buka https://aistudio.google.com/apikey, masuk dengan akun Google, klik **Create API key**, lalu salin.
2. **Di komputer:** di `.env` tulis satu baris `GEMINI_API_KEY=kunci_anda` (tanpa spasi, tanpa tanda petik, tanpa `VITE_`), simpan, lalu hentikan `npm run dev` (Ctrl+C) dan jalankan lagi.
3. **Di Vercel:** Settings → Environment Variables → nama `GEMINI_API_KEY`, isi kunci, centang Production, Save, lalu Deployments → **Redeploy**.
4. **Periksa:** buka `http://localhost:5173/api/status` (komputer) atau `https://alamat-anda.vercel.app/api/status`. Tertulis `BERHASIL` bila AI siap; bila gagal, status dan pesan tiap percobaan menunjukkan sebabnya (kunci tidak terbaca, kunci salah, kuota habis, atau jaringan).
5. Bila nama model bawaan gagal, isi `GEMINI_MODEL=` dengan nama dari AI Studio.
6. Paket gratis punya batas pertanyaan per menit dan per hari. Bila terlewati, Kak AI menampilkan "Terlalu banyak pertanyaan".
7. Jangan menaruh kunci di GitHub, di chat, atau dengan awalan `VITE_`. Bila kunci pernah terlihat orang lain, hapus lalu buat yang baru.
8. **Privasi:** pada paket gratis, Google dapat memakai isi pertanyaan untuk meningkatkan produknya dan petugas dapat membacanya. Jangan menulis nama atau data pribadi di obrolan, dan pastikan izin siswa dan orang tua menyebut hal ini.
