// Lapisan data: progres modul, hasil tes, skala beban kognitif, dan rekap jawaban.
// Mode pratinjau (tanpa database) menyimpan semuanya di perangkat ini saja.

import { supabase, supabaseSiap } from './supabase'

const baca = (kunci, awal) => {
  try {
    const mentah = localStorage.getItem(kunci)
    return mentah ? JSON.parse(mentah) : awal
  } catch {
    return awal
  }
}
const tulis = (kunci, nilai) => {
  try {
    localStorage.setItem(kunci, JSON.stringify(nilai))
  } catch {
    // Penyimpanan diblokir; abaikan agar UI tetap jalan.
  }
}
const lokal = (siswa) => siswa.pratinjau || !supabaseSiap

const KUNCI_TES = 'eksponen.tes-pratinjau'
const KUNCI_SKALA = 'eksponen.skala-pratinjau'
const KUNCI_LOG = 'eksponen.log-pratinjau'

// ------------------------------------------------------------------ progres

export const progresAwal = () => ({
  1: { terbuka: true, selesai: false },
  2: { terbuka: false, selesai: false },
  3: { terbuka: false, selesai: false },
})

const kunciProgres = (siswa) => `eksponen.progres.${siswa.kode}`

export async function muatProgres(siswa) {
  const p = { ...progresAwal(), ...baca(kunciProgres(siswa), {}) }
  if (!lokal(siswa)) {
    try {
      const { data, error } = await supabase
        .from('progres_modul')
        .select('modul,terbuka,selesai')
      if (!error && data) {
        for (const r of data) {
          const x = p[r.modul] || {}
          p[r.modul] = {
            terbuka: Boolean(x.terbuka || r.terbuka),
            selesai: Boolean(x.selesai || r.selesai),
          }
        }
      }
    } catch {
      // Offline: pakai data lokal.
    }
  }
  return p
}

export async function selesaikanModul(siswa, modul) {
  const p = { ...progresAwal(), ...baca(kunciProgres(siswa), {}) }
  p[modul] = { terbuka: true, selesai: true }
  if (modul < 3) p[modul + 1] = { ...p[modul + 1], terbuka: true }
  tulis(kunciProgres(siswa), p)

  if (!lokal(siswa)) {
    const baris = [modul, modul + 1]
      .filter((m) => m >= 1 && m <= 3)
      .map((m) => ({
        siswa_id: siswa.id,
        modul: m,
        terbuka: p[m].terbuka,
        selesai: p[m].selesai,
      }))
    try {
      await supabase.from('progres_modul').upsert(baris, { onConflict: 'siswa_id,modul' })
    } catch {
      // Data lokal tetap tersimpan.
    }
  }
  return p
}

// --------------------------------------------------------------------- tes

/** Simpan skor tes. jenis: 'pretest' | 'posttest' | 'diagnostik'. */
export async function simpanTes(siswa, jenis, skor, skorMaks) {
  const baris = { jenis, skor, skor_maks: skorMaks }
  if (lokal(siswa)) {
    const d = baca(KUNCI_TES, [])
    d.push({ ...baris, kode: siswa.kode, dibuat: new Date().toISOString() })
    tulis(KUNCI_TES, d)
    return { ok: true }
  }
  try {
    const { error } = await supabase.from('tes').insert({ siswa_id: siswa.id, ...baris })
    return { ok: !error, error }
  } catch (error) {
    return { ok: false, error }
  }
}

export async function ambilTes(siswa) {
  if (lokal(siswa)) return baca(KUNCI_TES, []).filter((t) => t.kode === siswa.kode)
  try {
    const { data } = await supabase
      .from('tes')
      .select('jenis,skor,skor_maks,dibuat')
      .order('dibuat', { ascending: true })
    return data || []
  } catch {
    return []
  }
}

// ------------------------------------------------------------ skala kognitif

/** nilaiPerButir: { IL1: 4, EL2: 7, ... } (0–10). */
export async function simpanSkala(siswa, nilaiPerButir) {
  const baris = Object.entries(nilaiPerButir).map(([butir, nilai]) => ({ butir, nilai }))
  if (lokal(siswa)) {
    const d = baca(KUNCI_SKALA, [])
    d.push({ kode: siswa.kode, dibuat: new Date().toISOString(), nilai: nilaiPerButir })
    tulis(KUNCI_SKALA, d)
    return { ok: true }
  }
  try {
    const { error } = await supabase
      .from('skala_kognitif')
      .insert(baris.map((b) => ({ siswa_id: siswa.id, ...b })))
    return { ok: !error, error }
  } catch (error) {
    return { ok: false, error }
  }
}

// ------------------------------------------------------------------ rekap

export async function ambilJawaban(siswa) {
  if (lokal(siswa)) return baca(KUNCI_LOG, [])
  try {
    const { data } = await supabase
      .from('jawaban')
      .select('modul,butir,benar,tingkat_petunjuk,waktu_ms,dibuat')
      .order('dibuat', { ascending: true })
    return data || []
  } catch {
    return []
  }
}

/** Ringkas jawaban latihan (butir "m1-01" dst.) per modul. */
export function ringkasPerModul(jawaban) {
  const hasil = {}
  for (const m of [1, 2, 3]) {
    const baris = jawaban.filter((j) => new RegExp(`^m${m}-\\d`).test(j.butir || ''))
    const butir = new Set(baris.map((b) => b.butir))
    const benar = new Set(baris.filter((b) => b.benar).map((b) => b.butir))
    const petunjuk = [...butir].map((id) =>
      Math.max(...baris.filter((b) => b.butir === id).map((b) => b.tingkat_petunjuk || 0)),
    )
    hasil[m] = {
      butir: butir.size,
      benar: benar.size,
      rataPetunjuk: petunjuk.length
        ? petunjuk.reduce((a, b) => a + b, 0) / petunjuk.length
        : null,
    }
  }
  return hasil
}
