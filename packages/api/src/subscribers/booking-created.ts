import { SubscriberArgs, type SubscriberConfig } from "@medusajs/framework"

export default async function bookingCreatedHandler({ event, container }: SubscriberArgs) {
  const bookingId = event.data.id
  console.log(`New booking created: ${bookingId}`)
}

export const config: SubscriberConfig = {
  event: "booking.created",
}
