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

export default function Masuk() {
  const { siswa, masuk, masukPratinjau } = useSiswa()
  const navigate = useNavigate()
  const [kode, setKode] = useState('')
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
        <label htmlFor="kode" className="block font-semibold text-teks">
          Kode kamu
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
