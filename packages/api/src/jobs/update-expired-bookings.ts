import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { BOOKING_MODULE } from "../modules/booking"

export default async function updateExpiredBookings() {
  const container = (global as any).__MEDUSA_CONTAINER__
  if (!container) return

  const bookingService = container.resolve(BOOKING_MODULE)

  const now = new Date()
  const [bookings] = await (bookingService.listAndCountBookings as any)(
    {
      status: ["active"],
      return_date: { $lt: now },
    },
    { take: 100 }
  )

  for (const booking of (bookings || []) as any[]) {
    await (bookingService.updateBookings as any)([
      { id: booking.id, status: "completed" },
    ])
    console.log(`Booking ${booking.id} auto-completed (return date passed)`)
  }
}

export const config = {
  name: "update-expired-bookings",
  schedule: "0 */6 * * *",
}
