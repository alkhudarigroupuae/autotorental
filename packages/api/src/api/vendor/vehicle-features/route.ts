import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { VEHICLE_MODULE } from "../../../modules/vehicle"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const vehicleService = req.scope.resolve(VEHICLE_MODULE)

  const [features] = await vehicleService.listAndCountVehicleFeatures(
    { is_active: true },
    { order: { category: "ASC", name: "ASC" } }
  )

  res.json({ features })
}
