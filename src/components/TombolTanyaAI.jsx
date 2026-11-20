import { useEffect, useState } from 'react'
import ObrolanAI from './ObrolanAI.jsx'

// Tombol melayang "Tanya AI" di layar belajar. Obrolan terbuka di atas layar
// yang sama, jadi siswa tidak berpindah halaman di tengah soal (DESIGN.md).
export default function TombolTanyaAI({ modul }) {
  const [buka, setBuka] = useState(false)

  useEffect(() => {
    if (!buka) return undefined
    const tutup = (e) => e.key === 'Escape' && setBuka(false)
    window.addEventListener('keydown', tutup)
    return () => window.removeEventListener('keydown', tutup)
  }, [buka])

  return (
    <>
      <button
        type="button"
        onClick={() => setBuka(true)}
        aria-label="Tanya AI"
        className="fixed right-4 bottom-4 z-40 flex min-h-12 items-center gap-2 rounded-full bg-pangkat px-5 text-lg font-bold text-white shadow-lg"
      >
        <span aria-hidden="true">💬</span> Tanya AI
      </button>

      {buka && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Tanya AI"
          className="fixed inset-0 z-50 flex flex-col bg-latar px-4 pt-3 pb-3"
        >
          <div className="mx-auto flex h-full w-full max-w-2xl flex-col">
            <header className="mb-3 flex items-center justify-between">
              <h2 className="text-xl font-bold text-teks">Tanya Kak AI</h2>
              <button
                type="button"
                onClick={() => setBuka(false)}
                aria-label="Tutup obrolan"
                className="min-h-11 rounded-lg border-2 border-garis px-4 font-semibold text-teks"
              >
                Tutup
              </button>
            </header>
            <div className="min-h-0 flex-1">
              <ObrolanAI modul={modul} />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
