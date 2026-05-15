import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { fetchVehicles, type Vehicle, type VehicleFilters } from '@/lib/api'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import VehicleCard from '@/components/VehicleCard'
import LoadingSpinner from '@/components/LoadingSpinner'
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react'

const categories = [
  { value: '', label: 'All Categories' },
  { value: 'sedan', label: 'Sedan' },
  { value: 'suv', label: 'SUV' },
  { value: 'sports', label: 'Sports' },
  { value: 'luxury', label: 'Luxury' },
  { value: 'truck', label: 'Truck' },
  { value: 'van', label: 'Van' },
  { value: 'electric', label: 'Electric' },
  { value: 'economy', label: 'Economy' },
]

const transmissions = [
  { value: '', label: 'All' },
  { value: 'automatic', label: 'Automatic' },
  { value: 'manual', label: 'Manual' },
]

const fuelTypes = [
  { value: '', label: 'All' },
  { value: 'petrol', label: 'Petrol' },
  { value: 'diesel', label: 'Diesel' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'electric', label: 'Electric' },
]

export default function VehiclesPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [error, setError] = useState('')

  const [filters, setFilters] = useState<VehicleFilters>({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    transmission: searchParams.get('transmission') || '',
    fuelType: searchParams.get('fuelType') || '',
    seatsMin: searchParams.get('seatsMin') ? Number(searchParams.get('seatsMin')) : undefined,
    priceMin: searchParams.get('priceMin') ? Number(searchParams.get('priceMin')) : undefined,
    priceMax: searchParams.get('priceMax') ? Number(searchParams.get('priceMax')) : undefined,
    city: searchParams.get('city') || '',
    page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
    limit: 12,
  })

  useEffect(() => {
    loadVehicles()
  }, [searchParams])

  const loadVehicles = async () => {
    setLoading(true)
    try {
      const result = await fetchVehicles(filters)
      setVehicles(result.data)
      setTotalPages(result.totalPages)
      setTotal(result.total)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load vehicles')
    } finally {
      setLoading(false)
    }
  }

  const updateFilter = (key: keyof VehicleFilters, value: any) => {
    const newFilters = { ...filters, [key]: value, page: 1 }
    setFilters(newFilters)
    
    const params = new URLSearchParams()
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v !== undefined && v !== '' && v !== null) {
        params.set(k, String(v))
      }
    })
    setSearchParams(params)
  }

  const clearFilters = () => {
    const defaultFilters: VehicleFilters = {
      search: '',
      category: '',
      transmission: '',
      fuelType: '',
      page: 1,
      limit: 12,
    }
    setFilters(defaultFilters)
    setSearchParams(new URLSearchParams())
  }

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return
    updateFilter('page', page)
  }

  const FilterSection = () => (
    <div className="space-y-6">
      {/* Search */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Search
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search cars..."
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-dark border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Category
        </label>
        <select
          value={filters.category}
          onChange={(e) => updateFilter('category', e.target.value)}
          className="w-full px-4 py-2 bg-dark border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
        >
          {categories.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      {/* Transmission */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Transmission
        </label>
        <select
          value={filters.transmission}
          onChange={(e) => updateFilter('transmission', e.target.value)}
          className="w-full px-4 py-2 bg-dark border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
        >
          {transmissions.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      {/* Fuel Type */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Fuel Type
        </label>
        <select
          value={filters.fuelType}
          onChange={(e) => updateFilter('fuelType', e.target.value)}
          className="w-full px-4 py-2 bg-dark border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
        >
          {fuelTypes.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Price Range (AED/day)
        </label>
        <div className="flex items-center space-x-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.priceMin || ''}
            onChange={(e) => updateFilter('priceMin', e.target.value ? Number(e.target.value) : undefined)}
            className="w-full px-3 py-2 bg-dark border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <span className="text-gray-500">-</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.priceMax || ''}
            onChange={(e) => updateFilter('priceMax', e.target.value ? Number(e.target.value) : undefined)}
            className="w-full px-3 py-2 bg-dark border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Clear Filters */}
      <button
        onClick={clearFilters}
        className="w-full py-2 border border-gray-700 text-gray-300 rounded-lg hover:bg-dark-lighter transition-colors"
      >
        Clear Filters
      </button>
    </div>
  )

  return (
    <div className="min-h-screen bg-dark">
      <Header />

      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white">Rent a Car</h1>
              <p className="text-gray-400 mt-1">
                {total} cars available
              </p>
            </div>

            {/* Mobile Filter Button */}
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="md:hidden mt-4 btn-secondary flex items-center justify-center space-x-2"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters</span>
            </button>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters - Desktop */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-24 bg-dark-lighter rounded-xl border border-gray-800 p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Filters</h2>
                <FilterSection />
              </div>
            </aside>

            {/* Mobile Filters */}
            {showMobileFilters && (
              <div className="lg:hidden fixed inset-0 z-50 bg-dark-lighter p-6 overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-white">Filters</h2>
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="p-2 text-gray-400 hover:text-white"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <FilterSection />
              </div>
            )}

            {/* Results */}
            <div className="flex-1">
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
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-dark-lighter flex items-center justify-center">
                    <Search className="w-10 h-10 text-gray-600" />
                  </div>
                  <p className="text-xl text-gray-400 mb-2">No results found</p>
                  <p className="text-gray-500">Try changing your search criteria</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {vehicles.map((vehicle) => (
                      <VehicleCard key={vehicle.id} vehicle={vehicle} />
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-10">
                      <button
                        onClick={() => goToPage((filters.page || 1) - 1)}
                        disabled={(filters.page || 1) <= 1}
                        className="px-4 py-2 border border-gray-700 text-gray-300 rounded-lg hover:bg-dark-lighter disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      >
                        Previous
                      </button>

                      <div className="flex items-center gap-1">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          const page = i + 1
                          return (
                            <button
                              key={page}
                              onClick={() => goToPage(page)}
                              className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                                filters.page === page
                                  ? 'bg-primary text-white'
                                  : 'text-gray-400 hover:bg-dark-lighter'
                              }`}
                            >
                              {page}
                            </button>
                          )
                        })}
                        {totalPages > 5 && (
                          <>
                            <span className="text-gray-500 px-2">...</span>
                            <button
                              onClick={() => goToPage(totalPages)}
                              className="w-10 h-10 rounded-lg text-gray-400 hover:bg-dark-lighter transition-colors"
                            >
                              {totalPages}
                            </button>
                          </>
                        )}
                      </div>

                      <button
                        onClick={() => goToPage((filters.page || 1) + 1)}
                        disabled={(filters.page || 1) >= totalPages}
                        className="px-4 py-2 border border-gray-700 text-gray-300 rounded-lg hover:bg-dark-lighter disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}