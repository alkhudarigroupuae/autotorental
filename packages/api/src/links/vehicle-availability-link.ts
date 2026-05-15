import { defineLink } from "@medusajs/framework/utils"
import VehicleModule from "../modules/vehicle"
import RentalModule from "../modules/rental"

export default defineLink(
  { linkable: VehicleModule.linkable.vehicle, isList: true },
  RentalModule.linkable.vehicleAvailability
)
