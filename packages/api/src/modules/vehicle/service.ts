import { MedusaService } from "@medusajs/framework/utils"
import { Vehicle, VehicleCategory, VehicleFeature } from "./models"

class VehicleModuleService extends MedusaService({
  Vehicle,
  VehicleCategory,
  VehicleFeature,
}) {
  constructor(container, moduleDeclaration) {
    super(...arguments)
  }
}

export default VehicleModuleService
