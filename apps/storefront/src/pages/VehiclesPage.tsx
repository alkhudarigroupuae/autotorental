import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { fetchVehicles, type Vehicle, type VehicleFilters } from '@/lib/api'
import VehicleCard from '@/components/VehicleCard'
import LoadingSpinner from '@/components/LoadingSpinner'

const categories = ['', 'sedan', 'suv', 'sports', 'luxury', 'truck', 'van']
const categoryLabels: Record<string, string> = {
  '': 'All',
  sedan: 'Sedan',
  suv: 'SUV',
  sports: 'Sports',
  luxury: 'Luxury',
  truck: 'Truck',
  van: 'Van',
}

const transmissions = ['', 'automatic', 'manual']
const transmissionLabels: Record<string, string> = {
  '': 'All',
  automatic: 'Automatic',
  manual: 'Manual',
}

const fuelTypes = ['', 'petrol', 'diesel', 'hybrid', 'electric']
const fuelLabels: Record<string, string> = {
  '': 'All',
  petrol: 'Petrol',
  diesel: 'Diesel',
  hybrid: 'Hybrid',
  electric: 'Electric',
}

export default function VehiclesPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)

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
    terms: 'Experience unparalleled luxury with the Mercedes-Benz G-Class.',
    available: true,
    createdAt: '',
    updatedAt: '',
  }

  const filters: VehicleFilters = {
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    transmission: searchParams.get('transmission') || '',
    fuelType: searchParams.get('fuelType') || '',
    seatsMin: searchParams.get('seatsMin') ? Number(searchParams.get('seatsMin')) : undefined,
    seatsMax: searchParams.get('seatsMax') ? Number(searchParams.get('seatsMax')) : undefined,
    priceMin: searchParams.get('priceMin') ? Number(searchParams.get('priceMin')) : undefined,
    priceMax: searchParams.get('priceMax') ? Number(searchParams.get('priceMax')) : undefined,
    city: searchParams.get('city') || '',
    page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
    limit: 12,
  }

  useEffect(() => {
    loadVehicles()
  }, [searchParams])

  const loadVehicles = async () => {
    setLoading(true)
    try {
      const result = await fetchVehicles(filters)
      setVehicles([demoVehicle, ...result.data])
      setTotalPages(result.totalPages)
      setTotal(result.total + 1)
    } catch {
      setVehicles([demoVehicle])
      setTotalPages(1)
      setTotal(1)
    } finally {
      setLoading(false)
    }
  }

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams)
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    params.delete('page')
    setSearchParams(params)
  }

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', String(page))
    setSearchParams(params)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const clearFilters = () => {
    setSearchParams({})
  }

  const hasActiveFilters = Array.from(searchParams.entries()).some(([k]) => k !== 'page')

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-dark">Vehicles</h1>
          <p className="text-gray-500 mt-1">
            {total} vehicles available
          </p>
        </div>
        <button
          className="lg:hidden btn-outline text-sm"
          onClick={() => setShowFilters(!showFilters)}
        >
          {showFilters ? 'Hide Filters' : 'Filters'}
        </button>
      </div>

      <div className="flex gap-8">
        <aside className={`${showFilters ? 'block' : 'hidden'} lg:block w-full lg:w-72 shrink-0`}>
          <div className="bg-gray-50 rounded-xl p-5 sticky top-24 space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <input
                type="text"
                value={filters.search || ''}
                onChange={(e) => updateFilter('search', e.target.value)}
                placeholder="Search by make or model..."
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={filters.category || ''}
                onChange={(e) => updateFilter('category', e.target.value)}
                className="input-field"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{categoryLabels[c]}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Transmission</label>
              <select
                value={filters.transmission || ''}
                onChange={(e) => updateFilter('transmission', e.target.value)}
                className="input-field"
              >
                {transmissions.map((t) => (
                  <option key={t} value={t}>{transmissionLabels[t]}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fuel Type</label>
              <select
                value={filters.fuelType || ''}
                onChange={(e) => updateFilter('fuelType', e.target.value)}
                className="input-field"
              >
                {fuelTypes.map((f) => (
                  <option key={f} value={f}>{fuelLabels[f]}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Seats</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.seatsMin || ''}
                  onChange={(e) => updateFilter('seatsMin', e.target.value)}
                  className="input-field"
                  min={1}
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.seatsMax || ''}
                  onChange={(e) => updateFilter('seatsMax', e.target.value)}
                  className="input-field"
                  min={1}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (AED/day)</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.priceMin || ''}
                  onChange={(e) => updateFilter('priceMin', e.target.value)}
                  className="input-field"
                  min={0}
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.priceMax || ''}
                  onChange={(e) => updateFilter('priceMax', e.target.value)}
                  className="input-field"
                  min={0}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <input
                type="text"
                value={filters.city || ''}
                onChange={(e) => updateFilter('city', e.target.value)}
                placeholder="Dubai, Abu Dhabi..."
                className="input-field"
              />
            </div>

            {hasActiveFilters && (
              <button onClick={clearFilters} className="text-sm text-red-500 hover:text-red-700 w-full text-center">
                Clear All Filters
              </button>
            )}
          </div>
        </aside>

        <main className="flex-1 min-w-0">
          {loading ? (
            <LoadingSpinner />
          ) : vehicles.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p className="text-xl">No results found</p>
              <p className="mt-2">Try changing your search criteria</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {vehicles.map((v) => (
                  <VehicleCard key={v.id} vehicle={v} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-10">
                  <button
                    onClick={() => goToPage((filters.page || 1) - 1)}
                    disabled={(filters.page || 1) <= 1}
                    className="btn-outline text-sm px-4 py-2 disabled:opacity-30"
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => goToPage(p)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        (filters.page || 1) === p
                          ? 'bg-blue text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    onClick={() => goToPage((filters.page || 1) + 1)}
                    disabled={(filters.page || 1) >= totalPages}
                    className="btn-outline text-sm px-4 py-2 disabled:opacity-30"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  )
}
