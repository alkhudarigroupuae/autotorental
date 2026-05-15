import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { VEHICLE_MODULE } from "../../../modules/vehicle"
import { RENTAL_MODULE } from "../../../modules/rental"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const vehicleService = req.scope.resolve(VEHICLE_MODULE)

  const seller_id = req.query.seller_id as string | undefined

  const filter: Record<string, unknown> = {}
  if (seller_id) filter.seller_id = seller_id

  const [vehicles, count] = await vehicleService.listAndCountVehicles(
    filter,
    {
      skip: parseInt(req.query.offset as string) || 0,
      take: parseInt(req.query.limit as string) || 20,
      order: { created_at: "DESC" },
    }
  )

  res.json({ vehicles, count })
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const vehicleService = req.scope.resolve(VEHICLE_MODULE)
  const rentalService = req.scope.resolve(RENTAL_MODULE)

  const body = req.body as Record<string, unknown>
  const rates = body.rates as Record<string, unknown> | undefined
  const terms = body.terms as Record<string, unknown> | undefined

  const [vehicle] = await vehicleService.createVehicles([body as any])

  if (rates) {
    await rentalService.createRentalRates([{
      vehicle_id: vehicle.id,
      daily_rate: (rates.daily_rate as number) ?? 0,
      weekly_rate: (rates.weekly_rate as number) ?? null,
      monthly_rate: (rates.monthly_rate as number) ?? null,
      weekly_mileage_limit: (rates.weekly_mileage_limit as number) ?? null,
      monthly_mileage_limit: (rates.monthly_mileage_limit as number) ?? null,
      extra_km_charge: (rates.extra_km_charge as number) ?? null,
    } as any])
  }

  if (terms) {
    await rentalService.createRentalTerms([{
      vehicle_id: vehicle.id,
      min_driver_age: (terms.min_driver_age as number) ?? 21,
      min_license_age_months: (terms.min_license_age_months as number) ?? 0,
      security_deposit: (terms.security_deposit as number) ?? 0,
      is_zero_deposit: (terms.is_zero_deposit as boolean) ?? false,
      insurance_level: (terms.insurance_level as string) ?? "basic",
      fuel_policy: (terms.fuel_policy as string) ?? "same_to_same",
      min_rental_days: (terms.min_rental_days as number) ?? 1,
      delivery_available: (terms.delivery_available as boolean) ?? false,
      delivery_fee: (terms.delivery_fee as number) ?? null,
      additional_driver_fee: (terms.additional_driver_fee as number) ?? null,
      child_seat_fee: (terms.child_seat_fee as number) ?? null,
    } as any])
  }

  res.json({ vehicle })
}
