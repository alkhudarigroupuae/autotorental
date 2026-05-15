import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { BOOKING_MODULE } from "../../../modules/booking"
import { VEHICLE_MODULE } from "../../../modules/vehicle"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const bookingService = req.scope.resolve(BOOKING_MODULE)
  const vehicleService = req.scope.resolve(VEHICLE_MODULE)

  const filter: Record<string, unknown> = {}
  if (req.query.status) filter.status = req.query.status
  if (req.query.vendor_id) filter.vendor_id = req.query.vendor_id
  if (req.query.vehicle_id) filter.vehicle_id = req.query.vehicle_id

  const [bookings, count] = await (bookingService.listAndCountBookings as any)(
    filter,
    {
      skip: parseInt(req.query.offset as string) || 0,
      take: parseInt(req.query.limit as string) || 50,
      order: { created_at: "DESC" },
    }
  )

  const vehicleIds = [...new Set(bookings.map((b: any) => b.vehicle_id).filter(Boolean))]
  let vehicleMap = new Map()
  if (vehicleIds.length > 0) {
    const [vehicles] = await (vehicleService.listAndCountVehicles as any)(
      { id: vehicleIds },
      { take: vehicleIds.length }
    )
    vehicleMap = new Map(vehicles.map((v: any) => [v.id, v]))
  }

  const enriched = bookings.map((b: any) => ({
    ...b,
    quoted_total: Number(b.quoted_total),
    vehicle: vehicleMap.get(b.vehicle_id) || null,
  }))

  res.json({ bookings: enriched, count })
}
