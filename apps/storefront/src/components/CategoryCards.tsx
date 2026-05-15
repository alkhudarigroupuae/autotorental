import { Link } from 'react-router-dom'
import { Car, Crown, Zap, Truck, Gauge, RotateCcw, Diamond, Battery } from 'lucide-react'

const categories = [
  {
    id: 'luxury',
    name: 'Luxury',
    icon: Crown,
    count: '576 Cars',
    gradient: 'from-yellow-500/20 to-orange-500/20',
    iconColor: 'text-yellow-500',
  },
  {
    id: 'sports',
    name: 'Sports',
    icon: Gauge,
    count: '133 Cars',
    gradient: 'from-red-500/20 to-pink-500/20',
    iconColor: 'text-red-500',
  },
  {
    id: 'suv',
    name: 'SUV',
    icon: Truck,
    count: '611 Cars',
    gradient: 'from-blue-500/20 to-cyan-500/20',
    iconColor: 'text-blue-500',
  },
  {
    id: 'monthly',
    name: 'Monthly',
    icon: RotateCcw,
    count: '1238 Cars',
    gradient: 'from-green-500/20 to-emerald-500/20',
    iconColor: 'text-green-500',
  },
  {
    id: 'economy',
    name: 'Economy',
    icon: Car,
    count: '355 Cars',
    gradient: 'from-gray-500/20 to-slate-500/20',
    iconColor: 'text-gray-400',
  },
  {
    id: 'electric',
    name: 'Electric',
    icon: Battery,
    count: '16 Cars',
    gradient: 'from-emerald-500/20 to-teal-500/20',
    iconColor: 'text-emerald-500',
  },
  {
    id: 'convertible',
    name: 'Convertible',
    icon: Zap,
    count: '108 Cars',
    gradient: 'from-purple-500/20 to-violet-500/20',
    iconColor: 'text-purple-500',
  },
  {
    id: 'supercar',
    name: 'Supercar',
    icon: Diamond,
    count: '58 Cars',
    gradient: 'from-amber-500/20 to-yellow-500/20',
    iconColor: 'text-amber-500',
  },
]

export default function CategoryCards() {
  return (
    <section className="py-16 bg-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-white mb-8">
          Browse by Category
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <Link
                key={category.id}
                to={`/vehicles?category=${category.id}`}
                className="group relative overflow-hidden rounded-xl bg-dark-lighter border border-gray-800 p-6 transition-all duration-300 hover:border-gray-700 hover:shadow-lg"
              >
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                
                {/* Content */}
                <div className="relative z-10">
                  <div className={`w-12 h-12 rounded-lg bg-dark-card flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`w-6 h-6 ${category.iconColor}`} />
                  </div>
                  
                  <h3 className="text-lg font-semibold text-white mb-1">
                    {category.name}
                  </h3>
                  
                  <p className="text-sm text-gray-500">
                    Rent {category.name}
                  </p>
                  
                  <p className="text-xs text-gray-600 mt-2">
                    {category.count}
                  </p>
                </div>

                {/* Hover Arrow */}
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}