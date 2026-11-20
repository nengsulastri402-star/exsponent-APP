# PRD — Aplikasi Pembelajaran Eksponen Berbasis Cognitive Load

## 1. Latar Belakang
Literasi matematis menuntut siswa memahami konsep dan menerapkannya. Pada eksponen, siswa harus mengelola banyak unsur sekaligus: arti pangkat, kesamaan basis, aturan operasi, dan tanda negatif. Hal ini membebani memori kerja. Wawancara dengan dua siswa SMP (S01 dan S02) menunjukkan sumber beban sebagai berikut.

| Jenis beban | Temuan utama |
|---|---|
| Intrinsic | Pangkat nol dan negatif sulit; banyak sifat harus digabung sekaligus; miskonsepsi 3² = 6, (−3)² vs −3², pangkat ditambah vs dikali; prasyarat perkalian dasar lemah |
| Extraneous | Guru menyajikan tabel sifat langsung tanpa penjabaran; penyajian terlalu cepat; pangkat tertulis sangat kecil; rumus dan contoh berjauhan (hlm 10 vs 12); tampilan padat; soal cerita membingungkan |
| Germane | Paham saat membuktikan sendiri lewat penjabaran; terbantu petunjuk bertahap, penanda warna, gambar visual; kebiasaan mengecek jawaban masih lemah (S02) |

Catatan: temuan bersifat deskriptif dari dua informan dan tidak dapat digeneralisasi.

## 2. Tujuan Produk
1. Menurunkan extraneous load lewat tampilan dan pacing yang tepat.
2. Mengelola intrinsic load lewat modul bertahap, satu sifat per langkah.
3. Meningkatkan germane load lewat pembuktian konkret, petunjuk bertingkat, dan refleksi.
4. Mendukung literasi matematis: siswa memahami, menjelaskan, dan menerapkan eksponen (termasuk soal cerita).

## 3. Pengguna
- **Utama:** siswa SMP kelas VIII–IX yang belajar eksponen, di Android dan browser.
- **Pengguna uji:** dua siswa percobaan yang belum pernah belajar materi ini.
- **Sekunder:** mahasiswa peneliti (melihat data jawaban, petunjuk, waktu).

## 4. Ruang Lingkup
**Termasuk:** Modul 1 (perkalian basis sama), Modul 2 (pembagian basis sama), Modul 3 (pangkat nol dan negatif), diagnostik prasyarat, pretest, posttest, skala Leppink.
**Tidak termasuk:** pangkat dari pangkat, notasi ilmiah, pangkat pecahan, login nama/email, fitur sosial, gamifikasi berlebihan.

## 5. Fitur (ringkas, rinci di FEATURES.md)
| ID | Fitur | Prioritas |
|---|---|---|
| F1 | Pembongkar konsep (ketuk 3⁴ → 3×3×3×3) | Wajib |
| F2 | Tiga modul, satu sifat per layar | Wajib |
| F3 | Tipografi kontras basis dan pangkat | Wajib |
| F4 | Penemu pola pangkat nol dan negatif (slider) | Wajib |
| F5 | Latihan dengan petunjuk 3 tingkat | Wajib |
| F6 | Diagnostik prasyarat 5 soal + mini-refresher | Penting |
| F7 | Rumus, contoh, langkah berdampingan | Penting |
| F8 | Penanda informasi pada soal cerita | Penting |
| F9 | Umpan balik berbasis miskonsepsi | Penting |
| F10 | Opsi "uji dengan angka kecil" | Opsional (bukti hanya dari S01) |

## 6. Kebutuhan Non-Fungsional
- Responsif, nyaman di layar 360 px; dapat dipasang sebagai PWA.
- Memuat < 3 detik pada koneksi seluler biasa.
- Pencatatan interaksi tidak boleh memperlambat UI.
- Privasi: hanya kode siswa; RLS aktif.
- Aksesibilitas: kontras warna memadai, tidak bergantung warna saja, target sentuh ≥ 44 px.

## 7. Alur Pengguna Utama
1. Masuk dengan kode siswa.
2. Pretest (sebelum sesi; dapat dijalankan oleh peneliti).
3. Diagnostik prasyarat (F6), lalu mini-refresher bila perlu.
4. Modul 1 → Modul 2 → Modul 3 (terbuka berurutan).
5. Di tiap modul: penjelasan konkret (F1/F4) → contoh bertahap → latihan dengan petunjuk (F5, F9).
6. Posttest + skala Leppink.

## 8. Kriteria Keberhasilan Awal
- Skor posttest naik dibanding pretest.
- Extraneous load (Leppink) lebih rendah daripada intrinsic dan germane load.
- Jumlah petunjuk per soal menurun dari Modul 1 ke Modul 3.
Dengan dua subjek, hasil dilaporkan secara deskriptif, tanpa uji inferensial.

## 9. Risiko
| Risiko | Mitigasi |
|---|---|
| Fitur membengkak | Patuhi cakupan tiga modul dan prioritas F1–F5 dulu |
| Animasi menambah extraneous load | Animasi hanya untuk pembuktian; durasi pendek; ada tombol ulang dan jeda |
| Siswa baru tidak punya prasyarat | F6 diagnostik + refresher |
| Data pribadi bocor | Kode saja, RLS, tanpa nama di repositori |
| Instrumen Leppink belum divalidasi untuk SMP | Terjemahkan dan uji keterbacaan; catat sebagai keterbatasan |
