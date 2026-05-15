import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { VEHICLE_MODULE } from "../../../modules/vehicle"
import { RENTAL_MODULE } from "../../../modules/rental"
import { BOOKING_MODULE } from "../../../modules/booking"
import { calculateQuote } from "../../../services/rental-pricing"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const vehicleService = req.scope.resolve(VEHICLE_MODULE)
  const rentalService = req.scope.resolve(RENTAL_MODULE)
  const bookingService = req.scope.resolve(BOOKING_MODULE)

  const body = req.body as Record<string, unknown>

  const vehicle = await vehicleService.retrieveVehicle(
    body.vehicle_id as string
  )

  const [rates] = await (rentalService.listRentalRates as any)(
    { vehicle_id: body.vehicle_id },
    { take: 1 }
  )

  const [terms] = await (rentalService.listRentalTerms as any)(
    { vehicle_id: body.vehicle_id },
    { take: 1 }
  )

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

  const [booking] = await (bookingService.createBookings as any)([
    {
      customer_id: "guest",
      vehicle_id: body.vehicle_id,
      vendor_id: vehicle.seller_id,
      customer_name: body.customer_name || null,
      customer_phone: body.customer_phone || null,
      customer_email: body.customer_email || null,
      status: "enquiry",
      pickup_date: new Date(body.pickup_date as string),
      return_date: new Date(body.return_date as string),
      pickup_location: body.pickup_location || null,
      return_location: body.return_location || null,
      notes: body.notes || null,
      quoted_total: quote.grand_total,
      advance_amount: quote.advance_amount,
      balance_amount: quote.balance_amount,
      deposit_amount: quote.security_deposit,
      addons: body.addons ? JSON.stringify(body.addons) : null,
    },
  ])

  await (rentalService.createVehicleAvailabilities as any)([
    {
      vehicle_id: body.vehicle_id,
      start_date: new Date(body.pickup_date as string),
      end_date: new Date(body.return_date as string),
      booking_id: booking.id,
      block_reason: "booking",
    },
  ])

  if (body.addons && Array.isArray(body.addons)) {
    const addonRecords = (body.addons as any[]).map((a: any) => ({
      booking_id: booking.id,
      type: a.type,
      label: a.label || a.type,
      price: a.price || 0,
    }))
    await (bookingService.createBookingAddons as any)(addonRecords)
  }

  res.json({ booking })
}
