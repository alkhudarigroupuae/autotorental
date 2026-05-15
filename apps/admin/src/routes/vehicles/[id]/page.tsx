import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Container, Heading, Text, Badge, Button } from "@medusajs/ui"
import { ArrowLeft } from "@medusajs/icons"
import type { RouteConfig } from "@mercurjs/dashboard-sdk"

export const config: RouteConfig = {
  label: "Vehicle Detail",
}

type VehicleDetail = {
  id: string
  make: string
  model_name: string
  year: number
  plate_number: string | null
  color: string | null
  transmission: string
  fuel_type: string
  seats: number
  doors: number
  status: string
  city: string | null
  seller_id: string
  description: string | null
  photos: string[] | null
  created_at: string
  category: { name: string } | null
  rate: { daily_rate: number; weekly_rate: number | null; monthly_rate: number | null } | null
  terms: { security_deposit: number; insurance_level: string; fuel_policy: string } | null
  bookings: any[]
}

const VehicleDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [vehicle, setVehicle] = useState<VehicleDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/admin/vehicles/${id}`, { credentials: "include" })
      .then((r) => r.json())
      .then((res) => setVehicle(res.vehicle))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <Container><Text>Loading...</Text></Container>
  if (!vehicle) return <Container><Text>Vehicle not found</Text></Container>

  const rate = vehicle.rate ? Number(vehicle.rate.daily_rate).toLocaleString("en-AE") : "—"

  return (
    <Container>
      <Button variant="transparent" onClick={() => navigate("/dashboard/vehicles")} className="mb-4">
        <ArrowLeft /> Back to Vehicles
      </Button>
      <div className="flex items-center justify-between mb-6">
        <div>
          <Heading>{vehicle.make} {vehicle.model_name} ({vehicle.year})</Heading>
          <Text className="text-ui-fg-subtle mt-1">ID: {vehicle.id}</Text>
        </div>
        <Badge color={vehicle.status === "published" ? "green" : vehicle.status === "draft" ? "grey" : "red"}>
          {vehicle.status}
        </Badge>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <div className="bg-ui-bg-base rounded-lg p-4 border">
            <Heading level="h2">Details</Heading>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div><Text size="small" className="text-ui-fg-subtle">Make</Text><Text>{vehicle.make}</Text></div>
              <div><Text size="small" className="text-ui-fg-subtle">Model</Text><Text>{vehicle.model_name}</Text></div>
              <div><Text size="small" className="text-ui-fg-subtle">Year</Text><Text>{vehicle.year}</Text></div>
              <div><Text size="small" className="text-ui-fg-subtle">Color</Text><Text>{vehicle.color || "—"}</Text></div>
              <div><Text size="small" className="text-ui-fg-subtle">Plate</Text><Text>{vehicle.plate_number || "—"}</Text></div>
              <div><Text size="small" className="text-ui-fg-subtle">Transmission</Text><Text>{vehicle.transmission}</Text></div>
              <div><Text size="small" className="text-ui-fg-subtle">Fuel</Text><Text>{vehicle.fuel_type}</Text></div>
              <div><Text size="small" className="text-ui-fg-subtle">Seats / Doors</Text><Text>{vehicle.seats} / {vehicle.doors}</Text></div>
              <div><Text size="small" className="text-ui-fg-subtle">City</Text><Text>{vehicle.city || "—"}</Text></div>
              <div><Text size="small" className="text-ui-fg-subtle">Category</Text><Text>{vehicle.category?.name || "—"}</Text></div>
            </div>
          </div>

          {vehicle.description && (
            <div className="bg-ui-bg-base rounded-lg p-4 border">
              <Heading level="h2">Description</Heading>
              <Text className="mt-2">{vehicle.description}</Text>
            </div>
          )}

          <div className="bg-ui-bg-base rounded-lg p-4 border">
            <Heading level="h2">Recent Bookings</Heading>
            {vehicle.bookings.length === 0 ? (
              <Text className="text-ui-fg-subtle mt-2">No bookings yet</Text>
            ) : (
              <div className="mt-2 space-y-2">
                {vehicle.bookings.slice(0, 5).map((b: any) => (
                  <div key={b.id} className="flex justify-between p-2 bg-ui-bg-component rounded">
                    <Text size="small">{b.customer_name || "—"}</Text>
                    <Badge size="small">{b.status}</Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-ui-bg-base rounded-lg p-4 border">
            <Heading level="h2">Pricing</Heading>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between"><Text size="small" className="text-ui-fg-subtle">Daily Rate</Text><Text weight="plus">{rate} AED</Text></div>
              {vehicle.rate?.weekly_rate && <div className="flex justify-between"><Text size="small" className="text-ui-fg-subtle">Weekly</Text><Text>{Number(vehicle.rate.weekly_rate).toLocaleString("en-AE")} AED</Text></div>}
              {vehicle.rate?.monthly_rate && <div className="flex justify-between"><Text size="small" className="text-ui-fg-subtle">Monthly</Text><Text>{Number(vehicle.rate.monthly_rate).toLocaleString("en-AE")} AED</Text></div>}
            </div>
          </div>

          <div className="bg-ui-bg-base rounded-lg p-4 border">
            <Heading level="h2">Terms</Heading>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between"><Text size="small" className="text-ui-fg-subtle">Deposit</Text><Text>{vehicle.terms?.security_deposit ? `${Number(vehicle.terms.security_deposit).toLocaleString("en-AE")} AED` : "—"}</Text></div>
              <div className="flex justify-between"><Text size="small" className="text-ui-fg-subtle">Insurance</Text><Text>{vehicle.terms?.insurance_level || "—"}</Text></div>
              <div className="flex justify-between"><Text size="small" className="text-ui-fg-subtle">Fuel Policy</Text><Text>{vehicle.terms?.fuel_policy || "—"}</Text></div>
            </div>
          </div>

          <div className="bg-ui-bg-base rounded-lg p-4 border">
            <Heading level="h2">Seller</Heading>
            <Text className="mt-2" size="small">{vehicle.seller_id}</Text>
          </div>
        </div>
      </div>
    </Container>
  )
}

export default VehicleDetailPage
