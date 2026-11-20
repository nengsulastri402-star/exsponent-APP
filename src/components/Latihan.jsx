import { useEffect, useState } from 'react'
import { setKonteks } from '../lib/konteks'
import { periksa } from '../lib/cekJawaban'
import { catatJawaban } from '../lib/logger'
import InputJawaban from './InputJawaban.jsx'
import KartuUmpanBalik from './KartuUmpanBalik.jsx'
import Matematika from './Matematika.jsx'
import PanelContoh from './PanelContoh.jsx'
import Pembimbing from './Pembimbing.jsx'
import PenandaCerita from './PenandaCerita.jsx'
import TombolPetunjuk from './TombolPetunjuk.jsx'
import Tombol from './Tombol.jsx'
import UjiAngkaKecil from './UjiAngkaKecil.jsx'

// Satu soal. Dua mode:
//  - "latihan": ada petunjuk 3 tingkat (F5), umpan balik miskonsepsi (F9),
//    rumus dan contoh di layar yang sama (F7), penanda soal cerita (F8).
//  - "tes": tanpa petunjuk dan tanpa umpan balik; jawaban langsung dicatat.
// Pakai key={soal.id} di pemanggil supaya keadaan ter-reset untuk tiap soal.

export default function Latihan({ soal, mode = 'latihan', nomor, total, rumus, contoh, onSelesai }) {
  const [mulai] = useState(() => Date.now())
  const [teks, setTeks] = useState('')
  const [percobaan, setPercobaan] = useState(0)
  const [tingkat, setTingkat] = useState(0)
  const [umpan, setUmpan] = useState(null)
  const [akhir, setAkhir] = useState(null) // 'benar' | 'lihat'
  const [ceritaSiap, setCeritaSiap] = useState(!soal.cerita || mode === 'tes')
  const tes = mode === 'tes'

  // Soal yang sedang dikerjakan dibagikan ke Kak AI (tidak pada mode tes).
  const teksKonteks = soal.soal || (soal.cerita ? soal.cerita.bagian.map((b) => b.t).join('') : '')
  useEffect(() => {
    if (tes) return undefined
    setKonteks({ soal: teksKonteks, perintah: soal.perintah })
    return () => setKonteks(null)
  }, [tes, teksKonteks, soal.perintah])

  function catat(jawaban, benar, kode, tingkatPetunjuk) {
    catatJawaban({
      modul: soal.modul,
      butir: soal.id,
      jawaban,
      benar,
      miskonsepsi: kode ?? null,
      tingkatPetunjuk,
      waktuMs: Date.now() - mulai,
    })
  }

  function kirim() {
    const h = periksa(soal, teks)

    if (tes) {
      if (h.status === 'kosong') {
        setUmpan(h)
        return
      }
      const benar = h.status === 'benar'
      catat(teks, benar, h.kode, 0)
      onSelesai({ benar })
      return
    }

    if (h.status === 'kosong' || h.status === 'format') {
      setUmpan(h)
      return
    }
    const benar = h.status === 'benar'
    setPercobaan((n) => n + 1)
    catat(teks, benar, h.kode, tingkat)
    setUmpan(h)
    if (benar) setAkhir('benar')
  }

  function lewati() {
    catat('', false, null, 0)
    onSelesai({ benar: false })
  }

  function naikPetunjuk(t) {
    setTingkat(t)
  }

  if (!ceritaSiap) {
    return (
      <div className="space-y-4">
        {nomor && (
          <p className="text-sm font-semibold text-teks-pelan">
            Soal {nomor} dari {total}
          </p>
        )}
        <PanelContoh rumus={rumus} contoh={contoh} />
        <PenandaCerita soal={soal} cerita={soal.cerita} onSelesai={() => setCeritaSiap(true)} />
      </div>
    )
  }

  const selesai = akhir !== null
  // Soal cerita: teks soal diambil dari bagian-bagian ceritanya.
  const teksSoal = soal.soal || (soal.cerita ? soal.cerita.bagian.map((b) => b.t).join('') : '')
  const panjang = teksSoal.length > 30

  return (
    <div className="space-y-4">
      {nomor && (
        <p className="text-sm font-semibold text-teks-pelan">
          {tes ? 'Soal' : 'Latihan'} {nomor} dari {total}
        </p>
      )}

      {!tes && <PanelContoh rumus={rumus} contoh={contoh} />}

      {!tes && soal.mandiri && (
        <p className="rounded-lg bg-basis-lembut px-3 py-2 font-semibold text-basis">
          Soal terakhir: kerjakan sendiri, tanpa petunjuk.
        </p>
      )}

      <div className="rounded-2xl border border-garis bg-kartu p-4 text-center">
        {teksSoal && (
          <div className={panjang ? 'text-left text-lg' : ''}>
            <Matematika teks={teksSoal} gaya={panjang ? 'prosa' : 'soal'} />
          </div>
        )}
        <p className="mt-2 text-teks">
          <Matematika teks={soal.perintah} />
        </p>
      </div>

      <InputJawaban
        id={`jawab-${soal.id}`}
        nilai={teks}
        onUbah={(v) => {
          setTeks(v)
          if (umpan?.status === 'kosong' || umpan?.status === 'format') setUmpan(null)
        }}
        onKirim={selesai ? undefined : kirim}
        nonaktif={selesai}
      />

      {!tes && soal.variabel && !selesai && <UjiAngkaKecil soal={soal} jawaban={teks} />}

      {!selesai && (
        <div className="flex gap-3">
          <Tombol penuh onClick={kirim}>
            {tes ? 'Kirim' : 'Periksa'}
          </Tombol>
          {tes && (
            <Tombol varian="sekunder" onClick={lewati}>
              Lewati
            </Tombol>
          )}
        </div>
      )}

      {!tes && !soal.mandiri && !selesai && (
        <TombolPetunjuk petunjuk={soal.petunjuk} tingkat={tingkat} onNaik={naikPetunjuk} />
      )}

      {umpan && <KartuUmpanBalik status={umpan.status} kode={umpan.kode} pesan={umpan.pesan} />}

      {!tes && !soal.mandiri && !selesai && umpan && umpan.status !== 'benar' && umpan.status !== 'kosong' && (
        <Pembimbing
          key={percobaan}
          soal={soal}
          jawaban={teks}
          status={umpan.status}
          kode={umpan.kode}
        />
      )}

      {!tes && !selesai && percobaan >= 3 && (
        <Tombol varian="sekunder" penuh onClick={() => setAkhir('lihat')}>
          Lihat pembahasan
        </Tombol>
      )}

      {akhir === 'lihat' && (
        <div className="rounded-xl border-2 border-basis/40 bg-basis-lembut px-4 py-3 text-teks">
          <p className="font-bold text-basis">Pembahasan</p>
          <Matematika teks={soal.pembahasan} />
        </div>
      )}

      {akhir === 'benar' && soal.pembahasan && (
        <div className="rounded-xl bg-latar px-4 py-3 text-teks">
          <Matematika teks={soal.pembahasan} />
        </div>
      )}

      {selesai && (
        <Tombol
          penuh
          onClick={() =>
            onSelesai({
              benar: akhir === 'benar',
              pertamaBenar: akhir === 'benar' && percobaan === 1,
              percobaan,
              tingkat,
              lihat: akhir === 'lihat',
            })
          }
        >
          Lanjut
        </Tombol>
      )}
    </div>
  )
}
