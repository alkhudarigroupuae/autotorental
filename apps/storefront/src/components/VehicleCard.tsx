import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { Vehicle } from '@/lib/api'

interface Props {
  vehicle: Vehicle
}

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

export default function VehicleCard({ vehicle }: Props) {
  const [imgError, setImgError] = useState(false)
  const primaryImage = vehicle.images?.find((img) => img.isPrimary)?.url || vehicle.images?.[0]?.url || '/placeholder-car.svg'

  return (
    <Link to={`/vehicles/${vehicle.id}`} className="card group">
      <div className="relative h-48 overflow-hidden bg-gray-100">
        <img
          src={imgError ? '/placeholder-car.svg' : primaryImage}
          alt={`${vehicle.make} ${vehicle.model} ${vehicle.year}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          onError={() => setImgError(true)}
        />
        {!vehicle.available && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-bold text-lg">Unavailable</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg mb-1">{vehicle.make} {vehicle.model}</h3>
        <p className="text-gray-500 text-sm mb-3">{vehicle.year} | {vehicle.city}</p>

        <div className="flex flex-wrap gap-2 mb-3">
          <span className="badge bg-gray-100 text-gray-700 text-xs">
            {transmissionLabels[vehicle.transmission] || vehicle.transmission}
          </span>
          <span className="badge bg-gray-100 text-gray-700 text-xs">
            {fuelLabels[vehicle.fuelType] || vehicle.fuelType}
          </span>
          <span className="badge bg-gray-100 text-gray-700 text-xs">
            {vehicle.seats} seats
          </span>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div>
            <span className="text-blue font-bold text-xl">{vehicle.dailyRate.toLocaleString('en-AE')}</span>
            <span className="text-gray-500 text-sm ml-1">AED / day</span>
          </div>
          <span className="text-dark text-sm font-medium hover:text-blue transition-colors">
            View Details →
          </span>
        </div>
      </div>
    </Link>
  )
}
