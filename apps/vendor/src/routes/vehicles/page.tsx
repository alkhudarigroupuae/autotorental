import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Container, Heading, Text, Button } from "@medusajs/ui"
import { DataTable } from "@mercurjs/dashboard-shared"
import { createColumnHelper } from "@tanstack/react-table"
import { Buildings, PlusMini } from "@medusajs/icons"
import type { RouteConfig } from "@mercurjs/dashboard-sdk"

export const config: RouteConfig = {
  label: "المركبات",
  icon: Buildings,
}

type VehicleRow = {
  id: string
  make: string
  model_name: string
  year: number
  plate_number: string | null
  status: string
  created_at: string
}

const columnHelper = createColumnHelper<VehicleRow>()

const columns = [
  columnHelper.accessor((row) => `${row.make} ${row.model_name}`, {
    id: "name",
    header: "المركبة",
    cell: ({ getValue }) => getValue(),
  }),
  columnHelper.accessor("year", {
    header: "السنة",
    cell: ({ getValue }) => String(getValue()),
  }),
  columnHelper.accessor("plate_number", {
    header: "اللوحة",
    cell: ({ getValue }) => getValue() || "—",
  }),
  columnHelper.accessor("status", {
    header: "الحالة",
    cell: ({ getValue }) => {
      const v = getValue()
      return v === "published" ? "منشور" : v === "draft" ? "مسودة" : "غير منشور"
    },
  }),
  columnHelper.accessor("created_at", {
    header: "تاريخ الإضافة",
    cell: ({ getValue }) => new Date(getValue()).toLocaleDateString("ar-AE"),
  }),
]

const VehicleListPage = () => {
  const navigate = useNavigate()
  const [data, setData] = useState<VehicleRow[]>([])
  const [count, setCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch("/vendor/vehicles", { credentials: "include" })
      .then((r) => r.json())
      .then((res) => {
        setData(res.vehicles || [])
        setCount(res.count || 0)
      })
      .catch(console.error)
      .finally(() => setIsLoading(false))
  }, [])

  return (
    <Container className="flex flex-col gap-y-4">
      <div className="flex items-center justify-between">
        <div>
          <Heading level="h1">المركبات</Heading>
          <Text className="text-ui-fg-subtle">إدارة أسطول مركباتك</Text>
        </div>
        <Button variant="primary" onClick={() => navigate("/vehicles/new")}>
          <PlusMini />
          إضافة مركبة
        </Button>
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
            heading: "لا توجد مركبات",
            description: "لم تقم بإضافة أي مركبة بعد",
          },
        }}
        getRowId={(row) => row.id}
        rowHref={(row) => `/vehicles/${row.id}`}
      />
    </Container>
  )
}

export default VehicleListPage
