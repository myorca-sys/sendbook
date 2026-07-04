# Cloudflare Pages — Storefront + Landing

> Hosting Astro storefront & landing page Sendbook.

| Item | Nilai | Status |
|---|---|---|
| **Project Name** | `sendbook` | ✅ |
| **Production Domain** | `sendbook.id` (belum dibeli, pakai `sendbook.pages.dev` dulu) | ⬜ |
| **Build Command** | (Astro: `npm run build`) | ⬜ |
| **Build Output** | `dist` | ⬜ |

## Setup yang sudah dilakukan

- ✅ Pages project `sendbook` dibuat via API
- ✅ Akses sementara di `https://sendbook.pages.dev`
- ✅ Direct upload enabled (bisa upload build via dashboard)

## Langkah Setup selanjutnya

- [ ] Buka Cloudflare Dashboard → Workers & Pages → **sendbook**
- [ ] Hubungkan ke GitHub repo `myorca-sys/sendbook`
- [ ] Set build config (setelah Astro storefront siap):
  - Build command: `cd apps/web && npm install && npm run build`
  - Build output directory: `apps/web/dist`
- [ ] Deploy
- [ ] (Setelah domain aktif) Set custom domain → `sendbook.id`

## Catatan

- Pages auto-deploy setiap push ke branch `main`
- Preview deployment untuk setiap PR (branch lain)
- Build log bisa dilihat di dashboard
