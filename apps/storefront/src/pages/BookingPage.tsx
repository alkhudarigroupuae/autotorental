import { useState, useEffect } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { fetchVehicle, createBooking, calculateQuote, type Vehicle, type QuoteResponse } from '@/lib/api'
import LoadingSpinner from '@/components/LoadingSpinner'

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

  if (loading) return <LoadingSpinner />
  if (error && !vehicle) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-red-500 text-xl mb-4">{error}</p>
        <button onClick={() => navigate('/vehicles')} className="btn-outline">
          Back to Vehicles
        </button>
      </div>
    )
  }
  if (!vehicle || !quote) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-500 text-xl mb-4">Please calculate the price first from the vehicle page</p>
        <button onClick={() => navigate(`/vehicles/${vehicleId}`)} className="btn-outline">
          Back to Vehicle
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-dark mb-8">Booking Request</h1>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="font-bold text-lg mb-4">Vehicle Summary</h2>
            <div className="flex items-center gap-4">
              <div className="w-24 h-16 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                <img
                  src={vehicle.images?.find((i) => i.isPrimary)?.url || vehicle.images?.[0]?.url || '/placeholder-car.svg'}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-bold">{vehicle.make} {vehicle.model} {vehicle.year}</h3>
                <p className="text-gray-500 text-sm">{vehicle.city}</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-5">
              <h2 className="font-bold text-lg">Customer Information</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className={`input-field ${formErrors.name ? 'border-red-500' : ''}`}
                  placeholder="Enter your full name"
                />
                {formErrors.name && <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  className={`input-field ${formErrors.phone ? 'border-red-500' : ''}`}
                  placeholder="+971 50 000 0000"
                  dir="ltr"
                />
                {formErrors.phone && <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className={`input-field ${formErrors.email ? 'border-red-500' : ''}`}
                  placeholder="example@email.com"
                  dir="ltr"
                />
                {formErrors.email && <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                  className="input-field min-h-[100px] resize-y"
                  placeholder="Any special requirements or notes..."
                  rows={3}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full mt-6 disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit Booking Request'}
            </button>
          </form>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24">
            <h2 className="font-bold text-lg mb-4">Price Details</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Pickup Date</span>
                <span className="font-medium">{pickupDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Return Date</span>
                <span className="font-medium">{returnDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Duration</span>
                <span className="font-medium">{quote.days} days</span>
              </div>
              <div className="border-t border-gray-100 my-2" />
              <div className="flex justify-between">
                <span className="text-gray-600">Base Price</span>
                <span className="font-medium">{quote.baseAmount.toLocaleString('en-AE')} AED</span>
              </div>
              {quote.addonsAmount > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Add-ons</span>
                  <span className="font-medium">+ {quote.addonsAmount.toLocaleString('en-AE')} AED</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">VAT (5%)</span>
                <span className="font-medium">{quote.vat.toLocaleString('en-AE')} AED</span>
              </div>
              <div className="border-t border-gray-100 pt-2 flex justify-between font-bold">
                <span>Grand Total</span>
                <span className="text-blue text-lg">{quote.grandTotal.toLocaleString('en-AE')} AED</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Advance Payment (20%)</span>
                <span className="font-medium">{quote.advance.toLocaleString('en-AE')} AED</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Balance Due</span>
                <span className="font-medium">{quote.balance.toLocaleString('en-AE')} AED</span>
              </div>
            </div>

            {addDelivery || addDriver || addChildSeat ? (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <h3 className="font-semibold text-sm mb-2">Selected Add-ons:</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  {addDelivery && <li>• Vehicle Delivery</li>}
                  {addDriver && <li>• Additional Driver</li>}
                  {addChildSeat && <li>• Child Seat</li>}
                </ul>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
