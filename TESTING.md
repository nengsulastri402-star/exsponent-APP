# TESTING.md — Rencana Pengujian dan Evaluasi

## 1. Uji Teknis (selama Development)
| Uji | Cara | Lulus bila |
|---|---|---|
| Responsif | Layar 360, 412, 768, 1366 px | Tidak ada teks terpotong; tidak ada scroll horizontal |
| Perangkat | Android Chrome, Windows Chrome/Edge | Semua fitur berjalan |
| PWA | Pasang ke layar utama | Terbuka tanpa bilah browser |
| Grayscale | Ubah tampilan ke hitam-putih | Basis dan pangkat tetap terbedakan (F3) |
| Pencatatan | Kerjakan 5 soal, cek tabel `jawaban` | Waktu, petunjuk, miskonsepsi tercatat |
| RLS | Coba baca data siswa lain | Ditolak |
| Offline ringan | Matikan jaringan saat menjawab | Jawaban masuk antrian dan tersinkron |
| Privasi | Telusuri repositori dan DB | Tidak ada nama atau kontak |

## 2. Uji Fitur Berdasarkan Indikator (dari matriks F1–F10)
| Fitur | Indikator uji |
|---|---|
| F1 | Siswa menjabarkan 3⁴ dan 5³×5² dengan benar dan menjelaskan alasannya |
| F2 | Skor per modul tercatat; modul berikutnya terbuka setelah modul sebelumnya |
| F3 | Akurasi membaca basis dan pangkat pada 5 soal |
| F4 | Siswa menjelaskan alasan a⁰ = 1 dengan kata sendiri |
| F5 | Jumlah petunjuk per soal menurun; soal mandiri benar |
| F6 | Skor diagnostik sebelum dan sesudah refresher |
| F7 | Tidak ada perpindahan layar di tengah soal |
| F8 | Penanda benar pada soal cerita |
| F9 | Jawaban dikoreksi setelah umpan balik |
| F10 | Hasil substitusi dipakai sebelum jawaban dikirim |

## 3. Evaluasi Pembelajaran (Implementation → Evaluation)
**Subjek:** dua siswa percobaan yang belum pernah belajar eksponen (kode P01, P02).

**Urutan:** Pretest → Sesi 1 → Sesi 2 → (Sesi 3) → Pertemuan 4 (observasi) → Posttest + Leppink.

**Instrumen:**
- Pretest dan posttest: 7 butir setara (CONTENT.md §1–2), skor per modul.
- Skala Leppink dkk. (2013): diisi setelah belajar; mengukur intrinsic, extraneous, germane load. Terjemahkan butirnya ke bahasa Indonesia dan sesuaikan konteks (mis. "aktivitas pembelajaran dengan aplikasi ini"). Ambil butir asli dari artikel Leppink dkk. (2013) dan catat bahwa terjemahan belum divalidasi untuk SMP; uji keterbacaan pada siswa sebelum dipakai.
- Catatan observasi fasilitator (pertemuan 4): di mana siswa tersendat, apakah pembongkar dan petunjuk dipakai, apakah tampilan membingungkan.
- Log aplikasi: jumlah petunjuk, waktu, kesalahan per modul, kode miskonsepsi.

## 4. Rencana Analisis (deskriptif)
1. Selisih skor posttest − pretest per siswa (total dan per modul).
2. Rata-rata dan sebaran subskala Leppink (IL, EL, GL) per siswa.
3. Tren petunjuk per soal dari Modul 1 ke Modul 3.
4. Waktu per soal dan kesalahan per modul.
5. Miskonsepsi yang masih muncul (kode M1–M8).
6. Hubungan deskriptif: perubahan skor vs penggunaan fitur (petunjuk, waktu, kesalahan). Dengan n = 2, jangan memakai uji inferensial; laporkan sebagai pola kasus.

Skrip: `analysis/ringkasan.py` membaca CSV ekspor dan menghasilkan tabel dan grafik.

## 5. Kriteria Keberhasilan Awal (usulan)
- Skor posttest naik dibanding pretest untuk kedua siswa.
- Extraneous load lebih rendah daripada intrinsic dan germane load.
- Jumlah petunjuk per soal menurun dari Modul 1 ke Modul 3.

## 6. Keterbatasan yang Harus Dicantumkan
- n = 2; tidak dapat digeneralisasi.
- Terjemahan skala Leppink belum divalidasi untuk SMP.
- Pretest-posttest tanpa kelompok kontrol; kenaikan skor tidak dapat dikaitkan secara kausal dengan aplikasi.
- Pengodean wawancara oleh satu peneliti tanpa pengode kedua.
- Cakupan hanya tiga modul.

## 7. Dokumentasi untuk Laporan
- Tangkapan layar tiap sesi vibe coding (prompt dan hasil).
- Foto kegiatan (wajah dikaburkan, tanpa nama).
- Ekspor data dan grafik dari skrip Python.
