import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { VEHICLE_MODULE } from "../../../modules/vehicle"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const vehicleService = req.scope.resolve(VEHICLE_MODULE)

  const [categories] = await vehicleService.listAndCountVehicleCategories(
    { is_active: true },
    { order: { name: "ASC" } }
  )

  res.json({ categories })
}
