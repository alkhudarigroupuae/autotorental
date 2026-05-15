import { createWorkflow, WorkflowResponse, transform } from "@medusajs/framework/workflows-sdk"
import { createBookingStep } from "./steps/create-booking"
import { createAvailabilityBlockStep } from "./steps/create-availability-block"
import { createAddonsStep } from "./steps/create-addons"

type CreateBookingWorkflowInput = {
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
  addons?: { type: string; label?: string; price?: number }[]
  notes?: string
}

export const createBookingWorkflow = createWorkflow(
  "create-booking",
  (input: CreateBookingWorkflowInput) => {
    const booking = createBookingStep({
      vehicle_id: input.vehicle_id,
      vendor_id: input.vendor_id,
      customer_name: input.customer_name,
      customer_phone: input.customer_phone,
      customer_email: input.customer_email,
      pickup_date: input.pickup_date,
      return_date: input.return_date,
      pickup_location: input.pickup_location,
      return_location: input.return_location,
      quoted_total: input.quoted_total,
      advance_amount: input.advance_amount,
      balance_amount: input.balance_amount,
      deposit_amount: input.deposit_amount,
      addons: input.addons,
      notes: input.notes,
    })

    createAvailabilityBlockStep({
      vehicle_id: input.vehicle_id,
      booking_id: booking.id,
      start_date: input.pickup_date,
      end_date: input.return_date,
    })

    const addonInput = transform({ input, booking }, (data) => ({
      booking_id: data.booking.id,
      addons: data.input.addons || [],
    }))

    createAddonsStep(addonInput)

    return new WorkflowResponse(booking)
  }
)
