# 🏗️ Arsitektur Teknis

---

## Tech Stack

### Frontend

| Layer | Teknologi | Hosting | Alasan |
|---|---|---|---|
| **Merchant App** | Expo SDK 56 (React Native 0.85, Hermes, New Arch) | EAS Build + EAS Update | Kamera, notifikasi, offline, distribusi APK via link |
| **Customer Storefront** | Astro 4 | Cloudflare Pages | Zero JS by default, SSG + hybrid, SEO, cepat |
| **Landing Page** | Astro 4 (gabung dengan storefront) | Cloudflare Pages | Satu proyek, satu deploy |
| **Styling** | Tailwind CSS + class-variance-authority | — | Utility-first, cepat develop |
| **State Management** | Zustand 5 + TanStack Query 5 | — | Ringan, proven di Orca |

### Backend

| Layer | Teknologi | Hosting | Alasan |
|---|---|---|---|
| **API Server** | Hono.js 4 | Cloudflare Workers | Edge runtime, $0, reuse dari Orca |
| **Database** | PostgreSQL (Supabase) | Supabase | Reuse dari Orca, row-level security |
| **ORM** | Drizzle ORM | — | Type-safe, reuse dari Orca |
| **Caching** | Upstash Redis | Upstash | Reuse dari Orca, REST API, rate limiting |
| **Auth** | Better-Auth + Drizzle adapter | Workers + Supabase | Reuse dari Orca, support email/Google/OTP |
| **File Storage** | Cloudflare R2 (S3-compatible) | Cloudflare | Free tier 10GB, bandwidth murah, integrated dengan Workers |
| **Bot Protection** | Cloudflare Turnstile | Cloudflare | Gratis, privacy-friendly |

### Infrastructure

| Layer | Teknologi | Biaya |
|---|---|---|
| **Monorepo** | pnpm workspaces | — |
| **Code Hosting** | GitHub | Gratis |
| **CI/CD** | GitHub Actions (opsional) | Gratis |
| **Domain** | sendbook.id (Niagahoster/Domainesia) | ~Rp150k/tahun |
| **DNS** | Cloudflare DNS | Gratis |
| **Email** | Resend / Supabase Email | Gratis-tier |
| **Observability** | Better Stack / Grafana | Gratis-tier |

---

## Arsitektur Sistem

### Data Flow Diagram

```
PENGGUNA AKHIR (Pembeli)
      │
      │ buka link sendbook.id/warung-bu-ana
      ▼
┌─────────────────┐     ┌─────────────────┐
│  Cloudflare     │────▶│  Astro          │
│  Pages (CDN)    │     │  (SSG/SSR)      │
│  sendbook.id    │     │  apps/web       │
└─────────────────┘     └────────┬────────┘
                                 │ GET /api/stores/:slug
                                 │ GET /api/products/:storeId
                                 ▼
┌─────────────────────────────────────────────┐
│  Cloudflare Workers                         │
│  api.sendbook.id                            │
│  ┌─────────────────────────────────────┐   │
│  │  Hono.js API                         │   │
│  │  • Auth (Better-Auth)                │   │
│  │  • Store CRUD                         │   │
│  │  • Product CRUD                       │   │
│  │  • Upload image → R2                  │   │
│  │  • Analytics counter                  │   │
│  │  • Rate limiting (Upstash)            │   │
│  └──────────┬──────────────────────────┘   │
└─────────────┼───────────────────────────────┘
              │
    ┌─────────┼────────────┐
    ▼         ▼            ▼
┌────────┐┌────────┐ ┌──────────┐
│Supabase││Upstash │ │Cloudflare│
│Postgres││Redis   │ │R2 (images│
└────────┘└────────┘ └──────────┘


MERCHANT (Pemilik Toko)
      │
      │ Buka Expo App (APK install)
      ▼
┌─────────────────────────────────────────────┐
│  Expo Mobile App (Merchant Dashboard)        │
│  • Auth (email/Google)                       │
│  • Dashboard stats                           │
│  • Manage products (add/edit/delete)          │
│  • Camera → upload foto ke R2                │
│  • Store settings                            │
│  • QR code generator                         │
│  • Notification order                        │
│                                              │
│  EAS Update → OTA JS updates tanpa rebuild    │
└──────┬──────────────────────────────────────┘
       │
       │ HTTPS API calls
       ▼
┌─────────────────────────────────────────────┐
│  Cloudflare Workers (same API)               │
└─────────────────────────────────────────────┘
```

### Struktur Repository

```
sendbook/
├── apps/
│   ├── mobile/                  # Expo merchant app
│   │   ├── app/                 # Expo Router pages
│   │   │   ├── (auth)/          # Login, Register
│   │   │   ├── (tabs)/          # Dashboard, Products, Settings
│   │   │   └── _layout.tsx
│   │   ├── components/          # Shared UI components
│   │   ├── lib/                 # Hooks, stores, API client
│   │   ├── assets/              # Icons, splash, adaptive icon
│   │   ├── app.json             # Expo config
│   │   └── package.json
│   │
│   ├── api-edge/                # Hono.js Cloudflare Worker
│   │   ├── src/
│   │   │   ├── routes/
│   │   │   │   ├── auth.ts      # Better-Auth endpoints
│   │   │   │   ├── stores.ts    # Store CRUD
│   │   │   │   ├── products.ts  # Product CRUD
│   │   │   │   ├── upload.ts    # R2 image upload
│   │   │   │   └── analytics.ts # Visitor tracking
│   │   │   ├── db/
│   │   │   │   ├── schema.ts    # Drizzle schema
│   │   │   │   └── index.ts     # DB client
│   │   │   ├── middleware/
│   │   │   │   ├── auth.ts      # Auth middleware
│   │   │   │   └── rate-limit.ts # Rate limiter
│   │   │   └── index.ts         # Hono app entry
│   │   ├── drizzle.config.ts
│   │   ├── wrangler.toml
│   │   └── package.json
│   │
│   └── web/                     # Astro storefront + landing
│       ├── src/
│       │   ├── pages/
│       │   │   ├── index.astro  # Landing page
│       │   │   ├── pricing.astro # Harga
│       │   │   └── stores/
│       │   │       └── [slug].astro  # Storefront per UMKM
│       │   ├── components/
│       │   │   ├── ProductGrid.astro
│       │   │   ├── StoreHeader.astro
│       │   │   ├── WhatsAppButton.astro
│       │   │   └── QRISDisplay.astro
│       │   └── layouts/
│       │       └── Base.astro
│       ├── astro.config.mjs
│       └── package.json
│
├── shared/
│   ├── config/
│   │   └── domains.ts           # URLs, constants
│   └── types/
│       ├── store.ts             # Store type
│       ├── product.ts           # Product type
│       └── api.ts               # API response types
│
├── supabase/
│   ├── migrations/              # Drizzle migrations output
│   └── seed.sql                 # Seed data
│
├── package.json                 # Root workspace
├── pnpm-workspace.yaml
└── .gitignore
```

---

## Drizzle Schema (V1)

### Tables

```typescript
// apps/api-edge/src/db/schema.ts

// ========== USERS (via Better-Auth) ==========
// Better-Auth manages its own tables:
// user, session, account, verification

// ========== STORES ==========
export const stores = pgTable("stores", {
  id: uuid("id").defaultRandom().primaryKey(),
  ownerId: text("owner_id").notNull().unique(), // relasi ke Better-Auth user.id
  slug: text("slug").notNull().unique(),        // sendbook.id/warung-bu-ana
  name: text("name").notNull(),
  description: text("description"),
  logoUrl: text("logo_url"),                     // R2 URL
  address: text("address"),
  whatsapp: text("whatsapp").notNull(),          // nomor WA toko
  mapsUrl: text("maps_url"),                     // Google Maps link
  theme: jsonb("theme").default({                // warna tema
    primary: "#6366f1",
    accent: "#f59e0b",
  }),
  socialLinks: jsonb("social_links").default([]), // [{platform, url}]
  paymentMethods: jsonb("payment_methods").default([]), // [{type, value}]
  isPublished: boolean("is_published").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ========== PRODUCTS ==========
export const products = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(),
  storeId: uuid("store_id")
    .notNull()
    .references(() => stores.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  price: integer("price").notNull(),               // dalam rupiah
  description: text("description"),
  images: text("images").array().notNull().default([]), // R2 URLs
  category: text("category"),
  isAvailable: boolean("is_available").default(true),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ========== ANALYTICS ==========
export const analyticsEvents = pgTable("analytics_events", {
  id: uuid("id").defaultRandom().primaryKey(),
  storeId: uuid("store_id")
    .notNull()
    .references(() => stores.id, { onDelete: "cascade" }),
  type: text("type").notNull(),                    // 'visit' | 'whatsapp_click'
  productId: uuid("product_id"),                   // nullable (for product clicks)
  ipHash: text("ip_hash"),                         // hashed IP for dedup
  userAgent: text("user_agent"),
  referer: text("referer"),
  createdAt: timestamp("created_at").defaultNow(),
});

// ========== INDEXES ==========
// - stores.slug → unique index
// - products.storeId → index
// - analyticsEvents.storeId + createdAt → index
```

### Relations

```
User (Better-Auth) ────1:1──── Store
Store ────────────────1:N──── Products
Store ────────────────1:N──── Analytics Events
```

---

## API Endpoints (V1)

### Public (no auth)

| Method | Endpoint | Deskripsi |
|---|---|---|
| `GET` | `/api/stores/:slug` | Ambil data toko + semua produk |
| `POST` | `/api/analytics/visit` | Catat kunjungan ke storefront |
| `POST` | `/api/analytics/click` | Catat klik tombol WA |

### Protected (auth required — merchant)

| Method | Endpoint | Deskripsi |
|---|---|---|
| `POST` | `/api/stores` | Buat toko baru |
| `PUT` | `/api/stores/:id` | Update toko |
| `DELETE` | `/api/stores/:id` | Hapus toko |
| `GET` | `/api/stores/me` | Ambil toko milik user saat ini |
| `POST` | `/api/products` | Tambah produk |
| `PUT` | `/api/products/:id` | Update produk |
| `DELETE` | `/api/products/:id` | Hapus produk |
| `POST` | `/api/upload` | Upload gambar → R2 |
| `GET` | `/api/analytics/summary` | Statistik toko |

### Auth (Better-Auth handles)

Better-Auth auto-generates: `/api/auth/*` — login, register, Google OAuth, session, dll.

---

## Security

### Yang Diimplementasikan V1

- ✅ **Better-Auth session** — semua route merchant dilindungi
- ✅ **Cloudflare Turnstile** — bot protection di form daftar & storefront
- ✅ **Rate limiting** — Redis-based, per IP: 100 req/min
- ✅ **R2 presigned URLs** — upload hanya via Workers, bukan langsung dari client
- ✅ **Input validation** — Zod schemas di semua endpoint
- ✅ **CORS** — hanya allow domains sendiri
- ✅ **SQL injection** — Drizzle ORM prevents by default
- ✅ **No exposed secrets** — semua env via wrangler secrets, bukan .env

### Post-V1

- 🔒 **RBAC** — role: owner, admin (untuk multi-admin nanti)
- 🔒 **Content Security Policy** — strict CSP header
- 🔒 **Audit log** — tracking perubahan data sensitif
- 🔒 **Data encryption at rest** — Supabase encryption
- 🔒 **GDPR/UU PDP compliance** — data deletion flow

---

## Performance Targets

| Metrik | Target V1 |
|---|---|
| **Storefront load time** | <500ms (SSG + CDN) |
| **API response time (p50)** | <100ms (Workers edge) |
| **API response time (p99)** | <500ms |
| **Image upload time** | <2s (R2 direct, Workers streaming) |
| **Concurrent users** | 1.000 (Workers auto-scale) |
| **Uptime** | 99.9% (Cloudflare SLA) |
| **Cost/month at scale** | <$50 for 10k active stores |

---

## Cost Estimation (Monthly)

| Service | Free Tier | Paid Tier (10k stores) |
|---|---|---|
| Cloudflare Workers | 100k req/hari ✅ | ~$5 (1M req) |
| Cloudflare Pages | Unlimited sites ✅ | $0 |
| Cloudflare R2 | 10GB storage ✅ | ~$5 (100GB) |
| Supabase | 500MB DB, 2GB bandwidth ✅ | ~$25 (8GB DB) |
| Upstash Redis | 10k cmd/hari ✅ | ~$5 (100k cmd) |
| EAS Build | 30 build/bulan ✅ | $0 (masih free) |
| Domain | — | ~$2 (sendbook.id) |
| **Total** | **$0/bln (saat development)** | **~$42/bln (10k stores)** |

---

## Yang Di-reuse dari Orca

| Komponen Orca | Status | Catatan |
|---|---|---|
| Monorepo pnpm structure | ✅ Reuse | Sama persis |
| Expo config (app.json, plugins) | ✅ Reuse | Ganti nama, bundle ID, hapus plugin scraper |
| Hono.js + Workers boilerplate | ✅ Reuse | Hapus scraper routes, ganti schema |
| Drizzle ORM + migrations | ✅ Reuse | Ganti schema |
| Better-Auth setup | ✅ Reuse | Hampir sama, ganti adapter config |
| Zustand stores pattern | ✅ Reuse | Beda state domain |
| TanStack Query patterns | ✅ Reuse | Beda query key |
| Astro config | ✅ Reuse | Ganti konten, hapus landing lama |
| Shared types/config | ✅ Reuse | Ganti isi |
| wrangler.toml / deploy scripts | ✅ Reuse | Ganti nama worker |
| Tailwind styling pattern | ✅ Reuse | Sama |
| **Rust scraper API** | ❌ **Hapus** | Nggak relevan |
| **Proto/protobuf** | ❌ **Hapus** | Nggak relevan |
| **Video player modules** | ❌ **Hapus** | Nggak relevan |
| **Crypto/webview modules** | ❌ **Hapus** | Ilegal & nggak relevan |
