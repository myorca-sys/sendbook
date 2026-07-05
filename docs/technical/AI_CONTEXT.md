# AI Context Handoff — Sendbook

Dokumen ini untuk AI di sesi berikutnya agar langsung paham konteks tanpa baca semua file.

## Ringkasan 30 Detik

Sendbook = etalase digital 1-halaman untuk UMKM Indonesia.
- Fork dari Orca (grey-area code dihapus)
- **Live**: `sendbook.pages.dev` (landing page, API, storefront)
- **Backend**: Hono.js via Cloudflare Pages Functions
- **DB**: Supabase PostgreSQL (reuse Orca — ganti sebelum launch)
- **Cache**: Upstash Redis (reuse Orca — ganti sebelum launch)
- **Storage**: Cloudflare R2 public bucket
- **Auth**: Better-Auth (email/password)
- **Frontend**: Astro static (landing) + SSR via Pages Functions (storefront)

## Constraints (PENTING)

1. **Android Termux** — tidak bisa run wrangler, workerd, drizzle-kit, esbuild
2. **npm** — pakai `--ignore-scripts` kalau ada package dengan workerd
3. **Deploy** — push GitHub → Cloudflare Pages auto-deploy
4. **API Token CF** — punya Pages Write + R2 Read, **tidak** punya Workers Write atau R2 Create

## Current State

### Live URLs

| URL | Fungsi |
|---|---|
| `https://sendbook.pages.dev` | Landing page (Astro static) |
| `https://sendbook.pages.dev/api/health` | Health check |
| `https://sendbook.pages.dev/store/warung-bu-ana` | Storefront demo (SSR) |
| `https://pub-8b6a4088db2c4966974f91de589f6cb9.r2.dev` | R2 public bucket |

### API Endpoints (via `/api/`)

`GET /api/health`, `POST /api/stores`, `GET /api/stores/:slug`, `PUT /api/stores/:id`, `DELETE /api/stores/:id`, `POST /api/products`, `PUT /api/products/:id`, `DELETE /api/products/:id`, `POST /api/upload`, `GET /api/analytics/summary`, `POST /api/analytics/event`

Auth routes via Better-Auth: `/api/auth/email-password/sign-in`, etc.

### Storefront (`/store/:slug`)

Server-rendered: inject store name, description, WhatsApp into HTML head for SEO.
Client-side JS: render product grid, WhatsApp chat buttons, analytics tracking.

## Prioritas untuk Next Session

1. 🟢 **Server-side product render** — saat ini produk di-render client-side (JS). Pindahkan ke server-side di `functions/store/[[slug]].ts` untuk SEO.
2. 🟢 **Merchant dashboard web** — login page, product management, store settings (web-based, bukan mobile dulu).
3. 🔴 **Production hardening** — buat Supabase project baru, Upstash Redis baru (current reuse Orca — credentials leaked).
4. 🟢 **Beli domain `sendbook.id`** — setup Cloudflare DNS.

## Important Files

| File | Deskripsi |
|---|---|
| `functions/api/[[path]].ts` | API handler (Hono.js + postgres) |
| `functions/store/[[slug]].ts` | SSR storefront |
| `apps/web/src/pages/index.astro` | Landing page |
| `apps/web/package.json` | Web dependencies |
| `package.json` (root) | Pages Functions dependencies |

## Credentials Snapshot

| Service | Credential | Status |
|---|---|---|
| Cloudflare Account | `Moehamadhkl@gmail.com` | ✅ |
| Cloudflare API Token | `kvAsLENRut_Z7Vpda5D0LyCpyDzTapknNF4KKmBC` | ✅ Limited |
| Supabase DB | `postgresql://postgres.ppwocgmumbdbvnqprxrg:Habibiendut1.@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres` | ⚠️ Orca reuse |
| Upstash Redis | `powerful-crow-69427` | ⚠️ Orca reuse |
| R2 Bucket | `sendbook-products` | ✅ Public |
| Better-Auth Secret | `f3JU7XRj6C3zmKZZYxMCwM2C2fUTCE0hKmcNNP2k1GM=` | ✅ |

## Next Session Start Command

```bash
cd /data/data/com.termux/files/home/projects/sendbook
# Read this file first, then docs/technical/03-ARCHITECTURE.md, then docs/technical/04-MASTERY-TODO.md
```
