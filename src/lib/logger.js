import { supabase, supabaseSiap } from './supabase'
import { bacaSiswaTersimpan } from './auth'

// Pencatat interaksi (ARCHITECTURE.md §5–6): tiap jawaban disimpan ke tabel
// `jawaban`. Bila offline, baris masuk antrian lokal dan dikirim saat online.

const KUNCI_ANTRIAN = 'eksponen.antrian'
const KUNCI_PRATINJAU = 'eksponen.log-pratinjau'
const BATAS_PRATINJAU = 200

function bacaDaftar(kunci) {
  try {
    return JSON.parse(localStorage.getItem(kunci) || '[]')
  } catch {
    return []
  }
}

function tulisDaftar(kunci, daftar) {
  try {
    localStorage.setItem(kunci, JSON.stringify(daftar))
  } catch {
    // Penyimpanan penuh atau diblokir; abaikan agar UI tidak terganggu.
  }
}

let sedangSinkron = false

/** Kirim seluruh antrian ke Supabase. Aman dipanggil berulang. */
export async function sinkronkanAntrian() {
  if (!supabaseSiap || sedangSinkron) return
  const antrian = bacaDaftar(KUNCI_ANTRIAN)
  if (antrian.length === 0) return

  sedangSinkron = true
  try {
    const { error } = await supabase.from('jawaban').insert(antrian)
    if (!error) tulisDaftar(KUNCI_ANTRIAN, [])
  } catch {
    // Masih offline; coba lagi nanti.
  } finally {
    sedangSinkron = false
  }
}

/**
 * Catat satu jawaban siswa.
 * waktuMs = lama dari soal tampil sampai dijawab; tingkatPetunjuk 0–3.
 */
export async function catatJawaban({
  modul,
  butir,
  jawaban,
  benar,
  miskonsepsi = null,
  tingkatPetunjuk = 0,
  waktuMs = null,
}) {
  const siswa = bacaSiswaTersimpan()
  if (!siswa) return

  const baris = {
    siswa_id: siswa.id,
    sesi_id: siswa.sesiId,
    modul,
    butir,
    jawaban: String(jawaban ?? ''),
    benar,
    miskonsepsi,
    tingkat_petunjuk: tingkatPetunjuk,
    waktu_ms: waktuMs === null ? null : Math.round(waktuMs),
  }

  // Mode pratinjau (tanpa database): simpan lokal agar bisa diperiksa.
  if (siswa.pratinjau || !supabaseSiap) {
    const log = bacaDaftar(KUNCI_PRATINJAU)
    log.push({ ...baris, dibuat: new Date().toISOString() })
    tulisDaftar(KUNCI_PRATINJAU, log.slice(-BATAS_PRATINJAU))
    return
  }

  // Tidak menunggu jaringan agar UI tetap lancar: masuk antrian dulu.
  tulisDaftar(KUNCI_ANTRIAN, [...bacaDaftar(KUNCI_ANTRIAN), baris])
  sinkronkanAntrian()
}
