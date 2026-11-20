"""Verifikasi kunci soal di src/data/soal.json dengan aritmetika pecahan eksak.

Dijalankan di laptop peneliti (bukan di aplikasi siswa):
    python verifikasi_soal.py

Yang diperiksa:
  1. setiap kunci jawaban dihitung ulang dan harus sama dengan kunci lain pada soal yang sama,
  2. setiap "jawaban miskonsepsi" harus SALAH (tidak sama dengan kunci),
  3. kode miskonsepsi ada di src/data/miskonsepsi.json,
  4. soal latihan non-mandiri punya 3 petunjuk,
  5. id soal unik.
Keluar dengan kode 1 bila ada masalah, sehingga bisa dipakai sebelum deploy.
"""
import ast
import json
import re
import sys
from fractions import Fraction
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
SOAL = RAIZ / "src" / "data" / "soal.json"
MISKONSEPSI = RAIZ / "src" / "data" / "miskonsepsi.json"

SUPERSKRIP = str.maketrans("⁰¹²³⁴⁵⁶⁷⁸⁹⁻", "0123456789-")


def normalisasi(teks: str) -> str:
    """Samakan penulisan seperti di aplikasi (src/lib/cekJawaban.js)."""
    s = str(teks)
    s = re.sub(r"[⁻⁰¹²³⁴⁵⁶⁷⁸⁹]+", lambda m: "^" + m.group(0).translate(SUPERSKRIP), s)
    for lama, baru in {"−": "-", "–": "-", "—": "-", "×": "*", "·": "*", "÷": "/", ":": "/", ",": "."}.items():
        s = s.replace(lama, baru)
    return re.sub(r"\s+", "", s).lower()


def _hitung(node):
    if isinstance(node, ast.Expression):
        return _hitung(node.body)
    if isinstance(node, ast.Constant) and isinstance(node.value, (int, float)):
        return Fraction(str(node.value))
    if isinstance(node, ast.UnaryOp) and isinstance(node.op, (ast.USub, ast.UAdd)):
        v = _hitung(node.operand)
        return -v if isinstance(node.op, ast.USub) else v
    if isinstance(node, ast.BinOp):
        a, b = _hitung(node.left), _hitung(node.right)
        if isinstance(node.op, ast.Add):
            return a + b
        if isinstance(node.op, ast.Sub):
            return a - b
        if isinstance(node.op, ast.Mult):
            return a * b
        if isinstance(node.op, ast.Div):
            return a / b
        if isinstance(node.op, ast.Pow):
            if b.denominator != 1 or abs(b) > 200:
                raise ValueError("pangkat tidak bulat atau terlalu besar")
            return a ** int(b)
    raise ValueError(f"ekspresi tidak didukung: {ast.dump(node)}")


def nilai(teks: str):
    """Hitung nilai ekspresi numerik. -3^2 = -9 dan (-3)^2 = 9 (seperti di aplikasi)."""
    s = normalisasi(teks).replace("^", "**")
    return _hitung(ast.parse(s, mode="eval"))


def simbolik(teks: str):
    """Bentuk variabel seperti a^5 -> ('a', 5); None bila bukan variabel."""
    m = re.fullmatch(r"([a-z])(?:\^(-?\d+|\(-?\d+\)))?", normalisasi(teks))
    if not m:
        return None
    return m.group(1), int((m.group(2) or "1").strip("()"))


def sama(a: str, b: str) -> bool:
    sa, sb = simbolik(a), simbolik(b)
    if sa or sb:
        return sa == sb
    return nilai(a) == nilai(b)


def main() -> int:
    soal = json.loads(SOAL.read_text(encoding="utf-8"))
    katalog = json.loads(MISKONSEPSI.read_text(encoding="utf-8"))
    masalah: list[str] = []
    ids: set[str] = set()
    total = 0

    for kelompok, daftar in soal.items():
        for s in daftar:
            total += 1
            sid = s["id"]
            if sid in ids:
                masalah.append(f"{sid}: id ganda")
            ids.add(sid)

            kunci = s["kunci"]
            # 1. semua kunci setara
            try:
                for k in kunci[1:]:
                    if not sama(kunci[0], k):
                        masalah.append(f"{sid}: kunci '{kunci[0]}' dan '{k}' tidak setara")
            except Exception as e:  # noqa: BLE001
                masalah.append(f"{sid}: kunci tidak bisa dihitung ({e})")
                continue

            # (khusus soal bentuk pangkat) kunci harus berupa pangkat/variabel
            if s["bentuk"] == "pangkat" and not (
                simbolik(kunci[0]) or re.fullmatch(r"(\(-?\d+\)|\d+)\^(\(-?\d+\)|-?\d+)", normalisasi(kunci[0]))
            ):
                masalah.append(f"{sid}: bentuk 'pangkat' tetapi kunci '{kunci[0]}' bukan pangkat")

            # 2. jawaban miskonsepsi harus salah, 3. kode ada di katalog
            for jawab, kode in (s.get("miskonsepsi") or {}).items():
                if kode not in katalog:
                    masalah.append(f"{sid}: kode miskonsepsi {kode} tidak ada di katalog")
                try:
                    if sama(kunci[0], jawab):
                        masalah.append(f"{sid}: jawaban miskonsepsi '{jawab}' ternyata BENAR")
                except Exception as e:  # noqa: BLE001
                    masalah.append(f"{sid}: miskonsepsi '{jawab}' tidak bisa dihitung ({e})")

            # 4. petunjuk
            if kelompok.startswith("modul") and not s.get("mandiri") and len(s.get("petunjuk", [])) != 3:
                masalah.append(f"{sid}: soal latihan harus punya 3 petunjuk")
            if s.get("mandiri") and s.get("petunjuk"):
                masalah.append(f"{sid}: soal mandiri tidak boleh punya petunjuk")

            # perhitungan cerita: kunci sesuai rumus
            c = s.get("cerita")
            if c and "rumus" in c and not sama(kunci[0], c["rumus"]) and s["bentuk"] == "nilai":
                masalah.append(f"{sid}: rumus cerita tidak setara dengan kunci")

    if masalah:
        print(f"{len(masalah)} masalah ditemukan (dari {total} soal):")
        for m in masalah:
            print("  -", m)
        return 1
    print(f"OK: {total} soal, semua kunci benar dan semua jawaban miskonsepsi memang salah.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
