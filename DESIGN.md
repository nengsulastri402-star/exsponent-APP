# DESIGN.md — Panduan UI/UX

Sumber: temuan EL1–EL3 (extraneous load) dan prinsip multimedia (signaling, spatial contiguity, segmenting, coherence).

## 1. Prinsip Utama
1. **Koherensi:** buang semua elemen yang tidak membantu belajar (grafik latar, tombol berlebih, ikon dekoratif).
2. **Signaling:** arahkan perhatian dengan warna, ukuran, dan penanda, bukan dengan teks panjang.
3. **Kontiguitas spasial:** rumus, contoh, dan langkah berada di satu layar, berdampingan atau bertumpuk jelas.
4. **Segmenting:** satu ide per layar; siswa menekan "Lanjut" sendiri (pacing dikendalikan siswa).
5. **Konkret → abstrak:** penjabaran dulu, rumus kemudian.

## 2. Tipografi Matematika (F3)
Gunakan komponen `<Pangkat basis pangkat />`.

| Elemen | Aturan |
|---|---|
| Basis | Ukuran besar (≥ 32 px mobile), tebal (700), warna biru tua |
| Pangkat | Ukuran ≥ 55% basis (tidak lebih kecil dari 18 px), warna jeruk/oranye tua, naik dengan jarak aman dari basis |
| Pembeda non-warna | Basis diberi garis bawah tipis atau kotak lembut; pangkat dalam kapsul/lingkaran halus |
| Pangkat negatif | Tanda minus selalu terlihat jelas, bukan tanda hubung kecil |
| Kurung | (−3)² dan −3² harus tampak sangat berbeda; tampilkan berdampingan dengan label |
| Font | Sans-serif sistem atau Inter/Nunito; angka tabular |

## 3. Warna
Gunakan token CSS; kontras teks minimal 4.5:1.

| Token | Fungsi | Contoh nilai |
|---|---|---|
| --basis | Basis | #1E3A8A |
| --pangkat | Pangkat | #C2410C |
| --benar | Umpan balik benar | #15803D |
| --perhatian | Salah/perlu diperbaiki (lembut) | #B45309 |
| --latar | Latar | #FFFFFF / #F8FAFC |
| --teks | Teks | #0F172A |

Jangan memakai merah mencolok untuk jawaban salah. Pakai nada lembut dengan ikon dan kata, bukan hanya warna.

## 4. Tata Letak
- **Mobile-first**, satu kolom; pada layar lebar (Windows) dua kolom: kiri contoh/penjelasan, kanan latihan atau langkah.
- Struktur layar pelajaran:
  1. Judul langkah (1 baris)
  2. Area visual utama (pembongkar/slider)
  3. Penjelasan singkat (maks 2 kalimat)
  4. Tombol aksi tunggal ("Lanjut", "Coba sendiri")
- Bilah progres sederhana per modul (langkah 3 dari 6), tanpa elemen lain.
- Menu: maksimal 3 pilihan di beranda (Mulai/Lanjut, Diagnostik, Hasil saya).

## 5. Komponen Kunci
| Komponen | Deskripsi |
|---|---|
| `Pangkat` | Merender basis dan pangkat dengan gaya kontras |
| `Pembongkar` (F1) | Ketuk 3⁴ → muncul 3×3×3×3 satu per satu; tombol Ulang dan Jeda |
| `PenemuPola` (F4) | Slider/langkah 3, 2, 1, 0, −1; tiap langkah membagi dengan 3; siswa menyimpulkan |
| `PanelContoh` (F7) | Rumus + contoh + langkah dalam satu kartu |
| `TombolPetunjuk` (F5) | Petunjuk 1 → 2 → 3, dicatat di database |
| `PenandaCerita` (F8) | Ketuk kata dalam soal cerita untuk menandai: diketahui, basis, banyak kali, waktu |
| `KartuUmpanBalik` (F9) | Nama kekeliruan + penjelasan + langkah perbaikan |
| `UjiAngkaKecil` (F10) | Kotak untuk mengganti variabel dengan angka kecil |

## 6. Animasi
- Hanya untuk pembuktian konsep (F1, F4).
- Durasi 300–600 ms per langkah, dikendalikan siswa (Lanjut/Ulang).
- Hormati `prefers-reduced-motion`.

## 7. Bahasa dan Nada
- Bahasa Indonesia sehari-hari yang sopan, kalimat pendek.
- Hindari istilah teknis tanpa penjelasan; saat istilah muncul ("basis", "pangkat"), tunjukkan langsung secara visual.
- Umpan balik mendukung ("Hampir! Cek lagi: pangkatnya ditambah, bukan dikali.").

## 8. Yang TIDAK Boleh
- Menampilkan 8 sifat eksponen dalam satu layar.
- Teks penjelasan panjang atau paragraf padat.
- Teks pangkat seragam atau sangat kecil.
- Latar ramai, banyak tombol, atau animasi otomatis berulang.
- Memindahkan siswa ke halaman lain di tengah mengerjakan soal.

## 9. Aksesibilitas
- Target sentuh ≥ 44×44 px.
- Semua ikon punya label teks.
- Pembeda basis/pangkat tidak hanya warna.
- Dapat dipakai dengan keyboard di Windows.
