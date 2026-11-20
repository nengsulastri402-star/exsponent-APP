import { useState } from 'react'
import katalog from '../data/miskonsepsi.json'
import { FASE, faseDari } from '../lib/rmt'
import { normalisasi } from '../lib/cekJawaban'
import Matematika from './Matematika.jsx'
import Tombol from './Tombol.jsx'

// Pembimbing (mediator) berbasis RMT: tidak memberi jawaban, hanya pertanyaan
// terpimpin (mediated questioning). Dipanggil bila siswa menekan tombol.
// Bila server AI belum diatur atau gagal, dipakai pertanyaan bawaan dari katalog
// miskonsepsi, sehingga fitur ini tidak pernah buntu.

const MAKS = 3

export default function Pembimbing({ soal, jawaban, status, kode }) {
  const [balasan, setBalasan] = useState([]) // { teks, ai }
  const [memuat, setMemuat] = useState(false)

  const m = kode ? katalog[kode] : null
  const fase = faseDari(status, m)
  const habis = balasan.length >= MAKS

  const kunciNorm = (soal.kunci ?? []).map((k) => normalisasi(k))
  const membocorkan = (teks) => {
    const t = normalisasi(teks)
    return kunciNorm.some((k) => k.length >= 3 && t.includes(k))
  }

  function cadangan() {
    const urut = [m?.pertanyaan, FASE[fase].cadangan, 'Coba buka petunjuk, atau jabarkan pangkatnya menjadi perkalian berulang.']
    return urut.filter(Boolean)[Math.min(balasan.length, urut.filter(Boolean).length - 1)]
  }

  async function tanya() {
    setMemuat(true)
    const teksSoal = soal.soal || (soal.cerita ? soal.cerita.bagian.map((b) => b.t).join('') : '')
    try {
      const r = await fetch('/api/tanya', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          modul: soal.modul,
          soal: teksSoal,
          perintah: soal.perintah,
          jawaban,
          fase,
          ke: balasan.length + 1,
          miskonsepsi: m ? { nama: m.nama, penjelasan: m.penjelasan } : null,
          riwayat: balasan.map((b) => b.teks),
        }),
      })
      if (!r.ok) throw new Error('gagal')
      const { teks } = await r.json()
      if (!teks || membocorkan(teks)) throw new Error('tidak_layak')
      setBalasan((b) => [...b, { teks, ai: true }])
    } catch {
      setBalasan((b) => [...b, { teks: cadangan(), ai: false }])
    } finally {
      setMemuat(false)
    }
  }

  return (
    <div className="space-y-3">
      {balasan.map((b, i) => (
        <div key={i} role="status" className="rounded-xl border-2 border-basis/40 bg-basis-lembut px-4 py-3 text-teks">
          <p className="text-sm font-bold text-basis">
            <span aria-hidden="true">💬 </span>{b.ai ? 'Pembimbing AI (Gemini)' : 'Pembimbing'} · tahap: {FASE[fase].nama}
          </p>
          <p className="mt-1">
            <Matematika teks={b.teks} />
          </p>
        </div>
      ))}
      {!habis && (
        <Tombol varian="sekunder" penuh onClick={tanya} disabled={memuat} aria-label="Tanya pembimbing">
          {memuat ? 'Pembimbing sedang berpikir…' : balasan.length ? 'Tanya lagi' : 'Tanya pembimbing'}
        </Tombol>
      )}
    </div>
  )
}
