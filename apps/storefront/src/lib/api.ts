const BASE_URL = '/store'
const PUBLISHABLE_API_KEY = 'pk_0c019faac611c2ea7d9a522104795240e54178f37a8403bc389df6d74949fae0'

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${url}`, {
    headers: { 'Content-Type': 'application/json', 'x-publishable-api-key': PUBLISHABLE_API_KEY, ...options?.headers },
    ...options,
  })
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }))
    throw new Error(error.message || `Request failed with status ${res.status}`)
  }
  return res.json()
}

export interface VehicleFilters {
  search?: string
  category?: string
  transmission?: string
  fuelType?: string
  seatsMin?: number
  seatsMax?: number
  priceMin?: number
  priceMax?: number
  city?: string
  page?: number
  limit?: number
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface Vehicle {
  id: string
  make: string
  model: string
  year: number
  category: string
  transmission: string
  fuelType: string
  seats: number
  doors: number
  color: string
  plateNumber: string
  dailyRate: number
  weeklyRate: number
  monthlyRate: number
  deposit: number
  minAge: number
  insurance: string
  fuelPolicy: string
  mileageLimit: string
  city: string
  features: { id: string; name: string; category: string }[]
  images: { id: string; url: string; isPrimary: boolean }[]
  terms: string
  available: boolean
  createdAt: string
  updatedAt: string
}

export interface QuoteRequest {
  pickupDate: string
  returnDate: string
  addons?: { delivery?: boolean; additionalDriver?: boolean; childSeat?: boolean }
}

export interface QuoteResponse {
  baseAmount: number
  addonsAmount: number
  addons: { delivery?: number; additionalDriver?: number; childSeat?: number }
  vat: number
  grandTotal: number
  advance: number
  balance: number
  days: number
}

export interface CreateBookingBody {
  vehicleId: string
  pickupDate: string
  returnDate: string
  customerName: string
  customerPhone: string
  customerEmail: string
  notes?: string
  addons?: { delivery?: boolean; additionalDriver?: boolean; childSeat?: boolean }
  totalAmount: number
  advanceAmount: number
  balanceAmount: number
}

export interface Booking {
  id: string
  vehicleId: string
  vehicle?: Vehicle
  pickupDate: string
  returnDate: string
  customerName: string
  customerPhone: string
  customerEmail: string
  notes?: string
  addons?: { delivery?: boolean; additionalDriver?: boolean; childSeat?: boolean }
  totalAmount: number
  advanceAmount: number
  balanceAmount: number
  status: string
  createdAt: string
  updatedAt: string
}

function mapVehicle(v: any): Vehicle {
  const categoryName = v.category?.name || v.category || ''
  return {
    id: v.id,
    make: v.make,
    model: v.model_name || '',
    year: v.year,
    category: categoryName.toLowerCase(),
    transmission: v.transmission || 'automatic',
    fuelType: v.fuel_type || 'petrol',
    seats: v.seats || 5,
    doors: v.doors || 4,
    color: v.color || '',
    plateNumber: v.plate_number || '',
    dailyRate: Number(v.daily_rate) || 0,
    weeklyRate: Number(v.weekly_rate) || 0,
    monthlyRate: Number(v.monthly_rate) || 0,
    deposit: Number(v.security_deposit) || 0,
    minAge: v.min_driver_age || 21,
    insurance: v.insurance_level === 'full' ? 'Full' : 'Basic',
    fuelPolicy: v.fuel_policy || 'full_to_full',
    mileageLimit: v.mileage_limit || 'Unlimited',
    city: v.city || '',
    features: v.features || [],
    images: (v.photos || []).map((url: string, i: number) => ({ id: String(i), url, isPrimary: i === 0 })),
    terms: v.description || '',
    available: v.status === 'published',
    createdAt: v.created_at || '',
    updatedAt: v.updated_at || '',
  }
}

export async function fetchVehicles(params?: VehicleFilters): Promise<PaginatedResponse<Vehicle>> {
  const query = new URLSearchParams()
  if (params) {
    if (params.search) query.set('search', params.search)
    if (params.category) query.set('category_id', params.category)
    if (params.transmission) query.set('transmission', params.transmission)
    if (params.fuelType) query.set('fuel_type', params.fuelType)
    if (params.seatsMin) query.set('seats', String(params.seatsMin))
    if (params.priceMin) query.set('min_price', String(params.priceMin))
    if (params.priceMax) query.set('max_price', String(params.priceMax))
    if (params.city) query.set('city', params.city)
    query.set('offset', String(((params.page || 1) - 1) * (params.limit || 12)))
    query.set('limit', String(params.limit || 12))
  }
  const qs = query.toString()
  const result = await request<any>(`/vehicles${qs ? `?${qs}` : ''}`)
  const data = (result.vehicles || []).map(mapVehicle)
  const total = result.count || 0
  const limit = params?.limit || 12
  return {
    data,
    total,
    page: params?.page || 1,
    limit,
    totalPages: Math.ceil(total / limit),
  }
}

export async function fetchVehicle(id: string): Promise<Vehicle> {
  const result = await request<any>(`/vehicles/${id}`)
  const vehicle = result.vehicle || result
  const rates = Array.isArray(result.rates) ? result.rates[0] : result.rates
  const terms = Array.isArray(result.terms) ? result.terms[0] : result.terms

  let enriched = mapVehicle(vehicle)
  if (result.features && Array.isArray(result.features)) {
    enriched.features = result.features
  }
  if (rates) {
    enriched.dailyRate = Number(rates.daily_rate) || 0
    enriched.weeklyRate = Number(rates.weekly_rate) || 0
    enriched.monthlyRate = Number(rates.monthly_rate) || 0
  }
  if (terms) {
    enriched.deposit = Number(terms.security_deposit) || 0
    enriched.minAge = terms.min_driver_age || 21
    enriched.insurance = terms.insurance_level === 'full' ? 'Full' : 'Basic'
    enriched.fuelPolicy = terms.fuel_policy || 'full_to_full'
  }
  return enriched
}

export async function calculateQuote(vehicleId: string, body: QuoteRequest): Promise<QuoteResponse> {
  const addons: any[] = []
  if (body.addons?.delivery) addons.push({ type: 'delivery', quantity: 1 })
  if (body.addons?.additionalDriver) addons.push({ type: 'additional_driver', quantity: 1 })
  if (body.addons?.childSeat) addons.push({ type: 'child_seat', quantity: 1 })

  const result = await request<any>(`/vehicles/${vehicleId}/quote`, {
    method: 'POST',
    body: JSON.stringify({
      pickup_date: body.pickupDate,
      return_date: body.returnDate,
      addons: addons.length > 0 ? addons : undefined,
    }),
  })

  return {
    baseAmount: result.base_amount || 0,
    addonsAmount: result.addons_total || 0,
    addons: { delivery: 0, additionalDriver: 0, childSeat: 0 },
    vat: result.vat_amount || 0,
    grandTotal: result.grand_total || 0,
    advance: result.advance_amount || 0,
    balance: result.balance_amount || 0,
    days: result.total_days || 0,
  }
}

export async function createBooking(body: CreateBookingBody): Promise<Booking> {
  const addons: any[] = []
  if (body.addons?.delivery) addons.push({ type: 'delivery', quantity: 1 })
  if (body.addons?.additionalDriver) addons.push({ type: 'additional_driver', quantity: 1 })
  if (body.addons?.childSeat) addons.push({ type: 'child_seat', quantity: 1 })

  const payload: Record<string, any> = {
    vehicle_id: body.vehicleId,
    pickup_date: body.pickupDate,
    return_date: body.returnDate,
    customer_name: body.customerName,
    customer_phone: body.customerPhone,
    customer_email: body.customerEmail,
  }
  if (body.notes) payload.notes = body.notes
  if (addons.length > 0) payload.addons = addons

  const result = await request<any>('/bookings', {
    method: 'POST',
    body: JSON.stringify(payload),
  })

  const booking = result.booking || result
  return {
    id: booking.id,
    vehicleId: booking.vehicle_id || '',
    pickupDate: booking.pickup_date || '',
    returnDate: booking.return_date || '',
    customerName: booking.customer_name || '',
    customerPhone: booking.customer_phone || '',
    customerEmail: booking.customer_email || '',
    notes: booking.notes,
    totalAmount: Number(booking.total_amount) || 0,
    advanceAmount: Number(booking.advance_amount) || 0,
    balanceAmount: Number(booking.balance_amount) || 0,
    status: booking.status || 'enquiry',
    createdAt: booking.created_at || '',
    updatedAt: booking.updated_at || '',
  }
}

export async function fetchBooking(id: string): Promise<Booking> {
  const result = await request<any>(`/bookings/${id}`)
  const booking = result.booking || result
  return {
    id: booking.id,
    vehicleId: booking.vehicle_id || '',
    vehicle: booking.vehicle ? mapVehicle(booking.vehicle) : undefined,
    pickupDate: booking.pickup_date || '',
    returnDate: booking.return_date || '',
    customerName: booking.customer_name || '',
    customerPhone: booking.customer_phone || '',
    customerEmail: booking.customer_email || '',
    notes: booking.notes,
    totalAmount: Number(booking.total_amount) || 0,
    advanceAmount: Number(booking.advance_amount) || 0,
    balanceAmount: Number(booking.balance_amount) || 0,
    status: booking.status || 'enquiry',
    createdAt: booking.created_at || '',
    updatedAt: booking.updated_at || '',
  }
}
