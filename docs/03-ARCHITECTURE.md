# 🏗️ Arsitektur Teknis

> **Pembaruan:** Migrasi dari pnpm → npm karena kompatibilitas Expo;
> Dev tools (wrangler, drizzle-kit) tidak bisa running di Android/arm64 — tapi fine, deploy via cloud.

---

## Tech Stack

### Frontend

| Layer | Teknologi | Hosting | Alasan |
|---|---|---|---|
| **Merchant App** | Expo SDK 56 (React Native 0.85, Hermes) | EAS Build + EAS Update | Kamera, notifikasi, distribusi APK via link |
| **Customer Storefront** | Astro 4 | Cloudflare Pages | Zero JS default, SSG + hybrid, SEO |
| **Landing Page** | Astro 4 (gabung dgn storefront) | Cloudflare Pages | Satu proyek, satu deploy |
| **Styling** | Tailwind CSS | — | Utility-first |
| **State Management** | Zustand 5 + TanStack Query 5 | — | Ringan, proven di Orca |

### Backend

| Layer | Teknologi | Hosting | Alasan |
|---|---|---|---|
| **API Server** | Hono.js 4 | Cloudflare Workers | Edge runtime, $0, reuse dari Orca |
| **Database** | PostgreSQL (Supabase) | Supabase | Reuse dari Orca, RLS |
| **ORM** | Drizzle ORM + postgres.js | — | Type-safe, reuse dari Orca |
| **Cache** | Upstash Redis | Upstash | Reuse dari Orca, rate limiting |
| **Auth** | Better-Auth + Drizzle adapter | Workers + Supabase | Reuse dari Orca |
| **File Storage** | Cloudflare R2 | Cloudflare | Free 10GB, terintegrasi Workers |
| **Bot Protection** | Cloudflare Turnstile | Cloudflare | Gratis |

### Infrastructure

| Layer | Teknologi | Biaya |
|---|---|---|
| **Package Manager** | npm (root + api-edge), Expo (managed) | — |
| **Code Hosting** | GitHub | Gratis |
| **Domain** | sendbook.id | ~Rp150k/thn |
| **DNS** | Cloudflare DNS | Gratis |
| **Email** | Resend / Supabase Email | Gratis-tier |

### ⚠️ Catatan Platform

Dev tools (wrangler, drizzle-kit, esbuild, workerd) **tidak support android/arm64**.
Coding dilakukan di Termux, deploy via GitHub → Cloudflare dashboard.
Gunakan `--ignore-scripts` saat `npm install` di Android.

---

## Struktur Repository

```
sendbook/
├── apps/
│   ├── mobile/                  # Expo merchant app
│   │   ├── app/                 # Expo Router pages
│   │   ├── components/          # Shared UI components
│   │   ├── lib/                 # Hooks, stores, API client
│   │   ├── app.json
│   │   └── package.json
│   │
│   ├── api-edge/                # Hono.js Cloudflare Worker
│   │   ├── src/
│   │   │   ├── routes/
│   │   │   │   ├── stores.ts     # Store CRUD
│   │   │   │   ├── products.ts   # Product CRUD
│   │   │   │   ├── upload.ts     # R2 image upload
│   │   │   │   └── analytics.ts  # Visitor tracking
│   │   │   ├── db/
│   │   │   │   ├── schema.ts     # Drizzle schema
│   │   │   │   ├── db.ts         # DB client factory
│   │   │   │   ├── seed.sql      # Data dummy
│   │   │   │   └── migrations/   # SQL migration files
│   │   │   ├── auth.ts           # Better-Auth config
│   │   │   └── index.ts          # Hono app entry
│   │   ├── drizzle.config.ts
│   │   ├── wrangler.toml
│   │   └── package.json
│   │
│   └── web/                     # Astro storefront + landing
│       ├── src/
│       │   ├── pages/
│       │   │   ├── index.astro  # Landing page
│       │   │   ├── pricing.astro
│       │   │   └── stores/
│       │   │       └── [slug].astro  # Storefront per UMKM
│       │   └── components/
│       └── package.json
│
├── shared/
│   └── types/api.ts             # Shared TypeScript types
│
├── docs/                        # Dokumentasi & pitch deck
├── package.json                 # Root — scripts only
└── .gitignore
```

---

## Drizzle Schema

### Tables

```sql
-- stores: Setiap UMKM punya satu toko
stores (id, owner_id, slug, name, description, logo_url,
        address, whatsapp, maps_url, theme, social_links,
        payment_methods, is_published, created_at, updated_at)

-- products: Produk dalam toko (1:N dengan stores)
products (id, store_id, name, price, description, images[],
          category, is_available, sort_order, created_at, updated_at)

-- analytics_events: Tracking visitor & WA clicks
analytics_events (id, store_id, type, product_id, ip_hash,
                  user_agent, created_at)
```

---

## API Endpoints

### Auth (Better-Auth generates)
| Method | Endpoint | Deskripsi |
|---|---|---|
| `POST` | `/api/auth/email-password/sign-in` | Login |
| `POST` | `/api/auth/email-password/sign-up` | Register |
| `GET` | `/api/auth/session` | Cek session |

### Store
| Method | Endpoint | Auth | Deskripsi |
|---|---|---|---|
| `POST` | `/api/stores` | ✅ | Buat toko |
| `GET` | `/api/stores/me` | ✅ | Ambil toko sendiri |
| `GET` | `/api/stores/:slug` | ❌ | Lihat toko publik |
| `PUT` | `/api/stores/:id` | ✅ | Update toko |
| `DELETE` | `/api/stores/:id` | ✅ | Hapus toko |

### Product
| Method | Endpoint | Auth | Deskripsi |
|---|---|---|---|
| `POST` | `/api/products` | ✅ | Tambah produk |
| `PUT` | `/api/products/:id` | ✅ | Update produk |
| `DELETE` | `/api/products/:id` | ✅ | Hapus produk |

### Other
| Method | Endpoint | Auth | Deskripsi |
|---|---|---|---|
| `POST` | `/api/upload` | ✅ | Upload gambar ke R2 |
| `GET` | `/api/analytics/summary` | ✅ | Statistik toko |
| `POST` | `/api/analytics/track` | ❌ | Catat event |
| `GET` | `/api/health` | ❌ | Health check |

---

## Database Migration

Migrations disimpan sebagai SQL file di `apps/api-edge/src/db/migrations/`.
Jalankan di SQL Editor Supabase secara manual.

```bash
# Generate migration (butuh environment non-Android):
# cd apps/api-edge && npx drizzle-kit generate

# Apply:
# Buka file .sql di folder migrations/ → paste di Supabase SQL Editor
```
