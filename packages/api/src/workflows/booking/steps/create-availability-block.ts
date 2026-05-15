import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { RENTAL_MODULE } from "../../../modules/rental"

type CreateAvailabilityInput = {
  vehicle_id: string
  booking_id: string
  start_date: string
  end_date: string
}

export const createAvailabilityBlockStep = createStep(
  "create-availability-block",
  async (input: CreateAvailabilityInput, { container }) => {
    const rentalService = container.resolve(RENTAL_MODULE)

    const [availability] = await (rentalService.createVehicleAvailabilities as any)([
      {
        vehicle_id: input.vehicle_id,
        start_date: new Date(input.start_date),
        end_date: new Date(input.end_date),
        booking_id: input.booking_id,
        block_reason: "booking",
      },
    ])

    return new StepResponse(availability, availability.id)
  },
  async (availabilityId, { container }) => {
    const rentalService = container.resolve(RENTAL_MODULE)
    await (rentalService.deleteVehicleAvailabilities as any)([availabilityId])
  }
)
