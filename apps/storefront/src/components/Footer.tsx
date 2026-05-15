import { Link } from 'react-router-dom'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-dark text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src="/auto-to-rental.png" alt="Auto to Rental" className="h-8 w-auto" />
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Your trusted car rental marketplace in the UAE. We provide the best vehicles at the best prices.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-blue transition-colors">Home</Link></li>
              <li><Link to="/vehicles" className="hover:text-blue transition-colors">Vehicles</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4">Contact Us</h4>
            <ul className="space-y-2 text-sm">
              <li>Phone: +971 50 000 0000</li>
              <li>Email: info@autotorental.ae</li>
              <li>Dubai, United Arab Emirates</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-500">
          &copy; {year} Auto To Rental. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
