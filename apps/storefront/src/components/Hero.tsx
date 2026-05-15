import { useState } from 'react'
import { Search, Calendar, MapPin, ChevronDown } from 'lucide-react'

interface HeroProps {
  onSearch: (searchData: {
    location: string
    pickupDate: string
    returnDate: string
  }) => void
}

export default function Hero({ onSearch }: HeroProps) {
  const [location, setLocation] = useState('Dubai')
  const [pickupDate, setPickupDate] = useState('')
  const [returnDate, setReturnDate] = useState('')
  const [showLocations, setShowLocations] = useState(false)

  const locations = ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah']

  const handleSearch = () => {
    onSearch({ location, pickupDate, returnDate })
  }

  return (
    <section className="relative min-h-[600px] flex items-center hero-gradient overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%232563EB' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-dark via-dark/95 to-dark/80" />

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-3xl">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            Rent a Car in{' '}
            <span className="gradient-text">Dubai</span>
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            Book Direct. No Commission Fees. Best Prices Guaranteed.
          </p>

          {/* Search Box */}
          <div className="glass-effect rounded-2xl p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Location */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <button
                    onClick={() => setShowLocations(!showLocations)}
                    className="w-full pl-10 pr-10 py-3 bg-dark border border-gray-700 rounded-lg text-left text-white focus:outline-none focus:ring-2 focus:ring-primary flex items-center justify-between"
                  >
                    <span>{location}</span>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </button>
                  
                  {showLocations && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-dark-lighter border border-gray-700 rounded-lg shadow-xl z-20">
                      {locations.map((loc) => (
                        <button
                          key={loc}
                          onClick={() => {
                            setLocation(loc)
                            setShowLocations(false)
                          }}
                          className="w-full px-4 py-3 text-left text-white hover:bg-dark-card transition-colors first:rounded-t-lg last:rounded-b-lg"
                        >
                          {loc}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Pickup Date */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Pick-up Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="date"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-dark border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Return Date */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Return Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="date"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-dark border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>

            {/* Search Button */}
            <button
              onClick={handleSearch}
              className="w-full btn-primary py-4 text-lg font-semibold flex items-center justify-center space-x-2"
            >
              <Search className="w-5 h-5" />
              <span>Search Cars</span>
            </button>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap items-center gap-6 mt-8 text-sm text-gray-400">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span>Free Delivery</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span>Insurance Included</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span>24/7 Support</span>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/3 h-2/3 opacity-20 pointer-events-none">
        <div className="w-full h-full bg-gradient-to-l from-primary/30 to-transparent rounded-l-full blur-3xl" />
      </div>
    </section>
  )
}