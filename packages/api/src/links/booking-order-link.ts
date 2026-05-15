import { defineLink } from "@medusajs/framework/utils"
import OrderModule from "@medusajs/medusa/order"
import BookingModule from "../modules/booking"

export default defineLink(
  OrderModule.linkable.order,
  BookingModule.linkable.booking
)
