import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { BOOKING_MODULE } from "../../../../modules/booking"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const bookingService = req.scope.resolve(BOOKING_MODULE)

  const { id } = req.params

  const booking = await (bookingService.retrieveBooking as any)(id)

  res.json({ booking })
}
