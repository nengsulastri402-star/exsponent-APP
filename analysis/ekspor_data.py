"""Tarik data penelitian dari Supabase menjadi CSV di analysis/data/.

Dijalankan di laptop peneliti. Membutuhkan kunci RAHASIA (service_role) yang
HANYA disimpan sebagai variabel lingkungan, tidak pernah di berkas proyek:

    # Windows PowerShell
    $env:SUPABASE_URL="https://xxxx.supabase.co"
    $env:SUPABASE_SERVICE_KEY="kunci-service-role"
    python ekspor_data.py

Privasi: kolom siswa_id diganti dengan `kode` siswa (P01, P02). Tidak ada nama.

Alternatif tanpa kunci rahasia: di dashboard Supabase buka Table Editor,
pilih tabel, lalu Export → CSV, dan simpan sebagai jawaban.csv, tes.csv,
skala_kognitif.csv di folder data/ (ganti siswa_id menjadi kode secara manual).
"""
import os
import sys
from pathlib import Path

import pandas as pd

KELUAR = Path(__file__).resolve().parent / "data"
TABEL = ["jawaban", "tes", "skala_kognitif", "progres_modul", "sesi"]
UKURAN_HALAMAN = 1000


def ambil_semua(klien, tabel: str) -> pd.DataFrame:
    baris, awal = [], 0
    while True:
        r = klien.table(tabel).select("*").range(awal, awal + UKURAN_HALAMAN - 1).execute()
        baris.extend(r.data)
        if len(r.data) < UKURAN_HALAMAN:
            break
        awal += UKURAN_HALAMAN
    return pd.DataFrame(baris)


def main() -> int:
    url = os.environ.get("SUPABASE_URL")
    kunci = os.environ.get("SUPABASE_SERVICE_KEY")
    if not url or not kunci:
        print("Isi dulu SUPABASE_URL dan SUPABASE_SERVICE_KEY (lihat petunjuk di awal berkas ini).")
        return 1
    try:
        from supabase import create_client
    except ImportError:
        print("Pasang dulu: pip install -r requirements.txt")
        return 1

    klien = create_client(url, kunci)
    KELUAR.mkdir(exist_ok=True)

    siswa = ambil_semua(klien, "siswa")[["id", "kode"]].rename(columns={"id": "siswa_id"})
    print(f"siswa: {len(siswa)} baris (hanya id dan kode dipakai)")

    for tabel in TABEL:
        df = ambil_semua(klien, tabel)
        if "siswa_id" in df.columns:
            df = df.merge(siswa, on="siswa_id", how="left").drop(columns=["siswa_id"])
            kolom = ["kode"] + [c for c in df.columns if c != "kode"]
            df = df[kolom]
        df.to_csv(KELUAR / f"{tabel}.csv", index=False, encoding="utf-8")
        print(f"{tabel}: {len(df)} baris → data/{tabel}.csv")
    return 0


if __name__ == "__main__":
    sys.exit(main())
