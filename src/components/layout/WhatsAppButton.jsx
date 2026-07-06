import { MessageCircle } from 'lucide-react'
import { buildWhatsAppUrlGeneric } from '../../lib/constants'

export default function WhatsAppButton() {
  return (
    <a
      href={buildWhatsAppUrlGeneric()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Consultar por WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 text-white text-sm font-semibold px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95"
      style={{ backgroundColor: '#25D366' }}
    >
      <MessageCircle className="w-5 h-5" />
      <span className="hidden sm:inline">Consultar</span>
    </a>
  )
}
