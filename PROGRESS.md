# Auto2Rental Marketplace — Progress

## Phase 0 — Foundation ✅ DONE

### Versions
- **Mercur**: v2.1.1
- **MedusaJS**: v2.13.4
- **Node**: v22.22.2
- **Bun**: v1.3.14
- **PostgreSQL**: 18.3 (port 5433)
- **Redis**: 8.0.6

### Running Services
| Service | URL | Status |
|---------|-----|--------|
| API | http://localhost:9000 | ✅ |
| Admin Panel | http://localhost:9000/dashboard | ✅ |
| Vendor Panel | http://localhost:9000/seller | ✅ |
| Storefront | http://localhost:3000 | ✅ |
| PostgreSQL | localhost:5433 | ✅ |
| Redis | localhost:6379 | ✅ |

### Deviations
1. PostgreSQL on port 5433 (custom cluster under `pgdata/`)
2. `npx` unavailable — use `bunx` for CLI commands
3. Admin invite token on first run at `/dashboard/invite?token=<token>`

---

## Phase 1 — Custom Modules ✅ DONE

### Vehicle Module
- Entity: `Vehicle` (make, model, year, status, photos, specs, features, etc.)
- Entity: `VehicleCategory` (name, name_ar, is_active)
- Entity: `VehicleFeature` (name, name_ar, icon, category)
- Migration + seed data (7 categories, 18 features, 12 vehicles)

### Rental Module
- Entity: `RentalRate` (daily, weekly, monthly rates, mileage limits)
- Entity: `RentalTerms` (min age, deposit, insurance, fuel policy, delivery)
- Entity: `VehicleAvailability` (date blocks linked to bookings)

### Booking Module
- Entity: `Booking` (status flow: enquiry→quoted→confirmed→active→completed)
- Entity: `BookingAddon` (delivery, additional driver, child seat)
- Status validation with state machine transitions

---

## Phase 2 — API Routes ✅ DONE

### Store API
| Route | Description |
|-------|-------------|
| `GET /store/vehicles` | List published vehicles with filters, rate enrichment |
| `GET /store/vehicles/:id` | Single vehicle with rates, terms, features, category |
| `POST /store/vehicles/:id/quote` | Pricing quote with VAT (5%), advance calculation |
| `POST /store/bookings` | Create booking + availability block + addons |
| `GET /store/bookings/:id` | Retrieve booking |

### Vendor API
| Route | Description |
|-------|-------------|
| CRUD `/vendor/vehicles` | Full vehicle management with rates + terms |
| `POST /vendor/vehicles/lookup` | UAE plate/VIN external API lookup |
| CRUD `/vendor/bookings` | Booking list/detail + status state machine |
| `GET /vendor/vehicle-categories` | Active categories |
| `GET /vendor/vehicle-features` | Active features |

### Admin API
| Route | Description |
|-------|-------------|
| `GET /admin/vehicles` | List all vehicles with filters |
| `GET /admin/vehicles/:id` | Vehicle detail with rate, terms, bookings |
| `PUT /admin/vehicles/:id` | Update vehicle |
| `GET /admin/bookings` | List all bookings with vehicle enrichment |
| `GET /admin/bookings/:id` | Booking detail |
| `PUT /admin/bookings/:id` | Update booking |

---

## Phase 3 — Frontend UIs ✅ DONE

### Vendor Portal (`/seller`)
- Vehicle list with DataTable (Arabic UI)
- Create vehicle (4-tab form: info, pricing, terms, features)
- Vehicle detail/edit in RouteDrawer
- Booking list with status/payment badges
- Booking detail with status workflow buttons

### Admin Dashboard (`/dashboard`)
- Vehicle list with DataTable
- Vehicle detail page (details, pricing, terms, recent bookings)
- Booking list with DataTable
- Booking detail page (customer, vehicle, payment)

### Storefront (port 3000)
- Home page with hero, search form, featured vehicles
- Vehicles listing with sidebar filters + pagination
- Vehicle detail with image gallery, specs, tabs, quote calculator
- Booking page with customer form + price breakdown
- Booking confirmation page
- Responsive design with Tailwind CSS

---

## Phase 4 — Backend Services ✅ DONE

### Services
- **Pricing Service**: Rate tiering (daily/weekly/monthly), add-ons, VAT 5%
- **Vehicle Lookup Service**: UAE plate/VIN via external API

### Workflows
- `create-booking-workflow` — create booking + availability + addons
- `update-booking-status-workflow` — status transitions with validation

### Links
- Vehicle ↔ RentalRate (pricing)
- Vehicle ↔ RentalTerms (conditions)
- Vehicle ↔ VehicleAvailability (calendar)
- Vehicle ↔ Booking (reservations)
- Vehicle ↔ Product (Medusa media/SEO)
- Booking ↔ Customer (Medusa customer)
- Booking ↔ Order (Medusa payment)

### Subscribers
- `booking.created` — triggered on new enquiry
- `booking.updated` — triggered on status change

### Jobs
- `update-expired-bookings` — auto-complete past-due active bookings (every 6h)

---

## Phase 5 — Deployment & Docs

### GitHub
- Repository published at https://github.com/alkhudarigroupuae/autotorental
- Clean source (no compiled files, no node_modules)

### Remaining / Future
| Item | Status |
|------|--------|
| Payment integration (Stripe) | 🔲 Planned |
| Admin user setup/auth | 🔲 Need admin invite flow |
| Email notifications | 🔲 Via subscriber events |
| Mobile app (Rider) | 🔲 Future |
| Testing suite | 🔲 Jest configured but empty |
| Production deployment | 🔲 Docker + CI/CD |
