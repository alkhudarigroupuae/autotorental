import { model } from "@medusajs/framework/utils"

const VehicleCategory = model.define("VehicleCategory", {
  id: model.id({ prefix: "vehcat" }).primaryKey(),
  name: model.text().searchable(),
  name_ar: model.text().nullable(),
  description: model.text().nullable(),
  is_active: model.boolean().default(true),
  metadata: model.json().nullable(),
})

export default VehicleCategory
