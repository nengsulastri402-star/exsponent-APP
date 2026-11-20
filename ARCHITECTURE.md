# ARCHITECTURE.md — Arsitektur Teknis

## 1. Stack
- **JavaScript:** React.js + Vite, Tailwind CSS, React Router
- PWA: `vite-plugin-pwa` (dapat dipasang di Android dan Windows)
- Supabase: PostgreSQL, RLS, (opsional) Edge Functions
- **Python:** pandas, matplotlib di `analysis/` untuk olah data
- Hosting: Vercel atau Netlify (frontend), Supabase (backend)

### 1.1 Pembagian Bahasa Pemrograman
| Bahasa | Komponen | Berjalan di |
|---|---|---|
| JavaScript | Aplikasi siswa (UI, `cekJawaban.js`, `logger.js`, PWA) | Browser siswa (Android/Windows) |
| Python | `verifikasi_soal.py`, `ekspor_data.py`, `ringkasan.py` | Laptop mahasiswa |
| SQL | Skema, RLS, fungsi `masuk_dengan_kode` | Supabase |

Alur antar bahasa:
```
Siswa (JavaScript, browser) → Supabase (SQL/PostgreSQL) → ekspor CSV / pembacaan tabel
                                                          → Python (analysis/) → tabel dan grafik untuk laporan
src/data/soal.json → Python (verifikasi_soal.py) memeriksa kunci jawaban sebelum dipakai siswa
```

## 2. Struktur Folder
```
exponent-app/
├─ CLAUDE.md  PRD.md  DESIGN.md  ARCHITECTURE.md
├─ FEATURES.md  CONTENT.md  ROADMAP.md  TESTING.md
├─ src/
│  ├─ components/
│  │  ├─ Pangkat.jsx
│  │  ├─ Pembongkar.jsx          (F1)
│  │  ├─ PenemuPola.jsx          (F4)
│  │  ├─ PanelContoh.jsx         (F7)
│  │  ├─ TombolPetunjuk.jsx      (F5)
│  │  ├─ PenandaCerita.jsx       (F8)
│  │  ├─ KartuUmpanBalik.jsx     (F9)
│  │  └─ UjiAngkaKecil.jsx       (F10)
│  ├─ modules/
│  │  ├─ modul1/  modul2/  modul3/
│  │  └─ diagnostik/
│  ├─ data/                      (soal.json, petunjuk.json, miskonsepsi.json)
│  ├─ lib/
│  │  ├─ supabase.js
│  │  ├─ logger.js               (catat jawaban, petunjuk, waktu)
│  │  └─ cekJawaban.js           (validasi + deteksi miskonsepsi)
│  ├─ pages/  (Beranda, Masuk, Pretest, Posttest, Leppink, Hasil)
│  └─ App.jsx
├─ supabase/migrations/
├─ analysis/                     (skrip Python)
│  ├─ requirements.txt           (pandas, matplotlib, supabase)
│  ├─ README.md                  (cara menjalankan)
│  ├─ verifikasi_soal.py         (cek kunci soal.json dengan aritmetika pecahan)
│  ├─ ekspor_data.py             (tarik tabel Supabase → CSV di data/)
│  ├─ ringkasan.py               (tabel dan grafik deskriptif → output/)
│  ├─ data/                      (CSV; tidak masuk repositori)
│  └─ output/                    (tabel dan grafik hasil)
└─ public/  (manifest, ikon)
```

## 3. Skema Database (Supabase)
Siswa hanya dikenal lewat `kode`.

```sql
create table siswa (
  id uuid primary key default gen_random_uuid(),
  kode text unique not null,        -- mis. P01, P02
  kelas text,
  dibuat timestamptz default now()
);

create table sesi (
  id uuid primary key default gen_random_uuid(),
  siswa_id uuid references siswa(id) on delete cascade,
  nomor_sesi int not null,
  mulai timestamptz default now(),
  selesai timestamptz
);

create table jawaban (
  id uuid primary key default gen_random_uuid(),
  siswa_id uuid references siswa(id) on delete cascade,
  sesi_id uuid references sesi(id),
  modul int check (modul between 0 and 3),   -- 0 = diagnostik
  butir text not null,
  jawaban text,
  benar boolean,
  miskonsepsi text,                          -- kode miskonsepsi terdeteksi
  tingkat_petunjuk int default 0 check (tingkat_petunjuk between 0 and 3),
  waktu_ms int,
  dibuat timestamptz default now()
);

create table tes (
  id uuid primary key default gen_random_uuid(),
  siswa_id uuid references siswa(id) on delete cascade,
  jenis text check (jenis in ('pretest','posttest','diagnostik')),
  skor numeric,
  skor_maks numeric,
  dibuat timestamptz default now()
);

create table skala_kognitif (
  id uuid primary key default gen_random_uuid(),
  siswa_id uuid references siswa(id) on delete cascade,
  butir text not null,           -- mis. IL1, EL2, GL3
  nilai int check (nilai between 0 and 10),
  dibuat timestamptz default now()
);

create table progres_modul (
  siswa_id uuid references siswa(id) on delete cascade,
  modul int,
  terbuka boolean default false,
  selesai boolean default false,
  primary key (siswa_id, modul)
);
```

## 4. Keamanan dan Privasi
- RLS aktif di semua tabel.
- Siswa hanya boleh insert/select baris miliknya (mekanisme: Supabase anonymous sign-in yang dipetakan ke `siswa.kode`, atau Edge Function yang menukar kode dengan token).
- Peneliti membaca semua data lewat dashboard Supabase atau service key yang TIDAK pernah masuk ke frontend/repositori.
- `.env` untuk `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY`; `.env` masuk `.gitignore`.
- Tidak ada kolom nama, email, foto, kontak.

## 5. Alur Data
1. Siswa memasukkan kode → sesi dibuat.
2. Tiap soal: timer mulai saat soal tampil; saat jawab, `logger.js` menyimpan jawaban, benar/salah, miskonsepsi, tingkat petunjuk tertinggi yang dipakai, dan waktu.
3. Modul berikutnya terbuka bila modul sebelumnya selesai (`progres_modul`).
4. Tes dan skala Leppink disimpan di `tes` dan `skala_kognitif`.
5. Skrip Python mengekspor CSV dan membuat tabel/grafik deskriptif.

## 6. Offline dan Kinerja
- Cache aset statis lewat service worker.
- Antrian lokal (localStorage/IndexedDB) untuk jawaban bila koneksi putus, disinkronkan saat online.
- Soal dimuat dari JSON lokal agar cepat.

## 7. Keputusan Teknis
| Keputusan | Alasan |
|---|---|
| PWA, bukan aplikasi native | Satu kode untuk Android dan Windows |
| Soal di JSON lokal | Cepat, mudah direvisi tanpa migrasi DB |
| Deteksi miskonsepsi di sisi klien (`cekJawaban.js`) | Umpan balik instan; kode miskonsepsi tetap dicatat |
| Tanpa akun nama/email | Privasi siswa |
