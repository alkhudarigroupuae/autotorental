import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { fetchVehicles, type Vehicle, type VehicleFilters } from '@/lib/api'
import VehicleCard from '@/components/VehicleCard'
import LoadingSpinner from '@/components/LoadingSpinner'
import { Search, SlidersHorizontal, X } from 'lucide-react'

const categories = [
  { value: '', label: 'All Categories' },
  { value: 'luxury', label: 'Luxury' },
  { value: 'sports', label: 'Sports' },
  { value: 'suv', label: 'SUV' },
  { value: 'sedan', label: 'Sedan' },
  { value: 'economy', label: 'Economy' },
  { value: 'electric', label: 'Electric' },
]

const transmissions = [
  { value: '', label: 'All' },
  { value: 'automatic', label: 'Automatic' },
  { value: 'manual', label: 'Manual' },
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

  const FilterContent = () => (
    <div className="space-y-5">
      {/* Search */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Search
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search cars..."
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Category
        </label>
        <select
          value={filters.category}
          onChange={(e) => updateFilter('category', e.target.value)}
          className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
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
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Transmission
        </label>
        <select
          value={filters.transmission}
          onChange={(e) => updateFilter('transmission', e.target.value)}
          className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
        >
          {transmissions.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      {/* Clear Filters */}
      <button
        onClick={clearFilters}
        className="w-full py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
      >
        Clear Filters
      </button>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="container-custom py-8">
          <h1 className="text-3xl font-bold text-gray-900">Rent a Car</h1>
          <p className="text-gray-600 mt-1">{total} cars available</p>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-900">Filters</h2>
                <SlidersHorizontal className="w-4 h-4 text-gray-400" />
              </div>
              <FilterContent />
            </div>
          </aside>

          {/* Mobile Filters */}
          {showMobileFilters && (
            <div className="lg:hidden fixed inset-0 z-50 bg-white p-5">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-semibold text-gray-900">Filters</h2>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <FilterContent />
            </div>
          )}

          {/* Results */}
          <div className="flex-1">
            {/* Mobile Filter Button */}
            <div className="lg:hidden mb-4">
              <button
                onClick={() => setShowMobileFilters(true)}
                className="w-full py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
              </button>
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
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-lg text-gray-900 mb-1">No results found</p>
                <p className="text-gray-500 text-sm">Try changing your search criteria</p>
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
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-sm"
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
                            className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                              filters.page === page
                                ? 'bg-primary text-white'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            {page}
                          </button>
                        )
                      })}
                    </div>

                    <button
                      onClick={() => goToPage((filters.page || 1) + 1)}
                      disabled={(filters.page || 1) >= totalPages}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-sm"
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
    </div>
  )
}