import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { RouteDrawer, Form } from "@mercurjs/dashboard-shared"
import { Button, Input, Select, Textarea, Heading, Text, Switch, toast } from "@medusajs/ui"
import { useForm } from "react-hook-form"

type FeatureItem = {
  id: string
  name: string
  name_ar: string
  icon: string | null
  category: string
}

type CategoryItem = {
  id: string
  name: string
  name_ar: string
}

type VehicleForm = {
  make: string
  model_name: string
  year: number
  transmission: string
  fuel_type: string
  seats: number
  doors: number
  color: string
  plate_number: string
  plate_region: string
  vin: string
  description: string
  city: string
  status: string
  category_id: string
  daily_rate: number
  weekly_rate: number
  monthly_rate: number
  weekly_mileage_limit: number
  monthly_mileage_limit: number
  extra_km_charge: number
  min_driver_age: number
  security_deposit: number
  is_zero_deposit: boolean
  insurance_level: string
  fuel_policy: string
  min_rental_days: number
  delivery_available: boolean
  delivery_fee: number
  additional_driver_fee: number
  child_seat_fee: number
}

const categoryLabels: Record<string, string> = {
  comfort: "الراحة",
  safety: "الأمان",
  tech: "التقنية",
  audio: "الصوت",
  other: "أخرى",
}

const categoryOrder = ["comfort", "safety", "tech", "audio", "other"] as const

const EditVehiclePage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("info")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [features, setFeatures] = useState<FeatureItem[]>([])
  const [selectedFeatures, setSelectedFeatures] = useState<Set<string>>(new Set())
  const [categories, setCategories] = useState<CategoryItem[]>([])
  const [photoUrls, setPhotoUrls] = useState("")

  const form = useForm<VehicleForm>()
  const { register, handleSubmit, watch, setValue, reset } = form

  const toggleFeature = (fid: string) => {
    setSelectedFeatures((prev) => {
      const next = new Set(prev)
      if (next.has(fid)) next.delete(fid)
      else next.add(fid)
      return next
    })
  }

  useEffect(() => {
    Promise.all([
      fetch("/vendor/vehicle-features", { credentials: "include" }).then((r) => r.json()),
      fetch("/vendor/vehicle-categories", { credentials: "include" }).then((r) => r.json()),
      fetch(`/vendor/vehicles/${id}`, { credentials: "include" }).then((r) => r.json()),
    ])
      .then(([featRes, catRes, vehRes]) => {
        setFeatures(featRes.features || [])
        setCategories(catRes.categories || [])

        const v = vehRes.vehicle
        if (v.photos && Array.isArray(v.photos)) {
          setPhotoUrls((v.photos as string[]).join("\n"))
        }
        const r = vehRes.rates || {}
        const t = vehRes.terms || {}

        if (v.features) {
          setSelectedFeatures(new Set(v.features as string[]))
        }

        reset({
          make: v.make || "",
          model_name: v.model_name || "",
          year: v.year || new Date().getFullYear(),
          transmission: v.transmission || "automatic",
          category_id: v.category_id || "",
          fuel_type: v.fuel_type || "petrol",
          seats: v.seats || 5,
          doors: v.doors || 4,
          color: v.color || "",
          plate_number: v.plate_number || "",
          plate_region: v.plate_region || "",
          vin: v.vin || "",
          description: v.description || "",
          city: v.city || "",
          status: v.status || "draft",
          daily_rate: Number(r.daily_rate) || 0,
          weekly_rate: Number(r.weekly_rate) || 0,
          monthly_rate: Number(r.monthly_rate) || 0,
          weekly_mileage_limit: r.weekly_mileage_limit || 0,
          monthly_mileage_limit: r.monthly_mileage_limit || 0,
          extra_km_charge: Number(r.extra_km_charge) || 0,
          min_driver_age: t.min_driver_age || 21,
          security_deposit: Number(t.security_deposit) || 0,
          is_zero_deposit: t.is_zero_deposit || false,
          insurance_level: t.insurance_level || "basic",
          fuel_policy: t.fuel_policy || "same_to_same",
          min_rental_days: t.min_rental_days || 1,
          delivery_available: t.delivery_available || false,
          delivery_fee: Number(t.delivery_fee) || 0,
          additional_driver_fee: Number(t.additional_driver_fee) || 0,
          child_seat_fee: Number(t.child_seat_fee) || 0,
        })
      })
      .catch(() => toast.error("فشل تحميل بيانات المركبة"))
      .finally(() => setLoading(false))
  }, [id, reset])

  const onSubmit = async (data: VehicleForm) => {
    setSubmitting(true)
    try {
      const res = await fetch(`/vendor/vehicles/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          make: data.make,
          model_name: data.model_name,
          year: data.year,
          category_id: data.category_id || null,
          transmission: data.transmission,
          fuel_type: data.fuel_type,
          seats: data.seats,
          doors: data.doors,
          color: data.color || null,
          plate_number: data.plate_number || null,
          plate_region: data.plate_region || null,
          vin: data.vin || null,
          description: data.description || null,
          city: data.city || null,
          status: data.status,
          features: Array.from(selectedFeatures),
          photos: photoUrls.trim() ? photoUrls.split("\n").map((u) => u.trim()).filter(Boolean) : null,
          rates: {
            daily_rate: data.daily_rate,
            weekly_rate: data.weekly_rate || null,
            monthly_rate: data.monthly_rate || null,
            weekly_mileage_limit: data.weekly_mileage_limit || null,
            monthly_mileage_limit: data.monthly_mileage_limit || null,
            extra_km_charge: data.extra_km_charge || null,
          },
          terms: {
            min_driver_age: data.min_driver_age,
            security_deposit: data.security_deposit,
            is_zero_deposit: data.is_zero_deposit,
            insurance_level: data.insurance_level,
            fuel_policy: data.fuel_policy,
            min_rental_days: data.min_rental_days,
            delivery_available: data.delivery_available,
            delivery_fee: data.delivery_fee || null,
            additional_driver_fee: data.additional_driver_fee || null,
            child_seat_fee: data.child_seat_fee || null,
          },
        }),
      })

      if (!res.ok) throw new Error("فشل التحديث")

      toast.success("تم تحديث المركبة بنجاح")
      navigate(`/vehicles/${id}`)
    } catch (err) {
      toast.error((err as Error).message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <RouteDrawer>
        <RouteDrawer.Header>
          <Heading level="h2">جاري التحميل...</Heading>
        </RouteDrawer.Header>
      </RouteDrawer>
    )
  }

  return (
    <RouteDrawer>
      <RouteDrawer.Header>
        <Heading level="h2">تعديل المركبة</Heading>
      </RouteDrawer.Header>
      <RouteDrawer.Body>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-6">
            <div className="flex gap-x-2 border-b pb-2">
              {["info", "pricing", "terms", "features"].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1 rounded text-sm ${
                    activeTab === tab ? "bg-ui-bg-base shadow-elevation-card-rest" : ""
                  }`}
                >
                  {tab === "info" ? "المعلومات" : tab === "pricing" ? "السعر" : tab === "terms" ? "الشروط" : "المميزات"}
                </button>
              ))}
            </div>

            {activeTab === "info" && (
              <div className="flex flex-col gap-y-3">
                <Input placeholder="الصانع" {...register("make", { required: true })} />
                <Input placeholder="الموديل" {...register("model_name", { required: true })} />
                <div className="grid grid-cols-2 gap-2">
                  <Input type="number" placeholder="السنة" {...register("year", { valueAsNumber: true })} />
                  <Select {...register("category_id")}>
                    <option value="">اختر الفئة</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name_ar || c.name}
                      </option>
                    ))}
                  </Select>
                </div>
                <Select {...register("transmission")}>
                  <option value="automatic">أوتوماتيك</option>
                  <option value="manual">يدوي</option>
                </Select>
                <Select {...register("fuel_type")}>
                  <option value="petrol">بنزين</option>
                  <option value="diesel">ديزل</option>
                  <option value="hybrid">هايبرد</option>
                  <option value="electric">كهرباء</option>
                </Select>
                <div className="grid grid-cols-2 gap-2">
                  <Input type="number" placeholder="مقاعد" {...register("seats", { valueAsNumber: true })} />
                  <Input type="number" placeholder="أبواب" {...register("doors", { valueAsNumber: true })} />
                </div>
                <Input placeholder="اللون" {...register("color")} />
                <Input placeholder="رقم اللوحة" {...register("plate_number")} />
                <Input placeholder="رقم الشاصي" {...register("vin")} />
                <Input placeholder="المدينة" {...register("city")} />
                <Textarea placeholder="الوصف" {...register("description")} />
                <Textarea
                  placeholder="روابط الصور (رابط واحد لكل سطر)"
                  value={photoUrls}
                  onChange={(e) => setPhotoUrls(e.target.value)}
                />
                <Select {...register("status")}>
                  <option value="draft">مسودة</option>
                  <option value="published">منشور</option>
                  <option value="unpublished">غير منشور</option>
                </Select>
              </div>
            )}

            {activeTab === "pricing" && (
              <div className="flex flex-col gap-y-3">
                <Input type="number" placeholder="السعر اليومي" {...register("daily_rate", { valueAsNumber: true })} />
                <div className="grid grid-cols-2 gap-2">
                  <Input type="number" placeholder="السعر الأسبوعي" {...register("weekly_rate", { valueAsNumber: true })} />
                  <Input type="number" placeholder="السعر الشهري" {...register("monthly_rate", { valueAsNumber: true })} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Input type="number" placeholder="حد km أسبوعي" {...register("weekly_mileage_limit", { valueAsNumber: true })} />
                  <Input type="number" placeholder="حد km شهري" {...register("monthly_mileage_limit", { valueAsNumber: true })} />
                </div>
                <Input type="number" placeholder="رسوم km إضافي" {...register("extra_km_charge", { valueAsNumber: true })} />
              </div>
            )}

            {activeTab === "terms" && (
              <div className="flex flex-col gap-y-3">
                <Input type="number" placeholder="الحد الأدنى للعمر" {...register("min_driver_age", { valueAsNumber: true })} />
                <Input type="number" placeholder="التأمين" {...register("security_deposit", { valueAsNumber: true })} />
                <div className="flex items-center gap-x-2">
                  <Switch checked={watch("is_zero_deposit")} onCheckedChange={(v) => setValue("is_zero_deposit", v)} />
                  <Text className="text-sm">بدون تأمين</Text>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Select {...register("insurance_level")}>
                    <option value="basic">أساسي</option>
                    <option value="full">شامل</option>
                  </Select>
                  <Select {...register("fuel_policy")}>
                    <option value="same_to_same">مثل ما استلمت</option>
                    <option value="full_to_full">كامل بكامل</option>
                  </Select>
                </div>
                <Input type="number" placeholder="أقل عدد أيام" {...register("min_rental_days", { valueAsNumber: true })} />
                <div className="flex items-center gap-x-2">
                  <Switch checked={watch("delivery_available")} onCheckedChange={(v) => setValue("delivery_available", v)} />
                  <Text className="text-sm">توصيل متاح</Text>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Input type="number" placeholder="رسوم التوصيل" {...register("delivery_fee", { valueAsNumber: true })} />
                  <Input type="number" placeholder="رسوم سائق إضافي" {...register("additional_driver_fee", { valueAsNumber: true })} />
                </div>
                <Input type="number" placeholder="رسوم كرسي طفل" {...register("child_seat_fee", { valueAsNumber: true })} />
              </div>
            )}

            {activeTab === "features" && (
              <div className="space-y-6">
                {features.length === 0 && (
                  <Text className="text-ui-fg-muted">جاري تحميل المميزات...</Text>
                )}
                {categoryOrder.map((cat) => {
                  const catFeatures = features.filter((f) => f.category === cat)
                  if (catFeatures.length === 0) return null
                  return (
                    <div key={cat}>
                      <Text className="font-semibold mb-3 text-ui-fg-base">
                        {categoryLabels[cat] || cat}
                      </Text>
                      <div className="grid grid-cols-1 gap-2">
                        {catFeatures.map((f) => (
                          <label
                            key={f.id}
                            className={`flex items-center gap-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                              selectedFeatures.has(f.id)
                                ? "bg-ui-bg-base shadow-elevation-card-rest border-ui-border-interactive"
                                : "bg-ui-bg-subtle border-ui-border-base hover:bg-ui-bg-base-hover"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={selectedFeatures.has(f.id)}
                              onChange={() => toggleFeature(f.id)}
                              className="accent-ui-fg-interactive"
                            />
                            <Text className="text-sm">{f.name_ar || f.name}</Text>
                          </label>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            <div className="flex justify-end gap-x-2 pt-4 border-t">
              <Button variant="secondary" type="button" onClick={() => navigate(`/vehicles/${id}`)}>
                إلغاء
              </Button>
              <Button variant="primary" type="submit" disabled={submitting}>
                {submitting ? "جاري الحفظ..." : "حفظ التغييرات"}
              </Button>
            </div>
          </form>
        </Form>
      </RouteDrawer.Body>
    </RouteDrawer>
  )
}

export default EditVehiclePage
