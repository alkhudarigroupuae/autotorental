import { model } from "@medusajs/framework/utils"

export const InsuranceLevel = {
  BASIC: "basic",
  FULL: "full",
} as const

export const FuelPolicy = {
  SAME_TO_SAME: "same_to_same",
  FULL_TO_FULL: "full_to_full",
} as const

const RentalTerms = model.define("RentalTerms", {
  id: model.id({ prefix: "rentterms" }).primaryKey(),
  vehicle_id: model.text(),
  min_driver_age: model.number().default(21),
  min_license_age_months: model.number().default(0),
  security_deposit: model.bigNumber().default(0),
  is_zero_deposit: model.boolean().default(false),
  insurance_level: model.enum(InsuranceLevel).default(InsuranceLevel.BASIC),
  fuel_policy: model.enum(FuelPolicy).default(FuelPolicy.SAME_TO_SAME),
  min_rental_days: model.number().default(1),
  delivery_available: model.boolean().default(false),
  delivery_fee: model.bigNumber().nullable(),
  additional_driver_fee: model.bigNumber().nullable(),
  child_seat_fee: model.bigNumber().nullable(),
  metadata: model.json().nullable(),
})

export default RentalTerms
