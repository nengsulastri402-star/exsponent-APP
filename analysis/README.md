# analysis/ — Alat Bantu Python

Python dipakai **di laptop peneliti**, bukan di aplikasi siswa (aplikasi ditulis dengan JavaScript). Lihat pembagian bahasa di `CLAUDE.md` dan `ARCHITECTURE.md` §1.1.

## Persiapan (sekali saja)

Butuh Python 3.11 atau lebih baru.

```bash
cd analysis
python -m venv .venv
# Windows:  .venv\Scripts\activate
# Mac/Linux: source .venv/bin/activate
pip install -r requirements.txt
```

## Skrip yang direncanakan

| Skrip | Fungsi | Tahap |
|---|---|---|
| `verifikasi_soal.py` | Menghitung ulang kunci di `../src/data/soal.json` dan melaporkan yang tidak cocok | Sprint 1.3b |
| `ekspor_data.py` | Mengambil tabel `jawaban`, `tes`, `skala_kognitif` dari Supabase menjadi CSV di `data/` | Sprint 3.2 |
| `ringkasan.py` | Tabel dan grafik deskriptif ke `output/` (n = 2, tanpa uji inferensial) | Sprint 3.2 |

## Aturan penting

- **Kunci rahasia:** `ekspor_data.py` memerlukan `service_role` key. Simpan hanya di variabel lingkungan laptop (`SUPABASE_URL`, `SUPABASE_SERVICE_KEY`). Jangan menulisnya di berkas mana pun dalam repositori.
- Folder `data/` berisi data penelitian dan sudah masuk `.gitignore`.
- Hanya kode siswa (P01, P02) yang boleh muncul di data, tabel, atau grafik.
