import { supabase, supabaseSiap } from './supabase'

// Siswa hanya dikenal lewat kode, mis. P01 (CLAUDE.md: Etika dan Privasi).
export const POLA_KODE = /^P\d{2,3}$/

const KUNCI_SISWA = 'eksponen.siswa'

export function bacaSiswaTersimpan() {
  try {
    const mentah = localStorage.getItem(KUNCI_SISWA)
    return mentah ? JSON.parse(mentah) : null
  } catch {
    return null
  }
}

export function simpanSiswa(siswa) {
  try {
    localStorage.setItem(KUNCI_SISWA, JSON.stringify(siswa))
  } catch {
    // Penyimpanan diblokir (mis. mode privat); sesi tetap jalan di memori.
  }
}

export function hapusSiswa() {
  try {
    localStorage.removeItem(KUNCI_SISWA)
  } catch {
    // Tidak ada yang perlu dihapus.
  }
}

/**
 * Masuk dengan kode siswa:
 * 1) pastikan ada sesi anonim Supabase,
 * 2) panggil fungsi database masuk_dengan_kode (lihat supabase/migrations),
 *    yang mengaitkan sesi anonim ke baris siswa dan membuat sesi belajar baru.
 */
export async function masukDenganKode(kode) {
  if (!supabaseSiap) throw new Error('SUPABASE_BELUM_DIATUR')

  const { data: sesiAuth } = await supabase.auth.getSession()
  if (!sesiAuth.session) {
    const { error } = await supabase.auth.signInAnonymously()
    if (error) throw error
  }

  const { data, error } = await supabase.rpc('masuk_dengan_kode', {
    p_kode: kode,
  })
  if (error) throw error

  return {
    id: data.siswa_id,
    sesiId: data.sesi_id,
    nomorSesi: data.nomor_sesi,
    kode: data.kode,
    pratinjau: false,
  }
}

const KUNCI_AKUN = 'eksponen.akunPanggilan'

/**
 * Masuk hanya dengan nama panggilan. Nama tidak dikirim ke database: ia hanya
 * dipakai di perangkat ini untuk tahu apakah sesi anonim lama boleh dipakai lagi.
 * Database memberi kode kosong berikutnya (fungsi masuk_otomatis).
 */
export async function masukOtomatis(panggilan) {
  if (!supabaseSiap) throw new Error('SUPABASE_BELUM_DIATUR')
  const nama = String(panggilan).trim().toLowerCase()

  let akunLama = ''
  try {
    akunLama = localStorage.getItem(KUNCI_AKUN) || ''
  } catch {
    // abaikan
  }
  const { data: sesiAuth } = await supabase.auth.getSession()
  // Nama berbeda di perangkat yang sama = siswa lain: mulai sesi anonim baru.
  if (sesiAuth.session && akunLama !== nama) await supabase.auth.signOut()

  const { data: cek } = await supabase.auth.getSession()
  if (!cek.session) {
    const { error } = await supabase.auth.signInAnonymously()
    if (error) throw error
  }

  const { data, error } = await supabase.rpc('masuk_otomatis')
  if (error) throw error
  try {
    localStorage.setItem(KUNCI_AKUN, nama)
  } catch {
    // abaikan
  }
  return {
    id: data.siswa_id,
    sesiId: data.sesi_id,
    nomorSesi: data.nomor_sesi,
    kode: data.kode,
    pratinjau: false,
  }
}

// Sesi anonim sengaja dipertahankan saat keluar, agar siswa yang sama (nama sama,
// perangkat sama) kembali ke kodenya (lihat masukOtomatis). Hanya data lokal dihapus.
export async function keluarAkun() {}
