import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { BOOKING_MODULE } from "../../../modules/booking"

type CreateBookingStepInput = {
  vehicle_id: string
  vendor_id: string
  customer_name?: string
  customer_phone?: string
  customer_email?: string
  pickup_date: string
  return_date: string
  pickup_location?: string
  return_location?: string
  quoted_total: number
  advance_amount: number
  balance_amount: number
  deposit_amount: number
  addons?: Record<string, unknown>[]
  notes?: string
}

export const createBookingStep = createStep(
  "create-booking",
  async (input: CreateBookingStepInput, { container }) => {
    const bookingService = container.resolve(BOOKING_MODULE)

    const [booking] = await (bookingService.createBookings as any)([
      {
        customer_id: "guest",
        vehicle_id: input.vehicle_id,
        vendor_id: input.vendor_id,
        customer_name: input.customer_name || null,
        customer_phone: input.customer_phone || null,
        customer_email: input.customer_email || null,
        status: "enquiry",
        pickup_date: new Date(input.pickup_date),
        return_date: new Date(input.return_date),
        pickup_location: input.pickup_location || null,
        return_location: input.return_location || null,
        notes: input.notes || null,
        quoted_total: input.quoted_total,
        advance_amount: input.advance_amount,
        balance_amount: input.balance_amount,
        deposit_amount: input.deposit_amount,
        addons: input.addons ? JSON.stringify(input.addons) : null,
      },
    ])

    return new StepResponse(booking, booking.id)
  },
  async (bookingId, { container }) => {
    const bookingService = container.resolve(BOOKING_MODULE)
    await (bookingService.deleteBookings as any)([bookingId])
  }
)
