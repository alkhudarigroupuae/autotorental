import { defineLink } from "@medusajs/framework/utils"
import VehicleModule from "../modules/vehicle"
import RentalModule from "../modules/rental"

export default defineLink(
  VehicleModule.linkable.vehicle,
  RentalModule.linkable.rentalTerms
)
