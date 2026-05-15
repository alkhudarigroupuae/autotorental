# Auto2Rental — Data Model Design (Phase 1)

## Overview

Custom modules built on top of MedusaJS v2 + Mercur for a UAE car rental marketplace.

---

## 1. Vehicle Module (`vehicle`)

### Core Entity: `Vehicle`

| Field | Type | Notes |
|-------|------|-------|
| `id` | auto-generated | Medusa module ID |
| `seller_id` | foreign key → Mercur Seller | The vendor who owns this car |
| `medusa_product_id` | foreign key → Medusa Product | Optional — links for media/SEO |
| `make` | string | Toyota, BMW, etc. |
| `model` | string | Camry, X5, etc. |
| `year` | integer | 2020, 2024, etc. |
| `category_id` | foreign key → VehicleCategory | Economy, Luxury, SUV, etc. |
| `transmission` | enum | `automatic` / `manual` |
| `fuel_type` | enum | `petrol` / `diesel` / `hybrid` / `electric` |
| `seats` | integer | 2, 4, 5, 7, etc. |
| `doors` | integer | 2, 4 |
| `color` | string | Exterior color |
| `plate_number` | string | UAE plate (e.g., "A 12345") |
| `vin` | string | 17-char VIN number |
| `plate_region` | string | Dubai, Abu Dhabi, etc. |
| `description` | text | Vendor's description |
| `photos` | jsonb | Array of image URLs |
| `specs` | jsonb | Extra specs (engine, mileage, etc.) |
| `features` | jsonb | **Array of feature IDs** — checklist system |
| `entry_method` | enum | `auto_vin` / `auto_plate` / `manual` |
| `status` | enum | `draft` / `published` / `unpublished` |
| `city` | string | Dubai, Abu Dhabi, Sharjah, etc. |
| `lat` | float | Location latitude |
| `lng` | float | Location longitude |
| `created_at` | timestamp | |
| `updated_at` | timestamp | |
| `deleted_at` | timestamp | Soft delete |

### Entity: `VehicleCategory`

| Field | Type | Notes |
|-------|------|-------|
| `id` | auto-generated | |
| `name` | string | Economy, Luxury, Sports, SUV, Commercial, Convertible |
| `name_ar` | string | Arabic translation |
| `description` | text | |
| `is_active` | boolean | Admin-managed |

### Entity: `VehicleFeature`

**The checklist system** — all possible features a vendor can select.

| Field | Type | Notes |
|-------|------|-------|
| `id` | auto-generated | |
| `name` | string | English name |
| `name_ar` | string | Arabic name |
| `icon` | string | Icon identifier |
| `category` | string | Grouping: `comfort`, `safety`, `tech`, `audio`, `other` |
| `is_active` | boolean | Admin-managed |

**Predefined features (seed data):**

| # | English | Arabic | Category |
|---|---------|--------|----------|
| 1 | Bluetooth | بلوتوث | tech |
| 2 | Apple CarPlay / Android Auto | أبل كاربلاي / أندرويد أوتو | tech |
| 3 | GPS Navigation | ملاحة GPS | tech |
| 4 | Sunroof / Moonroof | فتحة سقف | comfort |
| 5 | Leather Seats | مقاعد جلد | comfort |
| 6 | Heated Seats | مقاعد مدفأة | comfort |
| 7 | Ventilated Seats | مقاعد مبردة | comfort |
| 8 | Rear Camera | كاميرا خلفية | safety |
| 9 | Parking Sensors | حساسات موقف | safety |
| 10 | Lane Assist | مساعد المسرب | safety |
| 11 | Cruise Control | مثبت سرعة | tech |
| 12 | Keyless Entry | دخول بدون مفتاح | comfort |
| 13 | Push Start | تشغيل بزر | comfort |
| 14 | USB Charger | شاحن USB | tech |
| 15 | Premium Sound System | نظام صوتي فاخر | audio |
| 16 | Child Seat | كرسي طفل (إضافي) | safety |
| 17 | Roof Rack | حامل أمتعة | other |
| 18 | Dashcam | كاميرا أمامية | safety |

These are admin-managed, so more can be added later.

---

## 2. Rental Module (`rental`)

### Entity: `RentalRate`

| Field | Type | Notes |
|-------|------|-------|
| `id` | auto-generated | |
| `vehicle_id` | foreign key → Vehicle | |
| `daily_rate` | decimal | AED per day |
| `weekly_rate` | decimal | AED per week |
| `monthly_rate` | decimal | AED per month |
| `weekly_mileage_limit` | integer | KM per week |
| `monthly_mileage_limit` | integer | KM per month |
| `extra_km_charge` | decimal | AED per extra KM |
| `currency` | string | Fixed: `AED` |

### Entity: `RentalTerms`

| Field | Type | Notes |
|-------|------|-------|
| `id` | auto-generated | |
| `vehicle_id` | foreign key → Vehicle | |
| `min_driver_age` | integer | e.g., 21, 23, 25 |
| `min_license_age_months` | integer | 0 or 6 (new license handling) |
| `security_deposit` | decimal | AED amount |
| `is_zero_deposit` | boolean | "No deposit" flag |
| `insurance_level` | enum | `basic` / `full` |
| `fuel_policy` | enum | `same_to_same` / `full_to_full` |
| `min_rental_days` | integer | 1 by default |
| `delivery_available` | boolean | Doorstep delivery? |
| `delivery_fee` | decimal | AED |
| `additional_driver_fee` | decimal | AED per day |
| `child_seat_fee` | decimal | AED per rental |

### Entity: `VehicleAvailability`

| Field | Type | Notes |
|-------|------|-------|
| `id` | auto-generated | |
| `vehicle_id` | foreign key → Vehicle | |
| `start_date` | date | |
| `end_date` | date | |
| `booking_id` | foreign key → Booking | Null if blocked by vendor |
| `block_reason` | string | "Maintenance", "Vendor blocked" |

---

## 3. Booking Module (`booking`)

### Entity: `Booking`

| Field | Type | Notes |
|-------|------|-------|
| `id` | auto-generated | |
| `customer_id` | foreign key → Medusa Customer | |
| `vehicle_id` | foreign key → Vehicle | |
| `vendor_id` | foreign key → Mercur Seller | |
| `status` | enum | `enquiry` → `quoted` → `confirmed` → `active` → `completed` → `cancelled` / `rejected` |
| `pickup_date` | timestamp | |
| `return_date` | timestamp | |
| `pickup_location` | string | Text or address |
| `return_location` | string | |
| `quoted_total` | decimal | Full quote amount |
| `advance_amount` | decimal | 20% of total (configurable) |
| `balance_amount` | decimal | Due at pickup |
| `deposit_amount` | decimal | Refundable security deposit |
| `addons` | jsonb | Selected add-ons + fees |
| `payment_status` | enum | `pending` / `advance_paid` / `balance_paid` / `refunded` |
| `channel` | enum | `web` / `whatsapp` |
| `notes` | text | Customer notes |
| `medusa_order_id` | foreign key → Medusa Order | Created when advance captured |
| `post_rental_charges` | jsonb | Salik, fines, extra KM |
| `created_at` | timestamp | |
| `updated_at` | timestamp | |

### Booking Status Flow

```
enquiry ──→ quoted ──→ confirmed ──→ active ──→ completed
                │           │                        │
                ↓           ↓                        ↓
            rejected    cancelled                cancelled
```

### Entity: `BookingAddon`

| Field | Type | Notes |
|-------|------|-------|
| `id` | auto-generated | |
| `booking_id` | foreign key → Booking | |
| `type` | enum | `insurance_upgrade` / `additional_driver` / `child_seat` / `delivery` |
| `label` | string | Display name |
| `price` | decimal | AED |

---

## 4. Pricing Service (`pricing`)

### Quote Calculation Logic

Given: `vehicle_id`, `pickup_date`, `return_date`, `addons[]`

**Step 1 — Duration:**
```
total_days = return_date - pickup_date
```

**Step 2 — Rate Tier Selection (best-value logic):**
```
if total_days >= 28:
    effective_daily_rate = monthly_rate / 30
    mileage_limit = monthly_mileage_limit
elif total_days >= 7:
    effective_daily_rate = weekly_rate / 7
    mileage_limit = weekly_mileage_limit
else:
    effective_daily_rate = daily_rate
    mileage_limit = null (per-day no limit or per-day limit)
```

**Step 3 — Base Calculation:**
```
base = total_days × effective_daily_rate
```

**Step 4 — Add-ons:**
- Delivery fee (if selected)
- Additional driver (selected_days × daily_fee)
- Child seat fee

**Step 5 — VAT (UAE 5%):**
```
vat = (base + addons_total) × 0.05
```

**Step 6 — Totals:**
```
grand_total = base + addons_total + vat
advance_amount = grand_total × 0.20  (configurable)
balance_due_on_pickup = grand_total - advance_amount
deposit = security_deposit  (refundable, NOT in grand_total)
```

---

## 5. External API Integration — Plate/VIN Lookup

### Service: `carregistrationapi.ae`

- **Cost:** 0.80 AED per lookup (~$0.20)
- **Input:** Plate number + emirate
- **Output:** Make, model, year, color, VIN, etc.
- **Integration Point:** Vendor Fleet Management form

### Integration Flow

```
1. Vendor enters Plate Number (e.g., "A 12345") + Emirate
2. Frontend calls backend API route: POST /vendor/vehicles/lookup
3. Backend calls carregistrationapi.ae SOAP/REST API
4. Response mapped to Vehicle fields
5. Vehicle form pre-filled
6. Vendor reviews, adds features from checklist, adds photos
7. Saves as draft or publishes
```

### Fallback: Manual Entry
If the external API is down or returns no data, the vendor can enter all fields manually.

---

## 6. Links to Medusa/Mercur Native Modules

| Medusa/Mercur Module | Our Custom Link |
|---------------------|-----------------|
| Medusa `Product` | Vehicle → Product (optional, for SEO/media) |
| Medusa `Customer` | Booking → Customer |
| Medusa `Order` | Booking → Order (advance payment step) |
| Mercur `Seller` | Vehicle → Seller (vendor ownership) |
| Mercur `Seller` | Booking → Seller (vendor reference) |
| Medusa `Region` | Vehicle → Region (UAE = default) |
| Medusa `Payment` | Booking advance → Stripe PaymentIntent |

---

## 7. Enums Summary

```
VehicleStatus: draft | published | unpublished
EntryMethod: auto_vin | auto_plate | manual
Transmission: automatic | manual
FuelType: petrol | diesel | hybrid | electric
InsuranceLevel: basic | full
FuelPolicy: same_to_same | full_to_full
BookingStatus: enquiry | quoted | confirmed | active | completed | cancelled | rejected
PaymentStatus: pending | advance_paid | balance_paid | refunded
Channel: web | whatsapp
BookingAddonType: insurance_upgrade | additional_driver | child_seat | delivery
FeatureCategory: comfort | safety | tech | audio | other
```
