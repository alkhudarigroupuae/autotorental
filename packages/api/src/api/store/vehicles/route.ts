import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { VEHICLE_MODULE } from "../../../modules/vehicle"
import { RENTAL_MODULE } from "../../../modules/rental"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const vehicleService = req.scope.resolve(VEHICLE_MODULE)
  const rentalService = req.scope.resolve(RENTAL_MODULE)

  const filter: Record<string, unknown> = { status: "published" }

  if (req.query.make) filter.make = req.query.make
  if (req.query.model_name) filter.model_name = req.query.model_name
  if (req.query.category_id) filter.category_id = req.query.category_id
  if (req.query.transmission) filter.transmission = req.query.transmission
  if (req.query.fuel_type) filter.fuel_type = req.query.fuel_type
  if (req.query.seats) filter.seats = parseInt(req.query.seats as string)
  if (req.query.city) filter.city = req.query.city

  if (req.query.search) {
    const term = `%${req.query.search}%`
    filter.$or = [
      { make: { $like: term } },
      { model_name: { $like: term } },
    ]
  }

  const minPrice = req.query.min_price
    ? parseFloat(req.query.min_price as string)
    : undefined
  const maxPrice = req.query.max_price
    ? parseFloat(req.query.max_price as string)
    : undefined

  if (minPrice !== undefined || maxPrice !== undefined) {
    const rateFilter: Record<string, unknown> = {}
    if (minPrice !== undefined) rateFilter.daily_rate = { $gte: minPrice }
    if (maxPrice !== undefined) rateFilter.daily_rate = { $lte: maxPrice }

    const [rates] = await (rentalService.listRentalRates as any)(
      rateFilter,
      { take: 10000 }
    )

    const vehicleIds = [...new Set(rates.map((r: any) => r.vehicle_id))]

    if (vehicleIds.length === 0) {
      res.json({ vehicles: [], count: 0 })
      return
    }

    filter.id = vehicleIds
  }

  const [vehicles, count] = await (vehicleService.listAndCountVehicles as any)(
    filter,
    {
      skip: parseInt(req.query.offset as string) || 0,
      take: parseInt(req.query.limit as string) || 20,
      order: { created_at: "DESC" },
    }
  )

  const categoryIds = [
    ...new Set(vehicles.map((v: any) => v.category_id).filter(Boolean)),
  ]
  let categoryMap = new Map()
  if (categoryIds.length > 0) {
    const [categories] = await (vehicleService.listAndCountVehicleCategories as any)(
      { id: categoryIds },
      { take: categoryIds.length }
    )
    categoryMap = new Map(categories.map((c: any) => [c.id, c]))
  }

  const enriched = vehicles.map((v: any) => ({
    ...v,
    category: v.category_id ? categoryMap.get(v.category_id) || null : null,
    first_photo:
      Array.isArray(v.photos) && v.photos.length > 0 ? v.photos[0] : null,
  }))

  const vehicleIds = vehicles.map((v: any) => v.id)
  let rateMap = new Map()
  if (vehicleIds.length > 0) {
    const [allRates, rateCount] = await (rentalService.listAndCountRentalRates as any)(
      { vehicle_id: vehicleIds },
      { take: vehicleIds.length }
    )
    for (const r of (allRates || []) as any[]) {
      if (!rateMap.has(r.vehicle_id)) {
        rateMap.set(r.vehicle_id, r)
      }
    }
  }

  const withRates = enriched.map((v: any) => {
    const rate = rateMap.get(v.id)
    return {
      ...v,
      daily_rate: rate?.daily_rate ? Number(rate.daily_rate) : null,
      weekly_rate: rate?.weekly_rate ? Number(rate.weekly_rate) : null,
      monthly_rate: rate?.monthly_rate ? Number(rate.monthly_rate) : null,
    }
  })

  res.json({ vehicles: withRates, count })
}
