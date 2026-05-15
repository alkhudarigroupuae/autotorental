import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { MedusaError } from "@medusajs/framework/utils"
import { BOOKING_MODULE } from "../../../../modules/booking"
import { VEHICLE_MODULE } from "../../../../modules/vehicle"

const allowedTransitions: Record<string, string[]> = {
  enquiry: ["quoted", "cancelled", "rejected"],
  quoted: ["confirmed", "cancelled", "rejected"],
  confirmed: ["active", "cancelled"],
  active: ["completed"],
  completed: [],
  cancelled: [],
  rejected: [],
}

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const bookingService = req.scope.resolve(BOOKING_MODULE)
  const vehicleService = req.scope.resolve(VEHICLE_MODULE)

  const { id } = req.params

  const booking = await (bookingService.retrieveBooking as any)(id)

  const [vehicle] = await (vehicleService.listVehicles as any)(
    { id: booking.vehicle_id },
    { take: 1 }
  )

  res.json({ booking: { ...booking, vehicle: vehicle || null } })
}

export async function PUT(req: MedusaRequest, res: MedusaResponse) {
  const bookingService = req.scope.resolve(BOOKING_MODULE)
  const vehicleService = req.scope.resolve(VEHICLE_MODULE)

  const { id } = req.params
  const body = req.body as Record<string, unknown>
  const newStatus = body.status as string

  if (!newStatus) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "الحالة مطلوبة"
    )
  }

  const booking = await (bookingService.retrieveBooking as any)(id)
  const currentStatus = booking.status as string

  const validNext = allowedTransitions[currentStatus]
  if (!validNext || !validNext.includes(newStatus)) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      `لا يمكن تغيير الحالة من ${currentStatus} إلى ${newStatus}`
    )
  }

  await (bookingService.updateBookings as any)([{ id, status: newStatus }])

  const updated = await (bookingService.retrieveBooking as any)(id)

  const [vehicle] = await (vehicleService.listVehicles as any)(
    { id: updated.vehicle_id },
    { take: 1 }
  )

  res.json({ booking: { ...updated, vehicle: vehicle || null } })
}
