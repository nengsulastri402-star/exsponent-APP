"""Ringkasan deskriptif hasil uji coba (n kecil, tanpa uji inferensial).

    python ringkasan.py            # memakai CSV di data/ (hasil ekspor_data.py)
    python ringkasan.py --demo     # membuat data PALSU untuk mencoba skrip dan melihat bentuk keluarannya

Keluaran di output/ (atau output/demo/):
    skor_pre_post.csv / .png        skor pretest dan posttest per siswa, total dan per modul
    leppink.csv / .png              rata-rata subskala beban kognitif (IL, EL, GL)
    petunjuk_per_modul.csv / .png   rata-rata tingkat petunjuk tertinggi per soal latihan
    waktu_per_modul.csv             waktu per soal (detik)
    kesalahan_per_modul.csv         percobaan salah per modul
    miskonsepsi.csv / .png          miskonsepsi yang muncul (M1–M10)
    fase_kognitif.csv               kesalahan per tahap berpikir RMT: input, elaborasi, output
    ringkasan.md                    ringkasan angka dalam kalimat
Hanya kode siswa (P01, P02) yang muncul. Dengan 2 siswa, laporkan sebagai pola kasus.
"""
import argparse
import json
import random
import sys
from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt  # noqa: E402
import pandas as pd  # noqa: E402

BASE = Path(__file__).resolve().parent
RAIZ = BASE.parent
DATA = BASE / "data"
DATA_DEMO = BASE / "data_demo"
OUT = BASE / "output"

WARNA = {"basis": "#1E3A8A", "pangkat": "#C2410C", "benar": "#15803D", "abu": "#64748B"}
SUBSKALA = {"IL": "Intrinsic", "EL": "Extraneous", "GL": "Germane"}
SIFAT_LATIHAN = r"^m[123]-\d"


# ------------------------------------------------------------------ demo

def buat_demo() -> None:
    """Data palsu supaya skrip bisa dicoba sebelum ada data sungguhan."""
    rnd = random.Random(7)
    DATA_DEMO.mkdir(exist_ok=True)
    jawab, tes, skala = [], [], []
    for kode, peluang_pre, peluang_post in [("P01", 0.25, 0.85), ("P02", 0.15, 0.7)]:
        for jenis, awalan, peluang in [("pretest", "pre", peluang_pre), ("posttest", "post", peluang_post)]:
            skor = 0
            for i, modul in enumerate([1, 1, 2, 2, 3, 3, 1], start=1):
                benar = rnd.random() < peluang
                skor += benar
                jawab.append(dict(kode=kode, modul=modul, butir=f"{awalan}-{i}", jawaban="x", benar=benar,
                                  miskonsepsi=None if benar else rnd.choice(["M2", "M6", "M7", None]),
                                  tingkat_petunjuk=0, waktu_ms=rnd.randint(15000, 60000)))
            tes.append(dict(kode=kode, jenis=jenis, skor=skor, skor_maks=7))
        for modul, n in [(1, 6), (2, 5), (3, 8)]:
            for i in range(1, n + 1):
                butir = f"m{modul}-{i:02d}"
                mandiri = i == n
                petunjuk = 0 if mandiri else max(0, min(3, int(rnd.gauss(2.2 - 0.5 * modul, 0.8))))
                for percobaan in range(rnd.choice([1, 1, 2])):
                    salah = percobaan == 0 and rnd.random() < 0.35
                    jawab.append(dict(kode=kode, modul=modul, butir=butir, jawaban="x", benar=not salah,
                                      miskonsepsi=rnd.choice(["M1", "M2", "M3", "M4", "M6", "M7"]) if salah else None,
                                      tingkat_petunjuk=petunjuk, waktu_ms=rnd.randint(20000, 90000)))
        for butir, dasar in [("IL1", 5), ("IL2", 5), ("IL3", 6), ("EL1", 2), ("EL2", 2), ("EL3", 1),
                             ("GL1", 7), ("GL2", 8), ("GL3", 7)]:
            skala.append(dict(kode=kode, butir=butir, nilai=max(0, min(10, dasar + rnd.randint(-1, 1)))))
    pd.DataFrame(jawab).to_csv(DATA_DEMO / "jawaban.csv", index=False)
    pd.DataFrame(tes).to_csv(DATA_DEMO / "tes.csv", index=False)
    pd.DataFrame(skala).to_csv(DATA_DEMO / "skala_kognitif.csv", index=False)


# --------------------------------------------------------------- analisis

def muat(folder: Path) -> tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame]:
    try:
        return (pd.read_csv(folder / "jawaban.csv"), pd.read_csv(folder / "tes.csv"),
                pd.read_csv(folder / "skala_kognitif.csv"))
    except FileNotFoundError as e:
        sys.exit(f"Berkas belum ada: {e.filename}\nJalankan ekspor_data.py dulu, atau coba: python ringkasan.py --demo")


def skor(jawab: pd.DataFrame, tes: pd.DataFrame, keluar: Path) -> pd.DataFrame:
    t = tes[tes["jenis"].isin(["pretest", "posttest"])].sort_values("kode")
    terakhir = t.groupby(["kode", "jenis"])["skor"].last().unstack()
    hasil = pd.DataFrame({"pretest": terakhir.get("pretest"), "posttest": terakhir.get("posttest")})
    hasil["selisih"] = hasil["posttest"] - hasil["pretest"]

    ujian = jawab[jawab["butir"].str.match(r"^(pre|post)-")].copy()
    ujian["jenis"] = ujian["butir"].str.split("-").str[0]
    per_modul = (ujian.groupby(["kode", "modul", "jenis"])["benar"].sum().unstack().fillna(0)
                 .rename(columns={"pre": "pretest", "post": "posttest"}).reset_index())
    per_modul["selisih"] = per_modul.get("posttest", 0) - per_modul.get("pretest", 0)

    hasil.to_csv(keluar / "skor_pre_post.csv")
    per_modul.to_csv(keluar / "skor_pre_post_per_modul.csv", index=False)

    ax = hasil[["pretest", "posttest"]].plot(kind="bar", color=[WARNA["abu"], WARNA["basis"]], figsize=(6, 4), rot=0)
    ax.set_ylabel("Skor (maks. 7)")
    ax.set_xlabel("")
    ax.set_title("Skor pretest dan posttest")
    ax.set_ylim(0, 7.5)
    for c in ax.containers:
        ax.bar_label(c, padding=2)
    ax.spines[["top", "right"]].set_visible(False)
    plt.tight_layout()
    plt.savefig(keluar / "skor_pre_post.png", dpi=150)
    plt.close()
    return hasil


def leppink(skala: pd.DataFrame, keluar: Path) -> pd.DataFrame:
    s = skala.copy()
    s["subskala"] = s["butir"].str[:2].map(SUBSKALA)
    rata = s.groupby(["kode", "subskala"])["nilai"].mean().unstack()[list(SUBSKALA.values())]
    rata.round(2).to_csv(keluar / "leppink.csv")
    ax = rata.plot(kind="bar", color=[WARNA["basis"], WARNA["pangkat"], WARNA["benar"]], figsize=(6, 4), rot=0)
    ax.set_ylabel("Rata-rata skor (0–10)")
    ax.set_xlabel("")
    ax.set_ylim(0, 10.5)
    ax.set_title("Beban kognitif (Leppink)")
    ax.legend(title="")
    ax.spines[["top", "right"]].set_visible(False)
    plt.tight_layout()
    plt.savefig(keluar / "leppink.png", dpi=150)
    plt.close()
    return rata


def belajar(jawab: pd.DataFrame, keluar: Path):
    l = jawab[jawab["butir"].str.match(SIFAT_LATIHAN)].copy()

    # Petunjuk tertinggi per soal, rata-rata per modul (soal mandiri = 0 petunjuk).
    tertinggi = l.groupby(["kode", "modul", "butir"])["tingkat_petunjuk"].max().reset_index()
    petunjuk = tertinggi.groupby(["kode", "modul"])["tingkat_petunjuk"].mean().unstack().round(2)
    petunjuk.to_csv(keluar / "petunjuk_per_modul.csv")
    ax = petunjuk.T.plot(kind="line", marker="o", figsize=(6, 4), color=[WARNA["basis"], WARNA["pangkat"]])
    ax.set_xlabel("Modul")
    ax.set_ylabel("Rata-rata tingkat petunjuk per soal (0–3)")
    ax.set_xticks([1, 2, 3])
    ax.set_title("Petunjuk yang dibuka per modul")
    ax.spines[["top", "right"]].set_visible(False)
    plt.tight_layout()
    plt.savefig(keluar / "petunjuk_per_modul.png", dpi=150)
    plt.close()

    # Waktu: percobaan terakhir tiap soal, detik.
    akhir = l.sort_values("waktu_ms").groupby(["kode", "butir"]).tail(1)
    waktu = (akhir.assign(detik=akhir["waktu_ms"] / 1000).groupby(["kode", "modul"])["detik"].median().unstack().round(1))
    waktu.to_csv(keluar / "waktu_per_modul.csv")

    # Kesalahan.
    salah = l[l["benar"] == False].groupby(["kode", "modul"]).size().unstack(fill_value=0)  # noqa: E712
    salah.to_csv(keluar / "kesalahan_per_modul.csv")

    # Miskonsepsi (latihan, pretest, posttest).
    m = jawab.dropna(subset=["miskonsepsi"])
    hitung = m.groupby(["kode", "miskonsepsi"]).size().unstack(fill_value=0)
    hitung.to_csv(keluar / "miskonsepsi.csv")
    # Tahap berpikir (Feuerstein/RMT) tiap miskonsepsi, dari src/data/miskonsepsi.json.
    peta = json.loads((RAIZ / "src" / "data" / "miskonsepsi.json").read_text(encoding="utf-8"))
    fase_peta = {k: v.get("fase", "elaborasi") for k, v in peta.items()}
    fase = m.assign(fase=m["miskonsepsi"].map(fase_peta)).dropna(subset=["fase"])
    fase = fase.groupby(["kode", "fase"]).size().unstack(fill_value=0)
    fase.to_csv(keluar / "fase_kognitif.csv")
    if not hitung.empty:
        ax = hitung.T.plot(kind="bar", color=[WARNA["basis"], WARNA["pangkat"]], figsize=(7, 4), rot=0)
        ax.set_ylabel("Berapa kali muncul")
        ax.set_xlabel("Kode miskonsepsi")
        ax.set_title("Miskonsepsi yang muncul")
        ax.spines[["top", "right"]].set_visible(False)
        plt.tight_layout()
        plt.savefig(keluar / "miskonsepsi.png", dpi=150)
        plt.close()
    return petunjuk, waktu, salah, hitung


def tulis_ringkasan(keluar: Path, sk, lp, petunjuk, hitung, demo: bool) -> None:
    baris = ["# Ringkasan deskriptif", ""]
    if demo:
        baris += ["> **DATA PALSU (--demo).** Hanya untuk mencoba skrip. Jangan dilaporkan.", ""]
    baris += ["Jumlah siswa sedikit, jadi hasil dilaporkan sebagai pola kasus, tanpa uji inferensial.", "",
              "## Skor tes"]
    for kode, r in sk.iterrows():
        baris.append(f"- {kode}: pretest {r['pretest']:.0f}, posttest {r['posttest']:.0f} (selisih {r['selisih']:+.0f}).")
    baris += ["", "## Beban kognitif (rata-rata 0–10)"]
    for kode, r in lp.iterrows():
        baris.append(f"- {kode}: " + ", ".join(f"{k} {v:.1f}" for k, v in r.items()) + ".")
    baris += ["", "## Petunjuk rata-rata per soal (0–3)"]
    for kode, r in petunjuk.iterrows():
        baris.append(f"- {kode}: " + ", ".join(f"Modul {k}: {v:.1f}" for k, v in r.items()) + ".")
    baris += ["", "## Miskonsepsi yang muncul"]
    if hitung.empty:
        baris.append("- Tidak ada.")
    for kode, r in hitung.iterrows():
        baris.append(f"- {kode}: " + ", ".join(f"{k}×{v}" for k, v in r[r > 0].items()) + ".")
    fase_csv = keluar / "fase_kognitif.csv"
    if fase_csv.exists():
        fase = pd.read_csv(fase_csv, index_col=0)
        nama = {"input": "membaca soal", "elaborasi": "mengolah", "output": "menuliskan"}
        baris += ["", "## Tahap berpikir yang bermasalah (RMT)"]
        for kode, r in fase.iterrows():
            baris.append(f"- {kode}: " + ", ".join(f"{nama.get(k, k)}×{v}" for k, v in r[r > 0].items()) + ".")
        baris.append("- Pemetaan miskonsepsi ke tahap adalah tafsiran peneliti; mintakan pertimbangan dosen.")
    baris += ["", "## Keterbatasan",
              "- Jumlah siswa sedikit; tidak dapat digeneralisasi.",
              "- Tanpa kelompok kontrol; kenaikan skor tidak dapat dikaitkan secara kausal dengan aplikasi.",
              "- Terjemahan skala Leppink belum divalidasi untuk SMP."]
    (keluar / "ringkasan.md").write_text("\n".join(baris) + "\n", encoding="utf-8")


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--demo", action="store_true", help="pakai data palsu untuk mencoba skrip")
    a = ap.parse_args()

    if a.demo:
        buat_demo()
        jawab, tes, skala = muat(DATA_DEMO)
        keluar = OUT / "demo"
    else:
        jawab, tes, skala = muat(DATA)
        keluar = OUT
    keluar.mkdir(parents=True, exist_ok=True)
    plt.rcParams.update({"font.size": 11, "axes.titleweight": "bold"})

    sk = skor(jawab, tes, keluar)
    lp = leppink(skala, keluar)
    petunjuk, _, _, hitung = belajar(jawab, keluar)
    tulis_ringkasan(keluar, sk, lp, petunjuk, hitung, a.demo)
    print(f"Selesai. Hasil ada di {keluar}")


if __name__ == "__main__":
    main()
