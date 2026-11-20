import Halaman from '../components/Halaman.jsx'
import ObrolanAI from '../components/ObrolanAI.jsx'

export default function TanyaAI() {
  return (
    <Halaman judul="Tanya Kak AI" kembali="/" kembaliTeks="Kembali ke beranda">
      <div className="h-[calc(100dvh-8rem)]">
        <ObrolanAI modul={0} />
      </div>
    </Halaman>
  )
}
