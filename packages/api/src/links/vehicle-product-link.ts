import { defineLink } from "@medusajs/framework/utils"
import ProductModule from "@medusajs/medusa/product"
import VehicleModule from "../modules/vehicle"

export default defineLink(
  ProductModule.linkable.product,
  VehicleModule.linkable.vehicle
)
