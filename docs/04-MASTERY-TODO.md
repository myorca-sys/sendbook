# 📋 Mastery Todo List — Real-time Progress

> Status terkini pengerjaan Sendbook.
> ✅ = Selesai | ⬜ = Belum | 🔄 = Sedang dikerjakan

---

## 🏁 Fase 0: Fork & Bersihkan Orca ✅ Selesai

| # | Todo | Status | Catatan |
|---|---|---|---|
| 0.1 | Copy Orca → sendbook directory | ✅ | `projects/sendbook/` |
| 0.2 | Update root package.json | ✅ | npm workspace |
| 0.3 | Hapus api-rust, scripts, Dockerfile | ✅ | Bersih |
| 0.4 | Update mobile app.json + package.json | ✅ | bundle ID: com.sendbook.app |
| 0.5 | Hapus Expo plugins scraper | ✅ | webview, crypto, protobuf |
| 0.6 | Tambah expo-image-picker, expo-file-system | ✅ | Di package.json |
| 0.7 | Update shared types | ✅ | Store, Product, Analytics |
| 0.8 | Setup git + commit | ✅ | 2 commits, branch main |
| 0.9 | Setup EAS project | ⬜ | Butuh akun expo.dev |

---

## 🗄️ Fase 1: Database & Auth ✅ Selesai (Code)

| # | Todo | Status | Catatan |
|---|---|---|---|
| 1.1 | Buat project Supabase | ⬜ | **KAMU: buat akun & project** |
| 1.2 | Setup Upstash Redis | ⬜ | **KAMU: buat akun** |
| 1.3 | Drizzle schema — stores, products, analytics | ✅ | `db/schema.ts` |
| 1.4 | Migration SQL file | ✅ | `db/migrations/0000_init.sql` |
| 1.5 | Seed data dummy | ✅ | `db/seed.sql` — 1 toko + 6 produk |
| 1.6 | Better-Auth setup | ✅ | `auth.ts` — email/password |
| 1.7 | API routes — stores CRUD | ✅ | `routes/stores.ts` |
| 1.8 | API routes — products CRUD | ✅ | `routes/products.ts` |
| 1.9 | API routes — upload to R2 | ✅ | `routes/upload.ts` |
| 1.10 | API routes — analytics | ✅ | `routes/analytics.ts` |
| 1.11 | Hono app entry + CORS | ✅ | `index.ts` |
| 1.12 | Konfigurasi wrangler.toml | ✅ | nama: sendbook-api |
| 1.13 | Setup R2 bucket | ⬜ | **KAMU: buat di Cloudflare** |
| 1.14 | Setup env variables | ⬜ | **KAMU: isi secrets** |

---

## ⚡ Fase 2: Backend API — Selesai (di Fase 1)

Backend sudah selesai dibangun bersamaan dengan Fase 1.
Routes yang sudah jadi:

- ✅ `POST /api/stores` — create store
- ✅ `GET /api/stores/me` — my store
- ✅ `GET /api/stores/:slug` — public store + products
- ✅ `PUT /api/stores/:id` — update store
- ✅ `DELETE /api/stores/:id` — delete store
- ✅ `POST /api/products` — add product
- ✅ `PUT /api/products/:id` — update product
- ✅ `DELETE /api/products/:id` — delete product
- ✅ `POST /api/upload` — upload image to R2
- ✅ `GET /api/analytics/summary` — store stats
- ✅ `POST /api/analytics/track` — track event
- ✅ `GET /api/health` — health check

### ⬜ Next (post-V1):
| Todo | Priority |
|---|---|
| Rate limiting (Upstash Redis) | 🟡 Medium |
| Turnstile integration | 🟡 Medium |
| Payment gateway (Midtrans) | 🟢 Future |
| Image optimization (resize on upload) | 🟢 Future |

---

## 📱 Fase 3: Merchant Mobile App ⬜

| # | Todo | Status | Catatan |
|---|---|---|---|
| 3.1 | Setup Expo Router — auth vs tabs | ⬜ | |
| 3.2 | Auth screens (login, register) | ⬜ | |
| 3.3 | Dashboard screen (stats) | ⬜ | |
| 3.4 | Product list screen | ⬜ | |
| 3.5 | Add/edit product form | ⬜ | |
| 3.6 | Store settings screen | ⬜ | |
| 3.7 | QR code generator | ⬜ | |
| 3.8 | EAS Build + Update | ⬜ | |

---

## 🌐 Fase 4: Customer Storefront ⬜

| # | Todo | Status | Catatan |
|---|---|---|---|
| 4.1 | Landing page (hero, fitur, pricing) | ⬜ | |
| 4.2 | Storefront dynamic route `/[slug]` | ⬜ | |
| 4.3 | ProductGrid component | ⬜ | |
| 4.4 | WhatsAppButton component | ⬜ | |
| 4.5 | QRIS/Payment display | ⬜ | |
| 4.6 | Deploy Cloudflare Pages | ⬜ | |
| 4.7 | Custom domain sendbook.id | ⬜ | |

---

## 🚀 Fase 5: Deploy & Launch ⬜

| # | Todo | Status |
|---|---|---|
| 5.1 | Beli domain sendbook.id | ⬜ |
| 5.2 | Setup Cloudflare DNS | ⬜ |
| 5.3 | Deploy API Worker | ⬜ |
| 5.4 | Deploy Astro Pages | ⬜ |
| 5.5 | Run migration di Supabase | ⬜ |
| 5.6 | EAS Build APK | ⬜ |
| 5.7 | UMKM testing | ⬜ |
| 5.8 | Fix bug feedback | ⬜ |

---

## 📈 Fase 6: Post-Launch ⬜

| Todo | Priority |
|---|---|
| Premium subscription (Midtrans) | 🟡 High |
| Custom domain untuk Pro | 🟡 High |
| Push notification | 🟡 Medium |
| Payment gateway checkout | 🟢 Future |
| AI deskripsi produk | 🟢 Future |
| Multi-store | 🟢 Future |
