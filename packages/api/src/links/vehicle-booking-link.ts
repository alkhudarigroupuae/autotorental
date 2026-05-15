import { defineLink } from "@medusajs/framework/utils"
import VehicleModule from "../modules/vehicle"
import BookingModule from "../modules/booking"

export default defineLink(
  { linkable: VehicleModule.linkable.vehicle, isList: true },
  BookingModule.linkable.booking
)
