import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, X, Zap, Lock } from 'lucide-react'
import { STORE_NAME } from '../../lib/constants'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  const navLinks = [
    { to: '/', label: 'Inicio', exact: true },
    { to: '/catalogo', label: 'Catálogo' },
  ]

  const linkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors duration-150 ${
      isActive
        ? 'text-white border-b-2 border-accent pb-0.5'
        : 'text-blue-200 hover:text-white'
    }`

  return (
    <header
      className="sticky top-0 z-50 shadow-lg"
      style={{ backgroundColor: 'var(--color-primary)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105"
              style={{ backgroundColor: 'var(--color-accent)' }}
            >
              <Zap className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <span
              className="text-white font-bold text-lg tracking-tight leading-none"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              BCB
              <span className="block text-xs font-medium text-blue-200 leading-tight">
                Multielectro
              </span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.exact}
                className={linkClass}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Admin link + mobile toggle */}
          <div className="flex items-center gap-3">
            <Link
              to="/admin/login"
              className="text-blue-300 hover:text-white transition-colors"
              title="Administración"
            >
              <Lock className="w-4 h-4" />
            </Link>
            <button
              className="md:hidden text-blue-200 hover:text-white transition-colors"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Menú"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="md:hidden border-t"
          style={{ backgroundColor: 'var(--color-primary-light)', borderColor: 'rgba(255,255,255,0.1)' }}
        >
          <nav className="px-4 py-3 flex flex-col gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.exact}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-white'
                      : 'text-blue-200 hover:text-white hover:bg-white/10'
                  }`
                }
                style={({ isActive }) =>
                  isActive ? { backgroundColor: 'var(--color-accent)' } : {}
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
