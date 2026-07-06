import { Link } from 'react-router-dom'
import { MessageCircle, Zap } from 'lucide-react'
import { STORE_NAME, buildWhatsAppUrlGeneric } from '../../lib/constants'

function IconInstagram({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <circle cx="12" cy="12" r="4"/>
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
    </svg>
  )
}

function IconFacebook({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
    </svg>
  )
}

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer style={{ backgroundColor: 'var(--color-primary-dark)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: 'var(--color-accent)' }}
              >
                <Zap className="w-4 h-4 text-white" strokeWidth={2.5} />
              </div>
              <span
                className="text-white font-bold text-base"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {STORE_NAME}
              </span>
            </div>
            <p className="text-blue-300 text-sm leading-relaxed">
              Electrodomésticos y artículos para el hogar. Calidad y confianza en cada producto.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">
              Navegación
            </h3>
            <ul className="space-y-2">
              {[
                { to: '/', label: 'Inicio' },
                { to: '/catalogo', label: 'Catálogo' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-blue-300 hover:text-white text-sm transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">
              Contacto
            </h3>
            <a
              href={buildWhatsAppUrlGeneric()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-white px-4 py-2 rounded-lg transition-colors mb-4"
              style={{ backgroundColor: '#25D366' }}
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </a>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-blue-300 hover:text-white hover:bg-white/20 transition-colors"
                aria-label="Instagram"
              >
                <IconInstagram className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-blue-300 hover:text-white hover:bg-white/20 transition-colors"
                aria-label="Facebook"
              >
                <IconFacebook className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        <div
          className="mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-blue-400"
          style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}
        >
          <p>© {year} {STORE_NAME}. Todos los derechos reservados.</p>
          <p>Hecho con ❤️ en Argentina</p>
        </div>
      </div>
    </footer>
  )
}
