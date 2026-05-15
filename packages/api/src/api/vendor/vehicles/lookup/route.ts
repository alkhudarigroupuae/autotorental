import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { lookupByPlate, lookupByVin } from "../../../../services/vehicle-lookup"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { plate_number, emirate, vin } = req.body as Record<string, string | undefined>

  try {
    let result

    if (plate_number && emirate) {
      result = await lookupByPlate({ plate_number, emirate })
    } else if (vin) {
      result = await lookupByVin({ vin })
    } else {
      res.status(400).json({
        message: "Provide either plate_number+emirate or vin",
      })
      return
    }

    res.json({ vehicle: result })
  } catch (error) {
    res.status(502).json({
      message: "Vehicle lookup API error",
      error: (error as Error).message,
    })
  }
}
