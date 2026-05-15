import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk"
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { MedusaError } from "@medusajs/framework/utils"
import { BOOKING_MODULE } from "../../modules/booking"

const VALID_TRANSITIONS: Record<string, string[]> = {
  enquiry: ["quoted", "cancelled"],
  quoted: ["confirmed", "cancelled", "rejected"],
  confirmed: ["active", "cancelled"],
  active: ["completed", "cancelled"],
  completed: [],
  cancelled: [],
  rejected: [],
}

const updateBookingStatusStep = createStep(
  "update-booking-status",
  async (
    input: { booking_id: string; status: string; notes?: string },
    { container }
  ) => {
    const bookingService = container.resolve(BOOKING_MODULE)

    const booking = await bookingService.retrieveBooking(input.booking_id)

    const allowed = VALID_TRANSITIONS[booking.status] || []
    if (!allowed.includes(input.status)) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Cannot transition from "${booking.status}" to "${input.status}". Allowed: ${allowed.join(", ") || "none"}`
      )
    }

    const [updated] = await (bookingService.updateBookings as any)([
      { id: input.booking_id, status: input.status, notes: input.notes },
    ])

    return new StepResponse(updated, {
      booking_id: input.booking_id,
      previous_status: booking.status,
    })
  },
  async (data, { container }) => {
    if (!data) return
    const bookingService = container.resolve(BOOKING_MODULE)
    await (bookingService.updateBookings as any)([
      { id: data.booking_id, status: data.previous_status },
    ])
  }
)

type UpdateBookingStatusInput = {
  booking_id: string
  status: string
  notes?: string
}

export const updateBookingStatusWorkflow = createWorkflow(
  "update-booking-status",
  (input: UpdateBookingStatusInput) => {
    const result = updateBookingStatusStep({
      booking_id: input.booking_id,
      status: input.status,
      notes: input.notes,
    })

    return new WorkflowResponse(result)
  }
)
