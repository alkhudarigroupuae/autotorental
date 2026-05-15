import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { MedusaError } from "@medusajs/framework/utils"
import { RENTAL_MODULE } from "../../../../../modules/rental"
import { calculateQuote } from "../../../../../services/rental-pricing"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const rentalService = req.scope.resolve(RENTAL_MODULE)

  const { id } = req.params
  const body = req.body as Record<string, unknown>

  const [rates] = await (rentalService.listRentalRates as any)(
    { vehicle_id: id },
    { take: 1 }
  )

  const [terms] = await (rentalService.listRentalTerms as any)(
    { vehicle_id: id },
    { take: 1 }
  )

  if (!rates) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      "Rental rates not found for this vehicle"
    )
  }

  if (!terms) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      "Rental terms not found for this vehicle"
    )
  }

  const quote = calculateQuote({
    rates: {
      daily_rate: Number(rates.daily_rate),
      weekly_rate: rates.weekly_rate ? Number(rates.weekly_rate) : null,
      monthly_rate: rates.monthly_rate ? Number(rates.monthly_rate) : null,
      weekly_mileage_limit: rates.weekly_mileage_limit,
      monthly_mileage_limit: rates.monthly_mileage_limit,
      extra_km_charge: rates.extra_km_charge ? Number(rates.extra_km_charge) : null,
    },
    terms: {
      security_deposit: Number(terms.security_deposit),
      delivery_fee: terms.delivery_fee ? Number(terms.delivery_fee) : null,
      additional_driver_fee: terms.additional_driver_fee
        ? Number(terms.additional_driver_fee)
        : null,
      child_seat_fee: terms.child_seat_fee
        ? Number(terms.child_seat_fee)
        : null,
    },
    pickup_date: new Date(body.pickup_date as string),
    return_date: new Date(body.return_date as string),
    addons: body.addons as any,
  })

  res.json({ ...quote })
}
