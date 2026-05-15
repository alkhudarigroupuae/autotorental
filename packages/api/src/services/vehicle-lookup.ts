import { MedusaError } from "@medusajs/framework/utils"

const API_BASE = "https://api.carregistrationapi.ae/v1"
const LOOKUP_COST_AED = 0.8

export type PlateLookupInput = {
  plate_number: string
  emirate: string
}

export type VinLookupInput = {
  vin: string
}

export type LookupResult = {
  make: string
  model: string
  year: number
  color: string
  vin: string
  plate_number?: string
  plate_region?: string
  body_type?: string
  engine_capacity?: string
  fuel_type?: string
  registration_date?: string
  insurance_status?: string
  metadata?: Record<string, unknown>
}

function getApiKey(): string {
  const key = process.env.CAR_REGISTRATION_API_KEY
  if (!key) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "CAR_REGISTRATION_API_KEY environment variable not set"
    )
  }
  return key
}

async function callLookupAPI(endpoint: string, payload: Record<string, unknown>): Promise<LookupResult> {
  const apiKey = getApiKey()
  const url = `${API_BASE}/${endpoint}`

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": apiKey,
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new MedusaError(
      MedusaError.Types.UNEXPECTED_STATE,
      `Vehicle lookup API error: ${response.status} ${response.statusText}`
    )
  }

  const data = await response.json()

  return {
    make: data.make ?? "",
    model: data.model ?? "",
    year: data.year ?? 0,
    color: data.color ?? "",
    vin: data.vin ?? "",
    plate_number: data.plate_number,
    plate_region: data.plate_region,
    body_type: data.body_type,
    engine_capacity: data.engine_capacity,
    fuel_type: data.fuel_type,
    registration_date: data.registration_date,
    insurance_status: data.insurance_status,
    metadata: data,
  }
}

export async function lookupByPlate(input: PlateLookupInput): Promise<LookupResult> {
  return callLookupAPI("lookup/plate", {
    plate_number: input.plate_number,
    emirate: input.emirate,
  })
}

export async function lookupByVin(input: VinLookupInput): Promise<LookupResult> {
  return callLookupAPI("lookup/vin", {
    vin: input.vin,
  })
}

export const VEHICLE_LOOKUP_COST = LOOKUP_COST_AED
