import { MedusaService } from "@medusajs/framework/utils"
import { RentalRate, RentalTerms, VehicleAvailability } from "./models"

class RentalModuleService extends MedusaService({
  RentalRate,
  RentalTerms,
  VehicleAvailability,
}) {
  constructor(container, moduleDeclaration) {
    super(...arguments)
  }
}

export default RentalModuleService
