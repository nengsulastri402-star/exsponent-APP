import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import Pangkat from '../components/Pangkat.jsx'
import { POLA_KODE } from '../lib/auth'
import { useSiswa } from '../lib/siswaContext'
import { supabaseSiap } from '../lib/supabase'

// Mengembalikan { pesan, detail }. `pesan` untuk siswa; `detail` untuk peneliti
// (tampil kecil di bawah pesan, membantu mencari penyebab).
function pesanKesalahan(err) {
  const teks = String(err?.message ?? err)
  const rendah = teks.toLowerCase()
  const detail = teks

  if (rendah.includes('kode_tidak_dikenal')) {
    return {
      pesan: 'Kode tidak ditemukan. Tanyakan kodemu kepada guru atau kakak peneliti.',
      detail: 'Kode belum ada di tabel siswa. Jalankan supabase/seed.sql.',
    }
  }
  if (rendah.includes('failed to fetch') || rendah.includes('networkerror')) {
    return {
      pesan: 'Belum bisa terhubung. Periksa internetmu, lalu coba lagi.',
      detail: 'Periksa internet dan nilai VITE_SUPABASE_URL di .env.',
    }
  }
  if (rendah.includes('anonymous') && rendah.includes('disabled')) {
    return {
      pesan: 'Ada masalah saat masuk. Coba lagi sebentar lagi.',
      detail:
        'Masuk anonim belum aktif. Supabase: Authentication → Sign In / Providers → Anonymous Sign-Ins → aktifkan → Save.',
    }
  }
  if (
    rendah.includes('could not find the function') ||
    rendah.includes('masuk_dengan_kode') && rendah.includes('not')
  ) {
    return {
      pesan: 'Ada masalah saat masuk. Coba lagi sebentar lagi.',
      detail:
        'Fungsi masuk_dengan_kode belum ada. Jalankan seluruh isi supabase/migrations/0001_skema.sql di SQL Editor.',
    }
  }
  if (rendah.includes('invalid api key') || rendah.includes('apikey')) {
    return {
      pesan: 'Ada masalah saat masuk. Coba lagi sebentar lagi.',
      detail:
        'Kunci di .env salah atau terpotong. Salin ulang Publishable/anon key dari Supabase.',
    }
  }
  return {
    pesan: 'Ada masalah saat masuk. Coba lagi sebentar lagi.',
    detail,
  }
}

// Daftar kode yang bisa diketuk. Hanya kode, tidak ada nama siswa di kode program.
const DAFTAR_KODE = Array.from({ length: 30 }, (_, i) => `P${String(i + 1).padStart(2, '0')}`)

// Nama panggilan hanya disimpan di perangkat ini (localStorage), tidak dikirim ke database.
const kunciPanggilan = (kode) => `eksponen.panggilan.${kode}`
const ambilPanggilan = (kode) => {
  try {
    return localStorage.getItem(kunciPanggilan(kode)) || ''
  } catch {
    return ''
  }
}

export default function Masuk() {
  const { siswa, masuk, masukPratinjau } = useSiswa()
  const navigate = useNavigate()
  const [kode, setKode] = useState('')
  const [panggilan, setPanggilan] = useState('')
  const [pesan, setPesan] = useState('')
  const [detail, setDetail] = useState('')
  const [memuat, setMemuat] = useState(false)

  if (siswa) return <Navigate to="/" replace />

  async function kirim(e) {
    e.preventDefault()
    const bersih = kode.trim().toUpperCase()
    if (!POLA_KODE.test(bersih)) {
      setPesan('Tulis kodenya seperti ini: P01')
      return
    }
    try {
      const nama = panggilan.trim().slice(0, 20)
      if (nama) localStorage.setItem(kunciPanggilan(bersih), nama)
    } catch {
      // abaikan
    }
    setMemuat(true)
    setPesan('')
    setDetail('')
    try {
      await masuk(bersih)
      navigate('/', { replace: true })
    } catch (err) {
      console.error('Gagal masuk:', err)
      const hasil = pesanKesalahan(err)
      setPesan(hasil.pesan)
      setDetail(hasil.detail)
    } finally {
      setMemuat(false)
    }
  }

  function coba() {
    const bersih = kode.trim().toUpperCase()
    masukPratinjau(POLA_KODE.test(bersih) ? bersih : 'P00')
    navigate('/', { replace: true })
  }

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-4 py-8">
      <div className="mb-6 text-center">
        <Pangkat basis="a" pangkat="n" ukuran="lg" />
        <h1 className="mt-4 text-2xl font-bold text-teks">Belajar Eksponen</h1>
        <p className="mt-1 text-teks-pelan">Masukkan kodemu untuk mulai.</p>
      </div>

      <form
        onSubmit={kirim}
        className="rounded-2xl border border-garis bg-kartu p-5"
      >
        <p className="font-semibold text-teks">Ketuk kodemu</p>
        <div className="mt-2 grid grid-cols-5 gap-2" role="group" aria-label="Pilih kode">
          {DAFTAR_KODE.map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => {
                setKode(k)
                setPanggilan(ambilPanggilan(k))
              }}
              aria-pressed={kode === k}
              aria-label={`Kode ${k}`}
              className={`min-h-11 rounded-lg border-2 text-sm font-bold ${
                kode === k ? 'border-basis bg-basis text-white' : 'border-garis text-teks'
              }`}
            >
              {k}
            </button>
          ))}
        </div>
        <label htmlFor="kode" className="mt-4 block font-semibold text-teks">
          Atau tulis kodenya
        </label>
        <input
          id="kode"
          value={kode}
          onChange={(e) => setKode(e.target.value.toUpperCase())}
          maxLength={4}
          placeholder="P01"
          autoCapitalize="characters"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          aria-describedby={pesan ? 'pesan-masuk' : undefined}
          className="mt-2 min-h-12 w-full rounded-xl border-2 border-garis px-4 text-xl tracking-widest uppercase focus:border-basis"
        />

        <label htmlFor="panggilan" className="mt-4 block font-semibold text-teks">
          Nama panggilan (boleh kosong)
        </label>
        <input
          id="panggilan"
          value={panggilan}
          onChange={(e) => setPanggilan(e.target.value)}
          maxLength={20}
          placeholder="Contoh: Budi"
          autoComplete="off"
          className="mt-2 min-h-12 w-full rounded-xl border-2 border-garis px-4 text-lg focus:border-basis"
        />
        <p className="mt-1 text-xs text-teks-pelan">Hanya tersimpan di HP atau komputer ini.</p>

        {pesan && (
          <p
            id="pesan-masuk"
            role="alert"
            className="mt-3 rounded-lg bg-perhatian-lembut px-3 py-2 text-perhatian"
          >
            {pesan}
            {detail && (
              <span className="mt-2 block border-t border-perhatian/30 pt-2 text-xs break-words">
                Info untuk peneliti: {detail}
              </span>
            )}
          </p>
        )}

        <button
          type="submit"
          disabled={memuat || !supabaseSiap}
          aria-label="Masuk dengan kode"
          className="mt-4 min-h-12 w-full rounded-xl bg-basis px-4 text-lg font-bold text-white disabled:opacity-50"
        >
          {memuat ? 'Memeriksa…' : 'Masuk'}
        </button>
      </form>

      {!supabaseSiap && (
        <div className="mt-4 rounded-xl border border-perhatian bg-perhatian-lembut p-4 text-sm text-perhatian">
          <p>
            Database belum diatur (isi <code>.env</code>, lihat{' '}
            <code>.env.example</code>). Kamu tetap bisa mencoba tampilan tanpa
            database; datanya hanya tersimpan di perangkat ini.
          </p>
          <button
            type="button"
            onClick={coba}
            aria-label="Coba aplikasi tanpa database"
            className="mt-3 min-h-11 rounded-lg border-2 border-perhatian px-4 font-semibold"
          >
            Coba tanpa database
          </button>
        </div>
      )}
    </main>
  )
}
