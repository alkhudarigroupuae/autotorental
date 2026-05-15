import { useState, useEffect } from 'react'
import { calculateQuote, type QuoteResponse, type QuoteRequest } from '@/lib/api'

interface Props {
  vehicleId: string
  dailyRate: number
  onBook: (quote: QuoteResponse, pickupDate: string, returnDate: string, addons: QuoteRequest['addons']) => void
}

const ADDON_PRICES: Record<string, number> = {
  delivery: 150,
  additionalDriver: 100,
  childSeat: 50,
}

const addonLabels: Record<string, string> = {
  delivery: 'Vehicle Delivery',
  additionalDriver: 'Additional Driver',
  childSeat: 'Child Seat',
}

export default function QuoteCalculator({ vehicleId, dailyRate, onBook }: Props) {
  const [pickupDate, setPickupDate] = useState('')
  const [returnDate, setReturnDate] = useState('')
  const [addons, setAddons] = useState({ delivery: false, additionalDriver: false, childSeat: false })
  const [quote, setQuote] = useState<QuoteResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const today = new Date().toISOString().split('T')[0]

  useEffect(() => {
    if (pickupDate && returnDate) {
      setQuote(null)
      setError('')
    }
  }, [pickupDate, returnDate])

  const handleCalculate = async () => {
    if (!pickupDate || !returnDate) {
      setError('Please select pickup and return dates')
      return
    }
    if (returnDate <= pickupDate) {
      setError('Return date must be after pickup date')
      return
    }
    setLoading(true)
    setError('')
    try {
      const body: QuoteRequest = {
        pickupDate,
        returnDate,
        addons,
      }
      const result = await calculateQuote(vehicleId, body)
      setQuote(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error calculating price')
    } finally {
      setLoading(false)
    }
  }

  const handleBook = () => {
    if (quote) {
      onBook(quote, pickupDate, returnDate, addons)
    }
  }

  const toggleAddon = (key: keyof typeof addons) => {
    setAddons((prev) => ({ ...prev, [key]: !prev[key] }))
    setQuote(null)
  }

  return (
    <div className="bg-gray-50 rounded-xl p-6">
      <h3 className="font-bold text-xl mb-6">Calculate Price</h3>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Date</label>
          <input
            type="date"
            value={pickupDate}
            min={today}
            onChange={(e) => setPickupDate(e.target.value)}
            className="input-field"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Return Date</label>
          <input
            type="date"
            value={returnDate}
            min={pickupDate || today}
            onChange={(e) => setReturnDate(e.target.value)}
            className="input-field"
          />
        </div>
      </div>

      <div className="mb-6">
        <h4 className="font-semibold text-gray-800 mb-3">Optional Add-ons</h4>
        <div className="space-y-3">
          {Object.entries(addonLabels).map(([key, label]) => {
            const k = key as keyof typeof addons
            return (
              <label key={key} className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={addons[k]}
                    onChange={() => toggleAddon(k)}
                    className="w-5 h-5 accent-blue rounded"
                  />
                  <span className="text-sm text-gray-700">{label}</span>
                </div>
                <span className="text-sm text-gray-500">{ADDON_PRICES[key]} AED / day</span>
              </label>
            )
          })}
        </div>
      </div>

      <button
        onClick={handleCalculate}
        disabled={loading}
        className="btn-primary w-full mb-4 disabled:opacity-50"
      >
        {loading ? 'Calculating...' : 'Calculate Price'}
      </button>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      {quote && (
        <div className="bg-white rounded-lg p-4 space-y-3 border border-gray-200">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Duration</span>
            <span className="font-medium">{quote.days} days</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Base Price ({dailyRate.toLocaleString('en-AE')} AED/day)</span>
            <span className="font-medium">{quote.baseAmount.toLocaleString('en-AE')} AED</span>
          </div>
          {quote.addonsAmount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Add-ons</span>
              <span className="font-medium">+ {quote.addonsAmount.toLocaleString('en-AE')} AED</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">VAT (5%)</span>
            <span className="font-medium">{quote.vat.toLocaleString('en-AE')} AED</span>
          </div>
          <div className="border-t border-gray-200 pt-2 flex justify-between font-bold">
            <span>Total</span>
            <span className="text-blue text-lg">{quote.grandTotal.toLocaleString('en-AE')} AED</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Advance Payment (20%)</span>
            <span className="font-medium">{quote.advance.toLocaleString('en-AE')} AED</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Balance Due</span>
            <span className="font-medium">{quote.balance.toLocaleString('en-AE')} AED</span>
          </div>

          <button onClick={handleBook} className="btn-secondary w-full mt-2">
            Book Now
          </button>
        </div>
      )}
    </div>
  )
}
