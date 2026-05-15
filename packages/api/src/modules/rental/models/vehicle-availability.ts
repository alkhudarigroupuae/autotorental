import { model } from "@medusajs/framework/utils"

const VehicleAvailability = model.define("VehicleAvailability", {
  id: model.id({ prefix: "vehavail" }).primaryKey(),
  vehicle_id: model.text(),
  start_date: model.dateTime(),
  end_date: model.dateTime(),
  booking_id: model.text().nullable(),
  block_reason: model.text().nullable(),
  metadata: model.json().nullable(),
})

export default VehicleAvailability
