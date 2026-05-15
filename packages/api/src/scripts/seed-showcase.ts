import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { VEHICLE_MODULE } from "../modules/vehicle"
import { RENTAL_MODULE } from "../modules/rental"

const FEATURES_TO_ATTACH = [
  "Bluetooth",
  "Apple CarPlay / Android Auto",
  "GPS Navigation",
  "Sunroof / Moonroof",
  "Leather Seats",
  "Heated Seats",
  "Ventilated Seats",
  "Rear Camera",
  "Parking Sensors",
  "Lane Assist",
  "Cruise Control",
  "Keyless Entry",
  "Push Start",
  "USB Charger",
  "Premium Sound System",
  "Dashcam",
]

export default async function seedShowcaseVehicle({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const vehicleService = container.resolve(VEHICLE_MODULE)
  const rentalService = container.resolve(RENTAL_MODULE)

  const [existing] = await (vehicleService.listAndCountVehicles as any)(
    { make: "Mercedes-Benz", model_name: "G-Class", year: 2025 },
    { take: 1 }
  )
  if (existing.length > 0) {
    logger.info("Showcase vehicle already exists, skipping.")
    return
  }

  const [categories] = await vehicleService.listAndCountVehicleCategories()
  const [allFeatures] = await vehicleService.listAndCountVehicleFeatures()

  const luxuryId = categories.find((c: any) => c.name === "Luxury")?.id
  const featureMap: Record<string, string> = {}
  for (const f of allFeatures as any[]) featureMap[f.name] = f.id

  const featureIds = FEATURES_TO_ATTACH
    .map((name) => featureMap[name])
    .filter(Boolean)

  const [vehicle] = await (vehicleService.createVehicles as any)([
    {
      seller_id: "seed",
      make: "Mercedes-Benz",
      model_name: "G-Class",
      year: 2025,
      category_id: luxuryId,
      transmission: "automatic",
      fuel_type: "petrol",
      seats: 5,
      doors: 5,
      color: "Obsidian Black",
      plate_number: "DXB 55555",
      city: "Dubai",
      description:
        "Experience unparalleled luxury with the Mercedes-Benz G-Class. This iconic off-road vehicle combines rugged capability with handcrafted sophistication. Features include a hand-stitched leather interior, ambient lighting with 64 colors, Burmester 3D surround sound system, and twin-turbo V8 engine producing 577 horsepower.",
      status: "published",
      photos: [
        "https://images.unsplash.com/photo-1520031441872-265e4ff50366?w=800&q=80",
        "https://images.unsplash.com/photo-1606664514610-36b4f7e4f3c1?w=800&q=80",
        "https://images.unsplash.com/photo-1606220588913-bb3acb4d2f46?w=800&q=80",
        "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80",
      ],
      features: featureIds,
    },
  ])

  await rentalService.createRentalRates([
    {
      vehicle_id: vehicle.id,
      daily_rate: 2500,
      weekly_rate: 15000,
      monthly_rate: 50000,
      weekly_mileage_limit: 500,
      monthly_mileage_limit: 2000,
      extra_km_charge: 10,
      currency: "AED",
    },
  ])

  await rentalService.createRentalTerms([
    {
      vehicle_id: vehicle.id,
      min_driver_age: 28,
      min_license_age_months: 12,
      security_deposit: 15000,
      is_zero_deposit: false,
      insurance_level: "full",
      fuel_policy: "full_to_full",
      min_rental_days: 2,
      delivery_available: true,
      delivery_fee: 300,
      additional_driver_fee: 200,
      child_seat_fee: 100,
    },
  ])

  logger.info("Mercedes-Benz G-Class created successfully with 16 features!")
}
