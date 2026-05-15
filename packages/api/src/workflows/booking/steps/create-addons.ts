import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { BOOKING_MODULE } from "../../../modules/booking"

type CreateAddonsInput = {
  booking_id: string
  addons: { type: string; label?: string; price?: number }[]
}

export const createAddonsStep = createStep(
  "create-addons",
  async (input: CreateAddonsInput, { container }) => {
    const bookingService = container.resolve(BOOKING_MODULE)

    const records = input.addons.map((a) => ({
      booking_id: input.booking_id,
      type: a.type,
      label: a.label || a.type,
      price: a.price || 0,
    }))

    const addons = await (bookingService.createBookingAddons as any)(records)

    return new StepResponse(addons, { booking_id: input.booking_id, addon_ids: addons.map((a: any) => a.id) })
  },
  async (data, { container }) => {
    if (!data) return
    const bookingService = container.resolve(BOOKING_MODULE)
    await (bookingService.deleteBookingAddons as any)(data.addon_ids)
  }
)
