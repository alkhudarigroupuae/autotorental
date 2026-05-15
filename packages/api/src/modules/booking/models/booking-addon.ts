import { model } from "@medusajs/framework/utils"

export const BookingAddonType = {
  INSURANCE_UPGRADE: "insurance_upgrade",
  ADDITIONAL_DRIVER: "additional_driver",
  CHILD_SEAT: "child_seat",
  DELIVERY: "delivery",
} as const

const BookingAddon = model.define("BookingAddon", {
  id: model.id({ prefix: "bookaddon" }).primaryKey(),
  booking_id: model.text(),
  type: model.enum(BookingAddonType),
  label: model.text(),
  price: model.bigNumber().default(0),
  metadata: model.json().nullable(),
})

export default BookingAddon
