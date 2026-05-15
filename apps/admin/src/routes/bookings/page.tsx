import { useState, useEffect } from "react"
import { Container, Heading, Text, Badge } from "@medusajs/ui"
import { DataTable } from "@mercurjs/dashboard-shared"
import { createColumnHelper } from "@tanstack/react-table"
import { Calendar } from "@medusajs/icons"
import type { RouteConfig } from "@mercurjs/dashboard-sdk"

export const config: RouteConfig = {
  label: "Bookings",
  icon: Calendar,
}

type BookingRow = {
  id: string
  customer_name: string
  vehicle_id: string
  status: string
  pickup_date: string
  return_date: string
  quoted_total: number
  payment_status: string
  created_at: string
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

const columnHelper = createColumnHelper<BookingRow>()

const columns = [
  columnHelper.accessor("customer_name", {
    id: "customer",
    header: "Customer",
    cell: ({ getValue }) => <Text size="small" weight="plus">{getValue() || "—"}</Text>,
  }),
  columnHelper.accessor("vehicle_id", {
    header: "Vehicle ID",
    cell: ({ getValue }) => <Text size="small">{getValue().slice(0, 8)}...</Text>,
  }),
  columnHelper.accessor("status", {
    header: "Status",
    cell: ({ getValue }) => {
      const v = getValue()
      return <Badge color={statusColors[v] || "grey"}>{v}</Badge>
    },
  }),
  columnHelper.accessor("quoted_total", {
    header: "Total",
    cell: ({ getValue }) => `${Number(getValue()).toLocaleString("en-AE")} AED`,
  }),
  columnHelper.accessor("payment_status", {
    header: "Payment",
    cell: ({ getValue }) => (
      <Badge color={getValue() === "balance_paid" ? "green" : "orange"}>{getValue()}</Badge>
    ),
  }),
  columnHelper.accessor("pickup_date", {
    header: "Pickup",
    cell: ({ getValue }) => new Date(getValue()).toLocaleDateString("en-GB"),
  }),
  columnHelper.accessor("return_date", {
    header: "Return",
    cell: ({ getValue }) => new Date(getValue()).toLocaleDateString("en-GB"),
  }),
] as any

const BookingListPage = () => {
  const [data, setData] = useState<BookingRow[]>([])
  const [count, setCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch("/admin/bookings", { credentials: "include" })
      .then((r) => r.json())
      .then((res) => {
        setData(res.bookings || [])
        setCount(res.count || 0)
      })
      .catch(console.error)
      .finally(() => setIsLoading(false))
  }, [])

  return (
    <Container>
      <div className="flex items-center justify-between mb-6">
        <div>
          <Heading>Bookings</Heading>
          <Text className="text-ui-fg-subtle mt-1">
            Manage all bookings across vendors
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
        rowHref={(row: any) => `/bookings/${row.id}`}
      />
    </Container>
  )
}

export default BookingListPage
