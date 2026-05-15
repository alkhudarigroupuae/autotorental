import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchVehicle } from '@/lib/api'
import type { Vehicle } from '@/lib/api'
import LoadingSpinner from '@/components/LoadingSpinner'
import { 
  Phone, 
  MessageCircle, 
  MapPin, 
  Calendar,
  Gauge,
  Fuel,
  Users,
  DoorOpen,
  Briefcase,
  Check,
  ChevronLeft,
  Share2,
  Heart,
  Clock,
  Shield,
  Star,
  ImageIcon
} from 'lucide-react'

export default function VehicleDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [vehicle, setVehicle] = useState<Vehicle | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedImage, setSelectedImage] = useState(0)
  const [activeTab, setActiveTab] = useState<'overview' | 'features' | 'terms'>('overview')

  useEffect(() => {
    if (id) {
      loadVehicle()
    }
  }, [id])

  const loadVehicle = async () => {
    try {
      const data = await fetchVehicle(id!)
      setVehicle(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load vehicle')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (error || !vehicle) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-2">{error || 'Vehicle not found'}</p>
          <button
            onClick={() => navigate('/vehicles')}
            className="text-primary hover:underline"
          >
            Back to listings
          </button>
        </div>
      </div>
    )
  }

  const images = vehicle.images?.length > 0 
    ? vehicle.images 
    : [{ url: '', isPrimary: true }]

  const mainImage = images[selectedImage]?.url || images[0]?.url

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="container-custom py-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-primary transition-colors text-sm"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to results
          </button>
        </div>
      </div>

      <div className="container-custom py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images & Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              {/* Main Image */}
              <div className="relative aspect-[16/10] bg-gray-100">
                {mainImage ? (
                  <img
                    src={mainImage}
                    alt={`${vehicle.make} ${vehicle.model}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-2" />
                      <span className="text-gray-400">No image available</span>
                    </div>
                  </div>
                )}

                {/* Badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="badge-primary">{vehicle.category || 'Car'}</span>
                  {vehicle.available && (
                    <span className="badge bg-green-100 text-green-800">Available</span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <button className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors">
                    <Share2 className="w-5 h-5 text-gray-600" />
                  </button>
                  <button className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors">
                    <Heart className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="p-4 border-t border-gray-200">
                  <div className="flex gap-2 overflow-x-auto">
                    {images.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-colors ${
                          selectedImage === index 
                            ? 'border-primary' 
                            : 'border-transparent hover:border-gray-300'
                        }`}
                      >
                        <img
                          src={img.url}
                          alt={`View ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Vehicle Info */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                    {vehicle.make} {vehicle.model}
                  </h1>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {vehicle.city || 'Dubai'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {vehicle.year}
                    </span>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="border-b border-gray-200 mb-6">
                <div className="flex gap-6">
                  {(['overview', 'features', 'terms'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`pb-3 text-sm font-medium capitalize border-b-2 transition-colors ${
                        activeTab === tab
                          ? 'border-primary text-primary'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Specs Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Gauge className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Transmission</p>
                        <p className="font-medium text-gray-900 capitalize">
                          {vehicle.transmission}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Fuel className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Fuel Type</p>
                        <p className="font-medium text-gray-900 capitalize">
                          {vehicle.fuelType}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Users className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Seats</p>
                        <p className="font-medium text-gray-900">
                          {vehicle.seats} Passengers
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <DoorOpen className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Doors</p>
                        <p className="font-medium text-gray-900">
                          {vehicle.doors || 4} Doors
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Briefcase className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Bags</p>
                        <p className="font-medium text-gray-900">
                          {vehicle.luggageCapacity || 2} Bags
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Star className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Engine</p>
                        <p className="font-medium text-gray-900">
                          {vehicle.engine || 'Standard'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  {vehicle.description && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                      <p className="text-gray-600 leading-relaxed">
                        {vehicle.description}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'features' && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Features & Specs</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {vehicle.features?.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    )) || (
                      <p className="text-gray-500 col-span-2">No features listed</p>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'terms' && (
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Mileage Policy</h4>
                    <p className="text-gray-600 text-sm">
                      {vehicle.mileageLimit 
                        ? `${vehicle.mileageLimit} km included per day. Additional km charged at ${vehicle.extraMileageCharge || 1} AED/km.`
                        : 'Standard mileage allowance applies. Contact dealer for details.'}
                    </p>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Security Deposit</h4>
                    <p className="text-gray-600 text-sm">
                      {vehicle.deposit > 0 
                        ? `AED ${vehicle.deposit.toLocaleString()} security deposit required. Refundable upon safe return of the vehicle.`
                        : 'No security deposit required.'}
                    </p>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Insurance</h4>
                    <p className="text-gray-600 text-sm">
                      Comprehensive insurance included. Excess/deductible may apply in case of accident.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Pricing & Booking */}
          <div className="space-y-6">
            {/* Pricing Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-24">
              <div className="mb-6">
                <p className="text-sm text-gray-500 mb-1">Daily Rate</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-primary">
                    AED {vehicle.dailyRate.toLocaleString()}
                  </span>
                  <span className="text-gray-500">/ day</span>
                </div>
              </div>

              {/* Pricing Options */}
              <div className="space-y-3 mb-6">
                {vehicle.weeklyRate && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Weekly</span>
                    <span className="font-semibold text-gray-900">
                      AED {vehicle.weeklyRate.toLocaleString()}
                    </span>
                  </div>
                )}

                {vehicle.monthlyRate && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Monthly</span>
                    <span className="font-semibold text-gray-900">
                      AED {vehicle.monthlyRate.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>

              {/* Included Features */}
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>Free Delivery</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>Insurance Included</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>24/7 Support</span>
                </div>
              </div>

              {/* Contact Buttons */}
              <div className="space-y-3">
                <a
                  href="tel:+971500000000"
                  className="flex items-center justify-center gap-2 w-full py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  Call Now
                </a>
                <a
                  href="https://wa.me/971500000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                  WhatsApp
                </a>
              </div>
            </div>

            {/* Dealer Info */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                  <span className="text-lg font-bold text-primary">
                    {vehicle.dealer?.store?.name?.charAt(0) || 'A'}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {vehicle.dealer?.store?.name || 'AutoToRental Dealer'}
                  </h3>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Shield className="w-3.5 h-3.5" />
                    <span>Verified Dealer</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                <Clock className="w-4 h-4" />
                <span>Usually responds in 10 minutes</span>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  Listed on AutoToRental. Book directly with the dealer for the best rates.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}