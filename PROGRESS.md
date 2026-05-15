# Auto2Rental Marketplace — Progress

## Phase 0 — Recon & Setup ✅ DONE

### Versions
- **Mercur**: v2.1.1 (via `@mercurjs/cli@latest`)
- **MedusaJS**: v2.13.4 (bundled with Mercur)
- **Node**: v22.22.2
- **Bun**: v1.3.14
- **PostgreSQL**: 18.3 (custom instance on port 5433)
- **Redis**: 8.0.6 (running on default port 6379)

### Project Structure
```
auto2rental/
├── packages/api/           # Backend API (Medusa + Mercur core)
│   ├── src/                # Custom modules, workflows, api routes
│   ├── medusa-config.ts    # Medusa configuration
│   └── .env                # Environment variables
├── apps/admin/             # Admin dashboard (port 7000)
├── apps/vendor/            # Vendor portal (port 7001)
├── package.json            # Root workspace config
└── CLAUDE.md               # Agent instructions
```

### Running Services
| Service | URL | Status |
|---------|-----|--------|
| API | http://localhost:9000 | ✅ Running |
| Admin Panel | http://localhost:9000/dashboard | ✅ Running |
| Vendor Panel | http://localhost:9000/seller | ✅ Running |
| PostgreSQL | localhost:5433 | ✅ Running |
| Redis | localhost:6379 | ✅ Running |

### Deviations
1. PostgreSQL runs on port **5433** (not 5432) due to permission constraints. A custom cluster was initialized under `pgdata/` in the project root.
2. `npx` not available — codegen will use `bunx` instead. Minor warning, non-blocking.
3. Redis connected but shows "fake redis" warning — resolved by adding `redisUrl` to `medusa-config.ts`.

### Bootstrap Admin
Admin invite token was generated on first run. Access admin at:
http://localhost:9000/dashboard/invite?token=<token>

---

### Next: Phase 1 — Domain Model Design
- Design data model document for custom modules:
  - Vehicle module
  - Rental module (rates, terms, availability)
  - Booking module
  - Pricing service
- Document entities, fields, enums, relations
- Create empty module scaffolds
- Wait for approval before implementing
