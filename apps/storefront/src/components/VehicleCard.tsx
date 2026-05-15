import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Users, Fuel, Gauge } from 'lucide-react'
import type { Vehicle } from '@/lib/api'

interface VehicleCardProps {
  vehicle: Vehicle
}

export default function VehicleCard({ vehicle }: VehicleCardProps) {
  const [imgError, setImgError] = useState(false)
  const primaryImage = vehicle.images?.find((img) => img.isPrimary)?.url || vehicle.images?.[0]?.url

  return (
    <Link 
      to={`/vehicles/${vehicle.id}`}
      className="group block bg-white rounded-xl border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-card-hover hover:border-gray-300"
    >
      {/* Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
        {primaryImage && !imgError ? (
          <img
            src={primaryImage}
            alt={`${vehicle.make} ${vehicle.model}`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-2xl">🚗</span>
              </div>
              <span className="text-gray-400 text-sm">{vehicle.make}</span>
            </div>
          </div>
        )}

        {/* Category Badge */}
        {vehicle.category && (
          <div className="absolute top-3 left-3">
            <span className="badge-primary">
              {vehicle.category.charAt(0).toUpperCase() + vehicle.category.slice(1)}
            </span>
          </div>
        )}

        {/* Availability Badge */}
        <div className="absolute top-3 right-3">
          <span className={`badge ${
            vehicle.available 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {vehicle.available ? 'Available' : 'Booked'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <div className="mb-3">
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors">
            {vehicle.make} {vehicle.model}
          </h3>
          <div className="flex items-center text-gray-500 text-sm mt-1">
            <MapPin className="w-3.5 h-3.5 mr-1" />
            {vehicle.city || 'Dubai'} • {vehicle.year}
          </div>
        </div>

        {/* Specs */}
        <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4 text-gray-400" />
            <span>{vehicle.seats} Seats</span>
          </div>
          <div className="flex items-center gap-1">
            <Gauge className="w-4 h-4 text-gray-400" />
            <span>{vehicle.transmission === 'automatic' ? 'Auto' : 'Manual'}</span>
          </div>
          <div className="flex items-center gap-1">
            <Fuel className="w-4 h-4 text-gray-400" />
            <span className="capitalize">{vehicle.fuelType}</span>
          </div>
        </div>

        {/* Pricing */}
        <div className="border-t border-gray-100 pt-4">
          <div className="flex items-baseline justify-between">
            <div>
              <span className="price-large text-primary">
                AED {vehicle.dailyRate.toLocaleString()}
              </span>
              <span className="text-gray-500 text-sm"> / day</span>
            </div>
            {vehicle.deposit > 0 && (
              <span className="text-xs text-gray-500">
                Deposit: {vehicle.deposit.toLocaleString()} AED
              </span>
            )}
          </div>
          
          {/* Weekly/Monthly Rates */}
          <div className="flex gap-4 mt-2 text-xs text-gray-500">
            {vehicle.weeklyRate && (
              <span>{vehicle.weeklyRate.toLocaleString()} AED / week</span>
            )}
            {vehicle.monthlyRate && (
              <span>{vehicle.monthlyRate.toLocaleString()} AED / month</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}