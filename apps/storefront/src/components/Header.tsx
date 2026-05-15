import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Car, Menu, X, Phone, MapPin } from 'lucide-react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [location, setLocation] = useState('Dubai')
  const pathname = useLocation().pathname

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/vehicles', label: 'Rent a Car' },
    { to: '/categories', label: 'Categories' },
    { to: '/brands', label: 'Brands' },
  ]

  return (
    <header className="bg-dark border-b border-gray-800 sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-dark-lighter border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-10 text-sm">
            <div className="flex items-center space-x-4 text-gray-400">
              <button className="flex items-center space-x-1 hover:text-white transition-colors">
                <MapPin className="w-4 h-4" />
                <span>{location}</span>
              </button>
              <span className="hidden sm:inline">|</span>
              <span className="hidden sm:inline text-gray-500">AED / Eng</span>
            </div>
            <div className="flex items-center space-x-4">
              <a href="tel:+971500000000" className="flex items-center space-x-1 text-gray-400 hover:text-white transition-colors">
                <Phone className="w-4 h-4" />
                <span className="hidden sm:inline">+971 50 000 0000</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent-orange rounded-lg flex items-center justify-center">
              <Car className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold text-white">Auto</span>
              <span className="text-xl font-bold gradient-text">ToRental</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-medium transition-colors ${
                  pathname === link.to
                    ? 'text-primary'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
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
            className="md:hidden p-2 text-gray-400 hover:text-white"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-dark-lighter border-t border-gray-800">
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsMenuOpen(false)}
                className={`block py-2 text-sm font-medium ${
                  pathname === link.to
                    ? 'text-primary'
                    : 'text-gray-300'
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