import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { BOOKING_MODULE } from "../../../modules/booking"
import { VEHICLE_MODULE } from "../../../modules/vehicle"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const bookingService = req.scope.resolve(BOOKING_MODULE)
  const vehicleService = req.scope.resolve(VEHICLE_MODULE)

  const filter: Record<string, unknown> = {}

  const status = req.query.status as string | undefined
  if (status) filter.status = status

  const vendor_id = req.query.vendor_id as string | undefined
  if (vendor_id) filter.vendor_id = vendor_id

  const [bookings, count] = await (bookingService.listAndCountBookings as any)(
    filter,
    {
      skip: parseInt(req.query.offset as string) || 0,
      take: parseInt(req.query.limit as string) || 20,
      order: { created_at: "DESC" },
    }
  )

  const vehicleIds = [...new Set(bookings.map((b: any) => b.vehicle_id))]
  const vehicles = vehicleIds.length
    ? await (vehicleService.listVehicles as any)(
        { id: vehicleIds },
        { take: vehicleIds.length }
      )
    : []

  const vehicleMap = new Map(vehicles.map((v: any) => [v.id, v]))

  const enriched = bookings.map((b: any) => ({
    ...b,
    vehicle: vehicleMap.get(b.vehicle_id) || null,
  }))

  res.json({ bookings: enriched, count })
}
