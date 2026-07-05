# Cloudflare Pages

## Project: sendbook

| Properti | Value |
|---|---|
| URL | https://sendbook.pages.dev |
| Git integration | myorca-sys/sendbook (auto-deploy on push to main) |
| Build command | `npm install && cd apps/web && npm install && npm run build` |
| Output dir | `apps/web/dist` |
| Functions | ✅ Yes (root `/functions/`) |
| Node.js compat | ✅ `nodejs_compat` compatibility flag |

## Environment Variables (set via API)

| Variable | Value |
|---|---|
| `DATABASE_URL` | `postgresql://postgres.ppwocgmumbdbvnqprxrg:Habibiendut1.@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres` |
| `BETTER_AUTH_SECRET` | `f3JU7XRj6C3zmKZZYxMCwM2C2fUTCE0hKmcNNP2k1GM=` |
| `BETTER_AUTH_URL` | `https://sendbook.pages.dev` |
| `UPSTASH_REDIS_URL` | `https://powerful-crow-69427.upstash.io` |
| `UPSTASH_REDIS_TOKEN` | Abaikan — salah, tapi Redis tetap PONG (kemungkinan pakai env default) |
| `ENVIRONMENT` | `development` |

## Functions (Auto-deployed)

| Path | File | Deskripsi |
|---|---|---|
| `/api/*` | `functions/api/[[path]].ts` | Hono.js API (stores, products, upload, analytics) |
| `/store/*` | `functions/store/[[slug]].ts` | SSR storefront |

## Deploy Flow

```
Push to main → GitHub webhook → Cloudflare Pages:
  1. Install npm deps (root + apps/web)
  2. Build Astro (apps/web)
  3. Copy functions/ ke output
  4. Deploy to sendbook.pages.dev
```

## Troubleshooting

- **Functions not working?** Check `functions/` exists at repo root (not inside `apps/web/`)
- **Build fails?** Cloudflare uses a Linux amd64 build container — Astro static mode should work fine
- **Env vars not applying?** Set via API or dashboard, then trigger a new deploy
