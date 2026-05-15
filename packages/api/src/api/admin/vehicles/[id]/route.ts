import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { VEHICLE_MODULE } from "../../../../modules/vehicle"
import { RENTAL_MODULE } from "../../../../modules/rental"
import { BOOKING_MODULE } from "../../../../modules/booking"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const vehicleService = req.scope.resolve(VEHICLE_MODULE)
  const rentalService = req.scope.resolve(RENTAL_MODULE)
  const bookingService = req.scope.resolve(BOOKING_MODULE)

  const vehicle = await vehicleService.retrieveVehicle(req.params.id)

  let category = null
  if (vehicle.category_id) {
    try {
      category = await vehicleService.retrieveVehicleCategory(vehicle.category_id)
    } catch {
      // not found
    }
  }

  const [rates] = await (rentalService.listAndCountRentalRates as any)(
    { vehicle_id: req.params.id },
    { take: 1 }
  )

  const [terms] = await (rentalService.listAndCountRentalTerms as any)(
    { vehicle_id: req.params.id },
    { take: 1 }
  )

  const [bookings] = await (bookingService.listAndCountBookings as any)(
    { vehicle_id: req.params.id },
    { take: 20, order: { created_at: "DESC" } }
  )

  res.json({
    vehicle: {
      ...vehicle,
      category,
      rate: rates?.[0] ? { ...rates[0], daily_rate: Number(rates[0].daily_rate) } : null,
      terms: terms?.[0] || null,
      bookings: bookings || [],
    },
  })
}

export async function PUT(req: MedusaRequest, res: MedusaResponse) {
  const vehicleService = req.scope.resolve(VEHICLE_MODULE)
  const body = req.body as Record<string, unknown>

  const [updated] = await (vehicleService.updateVehicles as any)([
    {
      id: req.params.id,
      ...body,
    },
  ])

  res.json({ vehicle: updated })
}
