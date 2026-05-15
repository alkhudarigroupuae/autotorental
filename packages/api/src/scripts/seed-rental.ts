import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { VEHICLE_MODULE } from "../modules/vehicle"

const categories: { name: string; name_ar: string; description: string; is_active: boolean }[] = [
  { name: "Economy", name_ar: "اقتصادية", description: "سيارات صغيرة وموفرة للوقود", is_active: true },
  { name: "Sedan", name_ar: "سيدان", description: "سيارات عائلية متوسطة", is_active: true },
  { name: "Luxury", name_ar: "فاخرة", description: "سيارات فاخرة راقية", is_active: true },
  { name: "SUV", name_ar: "دفع رباعي", description: "سيارات دفع رباعي واسعة", is_active: true },
  { name: "Sports", name_ar: "رياضية", description: "سيارات رياضية عالية الأداء", is_active: true },
  { name: "Commercial", name_ar: "تجارية", description: "شاحنات ومركبات تجارية", is_active: true },
  { name: "Convertible", name_ar: "مكشوفة", description: "سيارات مكشوفة للرحلات", is_active: true },
]

const features: { name: string; name_ar: string; icon: string; category: "comfort" | "safety" | "tech" | "audio" | "other"; is_active: boolean }[] = [
  { name: "Bluetooth", name_ar: "بلوتوث", icon: "bluetooth", category: "tech", is_active: true },
  { name: "Apple CarPlay / Android Auto", name_ar: "أبل كاربلاي / أندرويد أوتو", icon: "smartphone", category: "tech", is_active: true },
  { name: "GPS Navigation", name_ar: "ملاحة GPS", icon: "map", category: "tech", is_active: true },
  { name: "Sunroof / Moonroof", name_ar: "فتحة سقف", icon: "sun", category: "comfort", is_active: true },
  { name: "Leather Seats", name_ar: "مقاعد جلد", icon: "seat", category: "comfort", is_active: true },
  { name: "Heated Seats", name_ar: "مقاعد مدفأة", icon: "thermometer", category: "comfort", is_active: true },
  { name: "Ventilated Seats", name_ar: "مقاعد مبردة", icon: "wind", category: "comfort", is_active: true },
  { name: "Rear Camera", name_ar: "كاميرا خلفية", icon: "camera", category: "safety", is_active: true },
  { name: "Parking Sensors", name_ar: "حساسات موقف", icon: "sensor", category: "safety", is_active: true },
  { name: "Lane Assist", name_ar: "مساعد المسرب", icon: "lane", category: "safety", is_active: true },
  { name: "Cruise Control", name_ar: "مثبت سرعة", icon: "speed", category: "tech", is_active: true },
  { name: "Keyless Entry", name_ar: "دخول بدون مفتاح", icon: "key", category: "comfort", is_active: true },
  { name: "Push Start", name_ar: "تشغيل بزر", icon: "power", category: "comfort", is_active: true },
  { name: "USB Charger", name_ar: "شاحن USB", icon: "usb", category: "tech", is_active: true },
  { name: "Premium Sound System", name_ar: "نظام صوتي فاخر", icon: "speaker", category: "audio", is_active: true },
  { name: "Child Seat", name_ar: "كرسي طفل", icon: "child", category: "safety", is_active: true },
  { name: "Roof Rack", name_ar: "حامل أمتعة", icon: "roof", category: "other", is_active: true },
  { name: "Dashcam", name_ar: "كاميرا أمامية", icon: "video", category: "safety", is_active: true },
]

export default async function seedRentalData({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const vehicleService = container.resolve(VEHICLE_MODULE)

  logger.info("Seeding vehicle categories...")
  const existingCategories = await vehicleService.listVehicleCategories()

  for (const cat of categories) {
    const exists = existingCategories.find(
      (e: Record<string, unknown>) => e.name === cat.name
    )
    if (!exists) {
      await vehicleService.createVehicleCategories([cat])
      logger.info(`  Created category: ${cat.name}`)
    } else {
      logger.info(`  Skipped category: ${cat.name} (already exists)`)
    }
  }

  logger.info("Seeding vehicle features...")
  const existingFeatures = await vehicleService.listVehicleFeatures()

  for (const feat of features) {
    const exists = existingFeatures.find(
      (e: Record<string, unknown>) => e.name === feat.name
    )
    if (!exists) {
      await vehicleService.createVehicleFeatures([feat])
      logger.info(`  Created feature: ${feat.name}`)
    } else {
      logger.info(`  Skipped feature: ${feat.name} (already exists)`)
    }
  }

  logger.info("Seeding completed successfully!")
}
