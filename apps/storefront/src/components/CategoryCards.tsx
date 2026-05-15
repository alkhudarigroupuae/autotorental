import { Link } from 'react-router-dom'
import { Crown, Gauge, Truck, RotateCcw, Car, Battery, Zap, Gem } from 'lucide-react'

const categories = [
  { id: 'luxury', name: 'Luxury', icon: Crown, count: '576 Cars', color: 'bg-amber-100 text-amber-700' },
  { id: 'sports', name: 'Sports', icon: Gauge, count: '133 Cars', color: 'bg-red-100 text-red-700' },
  { id: 'suv', name: 'SUV', icon: Truck, count: '611 Cars', color: 'bg-blue-100 text-blue-700' },
  { id: 'monthly', name: 'Monthly', icon: RotateCcw, count: '1238 Cars', color: 'bg-green-100 text-green-700' },
  { id: 'economy', name: 'Economy', icon: Car, count: '355 Cars', color: 'bg-gray-100 text-gray-700' },
  { id: 'electric', name: 'Electric', icon: Battery, count: '16 Cars', color: 'bg-emerald-100 text-emerald-700' },
  { id: 'convertible', name: 'Convertible', icon: Zap, count: '108 Cars', color: 'bg-purple-100 text-purple-700' },
  { id: 'supercar', name: 'Supercar', icon: Gem, count: '58 Cars', color: 'bg-pink-100 text-pink-700' },
]

export default function CategoryCards() {
  return (
    <section className="py-12 bg-white">
      <div className="container-custom">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Browse by Category
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <Link
                key={category.id}
                to={`/vehicles?category=${category.id}`}
                className="group flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 transition-all duration-200 hover:shadow-md hover:border-gray-300"
              >
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${category.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-xs text-gray-500">{category.count}</p>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}