import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Users, Fuel, Gauge, Check } from 'lucide-react'
import type { Vehicle } from '@/lib/api'

interface VehicleCardProps {
  vehicle: Vehicle
}

export default function VehicleCard({ vehicle }: VehicleCardProps) {
  const [imgError, setImgError] = useState(false)
  const primaryImage = vehicle.images?.find((img) => img.isPrimary)?.url || vehicle.images?.[0]?.url

  // Calculate discount if weekly/monthly rates are better
  const hasDiscount = vehicle.weeklyRate && vehicle.weeklyRate < vehicle.dailyRate * 7

  return (
    <Link 
      to={`/vehicles/${vehicle.id}`}
      className="group block bg-dark-card rounded-xl border border-gray-800 overflow-hidden transition-all duration-300 hover:border-gray-700 hover:shadow-xl hover:-translate-y-1"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-dark-lighter">
        {primaryImage && !imgError ? (
          <img
            src={primaryImage}
            alt={`${vehicle.make} ${vehicle.model}`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-dark-lighter to-dark">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-primary/20 flex items-center justify-center">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <span className="text-gray-500 text-sm">{vehicle.make}</span>
            </div>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          {hasDiscount && (
            <span className="px-2 py-1 bg-red-500 text-white text-xs font-semibold rounded">
              Special Offer
            </span>
          )}
          {vehicle.category === 'luxury' && (
            <span className="px-2 py-1 bg-gradient-to-r from-yellow-500 to-amber-500 text-white text-xs font-semibold rounded">
              Luxury
            </span>
          )}
        </div>

        {/* Availability Badge */}
        <div className="absolute top-3 right-3">
          <span className={`px-2 py-1 text-xs font-medium rounded ${
            vehicle.available 
              ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
              : 'bg-red-500/20 text-red-400 border border-red-500/30'
          }`}>
            {vehicle.available ? 'Available' : 'Booked'}
          </span>
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-dark-card via-transparent to-transparent opacity-60" />
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title & Location */}
        <div className="mb-3">
          <div className="flex items-start justify-between">
            <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">
              {vehicle.make} {vehicle.model}
            </h3>
            <span className="text-gray-500 text-sm">{vehicle.year}</span>
          </div>
          <div className="flex items-center text-gray-500 text-sm mt-1">
            <MapPin className="w-4 h-4 mr-1" />
            {vehicle.city || 'Dubai'}
          </div>
        </div>

        {/* Specs */}
        <div className="flex items-center gap-4 mb-4 text-sm text-gray-400">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{vehicle.seats}</span>
          </div>
          <div className="flex items-center gap-1">
            <Gauge className="w-4 h-4" />
            <span>{vehicle.transmission === 'automatic' ? 'Auto' : 'Manual'}</span>
          </div>
          <div className="flex items-center gap-1">
            <Fuel className="w-4 h-4" />
            <span className="capitalize">{vehicle.fuelType}</span>
          </div>
        </div>

        {/* Features */}
        {vehicle.features && vehicle.features.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {vehicle.features.slice(0, 3).map((feature, idx) => (
              <span 
                key={idx}
                className="inline-flex items-center px-2 py-0.5 bg-dark-lighter text-gray-400 text-xs rounded"
              >
                <Check className="w-3 h-3 mr-1 text-primary" />
                {feature.name || feature}
              </span>
            ))}
            {vehicle.features.length > 3 && (
              <span className="text-gray-500 text-xs">+{vehicle.features.length - 3}</span>
            )}
          </div>
        )}

        {/* Pricing */}
        <div className="border-t border-gray-800 pt-4">
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-2xl font-bold text-white">
                AED {vehicle.dailyRate.toLocaleString()}
              </span>
              <span className="text-gray-500 text-sm"> / day</span>
            </div>
            {vehicle.deposit > 0 && (
              <span className="text-xs text-gray-500">
                Deposit: AED {vehicle.deposit.toLocaleString()}
              </span>
            )}
          </div>
          
          {/* Weekly/Monthly Rates */}
          {(vehicle.weeklyRate || vehicle.monthlyRate) && (
            <div className="flex gap-4 mt-2 text-xs text-gray-500">
              {vehicle.weeklyRate && (
                <span>AED {vehicle.weeklyRate.toLocaleString()} / week</span>
              )}
              {vehicle.monthlyRate && (
                <span>AED {vehicle.monthlyRate.toLocaleString()} / month</span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}