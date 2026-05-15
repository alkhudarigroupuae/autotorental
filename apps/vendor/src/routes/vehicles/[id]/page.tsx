import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { Container, Heading, Text, Button, StatusBadge, Badge, toast } from "@medusajs/ui"
import { TwoColumnPage, SectionRow } from "@mercurjs/dashboard-shared"
import { PencilSquare, Trash } from "@medusajs/icons"

type FeatureItem = {
  id: string
  name: string
  name_ar: string
  icon: string | null
  category: string
}

const categoryLabels: Record<string, string> = {
  comfort: "الراحة",
  safety: "الأمان",
  tech: "التقنية",
  audio: "الصوت",
  other: "أخرى",
}

const VehicleDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [vehicle, setVehicle] = useState<Record<string, unknown> | null>(null)
  const [rates, setRates] = useState<Record<string, unknown> | null>(null)
  const [terms, setTerms] = useState<Record<string, unknown> | null>(null)
  const [features, setFeatures] = useState<FeatureItem[]>([])

  useEffect(() => {
    Promise.all([
      fetch(`/vendor/vehicles/${id}`, { credentials: "include" }).then((r) => r.json()),
      fetch("/vendor/vehicle-features", { credentials: "include" }).then((r) => r.json()),
    ])
      .then(([vehRes, featRes]) => {
        setVehicle(vehRes.vehicle)
        setRates(vehRes.rates)
        setTerms(vehRes.terms)
        setFeatures(featRes.features || [])
      })
      .catch(() => toast.error("فشل تحميل بيانات المركبة"))
      .finally(() => setLoading(false))
  }, [id])

  const handleDelete = async () => {
    try {
      await fetch(`/vendor/vehicles/${id}`, {
        method: "DELETE",
        credentials: "include",
      })
      toast.success("تم حذف المركبة")
      navigate("/vehicles")
    } catch {
      toast.error("فشل حذف المركبة")
    }
  }

  if (loading) {
    return (
      <Container>
        <Text>جاري التحميل...</Text>
      </Container>
    )
  }

  if (!vehicle) {
    return (
      <Container>
        <Text>المركبة غير موجودة</Text>
      </Container>
    )
  }

  const statusColor: "green" | "grey" | "red" =
    vehicle.status === "published" ? "green"
    : vehicle.status === "draft" ? "grey"
    : "red"

  const statusLabel =
    vehicle.status === "published" ? "منشور"
    : vehicle.status === "draft" ? "مسودة"
    : "غير منشور"

  const vehicleFeatureIds = (vehicle.features as string[]) || []
  const vehicleFeatures = features.filter((f) => vehicleFeatureIds.includes(f.id))

  const groupedFeatures = vehicleFeatures.reduce<Record<string, FeatureItem[]>>((acc, f) => {
    if (!acc[f.category]) acc[f.category] = []
    acc[f.category].push(f)
    return acc
  }, {})

  return (
    <TwoColumnPage>
      <TwoColumnPage.Main>
        <div className="flex items-center justify-between mb-6">
          <div>
            <Heading level="h1">
              {String(vehicle.make)} {String(vehicle.model_name)} ({String(vehicle.year)})
            </Heading>
            <Text className="text-ui-fg-subtle">
              {vehicle.plate_number ? `لوحة: ${vehicle.plate_number}` : "بدون لوحة"}
              {vehicle.city ? ` — ${vehicle.city}` : ""}
            </Text>
          </div>
          <StatusBadge color={statusColor}>{statusLabel}</StatusBadge>
        </div>

        <SectionRow
          title="الصانع"
          value={vehicle.make as string}
        />
        <SectionRow
          title="الموديل"
          value={vehicle.model_name as string}
        />
        <SectionRow
          title="السنة"
          value={String(vehicle.year)}
        />
        <SectionRow
          title="ناقل الحركة"
          value={vehicle.transmission === "automatic" ? "أوتوماتيك" : "يدوي"}
        />
        <SectionRow
          title="نوع الوقود"
          value={vehicle.fuel_type as string}
        />
        <SectionRow
          title="المقاعد"
          value={String(vehicle.seats)}
        />
        <SectionRow
          title="الأبواب"
          value={String(vehicle.doors)}
        />
        <SectionRow
          title="اللون"
          value={(vehicle.color as string) || "—"}
        />
        {(vehicle.description as string) && (
          <SectionRow
            title="الوصف"
            value={vehicle.description as string}
          />
        )}

        {vehicleFeatures.length > 0 && (
          <div className="mt-6">
            <Heading level="h2" className="mb-4">المميزات</Heading>
            {Object.entries(groupedFeatures).map(([cat, feats]) => (
              <div key={cat} className="mb-4">
                <Text className="font-semibold text-ui-fg-subtle mb-2">
                  {categoryLabels[cat] || cat}
                </Text>
                <div className="flex flex-wrap gap-2">
                  {feats.map((f) => (
                    <Badge key={f.id} size="small" color="green">
                      {f.name_ar || f.name}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {rates && (
          <>
            <SectionRow
              title="السعر اليومي"
              value={`${Number(rates.daily_rate).toLocaleString()} د.إ`}
            />
            {rates.weekly_rate && (
              <SectionRow
                title="السعر الأسبوعي"
                value={`${Number(rates.weekly_rate).toLocaleString()} د.إ`}
              />
            )}
            {rates.monthly_rate && (
              <SectionRow
                title="السعر الشهري"
                value={`${Number(rates.monthly_rate).toLocaleString()} د.إ`}
              />
            )}
          </>
        )}

        {terms && (
          <>
            <SectionRow
              title="الحد الأدنى للعمر"
              value={`${String(terms.min_driver_age)} سنة`}
            />
            <SectionRow
              title="التأمين"
              value={terms.insurance_level === "full" ? "شامل" : "أساسي"}
            />
            <SectionRow
              title="الحد الأدنى لأيام الإيجار"
              value={`${String(terms.min_rental_days)} يوم`}
            />
            <SectionRow
              title="سياسة الوقود"
              value={terms.fuel_policy === "full_to_full" ? "كامل بكامل" : "مثل ما استلمت"}
            />
          </>
        )}
      </TwoColumnPage.Main>

      <TwoColumnPage.Sidebar>
        <div className="flex flex-col gap-y-4">
          <Button
            variant="secondary"
            className="w-full"
            onClick={() => navigate(`/vehicles/${id}/edit`)}
          >
            <PencilSquare />
            تعديل
          </Button>
          <Button
            variant="danger"
            className="w-full"
            onClick={handleDelete}
          >
            <Trash />
            حذف
          </Button>
        </div>
      </TwoColumnPage.Sidebar>
    </TwoColumnPage>
  )
}

export default VehicleDetailPage
