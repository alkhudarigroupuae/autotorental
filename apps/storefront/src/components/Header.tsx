import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Phone, ChevronDown } from 'lucide-react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [location, setLocation] = useState('Dubai')
  const pathname = useLocation().pathname

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/vehicles', label: 'Rent a Car' },
  ]

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="container-custom">
          <div className="flex items-center justify-between h-9 text-sm">
            <div className="flex items-center gap-4 text-gray-600">
              <div className="flex items-center gap-1">
                <span className="font-medium">AED</span>
                <span className="text-gray-400">/</span>
                <span>English</span>
                <ChevronDown className="w-3 h-3" />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <a href="tel:+971500000000" className="flex items-center gap-1.5 text-gray-600 hover:text-primary transition-colors">
                <Phone className="w-3.5 h-3.5" />
                <span>+971 50 000 0000</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img 
              src="/auto-to-rental.png" 
              alt="Auto To Rental" 
              className="h-10 w-auto object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-medium transition-colors ${
                  pathname === link.to
                    ? 'text-primary'
                    : 'text-gray-700 hover:text-primary'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Link
              to="/vehicles"
              className="btn-primary text-sm"
            >
              Rent a Car
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-gray-900"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="container-custom py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsMenuOpen(false)}
                className={`block py-2 text-sm font-medium ${
                  pathname === link.to
                    ? 'text-primary'
                    : 'text-gray-700'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/vehicles"
              onClick={() => setIsMenuOpen(false)}
              className="btn-primary text-sm block text-center mt-4"
            >
              Rent a Car
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}