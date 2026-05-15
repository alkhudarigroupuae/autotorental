import { useState, useEffect } from "react"
import { Container, Heading, Text, StatusBadge, Badge } from "@medusajs/ui"
import { DataTable } from "@mercurjs/dashboard-shared"
import { createColumnHelper } from "@tanstack/react-table"
import { Calendar } from "@medusajs/icons"
import type { RouteConfig } from "@mercurjs/dashboard-sdk"

export const config: RouteConfig = {
  label: "الحجوزات",
  icon: Calendar,
}

const statusLabels: Record<string, string> = {
  enquiry: "استفسار",
  quoted: "بعرض سعر",
  confirmed: "مؤكد",
  active: "نشط",
  completed: "مكتمل",
  cancelled: "ملغي",
  rejected: "مرفوض",
}

const statusColors: Record<string, "grey" | "green" | "red" | "orange" | "blue" | "purple"> = {
  enquiry: "grey",
  quoted: "blue",
  confirmed: "green",
  active: "purple",
  completed: "green",
  cancelled: "red",
  rejected: "red",
}

const paymentLabels: Record<string, string> = {
  pending: "قيد الانتظار",
  advance_paid: "تم دفع العربون",
  balance_paid: "تم الدفع كاملاً",
  refunded: "تم الاسترجاع",
}

const paymentColors: Record<string, "grey" | "green" | "red" | "orange" | "blue" | "purple"> = {
  pending: "orange",
  advance_paid: "blue",
  balance_paid: "green",
  refunded: "grey",
}

type BookingRow = {
  id: string
  customer_id: string
  vehicle_id: string
  vehicle: { make: string; model_name: string; plate_number: string | null } | null
  status: string
  payment_status: string
  pickup_date: string
  return_date: string
  quoted_total: number
  created_at: string
}

const columnHelper = createColumnHelper<BookingRow>()

const columns = [
  columnHelper.accessor((row) =>
    row.vehicle ? `${row.vehicle.make} ${row.vehicle.model_name}` : "—",
    {
      id: "vehicle",
      header: "المركبة",
      cell: ({ row }) => (
        <div>
          <Text>
            {row.original.vehicle
              ? `${row.original.vehicle.make} ${row.original.vehicle.model_name}`
              : "—"}
          </Text>
          {row.original.vehicle?.plate_number && (
            <Text className="text-ui-fg-subtle text-sm">
              {row.original.vehicle.plate_number}
            </Text>
          )}
        </div>
      ),
    }
  ),
  columnHelper.accessor("customer_id", {
    header: "العميل",
    cell: ({ getValue }) => String(getValue()).slice(0, 8) + "…",
  }),
  columnHelper.accessor("pickup_date", {
    header: "تاريخ البداية",
    cell: ({ getValue }) => new Date(getValue()).toLocaleDateString("ar-AE"),
  }),
  columnHelper.accessor("return_date", {
    header: "تاريخ النهاية",
    cell: ({ getValue }) => new Date(getValue()).toLocaleDateString("ar-AE"),
  }),
  columnHelper.accessor("status", {
    header: "الحالة",
    cell: ({ getValue }) => {
      const v = getValue()
      return (
        <StatusBadge color={statusColors[v] || "grey"}>
          {statusLabels[v] || v}
        </StatusBadge>
      )
    },
  }),
  columnHelper.accessor("payment_status", {
    header: "الدفع",
    cell: ({ getValue }) => {
      const v = getValue()
      return (
        <Badge color={paymentColors[v] || "grey"} size="small">
          {paymentLabels[v] || v}
        </Badge>
      )
    },
  }),
  columnHelper.accessor("quoted_total", {
    header: "المبلغ الإجمالي",
    cell: ({ getValue }) =>
      `${Number(getValue()).toLocaleString()} د.إ`,
  }),
]

const BookingListPage = () => {
  const [data, setData] = useState<BookingRow[]>([])
  const [count, setCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch("/vendor/bookings", { credentials: "include" })
      .then((r) => r.json())
      .then((res) => {
        setData(res.bookings || [])
        setCount(res.count || 0)
      })
      .catch(console.error)
      .finally(() => setIsLoading(false))
  }, [])

  return (
    <Container className="flex flex-col gap-y-4">
      <div className="flex items-center justify-between">
        <div>
          <Heading level="h1">الحجوزات</Heading>
          <Text className="text-ui-fg-subtle">إدارة حجوزات العملاء</Text>
        </div>
      </div>
      <DataTable
        data={data}
        columns={columns}
        rowCount={count}
        pageSize={20}
        enablePagination
        enableSearch
        isLoading={isLoading}
        emptyState={{
          empty: {
            heading: "لا توجد حجوزات",
            description: "لم يتم إنشاء أي حجز بعد",
          },
        }}
        getRowId={(row) => row.id}
        rowHref={(row) => `/bookings/${row.id}`}
      />
    </Container>
  )
}

export default BookingListPage
