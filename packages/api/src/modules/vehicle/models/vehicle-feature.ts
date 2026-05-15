import { model } from "@medusajs/framework/utils"

export const FeatureCategory = {
  COMFORT: "comfort",
  SAFETY: "safety",
  TECH: "tech",
  AUDIO: "audio",
  OTHER: "other",
} as const

const VehicleFeature = model.define("VehicleFeature", {
  id: model.id({ prefix: "vehfeat" }).primaryKey(),
  name: model.text().searchable(),
  name_ar: model.text().nullable(),
  icon: model.text().nullable(),
  category: model.enum(FeatureCategory).default(FeatureCategory.OTHER),
  is_active: model.boolean().default(true),
  metadata: model.json().nullable(),
})

export default VehicleFeature
