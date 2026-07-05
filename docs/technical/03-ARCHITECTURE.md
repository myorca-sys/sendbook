# Arsitektur Teknis

Sendbook adalah aplikasi web-first: customer storefront + landing page via Cloudflare Pages,
API via Pages Functions (Hono.js + postgres.js), database via Supabase PostgreSQL.

## Tech Stack

### Frontend

| Layer | Teknologi | Hosting |
|---|---|---|
| Landing Page | Astro 4 (static) | Cloudflare Pages |
| Customer Storefront | SSR via Pages Function (HTML injection) | Cloudflare Pages |
| Merchant App | Expo SDK 56 (React Native 0.85, Hermes) | EAS Build (future) |
| Styling | Tailwind CSS | — |

### Backend

| Layer | Teknologi | Hosting |
|---|---|---|
| API Server | Hono.js 4 (via Pages Functions) | Cloudflare Pages |
| Database | PostgreSQL (Supabase) | Supabase |
| ORM | Drizzle ORM + postgres.js | — |
| Cache | Upstash Redis | Upstash |
| Auth | Better-Auth + Drizzle adapter | Pages Functions + Supabase |
| File Storage | Cloudflare R2 | Cloudflare |

### Infrastructure

| Layer | Teknologi |
|---|---|
| Package Manager | npm (--ignore-scripts di Android) |
| Code Hosting | GitHub (myorca-sys/sendbook) |
| CI/CD | Cloudflare Pages auto-deploy dari GitHub |
| DNS | Cloudflare DNS (default: sendbook.pages.dev) |
| Domain | sendbook.pages.dev (sementara), nanti sendbook.id |

### Catatan Platform

Dev tools (wrangler, drizzle-kit, esbuild, workerd) **tidak support android/arm64**.
Koding di Termux, deploy via GitHub → Cloudflare Pages auto-deploy.

## Struktur Repository

```
sendbook/
├── functions/
│   ├── api/
│   │   └── [[path]].ts         # Hono.js API handler (catch-all /api/*)
│   └── store/
│       └── [[slug]].ts         # SSR storefront (catch-all /store/*)
├── apps/
│   ├── mobile/                  # Expo merchant app (future)
│   └── web/                     # Astro static pages
│       ├── src/
│       │   ├── pages/
│       │   │   ├── index.astro  # Landing page (dark theme, Inter font)
│       │   │   └── store/
│       │   │       └── [slug].astro  # Static fallback storefront
│       │   └── components/
│       └── package.json
├── docs/                        # Dokumentasi proyek
├── package.json                 # Root — deps untuk Pages Functions (hono, postgres, zod)
└── .gitignore
```

## Arsitektur Routing (Cloudflare Pages)

```
sendbook.pages.dev
├── /                          → apps/web/dist/index.html (Astro static build)
├── /api/*                     → functions/api/[[path]].ts (Hono.js)
│   ├── GET  /api/health
│   ├── POST /api/auth/*
│   ├── GET  /api/stores/:slug
│   ├── POST /api/stores
│   ├── PUT  /api/stores/:id
│   ├── DELETE /api/stores/:id
│   ├── GET  /api/stores/:slug/products
│   ├── POST /api/products
│   ├── PUT  /api/products/:id
│   ├── DELETE /api/products/:id
│   ├── POST /api/upload         → R2
│   ├── POST /api/analytics/event
│   └── GET  /api/analytics/summary
├── /store/:slug               → functions/store/[[slug]].ts (SSR)
│   ├── Query DB → store + products
│   ├── Inject store info ke HTML head (SEO)
│   └── Client-side JS render products + WA buttons
└── /static/*                  → apps/web/dist/
```

## Data Flow

### Customer visits storefront
```
Browser → sendbook.pages.dev/warung-bu-ana
  └─ functions/store/[[slug]].ts
       ├── postgres.js → SELECT FROM stores WHERE slug = ?
       ├── postgres.js → SELECT FROM products WHERE store_id = ?
       ├── Inject <title>, <meta>, JSON-LD, store name/desc into HTML
       └── Return HTML with client-side JS untuk:
            ├── Render product grid
            ├── WhatsApp button → wa.me/628xxx?text=...
            └── Analytics tracking (fetch POST /api/analytics/event)
```

### Merchant uploads product
```
Mobile App / API Client → POST /api/upload (multipart)
  └─ functions/api/[[path]].ts (Hono)
       ├── Verify auth (Better-Auth session)
       ├── Save to R2 bucket (sendbook-products)
       └── Return public URL → https://pub-8b6a4088db2c4966974f91de589f6cb9.r2.dev/...

Mobile App / API Client → POST /api/products
  └─ functions/api/[[path]].ts (Hono)
       ├── Verify auth
       ├── Validate (zod)
       ├── INSERT INTO products (store_id, name, price, images[], ...)
       └── Return created product
```

## Database Schema

```sql
-- stores: Setiap UMKM punya satu toko
stores (id uuid, owner_id text, slug text UNIQUE, name text,
        description text, logo_url text, address text,
        whatsapp text, maps_url text, theme jsonb,
        social_links jsonb, payment_methods jsonb,
        is_published boolean, created_at timestamptz,
        updated_at timestamptz)

-- products: Produk dalam toko
products (id uuid, store_id uuid FK, name text, price integer,
          description text, images text[], category text,
          is_available boolean, sort_order integer,
          created_at timestamptz, updated_at timestamptz)

-- analytics_events: Visitor & WA click tracking
analytics_events (id uuid, store_id uuid FK, type text,
                  product_id uuid, ip_hash text,
                  user_agent text, created_at timestamptz)
```

## Perbedaan dari Orca

| Aspek | Orca | Sendbook |
|---|---|---|
| API | Cloudflare Worker (wrangler deploy) | Pages Functions (auto-deploy via GitHub) |
| DB | postgres.js langsung | postgres.js langsung (sama) |
| Auth | Better-Auth | Better-Auth (sama) |
| Storefront | Astro SSR (Cloudflare adapter) | Pages Function SSR + client-side JS |
| Storage | R2 | R2 (sama) |
| Scraper | Ada (Rust + Python) | **Dihapus total** |
| Mobile | Expo | Expo (sama, belum dibangun) |

## Migration

SQL migration ada di `apps/api-edge/src/db/migrations/0000_init.sql`.
Apply via Supabase SQL Editor (tidak bisa pakai drizzle-kit di Android).

## Credentials Terverifikasi

| Service | Status | Detail |
|---|---|---|
| Supabase DB | ✅ Live | `postgresql://postgres.ppwocgmumbdbvnqprxrg:***@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres` |
| Upstash Redis | ✅ PONG | `powerful-crow-69427` |
| R2 Bucket | ✅ Public | `pub-8b6a4088db2c4966974f91de589f6cb9.r2.dev` |
| Pages | ✅ Deployed | `sendbook.pages.dev` |
| API Health | ✅ OK | `/api/health` returns supabase & redis status |

> **WARNING**: Supabase & Upstash adalah instance Orca (password/token terekspos di git history Orca).
> Untuk production, buat project baru.
