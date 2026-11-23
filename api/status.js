// Alat periksa untuk peneliti: buka /api/status di browser. Menampilkan apakah kunci
// terbaca (tanpa memperlihatkan kunci) dan hasil uji panggil ke penyedia AI.
import { asalDitolak, diagnosa, kirim, terlaluSering } from './_bersama.js'

export default async function handler(req, res) {
  if (req.method !== 'GET') return kirim(res, 405, { error: 'metode_tidak_diizinkan' })
  if (asalDitolak(req)) return kirim(res, 403, { error: 'asal_ditolak' })
  if (terlaluSering(req, 'status', 10)) return kirim(res, 429, { error: 'terlalu_sering' })
  return kirim(res, 200, await diagnosa())
}
