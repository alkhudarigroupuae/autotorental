import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { fetchVehicles, type Vehicle } from '@/lib/api'
import Hero from '@/components/Hero'
import CategoryCards from '@/components/CategoryCards'
import VehicleCard from '@/components/VehicleCard'
import LoadingSpinner from '@/components/LoadingSpinner'
import { ChevronRight, Shield, Clock, Award } from 'lucide-react'

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
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <Hero onSearch={handleSearch} />

      {/* Category Cards */}
      <CategoryCards />

      {/* Featured Vehicles */}
      <section className="py-12 bg-gray-50">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Featured Rentals
            </h2>
            <Link
              to="/vehicles"
              className="flex items-center text-primary hover:text-primary-dark font-medium transition-colors"
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
              <p className="text-red-600 mb-2">Error loading vehicles</p>
              <p className="text-gray-500 text-sm">{error}</p>
            </div>
          ) : vehicles.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
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
      <section className="py-16 bg-white">
        <div className="container-custom">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-12">
            Why Choose AutoToRental?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-primary-50 flex items-center justify-center">
                <Award className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Best Prices</h3>
              <p className="text-gray-600 text-sm">
                Book directly with dealers. No commission fees. Best rates guaranteed.
              </p>
            </div>

            <div className="text-center">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-green-50 flex items-center justify-center">
                <Shield className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Verified Dealers</h3>
              <p className="text-gray-600 text-sm">
                All rental companies are verified and reviewed. Rent with confidence.
              </p>
            </div>

            <div className="text-center">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-orange-50 flex items-center justify-center">
                <Clock className="w-7 h-7 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">24/7 Support</h3>
              <p className="text-gray-600 text-sm">
                Round-the-clock customer service. We're here when you need us.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Rent Your Dream Car?
          </h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Browse our collection of luxury, sports, and economy cars. Book now and get the best deals.
          </p>
          <Link
            to="/vehicles"
            className="inline-block bg-white text-primary font-semibold px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Browse All Cars
          </Link>
        </div>
      </section>
    </div>
  )
}