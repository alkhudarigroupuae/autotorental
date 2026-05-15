import { MedusaError } from "@medusajs/framework/utils"

const VAT_RATE = 0.05
const DEFAULT_ADVANCE_PERCENTAGE = 0.2

export type RateInput = {
  daily_rate: number
  weekly_rate: number | null
  monthly_rate: number | null
  weekly_mileage_limit: number | null
  monthly_mileage_limit: number | null
  extra_km_charge: number | null
}

export type TermsInput = {
  security_deposit: number
  delivery_fee: number | null
  additional_driver_fee: number | null
  child_seat_fee: number | null
}

export type AddonInput = {
  type: "delivery" | "additional_driver" | "child_seat" | "insurance_upgrade"
  quantity: number
  days?: number
  price?: number
}[]

export type QuoteParams = {
  rates: RateInput
  terms: TermsInput
  pickup_date: Date
  return_date: Date
  addons?: AddonInput
}

export type QuoteResult = {
  total_days: number
  effective_daily_rate: number
  mileage_limit: number | null
  base_amount: number
  addons_total: number
  vat_amount: number
  grand_total: number
  advance_amount: number
  balance_amount: number
  security_deposit: number
}

function computeDays(pickup: Date, ret: Date): number {
  const diffMs = ret.getTime() - pickup.getTime()
  if (diffMs <= 0) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "return_date must be after pickup_date"
    )
  }
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24))
}

export function calculateQuote(params: QuoteParams): QuoteResult {
  const { rates, terms, pickup_date, return_date, addons } = params
  const total_days = computeDays(pickup_date, return_date)

  let effective_daily_rate: number
  let mileage_limit: number | null

  if (total_days >= 28 && rates.monthly_rate != null) {
    effective_daily_rate = rates.monthly_rate / 30
    mileage_limit = rates.monthly_mileage_limit ?? null
  } else if (total_days >= 7 && rates.weekly_rate != null) {
    effective_daily_rate = rates.weekly_rate / 7
    mileage_limit = rates.weekly_mileage_limit ?? null
  } else {
    effective_daily_rate = rates.daily_rate
    mileage_limit = null
  }

  const base_amount = total_days * effective_daily_rate

  let addons_total = 0
  if (addons) {
    for (const addon of addons) {
      const qty = addon.quantity || 1
      switch (addon.type) {
        case "delivery":
          addons_total += (terms.delivery_fee ?? 0) * qty
          break
        case "additional_driver":
          addons_total += (terms.additional_driver_fee ?? 0) * (addon.days ?? total_days) * qty
          break
        case "child_seat":
          addons_total += (terms.child_seat_fee ?? 0) * qty
          break
        case "insurance_upgrade":
          addons_total += (addon.price ?? 0) * qty
          break
      }
    }
  }

  const vat_amount = (base_amount + addons_total) * VAT_RATE
  const grand_total = base_amount + addons_total + vat_amount
  const advance_amount = grand_total * DEFAULT_ADVANCE_PERCENTAGE
  const balance_amount = grand_total - advance_amount
  const security_deposit = terms.security_deposit

  return {
    total_days,
    effective_daily_rate: Math.round(effective_daily_rate * 100) / 100,
    mileage_limit,
    base_amount: Math.round(base_amount * 100) / 100,
    addons_total: Math.round(addons_total * 100) / 100,
    vat_amount: Math.round(vat_amount * 100) / 100,
    grand_total: Math.round(grand_total * 100) / 100,
    advance_amount: Math.round(advance_amount * 100) / 100,
    balance_amount: Math.round(balance_amount * 100) / 100,
    security_deposit,
  }
}
