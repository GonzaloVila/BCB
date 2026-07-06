import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import WhatsAppButton from './WhatsAppButton'

const WHATSAPP_VISIBLE_PATHS = ['/catalogo', '/producto']

export default function Layout() {
  const location = useLocation()
  const showWhatsApp = WHATSAPP_VISIBLE_PATHS.some((p) => location.pathname.startsWith(p))

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--color-bg)' }}>
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      {showWhatsApp && <WhatsAppButton />}
    </div>
  )
}
