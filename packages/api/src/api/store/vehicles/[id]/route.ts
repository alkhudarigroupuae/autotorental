import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { VEHICLE_MODULE } from "../../../../modules/vehicle"
import { RENTAL_MODULE } from "../../../../modules/rental"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const vehicleService = req.scope.resolve(VEHICLE_MODULE)
  const rentalService = req.scope.resolve(RENTAL_MODULE)

  const { id } = req.params

  const vehicle = await vehicleService.retrieveVehicle(id)

  const [rates] = await (rentalService.listRentalRates as any)(
    { vehicle_id: id },
    { take: 1 }
  )

  const [terms] = await (rentalService.listRentalTerms as any)(
    { vehicle_id: id },
    { take: 1 }
  )

  let features: any[] = []
  if (
    vehicle.features &&
    Array.isArray(vehicle.features) &&
    vehicle.features.length > 0
  ) {
    const [featureRecords] = await (vehicleService.listAndCountVehicleFeatures as any)(
      { id: vehicle.features },
      { take: vehicle.features.length }
    )
    features = featureRecords
  }

  res.json({
    vehicle,
    rates: rates || null,
    terms: terms || null,
    features,
  })
}
