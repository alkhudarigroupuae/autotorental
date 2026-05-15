import { SubscriberArgs, type SubscriberConfig } from "@medusajs/framework"

export default async function bookingUpdatedHandler({ event, container }: SubscriberArgs) {
  const { id, status } = event.data
  console.log(`Booking ${id} updated to status: ${status}`)
}

export const config: SubscriberConfig = {
  event: "booking.updated",
}
