import { model } from "@medusajs/framework/utils"

export const VehicleStatus = {
  DRAFT: "draft",
  PUBLISHED: "published",
  UNPUBLISHED: "unpublished",
} as const

export const EntryMethod = {
  AUTO_VIN: "auto_vin",
  AUTO_PLATE: "auto_plate",
  MANUAL: "manual",
} as const

export const Transmission = {
  AUTOMATIC: "automatic",
  MANUAL: "manual",
} as const

export const FuelType = {
  PETROL: "petrol",
  DIESEL: "diesel",
  HYBRID: "hybrid",
  ELECTRIC: "electric",
} as const

const Vehicle = model.define("Vehicle", {
  id: model.id({ prefix: "veh" }).primaryKey(),
  seller_id: model.text(),
  medusa_product_id: model.text().nullable(),
  make: model.text().searchable(),
  model_name: model.text().searchable(),
  year: model.number(),
  category_id: model.text().nullable(),
  transmission: model.enum(Transmission).default(Transmission.AUTOMATIC),
  fuel_type: model.enum(FuelType).default(FuelType.PETROL),
  seats: model.number().default(5),
  doors: model.number().default(4),
  color: model.text().nullable(),
  plate_number: model.text().searchable().nullable(),
  vin: model.text().searchable().nullable(),
  plate_region: model.text().nullable(),
  description: model.text().nullable(),
  photos: model.json().nullable(),
  specs: model.json().nullable(),
  features: model.json().nullable(),
  entry_method: model.enum(EntryMethod).default(EntryMethod.MANUAL),
  status: model.enum(VehicleStatus).default(VehicleStatus.DRAFT),
  city: model.text().searchable().nullable(),
  lat: model.float().nullable(),
  lng: model.float().nullable(),
  metadata: model.json().nullable(),
})

export default Vehicle
