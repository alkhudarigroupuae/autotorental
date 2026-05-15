import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { VEHICLE_MODULE } from "../modules/vehicle"
import { RENTAL_MODULE } from "../modules/rental"

const vehicles = [
  { make: "Toyota", model_name: "Camry", year: 2024, transmission: "automatic", fuel_type: "petrol", seats: 5, doors: 4, color: "White", city: "Dubai", daily_rate: 150, weekly_rate: 900, monthly_rate: 3200, deposit: 1000, min_age: 21, insurance: "Full", fuel_policy: "full_to_full", mileage: "Unlimited", photos: ["https://placehold.co/800x600/2563EB/ffffff?text=Toyota+Camry"] },
  { make: "Nissan", model_name: "Altima", year: 2024, transmission: "automatic", fuel_type: "petrol", seats: 5, doors: 4, color: "Black", city: "Dubai", daily_rate: 130, weekly_rate: 780, monthly_rate: 2800, deposit: 1000, min_age: 21, insurance: "Full", fuel_policy: "full_to_full", mileage: "Unlimited", photos: ["https://placehold.co/800x600/2563EB/ffffff?text=Nissan+Altima"] },
  { make: "BMW", model_name: "5 Series", year: 2024, transmission: "automatic", fuel_type: "petrol", seats: 5, doors: 4, color: "Silver", city: "Dubai", daily_rate: 450, weekly_rate: 2800, monthly_rate: 10000, deposit: 3000, min_age: 25, insurance: "Full", fuel_policy: "full_to_full", mileage: "200 km/day", photos: ["https://placehold.co/800x600/2563EB/ffffff?text=BMW+5+Series"] },
  { make: "Mercedes", model_name: "E-Class", year: 2024, transmission: "automatic", fuel_type: "petrol", seats: 5, doors: 4, color: "Black", city: "Abu Dhabi", daily_rate: 500, weekly_rate: 3000, monthly_rate: 11000, deposit: 3000, min_age: 25, insurance: "Full", fuel_policy: "full_to_full", mileage: "200 km/day", photos: ["https://placehold.co/800x600/2563EB/ffffff?text=Mercedes+E-Class"] },
  { make: "Toyota", model_name: "Land Cruiser", year: 2024, transmission: "automatic", fuel_type: "petrol", seats: 7, doors: 5, color: "White", city: "Dubai", daily_rate: 600, weekly_rate: 3600, monthly_rate: 13000, deposit: 5000, min_age: 25, insurance: "Full", fuel_policy: "full_to_full", mileage: "250 km/day", photos: ["https://placehold.co/800x600/2563EB/ffffff?text=Land+Cruiser"] },
  { make: "Nissan", model_name: "Patrol", year: 2024, transmission: "automatic", fuel_type: "petrol", seats: 7, doors: 5, color: "Gold", city: "Dubai", daily_rate: 550, weekly_rate: 3300, monthly_rate: 12000, deposit: 5000, min_age: 25, insurance: "Full", fuel_policy: "full_to_full", mileage: "250 km/day", photos: ["https://placehold.co/800x600/2563EB/ffffff?text=Nissan+Patrol"] },
  { make: "Honda", model_name: "Civic", year: 2024, transmission: "automatic", fuel_type: "petrol", seats: 5, doors: 4, color: "Blue", city: "Sharjah", daily_rate: 120, weekly_rate: 700, monthly_rate: 2500, deposit: 800, min_age: 21, insurance: "Full", fuel_policy: "full_to_full", mileage: "Unlimited", photos: ["https://placehold.co/800x600/2563EB/ffffff?text=Honda+Civic"] },
  { make: "Ford", model_name: "Mustang", year: 2024, transmission: "automatic", fuel_type: "petrol", seats: 4, doors: 2, color: "Red", city: "Dubai", daily_rate: 400, weekly_rate: 2400, monthly_rate: 8500, deposit: 3000, min_age: 25, insurance: "Full", fuel_policy: "full_to_full", mileage: "150 km/day", photos: ["https://placehold.co/800x600/2563EB/ffffff?text=Ford+Mustang"] },
  { make: "Chevrolet", model_name: "Tahoe", year: 2024, transmission: "automatic", fuel_type: "petrol", seats: 7, doors: 5, color: "Black", city: "Dubai", daily_rate: 500, weekly_rate: 3000, monthly_rate: 10000, deposit: 4000, min_age: 25, insurance: "Full", fuel_policy: "full_to_full", mileage: "200 km/day", photos: ["https://placehold.co/800x600/2563EB/ffffff?text=Chevrolet+Tahoe"] },
  { make: "Hyundai", model_name: "Elantra", year: 2024, transmission: "automatic", fuel_type: "petrol", seats: 5, doors: 4, color: "White", city: "Ajman", daily_rate: 100, weekly_rate: 600, monthly_rate: 2200, deposit: 500, min_age: 21, insurance: "Basic", fuel_policy: "same_to_same", mileage: "Unlimited", photos: ["https://placehold.co/800x600/2563EB/ffffff?text=Hyundai+Elantra"] },
  { make: "Porsche", model_name: "Cayenne", year: 2024, transmission: "automatic", fuel_type: "petrol", seats: 5, doors: 5, color: "White", city: "Dubai", daily_rate: 800, weekly_rate: 5000, monthly_rate: 18000, deposit: 8000, min_age: 28, insurance: "Full", fuel_policy: "full_to_full", mileage: "150 km/day", photos: ["https://placehold.co/800x600/2563EB/ffffff?text=Porsche+Cayenne"] },
  { make: "Tesla", model_name: "Model 3", year: 2024, transmission: "automatic", fuel_type: "electric", seats: 5, doors: 4, color: "White", city: "Dubai", daily_rate: 350, weekly_rate: 2100, monthly_rate: 7500, deposit: 2000, min_age: 23, insurance: "Full", fuel_policy: "full_to_full", mileage: "Unlimited", photos: ["https://placehold.co/800x600/2563EB/ffffff?text=Tesla+Model+3"] },
]

export default async function seedVehicles({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const vehicleService = container.resolve(VEHICLE_MODULE)
  const rentalService = container.resolve(RENTAL_MODULE)

  const [categories] = await vehicleService.listAndCountVehicleCategories()
  const categoryMap: Record<string, string> = {}
  for (const c of categories as any[]) {
    const name = c.name.toLowerCase()
    if (name === "economy") categoryMap.economy = c.id
    else if (name === "sedan") categoryMap.sedan = c.id
    else if (name === "luxury") categoryMap.luxury = c.id
    else if (name === "suv") categoryMap.suv = c.id
    else if (name === "sports") categoryMap.sports = c.id
  }

  let count = 0
  for (const v of vehicles) {
    let category_id = categoryMap.sedan
    if (v.daily_rate >= 800) category_id = categoryMap.luxury
    else if (v.daily_rate >= 400 && v.seats >= 7) category_id = categoryMap.suv
    else if (v.daily_rate >= 400 && v.seats <= 4) category_id = categoryMap.sports
    else if (v.daily_rate >= 400) category_id = categoryMap.luxury
    else if (v.daily_rate <= 150) category_id = categoryMap.economy

    const [existing] = await (vehicleService.listAndCountVehicles as any)(
      { make: v.make, model_name: v.model_name, year: v.year },
      { take: 1 }
    )
    if (existing.length > 0) {
      logger.info(`  Skipped ${v.make} ${v.model_name} (already exists)`)
      continue
    }

    const [vehicle] = await (vehicleService.createVehicles as any)([{
      seller_id: "seed",
      make: v.make,
      model_name: v.model_name,
      year: v.year,
      category_id,
      transmission: v.transmission,
      fuel_type: v.fuel_type,
      seats: v.seats,
      doors: v.doors,
      color: v.color,
      city: v.city,
      status: "published",
      photos: v.photos,
    }])

    await rentalService.createRentalRates([{
      vehicle_id: vehicle.id,
      daily_rate: v.daily_rate,
      weekly_rate: v.weekly_rate,
      monthly_rate: v.monthly_rate,
      currency: "AED",
    }])

    await rentalService.createRentalTerms([{
      vehicle_id: vehicle.id,
      min_driver_age: v.min_age,
      security_deposit: v.deposit,
      insurance_level: v.insurance === "Full" ? "full" : "basic",
      fuel_policy: v.fuel_policy as any,
      delivery_available: true,
      delivery_fee: 150,
      additional_driver_fee: 100,
      child_seat_fee: 50,
    }])

    count++
    logger.info(`  Created ${v.make} ${v.model_name}`)
  }

  logger.info(`Seeded ${count} vehicles successfully!`)
}
