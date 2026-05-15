import { defineLink } from "@medusajs/framework/utils"
import CustomerModule from "@medusajs/medusa/customer"
import BookingModule from "../modules/booking"

export default defineLink(
  { linkable: CustomerModule.linkable.customer, isList: true },
  BookingModule.linkable.booking
)
