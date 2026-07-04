# Cloudflare Workers — API Backend

> Hosting Hono.js API untuk Sendbook.

| Item | Nilai | Status |
|---|---|---|
| **Worker Name** | `sendbook-api` | ⬜ |
| **Route** | `api.sendbook.id/*` | ⬜ |
| **Deploy Method** | `wrangler deploy` (dari laptop) | ⬜ |

## Langkah Setup

- [ ] Login ke Cloudflare Dashboard → Workers & Pages
- [ ] Create Worker (atau deploy dari CLI)
- [ ] Set route binding: `api.sendbook.id/*`
- [ ] Deploy dari laptop:
```bash
cd apps/api-edge
npx wrangler deploy
```
- [ ] Set secrets produksi:
```bash
echo "$DATABASE_URL" | npx wrangler secret put DATABASE_URL
echo "$BETTER_AUTH_SECRET" | npx wrangler secret put BETTER_AUTH_SECRET
echo "$BETTER_AUTH_URL" | npx wrangler secret put BETTER_AUTH_URL
echo "$UPSTASH_REDIS_REST_URL" | npx wrangler secret put UPSTASH_REDIS_REST_URL
echo "$UPSTASH_REDIS_REST_TOKEN" | npx wrangler secret put UPSTASH_REDIS_REST_TOKEN
```

## Catatan

- ⚠️ `wrangler` & `workerd` **tidak bisa jalan di Android/Termux** (unsupported platform)
- Deploy harus dari laptop, GitHub Actions, atau Cloudflare Dashboard langsung
