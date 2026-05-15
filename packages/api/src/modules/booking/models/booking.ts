import { model } from "@medusajs/framework/utils"

export const BookingStatus = {
  ENQUIRY: "enquiry",
  QUOTED: "quoted",
  CONFIRMED: "confirmed",
  ACTIVE: "active",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
  REJECTED: "rejected",
} as const

export const PaymentStatus = {
  PENDING: "pending",
  ADVANCE_PAID: "advance_paid",
  BALANCE_PAID: "balance_paid",
  REFUNDED: "refunded",
} as const

export const Channel = {
  WEB: "web",
  WHATSAPP: "whatsapp",
} as const

const Booking = model.define("Booking", {
  id: model.id({ prefix: "book" }).primaryKey(),
  customer_id: model.text(),
  customer_name: model.text().nullable(),
  customer_phone: model.text().nullable(),
  customer_email: model.text().nullable(),
  vehicle_id: model.text(),
  vendor_id: model.text(),
  status: model.enum(BookingStatus).default(BookingStatus.ENQUIRY),
  pickup_date: model.dateTime(),
  return_date: model.dateTime(),
  pickup_location: model.text().nullable(),
  return_location: model.text().nullable(),
  quoted_total: model.bigNumber().default(0),
  advance_amount: model.bigNumber().default(0),
  balance_amount: model.bigNumber().default(0),
  deposit_amount: model.bigNumber().default(0),
  addons: model.json().nullable(),
  payment_status: model.enum(PaymentStatus).default(PaymentStatus.PENDING),
  channel: model.enum(Channel).default(Channel.WEB),
  notes: model.text().nullable(),
  medusa_order_id: model.text().nullable(),
  post_rental_charges: model.json().nullable(),
  metadata: model.json().nullable(),
})

export default Booking
