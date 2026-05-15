import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { VEHICLE_MODULE } from "../../../../modules/vehicle"
import { RENTAL_MODULE } from "../../../../modules/rental"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const vehicleService = req.scope.resolve(VEHICLE_MODULE)
  const rentalService = req.scope.resolve(RENTAL_MODULE)

  const { id } = req.params

  const vehicle = await vehicleService.retrieveVehicle(id)

  const [rates] = await rentalService.listRentalRates(
    { vehicle_id: id },
    { take: 1 }
  )

  const [terms] = await rentalService.listRentalTerms(
    { vehicle_id: id },
    { take: 1 }
  )

  res.json({ vehicle, rates: rates || null, terms: terms || null })
}

export async function PUT(req: MedusaRequest, res: MedusaResponse) {
  const vehicleService = req.scope.resolve(VEHICLE_MODULE)
  const rentalService = req.scope.resolve(RENTAL_MODULE)

  const { id } = req.params
  const body = req.body as Record<string, unknown>
  const rates = body.rates as Record<string, unknown> | undefined
  const terms = body.terms as Record<string, unknown> | undefined

  const updateData: Record<string, unknown> = { id }
  const vehicleFields = ["make", "model_name", "year", "transmission", "fuel_type",
    "seats", "doors", "color", "plate_number", "plate_region", "vin",
    "description", "city", "status", "features"]
  for (const key of vehicleFields) {
    if (body[key] !== undefined) updateData[key] = body[key]
  }

  await vehicleService.updateVehicles(updateData as any)

  if (rates) {
    const [existingRate] = await rentalService.listRentalRates(
      { vehicle_id: id },
      { take: 1 }
    )

    const rateData: Record<string, unknown> = {
      vehicle_id: id,
      daily_rate: (rates.daily_rate as number) ?? 0,
      weekly_rate: (rates.weekly_rate as number) ?? null,
      monthly_rate: (rates.monthly_rate as number) ?? null,
      weekly_mileage_limit: (rates.weekly_mileage_limit as number) ?? null,
      monthly_mileage_limit: (rates.monthly_mileage_limit as number) ?? null,
      extra_km_charge: (rates.extra_km_charge as number) ?? null,
    }

    if (existingRate) {
      await rentalService.updateRentalRates({ id: existingRate.id, ...rateData } as any)
    } else {
      await rentalService.createRentalRates([rateData as any])
    }
  }

  if (terms) {
    const [existingTerms] = await rentalService.listRentalTerms(
      { vehicle_id: id },
      { take: 1 }
    )

    const termData: Record<string, unknown> = {
      vehicle_id: id,
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
    }

    if (existingTerms) {
      await rentalService.updateRentalTerms({ id: existingTerms.id, ...termData } as any)
    } else {
      await rentalService.createRentalTerms([termData as any])
    }
  }

  const vehicle = await vehicleService.retrieveVehicle(id)

  res.json({ vehicle })
}

export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  const vehicleService = req.scope.resolve(VEHICLE_MODULE)

  const { id } = req.params

  await vehicleService.softDeleteVehicles([id])

  res.status(204).send()
}
