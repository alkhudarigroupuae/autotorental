import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { fetchVehicles, type Vehicle } from '@/lib/api'
import VehicleCard from '@/components/VehicleCard'
import LoadingSpinner from '@/components/LoadingSpinner'

export default function HomePage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [searchText, setSearchText] = useState('')
  const [pickupDate, setPickupDate] = useState('')
  const [returnDate, setReturnDate] = useState('')

  const demoVehicle: Vehicle = {
    id: 'demo-1',
    make: 'Mercedes-Benz',
    model: 'G-Class',
    year: 2025,
    category: 'luxury',
    transmission: 'automatic',
    fuelType: 'petrol',
    seats: 5,
    doors: 5,
    color: 'Obsidian Black',
    plateNumber: 'DXB 55555',
    dailyRate: 2500,
    weeklyRate: 15000,
    monthlyRate: 50000,
    deposit: 15000,
    minAge: 28,
    insurance: 'Full',
    fuelPolicy: 'full_to_full',
    mileageLimit: '500 km/week',
    city: 'Dubai',
    features: [],
    images: [
      { id: '1', url: 'https://images.unsplash.com/photo-1520031441872-265e4ff50366?w=800&q=80', isPrimary: true },
      { id: '2', url: 'https://images.unsplash.com/photo-1606664514610-36b4f7e4f3c1?w=800&q=80', isPrimary: false },
      { id: '3', url: 'https://images.unsplash.com/photo-1606220588913-bb3acb4d2f46?w=800&q=80', isPrimary: false },
      { id: '4', url: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80', isPrimary: false },
    ],
    terms: 'Experience unparalleled luxury with the Mercedes-Benz G-Class. This iconic off-road vehicle combines rugged capability with handcrafted sophistication.',
    available: true,
    createdAt: '',
    updatedAt: '',
  }

  useEffect(() => {
    loadVehicles()
  }, [])

  const loadVehicles = async () => {
    try {
      const result = await fetchVehicles({ limit: 7 })
      setVehicles([demoVehicle, ...result.data])
    } catch {
      setVehicles([demoVehicle])
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params: Record<string, string> = {}
    if (searchText) params.search = searchText
    window.location.href = `/vehicles?${new URLSearchParams(params).toString()}`
  }

  const today = new Date().toISOString().split('T')[0]

  return (
    <div>
      <section className="relative bg-gradient-to-br from-dark via-dark-light to-dark overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-blue rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
              Your Car Starts{' '}
              <span className="text-blue">Here</span>
            </h1>
            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
              The best rental cars in the UAE. Choose your favorite vehicle and start your next adventure.
            </p>
          </div>

          <form onSubmit={handleSearch} className="max-w-3xl mx-auto bg-white rounded-xl shadow-2xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Search Vehicle</label>
                <input
                  type="text"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder="Make or model..."
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Date</label>
                <input
                  type="date"
                  value={pickupDate}
                  min={today}
                  onChange={(e) => setPickupDate(e.target.value)}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Return Date</label>
                <input
                  type="date"
                  value={returnDate}
                  min={pickupDate || today}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="input-field"
                />
              </div>
            </div>
            <button type="submit" className="btn-primary w-full">
              Search Vehicles
            </button>
          </form>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-dark">Featured Vehicles</h2>
            <p className="text-gray-500 mt-1">Choose from our latest vehicles</p>
          </div>
          <Link to="/vehicles" className="btn-outline text-sm hidden sm:inline-flex">
            View All
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : vehicles.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <p className="text-xl">No vehicles available at the moment</p>
            <p className="mt-2">Please check back later</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {vehicles.map((v) => (
              <VehicleCard key={v.id} vehicle={v} />
            ))}
          </div>
        )}

        <div className="text-center mt-8 sm:hidden">
          <Link to="/vehicles" className="btn-outline">
            View All
          </Link>
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-dark text-center mb-12">Why Choose Auto To Rental?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-lg mb-2">Reliable Cars</h3>
              <p className="text-gray-500 text-sm">All our vehicles undergo a comprehensive inspection to ensure the highest levels of quality and safety.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-lg mb-2">Best Prices</h3>
              <p className="text-gray-500 text-sm">We offer competitive prices with flexible plans to suit all budgets.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="font-bold text-lg mb-2">24/7 Support</h3>
              <p className="text-gray-500 text-sm">Our support team is available 24/7 to help you whenever you need us.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-3xl font-bold text-dark mb-4">Ready to Go?</h2>
        <p className="text-gray-500 mb-8 max-w-xl mx-auto">
          Choose your favorite vehicle today and enjoy an unforgettable driving experience.
        </p>
        <Link to="/vehicles" className="btn-primary text-lg px-10">
          Browse Vehicles
        </Link>
      </section>
    </div>
  )
}
