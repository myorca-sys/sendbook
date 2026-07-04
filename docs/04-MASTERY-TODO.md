# 📋 Mastery Todo List — Lengkap

> Setiap todo mencakup *apa yang harus dilakukan*, *tools/service yang digunakan*, *yang dipelajari (mastery)*, dan *estimasi waktu*.

---

## 🏁 Fase 0: Fork & Bersihkan Orca

**Tujuan:** Ambil struktur Orca yang bisa dipakai, buang yang tidak relevan.
**Estimasi:** 1 hari
**Output:** Repo sendbook bersih siap develop

| # | Todo | Service/Tool | Yang Dipelajari (Mastery) | Waktu |
|---|---|---|---|---|
| 0.1 | Buat repo GitHub baru `sendbook`, clone dari Orca | GitHub | Init repo, branch protection rules, default branch | 15 menit |
| 0.2 | Ganti root `package.json` → name: `sendbook`, hapus script tui/vercel | pnpm | Root workspace scripts, workspace protocol | 10 menit |
| 0.3 | Update `pnpm-workspace.yaml` — hapus `apps/api-rust` | pnpm | Workspace package filtering | 5 menit |
| 0.4 | Hapus folder `apps/api-rust/` + `scripts/database/` + `Dockerfile` | bash | — | 10 menit |
| 0.5 | Hapus dependensi scraper di root: `crypto-js`, `postgres` | pnpm | Dependency audit & removal | 5 menit |
| 0.6 | Ganti `apps/mobile/app.json` → name, slug, scheme: "sendbook" | Expo EAS | Expo app config, iOS/Android identifiers | 15 menit |
| 0.7 | Hapus Expo plugins scraper: `protobufjs`, `react-native-webview`, `react-native-quick-crypto` | Expo | Plugin management, native module removal | 10 menit |
| 0.8 | Hapus custom native modules: `native-video-player`, `orca-native-core` | Expo | Native module system, autolinking | 10 menit |
| 0.9 | Tambah Expo plugins baru: `expo-image-picker`, `expo-file-system` | Expo | Plugin installation, config plugin | 10 menit |
| 0.10 | Update `apps/mobile/package.json` — hapus deps scraper (crypto-js, protobufjs, readable-stream, dll) | pnpm | Package.json cleanup | 10 menit |
| 0.11 | Update `shared/types/` — hapus tipe anime/manga, buat tipe Store & Product | TypeScript | Shared type patterns, domain modeling | 30 menit |
| 0.12 | Buat EAS project baru di [expo.dev](https://expo.dev) untuk sendbook | Expo EAS | EAS project setup, projectId, owner | 15 menit |
| 0.13 | Setup ekspor dulu `apps/mobile` biar nggak broken — `npx expo export --platform android` | Expo EAS | Export validation | 15 menit |
| 0.14 | Commit: `"chore: fork from orca, init sendbook"` | GitHub | Git workflow, conventional commit | 5 menit |
| 0.15 | Create branch `feat/init` | GitHub | Branch strategy | 5 menit |

**Total Fase 0: ~2-3 jam**

---

## 🗄️ Fase 1: Database & Auth

**Tujuan:** Setup backend foundation — database, auth, caching
**Estimasi:** 2 hari
**Output:** Supabase + Upstash terhubung, schema ready, auth working

| # | Todo | Service/Tool | Yang Dipelajari (Mastery) | Waktu |
|---|---|---|---|---|
| 1.1 | Buat project **Supabase** baru, catat DB URL, anon key, service role key | Supabase | Project setup, connection pooling, SSL, region selection | 20 menit |
| 1.2 | Setup **Upstash Redis** baru (region same as Workers), catat REST URL & token | Upstash Redis | Redis REST API, TTL strategies, eviction policy | 15 menit |
| 1.3 | Buat schema **Drizzle**: tabel `stores` — semua field + indexes | Drizzle ORM | Drizzle schema syntax, pgTable, jsonb, timestamps, indexes | 30 menit |
| 1.4 | Buat schema **Drizzle**: tabel `products` — relasi ke stores + indexes | Drizzle ORM | Foreign keys, cascade delete, array columns | 20 menit |
| 1.5 | Buat schema **Drizzle**: tabel `analytics_events` — untuk tracking | Drizzle ORM | Event data modeling, partial indexes | 20 menit |
| 1.6 | Generate migration + apply ke Supabase | Drizzle Kit | Migration workflow: `drizzle-kit generate`, `migrate` | 15 menit |
| 1.7 | Setup **Better-Auth** di `apps/api-edge` dengan Drizzle adapter | Better-Auth | Auth config, email/password, Google OAuth, OTP, session management | 1 jam |
| 1.8 | Setup env variables di wrangler — DATABASE_URL, UPSTASH_REDIS, BETTER_AUTH_SECRET | Cloudflare Workers | `wrangler secret put`, secrets vs vars | 20 menit |
| 1.9 | Test koneksi: deploy API → cek auth endpoint response | Cloudflare Workers | `wrangler deploy`, live testing | 20 menit |
| 1.10 | Seed data dummy: 3 stores + 15 products via Drizzle | Supabase + Drizzle | Seed scripts, data factory pattern | 30 menit |

**Total Fase 1: ~4 jam**

---

## ⚡ Fase 2: Backend API (Cloudflare Workers)

**Tujuan:** Semua API endpoints untuk V1 functional
**Estimasi:** 3 hari
**Output:** API deployed, semua route ter-test

| # | Todo | Service/Tool | Yang Dipelajari (Mastery) | Waktu |
|---|---|---|---|---|
| 2.1 | Update `wrangler.toml` — ganti worker name, hapus binding scraper (HF, PROXY, KV, HYPERDRIVE) | Cloudflare Workers | wrangler config anatomy, bindings | 15 menit |
| 2.2 | Buat binding **R2 bucket** `sendbook-products` di wrangler.toml | Cloudflare R2 | R2 binding, bucket creation, permissions | 15 menit |
| 2.3 | Hapus semua route scraper di `src/routes/` (kuronime, samehadaku, idlix, proxy, dll) | Hono.js | Codebase cleanup | 20 menit |
| 2.4 | Buat **auth routes** — integrasi Better-Auth dengan Hono.js | Better-Auth + Hono.js | Better-Auth Hono integration, callback URLs | 1 jam |
| 2.5 | Buat `POST /api/stores` — create store (auth required) | Hono.js + Drizzle | Request validation (Zod), auth middleware, response formatting | 45 menit |
| 2.6 | Buat `GET /api/stores/:slug` — public store + products (no auth) | Hono.js + Drizzle | Public vs protected routes, query optimization, join | 30 menit |
| 2.7 | Buat `PUT /api/stores/:id` — update store (owner only) | Hono.js + Drizzle | Ownership validation, partial update | 30 menit |
| 2.8 | Buat `GET /api/stores/me` — ambil store milik user login | Hono.js + Drizzle | Relationship query dari auth context | 20 menit |
| 2.9 | Buat **full CRUD products**: POST, GET list, GET by id, PUT, DELETE | Hono.js + Drizzle | Nested resource routing, cascade validation | 1.5 jam |
| 2.10 | Buat `POST /api/upload` — upload gambar → R2, return URL | Cloudflare R2 | R2 put-object, file validation (size, type), presigned URLs vs direct upload | 1 jam |
| 2.11 | Buat `POST /api/analytics/visit` + `/click` — catat event | Hono.js + Drizzle | Lightweight insert, IP hashing, dedup logic | 30 menit |
| 2.12 | Buat `GET /api/analytics/summary` — aggregasi statistik toko | Hono.js + Drizzle | SQL aggregation: COUNT, GROUP BY, date range | 30 menit |
| 2.13 | Setup **rate limiting middleware** — Redis-based, 100 req/min per IP | Upstash Redis | Sliding window rate limit, Redis incr + TTL | 30 menit |
| 2.14 | Setup **CORS middleware** — hanya allow sendbook.id & api.sendbook.id | Hono.js | CORS configuration, preflight handling | 10 menit |
| 2.15 | Setup **Turnstile validation** di route register & storefront | Cloudflare Turnstile | Turnstile token verification, site key config | 20 menit |
| 2.16 | Deploy ke Workers: `wrangler deploy` | Cloudflare Workers | Deploy process, versioning, preview URLs | 10 menit |

**Total Fase 2: ~8 jam**

---

## 📱 Fase 3: Merchant Mobile App (Expo)

**Tujuan:** Aplikasi Expo untuk merchant mengelola toko dari HP
**Estimasi:** 5 hari
**Output:** APK siap distribusi, semua flow merchant functional

| # | Todo | Service/Tool | Yang Dipelajari (Mastery) | Waktu |
|---|---|---|---|---|
| 3.1 | Update `app.json` — ganti name, slug, icon, splash, bundle ID → `com.sendbook.app` | Expo EAS | App branding, EAS project config | 30 menit |
| 3.2 | Setup **Expo Router** — layout auth vs tabs (protected routes) | Expo Router | File-based routing, auth guard layout, redirect logic | 1 jam |
| 3.3 | Buat **Onboarding screen** — 3-step wizard: nama toko → produk pertama → nomor WA | Expo Router + Zustand | Multi-step form state, progress indicator | 2 jam |
| 3.4 | Buat **Auth screens**: Login (email+password), Register, Google OAuth | Expo + Better-Auth | Secure store for tokens, OAuth flow, error handling | 2 jam |
| 3.5 | Setup **TanStack Query** dengan API client — base URL, interceptors, retry | TanStack Query | QueryClient setup, mutation patterns, caching strategy | 45 menit |
| 3.6 | Buat **Dashboard screen**: card stats (total produk, pengunjung hari ini, klik WA) | TanStack Query + Charts | Data fetching, pull-to-refresh, skeleton loading | 1.5 jam |
| 3.7 | Buat **Product List screen**: FlashList with product cards, search/filter | FlashList + Zustand | Virtualized list, image caching, infinite scroll | 2 jam |
| 3.8 | Buat **Add Product screen**: form (name, price, desc, category) + image picker | Expo Image Picker | Camera/gallery integration, form validation (Zod) | 2 jam |
| 3.9 | Buat **Edit Product screen**: sama seperti add, tapi pre-fill + update API | Zustand + TanStack Query | Optimistic updates, cache invalidation | 1 jam |
| 3.10 | Buat **Store Settings screen**: edit nama, alamat, WA, social links, payment | Zustand + API | Complex form with nested arrays | 2 jam |
| 3.11 | Buat **Theme/Tampilan screen**: pilih warna tema (3-5 preset) | Zustand | Theme persistence, real-time preview | 1 jam |
| 3.12 | Buat **QR Code screen**: generate QR toko untuk dicetak | expo-qr-code | QR generation in React Native, save to gallery | 45 menit |
| 3.13 | Setup **EAS Update** — OTA update channel | EAS Update | `eas update` command, channel config, versioning | 30 menit |
| 3.14 | Setup **EAS Build** Android — build APK + AAB | EAS Build | Build profile, credentials, native modules compatibility | 1 jam |
| 3.15 | Test: `npx expo run:android` — full test di device | Expo | Native build testing, Metro bundler, debugging | 1 jam |

**Total Fase 3: ~18 jam**

---

## 🌐 Fase 4: Customer Storefront (Astro + Cloudflare Pages)

**Tujuan:** Halaman publik setiap UMKM + landing page
**Estimasi:** 3 hari
**Output:** Storefront live di Cloudflare Pages, custom domain

| # | Todo | Service/Tool | Yang Dipelajari (Mastery) | Waktu |
|---|---|---|---|---|
| 4.1 | Transform `apps/web` — hapus landing page Orca, mulai dari 0 | Astro | Astro project anatomy, file-based routing | 30 menit |
| 4.2 | Setup **Tailwind CSS** di Astro | Astro + Tailwind | Astro Tailwind integration, CSS isolation | 15 menit |
| 4.3 | Buat **Landing page**: hero section, fitur, cara kerja (3 langkah), pricing, CTA | Astro | Astro components, slots, islands | 2 jam |
| 4.4 | Buat **Layout umum**: header, footer, SEO meta tags, Open Graph | Astro | Layout components, Astro props, SEO best practices | 1 jam |
| 4.5 | Setup **dynamic route** `/stores/[slug].astro` — SSR/SSG hybrid | Astro + Cloudflare Pages | `getStaticPaths`, `Astro.request`, hybrid rendering | 1 jam |
| 4.6 | Buat komponen **StoreHeader**: foto toko, nama, alamat, maps link, rating stars | Astro | Component props, conditional rendering, responsive design | 1 jam |
| 4.7 | Buat komponen **ProductGrid**: grid 2-3 kolom, foto product card, harga | Astro | CSS Grid, lazy loading images, skeleton state | 1.5 jam |
| 4.8 | Buat komponen **WhatsAppButton**: per produk + floating tombol "Hubungi" | Astro | URL scheme `https://wa.me/...`, auto-fill template parameter | 45 menit |
| 4.9 | Buat komponen **PaymentMethods**: QRIS image, daftar rekening/e-wallet | Astro | Image optimization, accordion UI | 30 menit |
| 4.10 | Buat **404 page** untuk slug toko yang tidak ditemukan | Astro | Custom error pages, redirect logic | 15 menit |
| 4.11 | Buat **Analytics tracker**: script ringan kirim POST ke API setiap page load | Hono.js + Astro | Beacon API, visitor dedup by IP hash | 30 menit |
| 4.12 | Integrasi **Cloudflare Turnstile** di landing page form daftar | Cloudflare Turnstile | Turnstile React widget, site key injection | 20 menit |
| 4.13 | Setup **robots.txt**, **sitemap.xml**, Open Graph meta tags | Astro | SEO fundamentals, social preview cards | 30 menit |
| 4.14 | Deploy ke **Cloudflare Pages** — hubungkan ke GitHub repo | Cloudflare Pages | Git integration, build config, environment variables, preview deployments | 30 menit |
| 4.15 | **Custom domain**: beli sendbook.id, setup DNS via Cloudflare | Cloudflare DNS | DNS records, zone setup, SSL/TLS, page rules | 30 menit |

**Total Fase 4: ~10 jam**

---

## 🚀 Fase 5: Deploy & Launch

**Tujuan:** Semua siap produksi, siap dipakai UMKM
**Estimasi:** 2 hari
**Output:** Live production, dokumentasi, UMKM testing

| # | Todo | Service/Tool | Yang Dipelajari (Mastery) | Waktu |
|---|---|---|---|---|
| 5.1 | Beli domain **sendbook.id** (Niagahoster/Domainesia/Cloudflare Registrar) | Domain Registrar | TLD selection, WHOIS privacy | 15 menit |
| 5.2 | Setup **Cloudflare DNS**: A/CNAME untuk root (Pages) + `api.sendbook.id` (Workers) | Cloudflare DNS | DNS record types, proxy (orange cloud), TTL | 20 menit |
| 5.3 | Setup **Better-Auth production URLs**: update callback URLs untuk OAuth Google | Better-Auth | OAuth 2.0 redirect URIs, production config | 15 menit |
| 5.4 | Deploy API ke **production** Worker: `wrangler deploy --env production` | Cloudflare Workers | Environment-specific config, secrets | 15 menit |
| 5.5 | Build & deploy **Astro storefront** ke Pages production | Cloudflare Pages | Build command, output directory, environment variables | 15 menit |
| 5.6 | **EAS Build** APK final — download, test install di device | EAS Build | APK signing, version code, Play Console vs direct APK | 30 menit |
| 5.7 | **E2E test** end-to-end: daftar → buat toko → upload produk → share link → order WA | Manual | Edge case discovery, flow validation | 1 jam |
| 5.8 | Buat **README.md** — panduan lengkap cara setup toko | GitHub | Documentation writing, Markdown, badges | 1 jam |
| 5.9 | Buat **/pricing** page di Astro — Free vs Pro comparison table | Astro | Pricing psychology, feature comparison | 1 jam |
| 5.10 | Buat landing page copy + CTA yang meyakinkan | — | Copywriting, conversion optimization | 1 jam |
| 5.11 | Ajukan 5 **UMKM teman/keluarga** untuk testing & feedback | — | User testing, feedback collection, iteration | 3 hari |

**Total Fase 5: ~6 jam aktif + 3 hari testing**

---

## 📈 Fase 6: Post-Launch

**Tujuan:** Iterasi berdasarkan feedback, nambah fitur revenue-generating
**Estimasi:** Ongoing (8+ hari setelah Fase 5)

| # | Todo | Service/Tool | Prioritas |
|---|---|---|---|
| 6.1 | Fix bug dari feedback UMKM testing | — | 🔴 Critical |
| 6.2 | **Analytics publik** — hit counter di storefront (dilihat X kali) | Upstash Redis + Astro | 🟡 High |
| 6.3 | **Premium subscription** via Midtrans/Xendit — upgrade flow | Midtrans/Xendit | 🟡 High |
| 6.4 | **Custom domain** untuk merchant Pro — `toko.com` pointing ke sendbook | Cloudflare DNS + API | 🟡 High |
| 6.5 | **Export/Share** — download QR code, share card (image generator) | expo-qr + canvas | 🟡 Medium |
| 6.6 | **Approval system** — admin approve slug toko (anti-spam) | Admin dashboard | 🟡 Medium |
| 6.7 | **Notification push** — pemberitahuan order masuk | Expo Notifications + API | 🟡 Medium |
| 6.8 | **CSV import/export** produk | Multer/CSV parser | 🟡 Medium |
| 6.9 | **AI deskripsi** — auto-generate deskripsi dari nama produk | Cloudflare AI Workers | 🟢 Nice-to-have |
| 6.10 | **Integrasi payment gateway** — checkout in-page (Midtrans Snap) | Midtrans/Xendit | 🟢 Nice-to-have |
| 6.11 | **Multi-store** — satu akun, banyak toko | — | 🟢 Future |
| 6.12 | **Referral program** — ajak UMKM lain, dapat diskon/free | — | 🟢 Future |

---

## Ringkasan Total Waktu

| Fase | Jam Aktif | Hari Kalender |
|---|---|---|
| Fase 0: Fork & Bersihkan | 3 jam | 1 hari |
| Fase 1: Database & Auth | 4 jam | 2 hari |
| Fase 2: Backend API | 8 jam | 3 hari |
| Fase 3: Merchant Mobile App | 18 jam | 5 hari |
| Fase 4: Customer Storefront | 10 jam | 3 hari |
| Fase 5: Deploy & Launch | 6 jam aktif + 3 hari testing | 3 hari |
| **Total** | **~49 jam** | **~14 hari** |
