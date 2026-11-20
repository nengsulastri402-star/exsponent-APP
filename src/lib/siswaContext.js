import { createContext, useContext } from 'react'

export const SiswaContext = createContext(null)

export function useSiswa() {
  const nilai = useContext(SiswaContext)
  if (!nilai) throw new Error('useSiswa harus dipakai di dalam SiswaProvider')
  return nilai
}
