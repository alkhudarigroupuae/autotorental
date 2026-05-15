import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Container, Heading, Text, Badge, Button } from "@medusajs/ui"
import { ArrowLeft } from "@medusajs/icons"
import type { RouteConfig } from "@mercurjs/dashboard-sdk"

export const config: RouteConfig = {
  label: "Booking Detail",
}

const statusColors: Record<string, "green" | "orange" | "blue" | "purple" | "grey" | "red"> = {
  enquiry: "blue",
  quoted: "orange",
  confirmed: "green",
  active: "purple",
  completed: "green",
  cancelled: "grey",
  rejected: "red",
}

type BookingDetail = {
  id: string
  customer_name: string
  customer_phone: string
  customer_email: string
  vehicle_id: string
  vendor_id: string
  status: string
  pickup_date: string
  return_date: string
  pickup_location: string | null
  return_location: string | null
  quoted_total: number
  advance_amount: number
  balance_amount: number
  deposit_amount: number
  payment_status: string
  notes: string | null
  channel: string
  created_at: string
  vehicle: { make: string; model_name: string; plate_number: string } | null
}

const BookingDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [booking, setBooking] = useState<BookingDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/admin/bookings/${id}`, { credentials: "include" })
      .then((r) => r.json())
      .then((res) => setBooking(res.booking))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <Container><Text>Loading...</Text></Container>
  if (!booking) return <Container><Text>Booking not found</Text></Container>

  const vehicleName = booking.vehicle
    ? `${booking.vehicle.make} ${booking.vehicle.model_name} (${booking.vehicle.plate_number || "no plate"})`
    : booking.vehicle_id

  return (
    <Container>
      <Button variant="transparent" onClick={() => navigate("/dashboard/bookings")} className="mb-4">
        <ArrowLeft /> Back to Bookings
      </Button>

      <div className="flex items-center justify-between mb-6">
        <div>
          <Heading>Booking {booking.id.slice(0, 8)}...</Heading>
          <Text className="text-ui-fg-subtle mt-1">Created {new Date(booking.created_at).toLocaleString("en-GB")}</Text>
        </div>
        <Badge color={statusColors[booking.status] || "grey"}>{booking.status}</Badge>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <div className="bg-ui-bg-base rounded-lg p-4 border">
            <Heading level="h2">Customer</Heading>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div><Text size="small" className="text-ui-fg-subtle">Name</Text><Text>{booking.customer_name || "—"}</Text></div>
              <div><Text size="small" className="text-ui-fg-subtle">Phone</Text><Text>{booking.customer_phone || "—"}</Text></div>
              <div><Text size="small" className="text-ui-fg-subtle">Email</Text><Text>{booking.customer_email || "—"}</Text></div>
            </div>
          </div>

          <div className="bg-ui-bg-base rounded-lg p-4 border">
            <Heading level="h2">Vehicle</Heading>
            <Text className="mt-2">{vehicleName}</Text>
            <Text size="small" className="text-ui-fg-subtle mt-1">ID: {booking.vehicle_id}</Text>
          </div>

          <div className="bg-ui-bg-base rounded-lg p-4 border">
            <Heading level="h2">Rental Period</Heading>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div><Text size="small" className="text-ui-fg-subtle">Pickup</Text><Text>{new Date(booking.pickup_date).toLocaleString("en-GB")}</Text></div>
              <div><Text size="small" className="text-ui-fg-subtle">Return</Text><Text>{new Date(booking.return_date).toLocaleString("en-GB")}</Text></div>
              {booking.pickup_location && <div><Text size="small" className="text-ui-fg-subtle">Pickup Location</Text><Text>{booking.pickup_location}</Text></div>}
            </div>
          </div>

          {booking.notes && (
            <div className="bg-ui-bg-base rounded-lg p-4 border">
              <Heading level="h2">Notes</Heading>
              <Text className="mt-2">{booking.notes}</Text>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-ui-bg-base rounded-lg p-4 border">
            <Heading level="h2">Payment</Heading>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between"><Text size="small" className="text-ui-fg-subtle">Total</Text><Text weight="plus">{Number(booking.quoted_total).toLocaleString("en-AE")} AED</Text></div>
              <div className="flex justify-between"><Text size="small" className="text-ui-fg-subtle">Advance</Text><Text>{Number(booking.advance_amount).toLocaleString("en-AE")} AED</Text></div>
              <div className="flex justify-between"><Text size="small" className="text-ui-fg-subtle">Balance</Text><Text>{Number(booking.balance_amount).toLocaleString("en-AE")} AED</Text></div>
              <div className="flex justify-between"><Text size="small" className="text-ui-fg-subtle">Deposit</Text><Text>{Number(booking.deposit_amount).toLocaleString("en-AE")} AED</Text></div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between"><Text size="small" className="text-ui-fg-subtle">Payment Status</Text><Badge size="small" color={booking.payment_status === "balance_paid" ? "green" : "orange"}>{booking.payment_status}</Badge></div>
              </div>
            </div>
          </div>

          <div className="bg-ui-bg-base rounded-lg p-4 border">
            <Heading level="h2">Details</Heading>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between"><Text size="small" className="text-ui-fg-subtle">Channel</Text><Text>{booking.channel}</Text></div>
              <div className="flex justify-between"><Text size="small" className="text-ui-fg-subtle">Vendor</Text><Text size="small">{booking.vendor_id.slice(0, 8)}...</Text></div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  )
}

export default BookingDetailPage
