import { useState, useEffect } from "react"
import { Container, Heading, Text, Badge } from "@medusajs/ui"
import { DataTable } from "@mercurjs/dashboard-shared"
import { createColumnHelper } from "@tanstack/react-table"
import { BuildingStorefront } from "@medusajs/icons"
import type { RouteConfig } from "@mercurjs/dashboard-sdk"

export const config: RouteConfig = {
  label: "Vehicles",
  icon: BuildingStorefront,
}

type VehicleRow = {
  id: string
  make: string
  model_name: string
  year: number
  plate_number: string | null
  status: string
  seller_id: string
  created_at: string
}

const columnHelper = createColumnHelper<VehicleRow>()

const columns = [
  columnHelper.accessor((row) => `${row.make} ${row.model_name}`, {
    id: "name",
    header: "Vehicle",
    cell: ({ getValue }) => <Text size="small" weight="plus">{getValue()}</Text>,
  }),
  columnHelper.accessor("year", {
    header: "Year",
    cell: ({ getValue }) => String(getValue()),
  }),
  columnHelper.accessor("plate_number", {
    header: "Plate",
    cell: ({ getValue }) => getValue() || "—",
  }),
  columnHelper.accessor("seller_id", {
    header: "Seller",
    cell: ({ getValue }) => (getValue() ? getValue().slice(0, 8) + "..." : "—"),
  }),
  columnHelper.accessor("status", {
    header: "Status",
    cell: ({ getValue }) => {
      const v = getValue()
      const color = v === "published" ? "green" : v === "draft" ? "grey" : "red"
      return <Badge color={color}>{v}</Badge>
    },
  }),
  columnHelper.accessor("created_at", {
    header: "Created",
    cell: ({ getValue }) => new Date(getValue()).toLocaleDateString("en-GB"),
  }),
] as any

const VehicleListPage = () => {
  const [data, setData] = useState<VehicleRow[]>([])
  const [count, setCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch("/admin/vehicles", { credentials: "include" })
      .then((r) => r.json())
      .then((res) => {
        setData(res.vehicles || [])
        setCount(res.count || 0)
      })
      .catch(console.error)
      .finally(() => setIsLoading(false))
  }, [])

  return (
    <Container>
      <div className="flex items-center justify-between mb-6">
        <div>
          <Heading>Vehicles</Heading>
          <Text className="text-ui-fg-subtle mt-1">
            Manage all vehicles across vendors
          </Text>
        </div>
      </div>
      <DataTable
        columns={columns}
        data={data}
        pageSize={20}
        rowCount={count}
        enablePagination
        isLoading={isLoading}
        getRowId={(row: any) => row.id}
        rowHref={(row: any) => `/vehicles/${row.id}`}
      />
    </Container>
  )
}

export default VehicleListPage
