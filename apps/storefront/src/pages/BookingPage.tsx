import { useState, useEffect } from 'react'
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom'
import { fetchVehicle, createBooking, calculateQuote, type Vehicle, type QuoteResponse } from '@/lib/api'
import LoadingSpinner from '@/components/LoadingSpinner'
import { ChevronLeft, Car, Calendar, CreditCard } from 'lucide-react'

export default function BookingPage() {
  const { vehicleId } = useParams<{ vehicleId: string }>()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const [vehicle, setVehicle] = useState<Vehicle | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const pickupDate = searchParams.get('pickup') || ''
  const returnDate = searchParams.get('return') || ''
  const addDelivery = searchParams.get('delivery') === '1'
  const addDriver = searchParams.get('additionalDriver') === '1'
  const addChildSeat = searchParams.get('childSeat') === '1'

  const [quote, setQuote] = useState<QuoteResponse | null>(null)

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    notes: '',
  })

  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (vehicleId) loadData()
  }, [vehicleId])

  const loadData = async () => {
    if (!vehicleId) return
    setLoading(true)
    try {
      const v = await fetchVehicle(vehicleId)
      setVehicle(v)

      if (pickupDate && returnDate) {
        const q = await calculateQuote(vehicleId, {
          pickupDate,
          returnDate,
          addons: { delivery: addDelivery, additionalDriver: addDriver, childSeat: addChildSeat },
        })
        setQuote(q)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const validate = () => {
    const errors: Record<string, string> = {}
    if (!form.name.trim()) errors.name = 'Please enter your name'
    if (!form.phone.trim()) errors.phone = 'Please enter your phone number'
    else if (!/^\+?971\d{9}$/.test(form.phone.replace(/\s/g, '')))
      errors.phone = 'Please enter a valid UAE phone number (+971XXXXXXXXX)'
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errors.email = 'Please enter a valid email'
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate() || !vehicleId || !quote) return

    setSubmitting(true)
    setError('')

    try {
      const booking = await createBooking({
        vehicleId,
        pickupDate,
        returnDate,
        customerName: form.name,
        customerPhone: form.phone,
        customerEmail: form.email,
        notes: form.notes,
        addons: { delivery: addDelivery, additionalDriver: addDriver, childSeat: addChildSeat },
        totalAmount: quote.grandTotal,
        advanceAmount: quote.advance,
        balanceAmount: quote.balance,
      })
      navigate(`/booking/${booking.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit booking')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (error && !vehicle) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-2">{error}</p>
          <Link to="/vehicles" className="text-primary hover:underline">
            Back to Vehicles
          </Link>
        </div>
      </div>
    )
  }

  if (!vehicle || !quote) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-2">Please calculate the price first from the vehicle page</p>
          <Link to={`/vehicles/${vehicleId}`} className="text-primary hover:underline">
            Back to Vehicle
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container-custom py-4">
          <Link
            to={`/vehicles/${vehicleId}`}
            className="flex items-center text-gray-600 hover:text-primary transition-colors text-sm"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Vehicle
          </Link>
        </div>
      </div>

      <div className="container-custom py-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">Complete Your Booking</h1>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left Column - Form */}
          <div className="lg:col-span-3 space-y-6">
            {/* Vehicle Summary */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Car className="w-5 h-5 text-primary" />
                Vehicle Summary
              </h2>
              <div className="flex items-center gap-4">
                <div className="w-28 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  <img
                    src={vehicle.images?.find((i) => i.isPrimary)?.url || vehicle.images?.[0]?.url || '/placeholder-car.svg'}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900">{vehicle.make} {vehicle.model}</h3>
                  <p className="text-gray-500 text-sm">{vehicle.year} • {vehicle.city || 'Dubai'}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {pickupDate} to {returnDate}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Form */}
            <form onSubmit={handleSubmit}>
              <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
                <h2 className="font-semibold text-gray-900 mb-4">Customer Information</h2>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    className={`input-field ${formErrors.name ? 'input-field-error' : ''}`}
                    placeholder="Enter your full name"
                  />
                  {formErrors.name && <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number *</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                    className={`input-field ${formErrors.phone ? 'input-field-error' : ''}`}
                    placeholder="+971 50 000 0000"
                    dir="ltr"
                  />
                  {formErrors.phone && <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    className={`input-field ${formErrors.email ? 'input-field-error' : ''}`}
                    placeholder="example@email.com"
                    dir="ltr"
                  />
                  {formErrors.email && <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Additional Notes</label>
                  <textarea
                    value={form.notes}
                    onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                    className="input-field min-h-[100px] resize-y"
                    placeholder="Any special requirements or notes..."
                    rows={3}
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mt-6">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="btn-primary w-full mt-6 py-4 text-base disabled:opacity-50"
              >
                {submitting ? 'Processing...' : 'Confirm Booking Request'}
              </button>
            </form>
          </div>

          {/* Right Column - Price Summary */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-24">
              <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary" />
                Price Summary
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-medium">{quote.days} days</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Base Rate</span>
                  <span className="font-medium">{quote.baseAmount.toLocaleString('en-AE')} AED</span>
                </div>
                {quote.addonsAmount > 0 && (
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Add-ons</span>
                    <span className="font-medium">+ {quote.addonsAmount.toLocaleString('en-AE')} AED</span>
                  </div>
                )}
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">VAT (5%)</span>
                  <span className="font-medium">{quote.vat.toLocaleString('en-AE')} AED</span>
                </div>
                
                <div className="border-t border-gray-200 my-4" />
                
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-900">Total Amount</span>
                  <span className="text-2xl font-bold text-primary">
                    {quote.grandTotal.toLocaleString('en-AE')} AED
                  </span>
                </div>

                <div className="bg-primary-50 rounded-lg p-4 mt-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Advance Payment (20%)</span>
                    <span className="font-semibold">{quote.advance.toLocaleString('en-AE')} AED</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Balance on Pickup</span>
                    <span className="font-semibold">{quote.balance.toLocaleString('en-AE')} AED</span>
                  </div>
                </div>
              </div>

              {(addDelivery || addDriver || addChildSeat) && (
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <h3 className="font-medium text-sm text-gray-900 mb-2">Selected Add-ons:</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {addDelivery && <li>• Vehicle Delivery</li>}
                    {addDriver && <li>• Additional Driver</li>}
                    {addChildSeat && <li>• Child Seat</li>}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}