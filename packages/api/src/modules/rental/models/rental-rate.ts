import { model } from "@medusajs/framework/utils"

const RentalRate = model.define("RentalRate", {
  id: model.id({ prefix: "rentrate" }).primaryKey(),
  vehicle_id: model.text(),
  daily_rate: model.bigNumber(),
  weekly_rate: model.bigNumber().nullable(),
  monthly_rate: model.bigNumber().nullable(),
  weekly_mileage_limit: model.number().nullable(),
  monthly_mileage_limit: model.number().nullable(),
  extra_km_charge: model.bigNumber().nullable(),
  currency: model.text().default("AED"),
  metadata: model.json().nullable(),
})

export default RentalRate
