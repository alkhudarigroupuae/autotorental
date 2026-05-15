import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/vehicles', label: 'Vehicles' },
]

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `font-medium transition-colors duration-200 ${
      isActive ? 'text-blue' : 'text-dark hover:text-blue'
    }`

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <img src="/auto-to-rental.png" alt="Auto to Rental" className="h-10 w-auto" />
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink key={link.to} to={link.to} className={linkClass} end={link.to === '/'}>
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <button className="text-sm text-gray-500 hover:text-blue transition-colors border border-gray-300 rounded-lg px-3 py-1.5">
              EN
            </button>
          </div>

          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden pb-4 border-t border-gray-100 pt-4">
            <nav className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={linkClass}
                  end={link.to === '/'}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </NavLink>
              ))}
              <button className="self-start text-sm text-gray-500 hover:text-blue transition-colors border border-gray-300 rounded-lg px-3 py-1.5 mt-2">
                EN
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
