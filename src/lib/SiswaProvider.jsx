import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  bacaSiswaTersimpan,
  hapusSiswa,
  keluarAkun,
  masukDenganKode,
  masukOtomatis,
  simpanSiswa,
} from './auth'
import { sinkronkanAntrian } from './logger'
import { SiswaContext } from './siswaContext'

export default function SiswaProvider({ children }) {
  const [siswa, setSiswa] = useState(() => bacaSiswaTersimpan())

  const masuk = useCallback(async (kode) => {
    const baru = await masukDenganKode(kode)
    simpanSiswa(baru)
    setSiswa(baru)
  }, [])

  const masukNama = useCallback(async (panggilan) => {
    const baru = await masukOtomatis(panggilan)
    simpanSiswa(baru)
    setSiswa(baru)
  }, [])

  // Pratinjau: coba aplikasi tanpa database (data hanya di perangkat ini).
  const masukPratinjau = useCallback((kode) => {
    const baru = {
      id: 'pratinjau',
      sesiId: 'pratinjau',
      nomorSesi: 1,
      kode,
      pratinjau: true,
    }
    simpanSiswa(baru)
    setSiswa(baru)
  }, [])

  const keluar = useCallback(async () => {
    await keluarAkun()
    hapusSiswa()
    setSiswa(null)
  }, [])

  // Kirim jawaban yang tertahan saat offline.
  useEffect(() => {
    sinkronkanAntrian()
    window.addEventListener('online', sinkronkanAntrian)
    return () => window.removeEventListener('online', sinkronkanAntrian)
  }, [])

  const nilai = useMemo(
    () => ({ siswa, masuk, masukNama, masukPratinjau, keluar }),
    [siswa, masuk, masukNama, masukPratinjau, keluar],
  )

  return <SiswaContext.Provider value={nilai}>{children}</SiswaContext.Provider>
}
