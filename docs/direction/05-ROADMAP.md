# Roadmap & Milestone

Timeline pengembangan Sendbook.

## Status Saat Ini (Juli 2026)

**Aktif**: Landing page + API + Storefront sudah live di `sendbook.pages.dev`.
**Mulai**: Fork Orca. **Progress**: ~Fase 4 dari roadmap awal.

## Timeline Visual (Aktual)

```
SESI   1      2      3      4      5
       █      █      █      █      █

DONE   ████████████████████████████░░
       Fork  DB+API Landing Storefront
       Clean Deploy Pages    SSR
       
NEXT                    ░░░░░░░░████████████████████
                               SEO    Dashboard Mobile
                               Enhance Web App
```

## Fase & Milestone

### ✅ Selesai: Fork, DB, API, Landing, Storefront (Sesi 1-4)

| Milestone | Deliverable | Status |
|---|---|---|
| Fork Orca | Repo bersih, no scraper, no grey-area | ✅ |
| Database | Supabase + schema + seed | ✅ |
| API | Hono.js via Pages Functions, semua route | ✅ |
| Landing | Astro static page, dark theme | ✅ |
| Storefront | SSR storefront, WA buttons, SEO meta | ✅ |
| Infra Docs | 7 service docs + credentials verified | ✅ |

### 🔜 Next Up: SEO Enhancement + Merchant Dashboard

**Target: Sesi 5-7**

| # | Todo | Prioritas |
|---|---|---|
| 1 | Server-side product card render (SEO) | 🔴 High |
| 2 | Product image optimization (lazy load) | 🟡 Medium |
| 3 | Open Graph / Twitter Card meta tags | 🟡 Medium |
| 4 | Merchant auth (login page) | 🔴 High |
| 5 | Merchant dashboard (stats) | 🔴 High |
| 6 | Product management UI | 🔴 High |
| 7 | Store settings page | 🟡 Medium |

### 🔜 Production Hardening

**Before public launch:**

| # | Todo | Prioritas | Reason |
|---|---|---|---|
| 1 | Buat Supabase project baru | 🔴 Critical | Current: Orca's DB (password di git history) |
| 2 | Buat Upstash Redis baru | 🔴 Critical | Current: Orca's instance (token di git history) |
| 3 | Beli domain sendbook.id | 🟡 High | Branding & trust |
| 4 | Setup Cloudflare DNS | 🟡 Medium | |
| 5 | Rate limiting | 🟡 Medium | |
| 6 | Turnstile bot protection | 🟡 Medium | |

### 🔜 V2: Mobile App (Expo)

**Target: Sesi 8+**

| # | Todo |
|---|---|
| 1 | Expo Router setup |
| 2 | Auth screens |
| 3 | Dashboard with stats |
| 4 | Product CRUD (camera, gallery) |
| 5 | Store settings |
| 6 | QR code generator |
| 7 | EAS Build APK |

### 🔜 V3: Monetisasi

| # | Todo |
|---|---|
| 1 | Premium subscription (Midtrans) |
| 2 | Custom domain untuk Pro tier |
| 3 | Payment gateway checkout |
| 4 | Push notification |
| 5 | AI features |

## Kapak Kunci

### Jika AI di sesi berikutnya baca ini:

1. **Proyek sudah live** — landing, API, storefront semua berfungsi
2. **Infra**: Cloudflare Pages (Functions), Supabase (reuse Orca), Upstash Redis (reuse Orca)
3. **Prioritas #1**: Buat Supabase & Upstash baru (current instance punya leaked credentials)
4. **Prioritas #2**: Merchant dashboard web (login, manage products)
5. **Prioritas #3**: Server-side render produk di storefront (SEO)
6. **Constraints**: Termux Android, no wrangler/workerd, npm `--ignore-scripts`
7. **Credentials**: Lihat di `docs/services/` masing-masing
