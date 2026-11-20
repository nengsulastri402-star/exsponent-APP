import { useState } from 'react'
import { ujiAngkaKecil } from '../lib/cekJawaban'
import { catatJawaban } from '../lib/logger'
import Tombol from './Tombol.jsx'

// F10 (opsional) — "Uji dulu": ganti huruf dengan angka kecil, lalu lihat apakah
// soal dan jawabanmu bernilai sama. Hanya muncul pada soal berhuruf.
export default function UjiAngkaKecil({ soal, jawaban }) {
  const [angka, setAngka] = useState('2')
  const [hasil, setHasil] = useState(null)
  const [pesan, setPesan] = useState('')

  function uji() {
    setPesan('')
    const n = Number(angka)
    if (!Number.isInteger(n) || n < 1 || n > 9) {
      setPesan('Pilih angka bulat 1 sampai 9.')
      return
    }
    if (!jawaban.trim()) {
      setPesan('Tulis jawabanmu dulu, lalu uji.')
      return
    }
    const h = ujiAngkaKecil(soal.soal, jawaban, n)
    if (!h) {
      setPesan('Jawabanmu belum bisa diuji. Tulis seperti a^5.')
      return
    }
    setHasil(h)
    catatJawaban({
      modul: soal.modul,
      butir: `f10-${soal.id}`,
      jawaban: `a=${n}; ${h.soal} vs ${h.jawaban}`,
      benar: h.cocok,
    })
  }

  return (
    <details className="rounded-xl border border-garis bg-kartu px-4 py-2">
      <summary className="flex min-h-11 cursor-pointer items-center font-semibold text-basis">
        Uji dulu dengan angka kecil
      </summary>
      <div className="space-y-3 pb-2">
        <label className="flex items-center gap-3 text-teks" htmlFor={`uji-${soal.id}`}>
          Ganti huruf dengan
          <input
            id={`uji-${soal.id}`}
            type="number"
            min="1"
            max="9"
            value={angka}
            onChange={(e) => setAngka(e.target.value)}
            className="min-h-11 w-20 rounded-lg border-2 border-garis px-2 text-center text-xl"
          />
        </label>
        <Tombol varian="sekunder" onClick={uji}>
          Uji
        </Tombol>
        {pesan && <p className="text-perhatian">{pesan}</p>}
        {hasil && (
          <p role="status" className={hasil.cocok ? 'text-benar' : 'text-perhatian'}>
            Soal bernilai <b>{hasil.soal}</b>, jawabanmu bernilai <b>{hasil.jawaban}</b>.{' '}
            {hasil.cocok ? '✔ Cocok.' : '✎ Belum cocok. Periksa lagi.'}
          </p>
        )}
      </div>
    </details>
  )
}
