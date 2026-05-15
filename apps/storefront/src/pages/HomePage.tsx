import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { fetchVehicles, type Vehicle } from '@/lib/api'
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import CategoryCards from '@/components/CategoryCards'
import VehicleCard from '@/components/VehicleCard'
import Footer from '@/components/Footer'
import LoadingSpinner from '@/components/LoadingSpinner'
import { ChevronRight } from 'lucide-react'

export default function HomePage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadVehicles()
  }, [])

  const loadVehicles = async () => {
    try {
      const result = await fetchVehicles({ limit: 8 })
      setVehicles(result.data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load vehicles')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (searchData: {
    location: string
    pickupDate: string
    returnDate: string
  }) => {
    const params = new URLSearchParams()
    if (searchData.location) params.set('city', searchData.location)
    if (searchData.pickupDate) params.set('pickupDate', searchData.pickupDate)
    if (searchData.returnDate) params.set('returnDate', searchData.returnDate)
    window.location.href = `/vehicles?${params.toString()}`
  }

  return (
    <div className="min-h-screen bg-dark">
      <Header />
      
      <main>
        {/* Hero Section */}
        <Hero onSearch={handleSearch} />

        {/* Category Cards */}
        <CategoryCards />

        {/* Featured Vehicles */}
        <section className="py-16 bg-dark">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-white">
                Featured Rentals
              </h2>
              <Link
                to="/vehicles"
                className="flex items-center text-primary hover:text-primary-light transition-colors"
              >
                <span>View All Cars</span>
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner />
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-500 mb-2">Error loading vehicles</p>
                <p className="text-gray-500 text-sm">{error}</p>
              </div>
            ) : vehicles.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No vehicles available at the moment</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {vehicles.map((vehicle) => (
                  <VehicleCard key={vehicle.id} vehicle={vehicle} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-16 bg-dark-lighter">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white text-center mb-12">
              Why Choose AutoToRental?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Best Prices</h3>
                <p className="text-gray-400">
                  Book directly with dealers. No commission fees. Best rates guaranteed.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
                  <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Verified Dealers</h3>
                <p className="text-gray-400">
                  All rental companies are verified and reviewed. Rent with confidence.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent-orange/20 flex items-center justify-center">
                  <svg className="w-8 h-8 text-accent-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">24/7 Support</h3>
                <p className="text-gray-400">
                  Round-the-clock customer service. We're here when you need us.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent-orange/20" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Rent Your Dream Car?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Browse our collection of luxury, sports, and economy cars. Book now and get the best deals.
            </p>
            <Link
              to="/vehicles"
              className="btn-primary text-lg px-8 py-4 inline-block"
            >
              Browse All Cars
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}