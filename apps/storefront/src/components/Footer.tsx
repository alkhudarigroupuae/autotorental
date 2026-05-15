import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="inline-block mb-4">
              <img 
                src="/auto-to-rental.png" 
                alt="Auto To Rental" 
                className="h-10 w-auto object-contain"
              />
            </Link>
            <p className="text-gray-600 text-sm mb-4">
              Dubai's premier car rental marketplace. Book direct with verified dealers.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-primary text-sm transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/vehicles" className="text-gray-600 hover:text-primary text-sm transition-colors">
                  Rent a Car
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Categories</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/vehicles?category=luxury" className="text-gray-600 hover:text-primary text-sm transition-colors">
                  Luxury Cars
                </Link>
              </li>
              <li>
                <Link to="/vehicles?category=sports" className="text-gray-600 hover:text-primary text-sm transition-colors">
                  Sports Cars
                </Link>
              </li>
              <li>
                <Link to="/vehicles?category=suv" className="text-gray-600 hover:text-primary text-sm transition-colors">
                  SUVs
                </Link>
              </li>
              <li>
                <Link to="/vehicles?category=economy" className="text-gray-600 hover:text-primary text-sm transition-colors">
                  Economy Cars
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-gray-600 text-sm">
                <Phone className="w-4 h-4" />
                <span>+971 50 000 0000</span>
              </li>
              <li className="flex items-center gap-2 text-gray-600 text-sm">
                <Mail className="w-4 h-4" />
                <span>info@autotorental.com</span>
              </li>
              <li className="flex items-start gap-2 text-gray-600 text-sm">
                <MapPin className="w-4 h-4 mt-0.5" />
                <span>Dubai, UAE</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200">
        <div className="container-custom py-4">
          <div className="flex flex-col md:flex-row items-center justify-between text-sm text-gray-500">
            <p>&copy; 2024 AutoToRental. All rights reserved.</p>
            <div className="flex gap-6 mt-2 md:mt-0">
              <Link to="/privacy" className="hover:text-gray-700 transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-gray-700 transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}