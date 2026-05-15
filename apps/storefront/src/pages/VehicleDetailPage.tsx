import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchVehicle, type Vehicle } from '@/lib/api'
import QuoteCalculator from '@/components/QuoteCalculator'
import LoadingSpinner from '@/components/LoadingSpinner'

const transmissionLabels: Record<string, string> = {
  automatic: 'Automatic',
  manual: 'Manual',
}

const fuelLabels: Record<string, string> = {
  petrol: 'Petrol',
  diesel: 'Diesel',
  hybrid: 'Hybrid',
  electric: 'Electric',
}

const categoryLabels: Record<string, string> = {
  sedan: 'Sedan',
  suv: 'SUV',
  sports: 'Sports',
  luxury: 'Luxury',
  truck: 'Truck',
  van: 'Van',
}

export default function VehicleDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [vehicle, setVehicle] = useState<Vehicle | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedImage, setSelectedImage] = useState(0)
  const [activeTab, setActiveTab] = useState<'specs' | 'features' | 'terms'>('specs')

  useEffect(() => {
    if (id) loadVehicle()
  }, [id])

  const loadVehicle = async () => {
    if (!id) return
    setLoading(true)
    try {
      const result = await fetchVehicle(id)
      setVehicle(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load vehicle details')
    } finally {
      setLoading(false)
    }
  }

  const handleBook = (pickupDate: string, returnDate: string) => {
    if (!id) return
    navigate(`/book/${id}?pickup=${pickupDate}&return=${returnDate}`)
  }

  if (loading) return <LoadingSpinner />
  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <p className="text-red-500 text-xl mb-4">{error}</p>
        <button onClick={() => navigate('/vehicles')} className="btn-outline">
          Back to Vehicles
        </button>
      </div>
    )
  }
  if (!vehicle) return null

  const images = vehicle.images?.length > 0 ? vehicle.images : [{ id: '0', url: '/placeholder-car.svg', isPrimary: true }]

  const groupedFeatures: Record<string, { id: string; name: string }[]> = {}
  vehicle.features?.forEach((f) => {
    if (!groupedFeatures[f.category]) groupedFeatures[f.category] = []
    groupedFeatures[f.category].push(f)
  })

  const categoryColors: Record<string, string> = {
    safety: 'bg-green-100 text-green-800',
    comfort: 'bg-blue-100 text-blue-800',
    technology: 'bg-purple-100 text-purple-800',
    tech: 'bg-purple-100 text-purple-800',
    audio: 'bg-yellow-100 text-yellow-800',
    exterior: 'bg-orange-100 text-orange-800',
    interior: 'bg-pink-100 text-pink-800',
    other: 'bg-gray-100 text-gray-700',
  }

  const categoryLabelsGroup: Record<string, string> = {
    safety: 'Safety',
    comfort: 'Comfort',
    technology: 'Technology',
    tech: 'Technology',
    audio: 'Audio',
    exterior: 'Exterior',
    interior: 'Interior',
    other: 'Other',
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-blue transition-colors mb-6 flex items-center gap-1">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="mb-4">
            <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-gray-100">
              <img
                src={images[selectedImage]?.url}
                alt={`${vehicle.make} ${vehicle.model}`}
                className="w-full h-full object-cover"
              />
              {!vehicle.available && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">Unavailable</span>
                </div>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-20 h-16 rounded-lg overflow-hidden shrink-0 border-2 transition-colors ${
                      idx === selectedImage ? 'border-blue' : 'border-transparent'
                    }`}
                  >
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-dark">
                {vehicle.make} {vehicle.model}
              </h1>
              <p className="text-gray-500 mt-1">
                {vehicle.year} | {categoryLabels[vehicle.category] || vehicle.category} | {vehicle.city}
              </p>
            </div>
            <div className="text-left">
              <div className="text-blue font-bold text-3xl">{vehicle.dailyRate.toLocaleString('en-AE')}</div>
              <div className="text-gray-500 text-sm">AED / day</div>
            </div>
          </div>

          <div className="tabs flex gap-1 bg-gray-100 rounded-lg p-1 mb-6">
              {(['specs', 'features', 'terms'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-2.5 rounded-md text-sm font-medium transition-all ${
                    activeTab === tab ? 'bg-white shadow-sm text-dark' : 'text-gray-500 hover:text-dark'
                  }`}
                >
                  {tab === 'specs' ? 'Specs' : tab === 'features' ? 'Features' : 'Terms'}
                </button>
            ))}
          </div>

          <div>
            {activeTab === 'specs' && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  { label: 'Transmission', value: transmissionLabels[vehicle.transmission] || vehicle.transmission },
                  { label: 'Fuel Type', value: fuelLabels[vehicle.fuelType] || vehicle.fuelType },
                  { label: 'Seats', value: `${vehicle.seats} seats` },
                  { label: 'Doors', value: `${vehicle.doors} doors` },
                  { label: 'Color', value: vehicle.color },
                  { label: 'Plate', value: vehicle.plateNumber },
                ].map((spec) => (
                  <div key={spec.label} className="bg-gray-50 rounded-lg p-4">
                    <div className="text-gray-500 text-sm">{spec.label}</div>
                    <div className="font-semibold text-dark mt-1">{spec.value}</div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'features' && (
              <div className="space-y-4">
                {Object.entries(groupedFeatures).length === 0 ? (
                  <p className="text-gray-500">No features specified</p>
                ) : (
                  Object.entries(groupedFeatures).map(([category, features]) => (
                    <div key={category}>
                      <h4 className="font-semibold text-dark mb-2">{categoryLabelsGroup[category] || category}</h4>
                      <div className="flex flex-wrap gap-2">
                        {features.map((f) => (
                          <span
                            key={f.id}
                            className={`badge ${categoryColors[category] || 'bg-gray-100 text-gray-700'}`}
                          >
                            {f.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'terms' && (
              <div className="space-y-4">
                {vehicle.terms && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700 whitespace-pre-line">{vehicle.terms}</p>
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <span className="text-gray-500 text-sm">Min. Age</span>
                    <p className="font-semibold text-dark mt-1">{vehicle.minAge} years</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <span className="text-gray-500 text-sm">Insurance</span>
                    <p className="font-semibold text-dark mt-1">{vehicle.insurance}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <span className="text-gray-500 text-sm">Fuel Policy</span>
                    <p className="font-semibold text-dark mt-1">{vehicle.fuelPolicy}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <span className="text-gray-500 text-sm">Mileage Limit</span>
                    <p className="font-semibold text-dark mt-1">{vehicle.mileageLimit}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <span className="text-gray-500 text-sm">Security Deposit</span>
                    <p className="font-semibold text-dark mt-1">{vehicle.deposit.toLocaleString('en-AE')} AED</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-blue/5 border border-blue/20 rounded-lg p-4 text-center">
              <div className="text-blue font-bold text-xl">{vehicle.dailyRate.toLocaleString('en-AE')}</div>
              <div className="text-gray-600 text-sm">AED / day</div>
            </div>
            {vehicle.weeklyRate > 0 && (
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <div className="text-dark font-bold text-xl">{vehicle.weeklyRate.toLocaleString('en-AE')}</div>
                <div className="text-gray-600 text-sm">AED / week</div>
              </div>
            )}
            {vehicle.monthlyRate > 0 && (
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <div className="text-dark font-bold text-xl">{vehicle.monthlyRate.toLocaleString('en-AE')}</div>
                <div className="text-gray-600 text-sm">AED / month</div>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <QuoteCalculator
              vehicleId={vehicle.id}
              dailyRate={vehicle.dailyRate}
              onBook={(quote, pickupDate, returnDate, addons) => {
                const params = new URLSearchParams({
                  pickup: pickupDate,
                  return: returnDate,
                  ...(addons?.delivery ? { delivery: '1' } : {}),
                  ...(addons?.additionalDriver ? { additionalDriver: '1' } : {}),
                  ...(addons?.childSeat ? { childSeat: '1' } : {}),
                })
                navigate(`/book/${vehicle.id}?${params.toString()}`)
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
