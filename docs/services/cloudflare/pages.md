# Cloudflare Pages — Storefront + Landing

> Hosting Astro storefront & landing page Sendbook.

| Item | Nilai | Status |
|---|---|---|
| **Project Name** | `sendbook` | ⬜ |
| **Production Domain** | `sendbook.id` | ⬜ |
| **Build Command** | (Astro: `npm run build`) | ⬜ |
| **Build Output** | `dist` | ⬜ |

## Langkah Setup

- [ ] Buka Cloudflare Dashboard → Workers & Pages → **Create → Pages**
- [ ] Hubungkan ke GitHub repo `sendbook`
- [ ] Set build config:
  - Build command: `cd apps/web && npm install && npm run build`
  - Build output directory: `apps/web/dist`
- [ ] Deploy
- [ ] (Setelah domain aktif) Set custom domain → `sendbook.id`

## Catatan

- Pages auto-deploy setiap push ke branch `main`
- Preview deployment untuk setiap PR (branch lain)
- Build log bisa dilihat di dashboard
