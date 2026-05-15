import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { VEHICLE_MODULE } from "../../../modules/vehicle"
import { RENTAL_MODULE } from "../../../modules/rental"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const vehicleService = req.scope.resolve(VEHICLE_MODULE)
  const rentalService = req.scope.resolve(RENTAL_MODULE)

  const filter: Record<string, unknown> = {}
  if (req.query.status) filter.status = req.query.status
  if (req.query.seller_id) filter.seller_id = req.query.seller_id
  if (req.query.search) {
    const term = `%${req.query.search}%`
    filter.$or = [
      { make: { $like: term } },
      { model_name: { $like: term } },
      { plate_number: { $like: term } },
    ]
  }

  const [vehicles, count] = await (vehicleService.listAndCountVehicles as any)(
    filter,
    {
      skip: parseInt(req.query.offset as string) || 0,
      take: parseInt(req.query.limit as string) || 50,
      order: { created_at: "DESC" },
    }
  )

  const vehicleIds = vehicles.map((v: any) => v.id)
  let rateMap = new Map()
  if (vehicleIds.length > 0) {
    const [allRates] = await (rentalService.listAndCountRentalRates as any)(
      { vehicle_id: vehicleIds },
      { take: vehicleIds.length }
    )
    for (const r of (allRates || []) as any[]) {
      if (!rateMap.has(r.vehicle_id)) {
        rateMap.set(r.vehicle_id, r)
      }
    }
  }

  const enriched = vehicles.map((v: any) => {
    const rate = rateMap.get(v.id)
    return {
      ...v,
      daily_rate: rate?.daily_rate ? Number(rate.daily_rate) : null,
    }
  })

  res.json({ vehicles: enriched, count })
}
