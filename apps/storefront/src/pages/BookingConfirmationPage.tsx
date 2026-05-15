import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { fetchBooking, type Booking } from '@/lib/api'
import LoadingSpinner from '@/components/LoadingSpinner'
import { CheckCircle, Phone, Mail, Clock, Car, CreditCard } from 'lucide-react'

export default function BookingConfirmationPage() {
  const { id } = useParams<{ id: string }>()
  const [booking, setBooking] = useState<Booking | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (id) loadBooking()
  }, [id])

  const loadBooking = async () => {
    if (!id) return
    setLoading(true)
    try {
      const result = await fetchBooking(id)
      setBooking(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load booking')
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

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-2">{error}</p>
          <Link to="/" className="text-primary hover:underline">
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  if (!booking) return null

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom max-w-2xl">
        {/* Success Message */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
          <p className="text-gray-600">Thank you! We will contact you soon to confirm your reservation.</p>
        </div>

        {/* Booking Details Card */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
          <div className="bg-primary p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm mb-1">Booking Reference</p>
                <p className="text-2xl font-bold font-mono" dir="ltr">#{booking.id.slice(0, 8).toUpperCase()}</p>
              </div>
              <div className="text-right">
                <p className="text-white/80 text-sm mb-1">Status</p>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/20 text-white">
                  <Clock className="w-4 h-4 mr-1.5" />
                  Pending Confirmation
                </span>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Vehicle Info */}
            {booking.vehicle && (
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0">
                  <Car className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Vehicle</p>
                  <p className="font-semibold text-gray-900">
                    {booking.vehicle.make} {booking.vehicle.model} {booking.vehicle.year}
                  </p>
                </div>
              </div>
            )}

            {/* Duration */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Rental Period</p>
                <p className="font-semibold text-gray-900">
                  {booking.pickupDate} to {booking.returnDate}
                </p>
              </div>
            </div>

            {/* Customer Info */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
                <Mail className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Customer</p>
                <p className="font-semibold text-gray-900">{booking.customerName}</p>
                <p className="text-gray-600 text-sm" dir="ltr">{booking.customerPhone}</p>
                {booking.customerEmail && (
                  <p className="text-gray-600 text-sm">{booking.customerEmail}</p>
                )}
              </div>
            </div>

            {/* Payment Summary */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-gray-900">Payment Summary</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Amount</span>
                  <span className="font-bold text-gray-900">{booking.totalAmount.toLocaleString('en-AE')} AED</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Advance Paid</span>
                  <span className="font-medium text-green-600">{booking.advanceAmount.toLocaleString('en-AE')} AED</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Balance Due</span>
                  <span className="font-medium">{booking.balanceAmount.toLocaleString('en-AE')} AED</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* What's Next */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8">
          <h3 className="font-bold text-amber-800 mb-3">What's Next?</h3>
          <ul className="space-y-3 text-sm text-amber-700">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
              <span>Our team will contact you within 24 hours to confirm your booking.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
              <span>A booking confirmation email will be sent to your email address.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
              <span>Have questions? Call us at +971 50 000 0000</span>
            </li>
          </ul>
        </div>

        {/* Actions */}
        <div className="text-center space-y-3">
          <Link to="/vehicles" className="btn-primary inline-block">
            Browse More Cars
          </Link>
          <div>
            <a 
              href="tel:+971500000000" 
              className="inline-flex items-center gap-2 text-primary hover:text-primary-dark transition-colors"
            >
              <Phone className="w-4 h-4" />
              Need Help? Call Us
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}