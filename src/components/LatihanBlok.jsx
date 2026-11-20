import { useState } from 'react'
import Latihan from './Latihan.jsx'

// Menjalankan beberapa soal latihan berurutan, satu per layar.
export default function LatihanBlok({ daftar, rumus, contoh, onSelesai }) {
  const [i, setI] = useState(0)
  const [hasil, setHasil] = useState([])
  const soal = daftar[i]

  function lanjut(h) {
    const baru = [...hasil, { id: soal.id, ...h }]
    setHasil(baru)
    if (i + 1 >= daftar.length) onSelesai(baru)
    else setI(i + 1)
  }

  return (
    <Latihan
      key={soal.id}
      soal={soal}
      nomor={i + 1}
      total={daftar.length}
      rumus={rumus}
      contoh={contoh}
      onSelesai={lanjut}
    />
  )
}
