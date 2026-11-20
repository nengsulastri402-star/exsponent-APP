import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useSiswa } from './lib/siswaContext'
import Beranda from './pages/Beranda.jsx'
import Belajar from './pages/Belajar.jsx'
import Diagnostik from './pages/Diagnostik.jsx'
import Hasil from './pages/Hasil.jsx'
import Leppink from './pages/Leppink.jsx'
import Masuk from './pages/Masuk.jsx'
import ModulPlayer from './pages/ModulPlayer.jsx'
import TesMenu from './pages/TesMenu.jsx'
import TesPage from './pages/TesPage.jsx'
import TombolTanyaAI from './components/TombolTanyaAI.jsx'
import Tipografi from './pages/Tipografi.jsx'
import TanyaAI from './pages/TanyaAI.jsx'

// Halaman yang hanya boleh dibuka setelah siswa memasukkan kode.
function WajibMasuk({ children }) {
  const { siswa } = useSiswa()
  if (!siswa) return <Navigate to="/masuk" replace />
  return children
}

const lindungi = (el) => <WajibMasuk>{el}</WajibMasuk>

// Tombol "Tanya AI" melayang di semua halaman belajar. Tidak tampil di tes,
// cek dasar, angket, dan halaman masuk, agar skor tidak dipengaruhi.
const TANPA_AI = ['/tes', '/diagnostik', '/leppink', '/masuk', '/tipografi', '/tanya']

function AIMelayang() {
  const { siswa } = useSiswa()
  const { pathname } = useLocation()
  if (!siswa || TANPA_AI.some((p) => pathname.startsWith(p))) return null
  const modul = Number(pathname.match(/^\/belajar\/([123])/)?.[1] || 0)
  return <TombolTanyaAI modul={modul} />
}

export default function App() {
  return (
    <>
    <Routes>
      <Route path="/" element={lindungi(<Beranda />)} />
      <Route path="/belajar" element={lindungi(<Belajar />)} />
      <Route path="/belajar/:id" element={lindungi(<ModulPlayer />)} />
      <Route path="/diagnostik" element={lindungi(<Diagnostik />)} />
      <Route path="/hasil" element={lindungi(<Hasil />)} />
      <Route path="/tes" element={lindungi(<TesMenu />)} />
      <Route path="/tes/:jenis" element={lindungi(<TesPage />)} />
      <Route path="/tanya" element={lindungi(<TanyaAI />)} />
      <Route path="/leppink" element={lindungi(<Leppink />)} />
      <Route path="/masuk" element={<Masuk />} />
      {/* Halaman uji tipografi (F3), dipakai saat pengembangan. */}
      <Route path="/tipografi" element={<Tipografi />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    <AIMelayang />
    </>
  )
}
