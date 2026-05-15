import { MedusaService } from "@medusajs/framework/utils"
import { Booking, BookingAddon } from "./models"

class BookingModuleService extends MedusaService({
  Booking,
  BookingAddon,
}) {
  constructor(container, moduleDeclaration) {
    super(...arguments)
  }
}

export default BookingModuleService
