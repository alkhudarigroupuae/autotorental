import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { Container, Heading, Text, Button, StatusBadge, Badge, toast } from "@medusajs/ui"
import { TwoColumnPage, SectionRow } from "@mercurjs/dashboard-shared"

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

const allowedTransitions: Record<string, string[]> = {
  enquiry: ["quoted", "cancelled", "rejected"],
  quoted: ["confirmed", "cancelled", "rejected"],
  confirmed: ["active", "cancelled"],
  active: ["completed"],
}

const actionLabels: Record<string, string> = {
  quoted: "عرض سعر",
  confirmed: "تأكيد",
  active: "بدء الحجز",
  completed: "إكمال",
  cancelled: "إلغاء",
  rejected: "رفض",
}

const actionVariants: Record<string, "primary" | "secondary" | "danger"> = {
  quoted: "primary",
  confirmed: "primary",
  active: "primary",
  completed: "primary",
  cancelled: "danger",
  rejected: "danger",
}

const BookingDetailPage = () => {
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [booking, setBooking] = useState<Record<string, unknown> | null>(null)

  useEffect(() => {
    fetch(`/vendor/bookings/${id}`, { credentials: "include" })
      .then((r) => r.json())
      .then((res) => {
        setBooking(res.booking)
      })
      .catch(() => toast.error("فشل تحميل بيانات الحجز"))
      .finally(() => setLoading(false))
  }, [id])

  const handleStatusUpdate = async (status: string) => {
    try {
      const res = await fetch(`/vendor/bookings/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.message || "فشل تحديث الحالة")
      }
      const data = await res.json()
      setBooking(data.booking)
      toast.success(`تم تحديث الحالة إلى ${statusLabels[status] || status}`)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "فشل تحديث الحالة")
    }
  }

  if (loading) {
    return (
      <Container>
        <Text>جاري التحميل...</Text>
      </Container>
    )
  }

  if (!booking) {
    return (
      <Container>
        <Text>الحجز غير موجود</Text>
      </Container>
    )
  }

  const vehicle = booking.vehicle as Record<string, unknown> | null
  const status = booking.status as string
  const paymentStatus = booking.payment_status as string
  const nextActions = allowedTransitions[status] || []

  return (
    <TwoColumnPage>
      <TwoColumnPage.Main>
        <div className="flex items-center justify-between mb-6">
          <div>
            <Heading level="h1">
              {vehicle ? `${String(vehicle.make)} ${String(vehicle.model_name)}` : "حجز"}
            </Heading>
            <Text className="text-ui-fg-subtle">
              {vehicle?.plate_number
                ? `لوحة: ${vehicle.plate_number}`
                : `حجز #${String(booking.id).slice(0, 8)}`}
            </Text>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge color={statusColors[status] || "grey"}>
              {statusLabels[status] || status}
            </StatusBadge>
            <Badge color={paymentColors[paymentStatus] || "grey"} size="small">
              {paymentLabels[paymentStatus] || paymentStatus}
            </Badge>
          </div>
        </div>

        <Heading level="h2" className="mb-4">معلومات المركبة</Heading>
        <SectionRow title="الصانع" value={vehicle ? String((vehicle as any).make) : "—"} />
        <SectionRow title="الموديل" value={vehicle ? String((vehicle as any).model_name) : "—"} />
        {(vehicle as any)?.plate_number && (
          <SectionRow title="اللوحة" value={String((vehicle as any).plate_number)} />
        )}

        <Heading level="h2" className="mb-4 mt-6">معلومات العميل</Heading>
        <SectionRow title="معرف العميل" value={String(booking.customer_id)} />

        <Heading level="h2" className="mb-4 mt-6">تواريخ الحجز</Heading>
        <SectionRow
          title="تاريخ الاستلام"
          value={new Date(booking.pickup_date as string).toLocaleDateString("ar-AE")}
        />
        <SectionRow
          title="تاريخ الإرجاع"
          value={new Date(booking.return_date as string).toLocaleDateString("ar-AE")}
        />
        {(booking.pickup_location as string) && (
          <SectionRow
            title="موقع الاستلام"
            value={booking.pickup_location as string}
          />
        )}
        {(booking.return_location as string) && (
          <SectionRow
            title="موقع الإرجاع"
            value={booking.return_location as string}
          />
        )}

        <Heading level="h2" className="mb-4 mt-6">التسعير</Heading>
        <SectionRow
          title="الإجمالي المعروض"
          value={`${Number(booking.quoted_total).toLocaleString()} د.إ`}
        />
        <SectionRow
          title="العربون"
          value={`${Number(booking.advance_amount).toLocaleString()} د.إ`}
        />
        <SectionRow
          title="المبلغ المتبقي"
          value={`${Number(booking.balance_amount).toLocaleString()} د.إ`}
        />
        <SectionRow
          title="التأمين"
          value={`${Number(booking.deposit_amount).toLocaleString()} د.إ`}
        />

        {(booking.notes as string) && (
          <>
            <Heading level="h2" className="mb-4 mt-6">ملاحظات</Heading>
            <SectionRow title="الملاحظات" value={booking.notes as string} />
          </>
        )}
      </TwoColumnPage.Main>

      <TwoColumnPage.Sidebar>
        {nextActions.length > 0 && (
          <div className="flex flex-col gap-y-2">
            <Text className="font-semibold text-ui-fg-subtle mb-2">
              إجراءات
            </Text>
            {nextActions.map((action) => (
              <Button
                key={action}
                variant={actionVariants[action] || "secondary"}
                className="w-full"
                onClick={() => handleStatusUpdate(action)}
              >
                {actionLabels[action] || action}
              </Button>
            ))}
          </div>
        )}
      </TwoColumnPage.Sidebar>
    </TwoColumnPage>
  )
}

export default BookingDetailPage
