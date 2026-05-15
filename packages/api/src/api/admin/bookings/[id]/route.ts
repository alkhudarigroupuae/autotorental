import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { BOOKING_MODULE } from "../../../../modules/booking"
import { VEHICLE_MODULE } from "../../../../modules/vehicle"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const bookingService = req.scope.resolve(BOOKING_MODULE)
  const vehicleService = req.scope.resolve(VEHICLE_MODULE)

  const booking = await bookingService.retrieveBooking(req.params.id)

  let vehicle = null
  if (booking.vehicle_id) {
    try {
      vehicle = await vehicleService.retrieveVehicle(booking.vehicle_id)
    } catch {
      // vehicle not found
    }
  }

  res.json({
    booking: {
      ...booking,
      quoted_total: Number(booking.quoted_total),
      vehicle,
    },
  })
}

export async function PUT(req: MedusaRequest, res: MedusaResponse) {
  const bookingService = req.scope.resolve(BOOKING_MODULE)
  const body = req.body as Record<string, unknown>

  const [updated] = await (bookingService.updateBookings as any)([
    {
      id: req.params.id,
      ...body,
    },
  ])

  res.json({ booking: { ...updated, quoted_total: Number(updated.quoted_total) } })
}
