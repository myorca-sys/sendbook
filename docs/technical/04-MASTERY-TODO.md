# Mastery Todo — Progress Real-time

✅ = Selesai | ⬜ = Belum | 🔄 = Sedang dikerjakan

## Fase 0: Fork & Bersihkan Orca ✅

| # | Todo | Status | Catatan |
|---|---|---|---|
| 0.1 | Fork Orca → sendbook directory | ✅ | `projects/sendbook/` |
| 0.2 | Hapus Rust scraper, scripts, Dockerfile, proto | ✅ | Bersih dari grey-area code |
| 0.3 | Hapus crypto, webview, native modules | ✅ | |
| 0.4 | Hapus anime types | ✅ | |
| 0.5 | Update .gitignore | ✅ | |
| 0.6 | Setup git + push ke GitHub | ✅ | `myorca-sys/sendbook` public |
| 0.7 | Setup EAS project | ⬜ | Butuh akun expo.dev |

## Fase 1: Database & Infra ✅

| # | Todo | Status | Catatan |
|---|---|---|---|
| 1.1 | Drizzle schema — stores, products, analytics | ✅ | `db/schema.ts` |
| 1.2 | Migration SQL (0000_init.sql) | ✅ | Sudah di-run di Supabase |
| 1.3 | Seed data dummy | ✅ | 1 store + 6 products |
| 1.4 | Better-Auth setup | ✅ | Email/password |
| 1.5 | API routes — stores, products, upload, analytics | ✅ | Di Hono.js |
| 1.6 | Hono app entry + CORS | ✅ | |
| 1.7 | Tables SQL dibuat di Supabase | ✅ | stores, products, analytics_events |
| 1.8 | Seed SQL di-run | ✅ | warung-bu-ana terisi |
| 1.9 | Koneksi DB diverifikasi | ✅ | `api/health` return supabase OK |
| 1.10 | Upstash Redis diverifikasi | ✅ | PONG |
| 1.11 | R2 bucket dibuat | ✅ | `sendbook-products` public |
| 1.12 | Infra docs ditulis | ✅ | 7 service docs + template |

## Fase 2: Deploy API ✅

| # | Todo | Status | Catatan |
|---|---|---|---|
| 2.1 | Pindah Worker → Pages Functions | ✅ | `functions/api/[[path]].ts` |
| 2.2 | Setup Pages project di Cloudflare | ✅ | `sendbook` |
| 2.3 | Hubungkan ke GitHub (auto-deploy) | ✅ | |
| 2.4 | Set env vars via API | ✅ | 6 variables (DB, Auth, Redis, R2) |
| 2.5 | Set compat flags (nodejs_compat) | ✅ | |
| 2.6 | API health endpoint live | ✅ | `sendbook.pages.dev/api/health` |
| 2.7 | Verifikasi deploy | ✅ | Semua route berfungsi |

## Fase 3: Landing Page ✅

| # | Todo | Status | Catatan |
|---|---|---|---|
| 3.1 | Buat landing page Astro (index.astro) | ✅ | Dark theme, Inter font |
| 3.2 | Build & deploy | ✅ | `apps/web/dist/` → Pages |
| 3.3 | Set Pages build config | ✅ | `npm install && cd apps/web && npm install && npm run build` |

## Fase 4: Storefront ✅

| # | Todo | Status | Catatan |
|---|---|---|---|
| 4.1 | SSR storefront di Pages Function | ✅ | `functions/store/[[slug]].ts` |
| 4.2 | SEO tags (title, description, JSON-LD) | ✅ | Injected server-side |
| 4.3 | Client-side product render | ✅ | |
| 4.4 | WhatsApp chat button | ✅ | `wa.me/628xxx?text=...` |
| 4.5 | Storefront live | ✅ | `sendbook.pages.dev/store/warung-bu-ana` |

## Fase 5: Storefront SEO Enhancement ⬜

| # | Todo | Status | Catatan |
|---|---|---|---|
| 5.1 | Server-side render product cards (current: client-side only) | ⬜ | SEO improvement |
| 5.2 | Product image lazy loading | ⬜ | |
| 5.3 | Open Graph / Twitter Card meta | ⬜ | |

## Fase 6: Merchant Dashboard ⬜

| # | Todo | Status | Catatan |
|---|---|---|---|
| 6.1 | Auth login page | ⬜ | |
| 6.2 | Dashboard — store stats | ⬜ | |
| 6.3 | Product management UI | ⬜ | |
| 6.4 | Store settings | ⬜ | |
| 6.5 | QR code generator | ⬜ | |

## Fase 7: Mobile App (Expo) ⬜

| # | Todo | Status | Catatan |
|---|---|---|---|
| 7.1 | Setup Expo Router | ⬜ | |
| 7.2 | Auth screens | ⬜ | |
| 7.3 | Dashboard | ⬜ | |
| 7.4 | Product CRUD | ⬜ | |
| 7.5 | Store settings | ⬜ | |
| 7.6 | EAS Build | ⬜ | |

## Fase 8: Production Hardening ⬜

| # | Todo | Priority | Catatan |
|---|---|---|---|
| 8.1 | Buat Supabase project baru | 🔴 High | Current: Orca's DB (password leaked) |
| 8.2 | Buat Upstash Redis baru | 🔴 High | Current: Orca's instance (token leaked) |
| 8.3 | Beli domain sendbook.id | 🟡 Medium | |
| 8.4 | Setup Cloudflare DNS + SSL | 🟡 Medium | |
| 8.5 | Rate limiting (Upstash) | 🟡 Medium | |
| 8.6 | Turnstile integration | 🟡 Medium | |
| 8.7 | Payment gateway (Midtrans) | 🟢 Future | |

## Live URLs

| URL | Deskripsi |
|---|---|
| https://sendbook.pages.dev | Landing page |
| https://sendbook.pages.dev/api/health | API health check |
| https://sendbook.pages.dev/store/warung-bu-ana | Storefront demo |
| https://pub-8b6a4088db2c4966974f91de589f6cb9.r2.dev | R2 public bucket |
