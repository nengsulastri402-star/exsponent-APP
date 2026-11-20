# CONTENT.md — Soal, Petunjuk, Miskonsepsi

Catatan: soal pemicu wawancara BUKAN butir pretest/posttest. Posttest memakai soal setara dengan angka berbeda. Semua kunci di bawah wajib diverifikasi ulang sebelum dimasukkan ke `data/soal.json`.

## 1. Pretest (draf)
| No | Soal | Modul | Kunci |
|---|---|---|---|
| 1 | Tentukan nilai 5³ × 5² | 1 | 5⁵ = 3125 |
| 2 | Sederhanakan m⁴ × m⁵ | 1 | m⁹ |
| 3 | Tentukan nilai 7⁶ ÷ 7⁴ | 2 | 7² = 49 |
| 4 | Sederhanakan y⁷ ÷ y⁴ | 2 | y³ |
| 5 | Tentukan nilai 9⁰ + 3⁻² | 3 | 10/9 |
| 6 | Tulis 10⁻³ sebagai pecahan | 3 | 1/1000 |
| 7 | Kabar tersebar: awalnya 1 orang, tiap jam menjadi 3 kali lipat. Tulis jumlah setelah 4 jam dalam bentuk pangkat | 1 | 3⁴ = 81 |

## 2. Posttest (soal setara, angka berbeda, DRAF untuk dibuat)
| No | Soal | Modul | Kunci |
|---|---|---|---|
| 1 | Tentukan nilai 4³ × 4² | 1 | 4⁵ = 1024 |
| 2 | Sederhanakan p³ × p⁶ | 1 | p⁹ |
| 3 | Tentukan nilai 6⁵ ÷ 6³ | 2 | 6² = 36 |
| 4 | Sederhanakan z⁸ ÷ z⁵ | 2 | z³ |
| 5 | Tentukan nilai 8⁰ + 2⁻³ | 3 | 1 + 1/8 = 9/8 |
| 6 | Tulis 10⁻² sebagai pecahan | 3 | 1/100 |
| 7 | Satu sel membelah menjadi 2 setiap jam. Tulis jumlah sel setelah 5 jam dalam bentuk pangkat | 1 | 2⁵ = 32 |

Catatan: Butir 7 pada pretest dan posttest sama-sama memakai konteks pertumbuhan; pastikan strukturnya setara (awal 1, pengali tetap, jumlah jam berbeda).

## 3. Katalog Miskonsepsi (untuk F9)
| Kode | Miskonsepsi | Sumber | Contoh jawaban salah | Umpan balik singkat |
|---|---|---|---|---|
| M1 | aⁿ dianggap a × n | S02 | 3² = 6 | "3² artinya 3 dikali dirinya sendiri 2 kali: 3 × 3 = 9." Tampilkan Pembongkar |
| M2 | Pangkat dikali pada perkalian basis sama | S02 | 5³ × 5² = 5⁶ | "Jabarkan: (5×5×5)×(5×5). Ada berapa faktor 5 seluruhnya?" |
| M3 | Pangkat dikurangi atau dibagi tertukar | S02 | 7⁶ ÷ 7⁴ = 7¹.⁵ atau 7¹⁰ | "Faktor yang sama di atas dan bawah dicoret. Sisa berapa?" |
| M4 | Basis ikut dioperasikan | S02 | 5³ × 5² = 25⁵ | "Basisnya tidak berubah; hanya pangkat yang diolah." |
| M5 | (−3)² tertukar dengan −3² | S02 | (−3)² = −9 | Tampilkan berdampingan: (−3)×(−3) = 9 vs −(3×3) = −9 |
| M6 | a⁰ dianggap 0 | S01, S02 | 9⁰ = 0 | Arahkan ke Penemu Pola: turun satu pangkat = dibagi basis |
| M7 | Pangkat negatif jadi bilangan negatif | S01, S02 | 3⁻² = −9 | "Pangkat negatif artinya kebalikan, bukan bilangan negatif: 1/3²." |
| M8 | Basis beda langsung dijumlahkan pangkatnya | S02 | 2³ × 4² = 2⁵ | "Basis harus sama dulu. Bisakah 4 ditulis sebagai 2²?" (di Modul 1 hanya sebagai catatan; soal basis beda disajikan setelah sifat dasar) |
| M9 | Lupa jumlah awal pada soal cerita | uji coba aplikasi | 2 × 2^4 dijawab 2^4 | "Jangan lupa jumlah awalnya: awal × basis berpangkat banyak kali." |
| M10 | Total waktu dipakai sebagai banyak kali | EL05-S01, EL05-S02 | membelah tiap 2 jam, 6 jam, dijawab 2^6 | "Banyak kali = total waktu ÷ selang waktu satu kali." |

Catatan: `2³ × 4²` muncul di soal pemicu wawancara (S02 ragu). Pakai hanya sebagai soal pengayaan opsional, bukan butir tes.

## 4. Petunjuk 3 Tingkat — Templat
Contoh untuk `5³ × 5²`:
1. **Pemantik:** Apakah kedua bilangan punya basis yang sama?
2. **Ingat sifat:** Pada perkalian basis sama, perhatikan banyak faktor 5 seluruhnya.
3. **Penjabaran sebagian:** (5×5×5) × (5×5) = 5 × 5 × 5 × 5 × __. Hitung banyak faktor 5, lalu tulis sebagai pangkat.

Contoh untuk `9⁰ + 3⁻²`:
1. Hitung bagian pertama dan kedua terpisah.
2. Ingat: sebarang bilangan (tidak nol) berpangkat nol hasilnya? Dan pangkat negatif = kebalikan.
3. 9⁰ = 1, dan 3⁻² = 1/3² = 1/__. Jumlahkan pecahannya.

## 5. Diagnostik Prasyarat (F6) — draf
| No | Soal | Kunci |
|---|---|---|
| 1 | 7 × 8 | 56 |
| 2 | 6 × 9 | 54 |
| 3 | −5 + 8 | 3 |
| 4 | 3 − 7 | −4 |
| 5 | 2 × 2 × 2 × 2 | 16 |

## 6. Soal Latihan per Modul (bahan, buat 5–6 butir per modul)
- **Modul 1:** 2³ × 2², 3⁴ × 3, a² × a³, soal cerita pertumbuhan (awal, kali, jam).
- **Modul 2:** 5⁷ ÷ 5⁴, 10⁶ ÷ 10², b⁹ ÷ b⁵, soal cerita pembagian sederhana.
- **Modul 3:** 4⁰, 10⁻¹, 2⁻³, 5⁻², pola 10³ → 10⁻³, bandingkan (−3)² dan −3² (sebagai cek prasyarat, bukan inti).

## 7. Soal Cerita (F8)
Templat: "Suatu bakteri membelah diri menjadi dua setiap satu jam. Jika awalnya ada 2 bakteri, berapa jumlah bakteri setelah 4 jam?"
Penanda: *diketahui awal = 2; basis (kelipatan) = 2; banyak kali = 4; waktu total = 4 jam*.
Peringatan umpan balik: bedakan **banyak kali membelah** dan **total waktu**; dalam contoh ini keduanya sama karena membelah tiap 1 jam, jadi sediakan variasi (membelah tiap 2 jam).

## 8. Format `soal.json` (usulan)
```json
{
  "id": "m1-latihan-01",
  "modul": 1,
  "tipe": "isian",
  "soal": "5^3 × 5^2",
  "kunci": ["5^5", "3125"],
  "petunjuk": ["...", "...", "..."],
  "miskonsepsi": { "5^6": "M2", "25^5": "M4", "5^1": "M2" }
}
```

## 9. Berkas data yang dipakai aplikasi
- `src/data/soal.json`: semua soal (diagnostik, diagnostikUlang, pretest, posttest, modul1–3). Kunci dan jawaban miskonsepsi diperiksa otomatis oleh `analysis/verifikasi_soal.py` dan `npm run uji`.
- `src/data/miskonsepsi.json`: katalog M1–M10 untuk umpan balik (F9).
- `src/data/leppink.json`: DRAF terjemahan 9 butir skala Leppink. Periksa jumlah dan bunyi butir dengan artikel aslinya (Leppink dkk., 2013) sebelum dipakai penelitian.
- Jawaban miskonsepsi di `soal.json` ditulis sebagai NILAI (mis. "64") atau bentuk huruf (mis. "a^6"); pemeriksa mencocokkan nilai jawaban siswa, jadi "2^6" dan "64" sama-sama dikenali.
