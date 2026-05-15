import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { fetchBooking, type Booking } from '@/lib/api'
import LoadingSpinner from '@/components/LoadingSpinner'

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

  if (loading) return <LoadingSpinner />
  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-red-500 text-xl mb-4">{error}</p>
        <Link to="/" className="btn-outline">
          Back to Home
        </Link>
      </div>
    )
  }
  if (!booking) return null

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-dark mb-2">Request Received</h1>
        <p className="text-gray-500">Thank you! We will contact you soon to confirm the booking.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <span className="text-gray-500 text-sm">Booking ID</span>
            <p className="font-bold text-dark text-lg font-mono" dir="ltr">#{booking.id}</p>
          </div>
          <div>
            <span className="text-gray-500 text-sm">Status</span>
            <p className="font-bold">
              <span className="bg-yellow-100 text-yellow-800 badge">Enquiry</span>
            </p>
          </div>
        </div>

        {booking.vehicle && (
          <div className="border-t border-gray-100 pt-4 mb-4">
            <span className="text-gray-500 text-sm">Vehicle</span>
            <p className="font-semibold text-dark">
              {booking.vehicle.make} {booking.vehicle.model} {booking.vehicle.year}
            </p>
          </div>
        )}

        <div className="border-t border-gray-100 pt-4 mb-4">
          <span className="text-gray-500 text-sm">Duration</span>
          <p className="font-semibold text-dark">
            From {booking.pickupDate} to {booking.returnDate}
          </p>
        </div>

        <div className="border-t border-gray-100 pt-4 mb-4">
          <span className="text-gray-500 text-sm">Customer</span>
          <p className="font-semibold text-dark">{booking.customerName}</p>
          <p className="text-gray-500 text-sm" dir="ltr">{booking.customerPhone}</p>
          {booking.customerEmail && <p className="text-gray-500 text-sm">{booking.customerEmail}</p>}
        </div>

        <div className="border-t border-gray-100 pt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Grand Total</span>
            <span className="font-bold text-blue">{booking.totalAmount.toLocaleString('en-AE')} AED</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Advance Payment</span>
            <span className="font-medium">{booking.advanceAmount.toLocaleString('en-AE')} AED</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Balance Due</span>
            <span className="font-medium">{booking.balanceAmount.toLocaleString('en-AE')} AED</span>
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8">
        <h3 className="font-bold text-yellow-800 mb-2">What's Next?</h3>
        <ul className="text-sm text-yellow-700 space-y-2">
          <li>• Our team will contact you within 24 hours to confirm the booking.</li>
          <li>• A booking confirmation and invoice will be sent to your email.</li>
          <li>• You can call us at +971 50 000 0000 for any inquiries.</li>
        </ul>
      </div>

      <div className="text-center">
        <Link to="/" className="btn-primary">
          Back to Home
        </Link>
      </div>
    </div>
  )
}
