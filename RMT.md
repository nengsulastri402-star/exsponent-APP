# RMT.md — Rigorous Mathematical Thinking di Aplikasi

Sumber: ringkasan dosen atas buku *Rigorous Mathematical Thinking: Conceptual Formation in the Mathematics Classroom* (Kinard dan Kozulin). RMT memadukan teori sosiokultural Vygotsky (alat psikologis, konsep ilmiah, Learning Activity) dengan teori Feuerstein (SCM dan Pengalaman Belajar Ter-mediasi, MLE).

Pemetaan di bawah adalah **tafsiran peneliti** atas ringkasan itu. Mintakan pertimbangan dosen sebelum dipakai di laporan.

## Pemetaan komponen RMT ke fitur

| Komponen RMT | Wujud di aplikasi | Lokasi |
|---|---|---|
| MLE: intensionalitas | Layar "Tujuan hari ini" di awal tiap modul | `PetaMediasi.jsx`, `modules/*/index.jsx` |
| MLE: pemberian makna | Baris "Mengapa penting" di layar yang sama | idem |
| MLE: transendensi | Baris "Berlaku juga di" pada layar "Aturannya" | idem |
| Mediator kognitif, tanya jawab bebas | Obrolan **Tanya Kak AI**: siswa bertanya apa saja tentang eksponen; AI menjawab langsung dan menjelaskan dari konkret ke rumus, langkah demi langkah. Tombol melayang di layar modul (soal yang sedang dikerjakan ikut dikirim sebagai konteks) dan menu di beranda | `ObrolanAI.jsx`, `TombolTanyaAI.jsx`, `api/chat.js` |
| Mediator kognitif, pertanyaan terpimpin | Tombol **Tanya pembimbing** setelah jawaban salah (maks. 3 kali per soal), tidak pernah memberi jawaban akhir | `Pembimbing.jsx`, `api/tanya.js` |
| Fungsi kognitif Input / Elaborasi / Output | Tiap miskonsepsi M1–M10 diberi `fase`; status "format" dihitung sebagai Output; tahap ditampilkan pada pembimbing | `miskonsepsi.json`, `lib/rmt.js` |
| Peta kognitif (diagnosis tahap) | Rekap kesalahan per tahap | `analysis/ringkasan.py` → `fase_kognitif.csv` |
| Learning Activity: analisis tugas, rencana, refleksi | Tiga langkah kerja (Baca, Rencanakan, Periksa) di panel "Rumus dan contoh"; langkah refleksi di tengah modul | `PanelContoh.jsx`, langkah `refleksi` |
| Alat psikologis: tanda dan simbol | Komponen `Pangkat` (basis dan pangkat dibedakan) | `Pangkat.jsx`, `Matematika.jsx` |
| Alat psikologis: organizer grafis | Pembongkar (perkalian berulang), garis bilangan di cek dasar, tabel pola | `Pembongkar.jsx`, `PenemuPola.jsx` |
| Alat psikologis: rumus dan persamaan | Rumus berdampingan dengan soal | `PanelContoh.jsx` |
| Konsep sehari-hari ke konsep ilmiah | Soal cerita ditandai (awal, basis, selang, total waktu) lalu dibawa ke bentuk pangkat | `PenandaCerita.jsx` |
| Asesmen dinamis (LPAD: uji, mediasi, uji ulang) | Pretest, belajar dengan petunjuk 3 tingkat dan pembimbing, posttest; jumlah bantuan tercatat | `TesRunner.jsx`, `TombolPetunjuk.jsx` |
| Metakognisi, regulasi diri | Refleksi "Mengapa begitu?"; soal terakhir tiap modul tanpa petunjuk dan tanpa pembimbing | `Refleksi.jsx`, `Latihan.jsx` |

## Pemetaan miskonsepsi ke tahap berpikir (untuk dinilai dosen)

| Tahap | Arti | Miskonsepsi |
|---|---|---|
| Input | Membaca dan mengumpulkan data soal dengan tepat | M1 (membaca simbol pangkat), M5 (kurung dan minus), M8 (basis berbeda), M9 (jumlah awal terlupa) |
| Elaborasi | Mengolah: hubungan bagian-keseluruhan, penalaran | M2, M3, M4, M6, M7, M10 |
| Output | Menuliskan jawaban dengan tepat dan presisi | Bentuk jawaban tidak sesuai permintaan (status `format`) |

## Aturan Kak AI (obrolan bebas, `api/chat.js`)
- Menjawab pertanyaan siswa seputar matematika dengan jelas; konkret dulu, maksimal sekitar 120 kata, sering diakhiri pertanyaan kecil.
- Bawaan: AI menjawab langsung dan menyelesaikan soal sampai tuntas bila siswa meminta (siswa bertanya ketika buntu). Mode membimbing tanpa hasil akhir: isi `KAKAI_MODE=mediasi` di server.
- Di luar matematika ditolak ramah; siswa yang tampak tertekan diarahkan bercerita kepada orang tua atau guru.
- Tidak ada di pretest, posttest, dan cek dasar, agar skor tidak terpengaruh.
- Riwayat obrolan hanya di perangkat siswa. Belum ada pencatatan ke database; kalau dosen ingin menganalisis pertanyaan siswa, perlu tabel baru dan izin tambahan.

## Aturan tombol pembimbing (`api/tanya.js`)
- Tidak boleh menyebut atau menghitungkan jawaban akhir. Balasan yang memuat kunci jawaban dibuang di aplikasi, lalu diganti pertanyaan bawaan.
- Maksimal 3 kalimat, satu pertanyaan pemandu; makin besar nomor bantuan makin spesifik (mengikuti pemberian petunjuk bertahap ala asesmen dinamis).
- Hanya bilangan berpangkat bulat. Pangkat dari pangkat, notasi ilmiah, dan pangkat pecahan tetap di luar cakupan.
- Yang dikirim ke penyedia AI: teks soal, jawaban siswa (maks. 80 karakter), tahap, nama miskonsepsi. **Tidak** ada kode siswa, nama, atau data lain.
- Kunci API hanya di server (variabel `GEMINI_API_KEY`). Tanpa kunci atau bila gagal, aplikasi memakai pertanyaan pemandu bawaan.

## Belum dikerjakan
- Penggunaan pembimbing belum tercatat di database (menambah baris `jawaban` akan mengotori analisis). Bila perlu dicatat, tambahkan kolom atau tabel khusus lebih dulu.
- Tujuan dan makna per modul dalam bahasa siswa perlu dikoreksi dosen.
