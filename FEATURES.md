# FEATURES.md — Spesifikasi Fitur dan Kriteria Penerimaan

Format tiap fitur: Bukti → Perilaku → Spesifikasi → Kriteria penerimaan → Data yang dicatat.

---
## F1 — Pembongkar Konsep (WAJIB) · Modul 1, 2
**Bukti:** S02 menghitung 3² = 6; S01 paham lewat penjabaran (2×2×2)×(2×2) = 2⁵; guru memberi rumus tanpa penjabaran. (IL1, EL1, GL1)
**Spesifikasi:**
- Siswa mengetuk `3⁴`; muncul `3 × 3 × 3 × 3` satu faktor per ketukan, dengan label "basis 3 dipakai 4 kali".
- Mode pembuktian: `5³ × 5² = (5×5×5)×(5×5) = 5⁵`; hitung faktor, lalu tampilkan "3 + 2 = 5".
- Pembagian: `7⁶ ÷ 7⁴` ditampilkan sebagai pecahan dengan faktor yang dicoret satu per satu.
- Tombol Ulang dan Jeda; tanpa putar otomatis berulang.
- Setelah animasi, ajukan satu pertanyaan penjelasan: "Mengapa pangkatnya dijumlahkan?" (pilihan jawaban atau isian singkat).
**Kriteria penerimaan:**
- [ ] 3⁴ dan 5³×5² dapat dijabarkan interaktif.
- [ ] Rumus umum baru muncul SETELAH penjabaran selesai.
- [ ] Layar tetap terbaca di 360 px.
**Data:** jumlah pemakaian pembongkar, jawaban pertanyaan penjelasan.

## F2 — Tiga Modul, Satu Sifat per Layar (WAJIB)
**Bukti:** IL2 (unsur bersamaan), EL3 (terlalu cepat), DS03-S01 (jangan 8 sifat sekaligus).
**Spesifikasi:**
- Modul 1 perkalian, Modul 2 pembagian, Modul 3 pangkat nol dan negatif.
- Tiap modul 5–7 langkah; satu konsep per langkah; tombol "Lanjut" dikendalikan siswa.
- Modul berikutnya terbuka setelah modul sebelumnya selesai.
- Soal gabungan sifat hanya di akhir (opsional Sesi 3).
**Kriteria penerimaan:**
- [ ] Tidak ada layar dengan lebih dari satu sifat baru.
- [ ] Penguncian modul berfungsi dan tersimpan di `progres_modul`.
- [ ] Skor per modul tercatat.

## F3 — Tipografi Kontras (WAJIB)
**Bukti:** EL01-S02 (pangkat terlalu kecil), EL02-S02, DS03-S02 (ukuran seragam). (EL2)
**Spesifikasi:** komponen `Pangkat` sesuai DESIGN.md §2; dipakai di SEMUA tempat angka berpangkat muncul.
**Kriteria penerimaan:**
- [ ] Basis dan pangkat dapat dibedakan tanpa warna (grayscale test).
- [ ] Pangkat ≥ 18 px pada mobile.
- [ ] (−3)² dan −3² tampil berbeda jelas.
**Uji:** akurasi membaca basis dan pangkat pada 5 soal.

## F4 — Penemu Pola Pangkat Nol dan Negatif (WAJIB) · Modul 3
**Bukti:** pangkat nol dan negatif sulit bagi keduanya; penjelasan terlalu cepat; DS01-S02 ingin animasi alasan a⁰ = 1. (IL1, EL3)
**Spesifikasi:**
- Slider/langkah: 3³ = 27 → 3² = 9 → 3¹ = 3 → 3⁰ = ? → 3⁻¹ = ?
- Tiap langkah turun satu pangkat = dibagi 3. Siswa menebak nilai berikutnya sebelum terungkap.
- Siswa menyimpulkan: a⁰ = 1; a⁻ⁿ = 1/aⁿ. Aturan baru disebut setelah pola terlihat.
- Tampilkan juga ide pembagian: 3² ÷ 3² = 1 = 3⁰.
**Kriteria penerimaan:**
- [ ] Siswa menebak sebelum jawaban muncul.
- [ ] Kesimpulan diminta dalam kata-kata siswa (pilihan kalimat atau isian).
- [ ] Contoh pangkat negatif sampai 10⁻³.

## F5 — Latihan dengan Petunjuk 3 Tingkat (WAJIB)
**Bukti:** GL03-S01, GL03-S02 (petunjuk bertahap membantu), GL05-S02.
**Spesifikasi:**
- Tingkat 1: pemantik ("Apakah basisnya sudah sama?").
- Tingkat 2: ingatkan sifat spesifik atau langkah awal.
- Tingkat 3: tampilkan penjabaran sebagian; siswa melanjutkan.
- Tiap tingkat dibuka siswa sendiri; pemakaian dicatat.
- Fading: soal akhir tiap modul dikerjakan mandiri tanpa tombol petunjuk (atau dengan opsi tersembunyi).
**Kriteria penerimaan:**
- [ ] `tingkat_petunjuk` tersimpan per soal.
- [ ] Setelah benar, tidak ada petunjuk yang dibuka otomatis.
- [ ] Rekap petunjuk per modul dapat diekspor.

## F6 — Diagnostik Prasyarat dan Mini-Refresher (PENTING)
**Bukti:** IL03-S01, IL03-S02 (perkalian dasar dan bilangan bulat).
**Spesifikasi:**
- 5 soal: perkalian 1–10, penjumlahan dan pengurangan bilangan bulat (positif dan negatif), perkalian berulang sederhana.
- Skor < 4/5 → tawarkan mini-refresher (2–3 layar) lalu ulangi diagnostik singkat.
- Hasil memberi rekomendasi: lanjut ke Modul 1 atau refresher dulu (siswa boleh memilih).
**Kriteria penerimaan:**
- [ ] Skor sebelum dan sesudah refresher tercatat.
- [ ] Tidak menghukum; nada tetap mendukung.

## F7 — Rumus, Contoh, Langkah Berdampingan (PENTING)
**Bukti:** EL02-S01 (bolak-balik halaman 10 dan 12), GL05-S02 (contoh acuan di samping layar).
**Spesifikasi:** `PanelContoh` menampilkan rumus kecil di sudut/atas, contoh acuan, dan area kerja dalam satu layar. Pada mobile, rumus dalam "kartu lipat" di atas area soal; tetap satu layar tanpa pindah halaman.
**Kriteria penerimaan:**
- [ ] Tidak ada navigasi halaman saat mengerjakan soal.
- [ ] Contoh acuan dapat dibuka/ditutup tanpa kehilangan jawaban.

## F8 — Penanda Informasi pada Soal Cerita (PENTING)
**Bukti:** EL05-S01, EL05-S02 (bingung basis, nilai awal, banyak pengulangan, total waktu vs frekuensi).
**Spesifikasi:** siswa mengetuk bagian teks dan memilih label: *diketahui awal, basis (kelipatan), banyak kali, waktu total*. Setelah penandaan benar, bentuk pangkat tersusun otomatis: awal × basis^banyak kali.
**Kriteria penerimaan:**
- [ ] Penanda benar/salah dicatat.
- [ ] Umpan balik jelas bila "waktu total" tertukar dengan "banyak kali".

## F9 — Umpan Balik Berbasis Miskonsepsi (PENTING)
**Bukti:** IL02-S02, IL05-S02, IL01-S02 (tertukar tambah dan kali, aⁿ = a×n), GL02-S01.
**Spesifikasi:** `cekJawaban.js` membandingkan jawaban salah dengan pola miskonsepsi umum (CONTENT.md §3), lalu menampilkan kartu umpan balik dengan nama kekeliruan, penjelasan singkat, dan langkah perbaikan. Siswa mencoba lagi.
**Kriteria penerimaan:**
- [ ] Minimal 6 pola miskonsepsi terdeteksi untuk 3 modul.
- [ ] Kode miskonsepsi tersimpan di `jawaban.miskonsepsi`.
- [ ] Umpan balik tidak menampilkan kunci langsung pada percobaan pertama.

## F10 — Opsi "Uji dengan Angka Kecil" (OPSIONAL)
**Bukti:** hanya S01 (GL02) yang melakukannya; S02 tidak ada. Bukti lemah, maka prioritas rendah.
**Spesifikasi:** sebelum mengirim, siswa dapat memilih "Uji dulu" untuk mencoba mengganti variabel dengan angka kecil (a = 2) dan melihat apakah hasilnya cocok.
**Kriteria penerimaan:**
- [ ] Opsi tidak mengganggu alur utama (tidak wajib).
- [ ] Pemakaian opsi dicatat.
