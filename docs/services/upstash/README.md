# ⚡ Upstash Redis — Caching

> Redis untuk rate limiting API, caching data, dan session store.

| Item | Nilai | Status |
|---|---|---|
| **Email Akun** | | ⬜ |
| **Database Name** | `sendbook` | ⬜ |
| **Region** | Singapore (ap-southeast-1) | ⬜ |
| **REST URL** | `https://[id].upstash.io` | ⬜ |
| **REST Token** | `xxxxxxxx` | ⬜ |

## Langkah Setup

- [ ] Buka [upstash.com](https://upstash.com)
- [ ] Login (bisa pakai akun GitHub)
- [ ] **Create Database** → pilih **Redis**
- [ ] Region: **Singapore** (supaya dekat dengan Supabase)
- [ ] Setelah jadi, buka **REST API** tab
- [ ] Copy **UPSTASH_REDIS_REST_URL** & **UPSTASH_REDIS_REST_TOKEN**
- [ ] Simpan ke environment:
```bash
# .dev.vars
UPSTASH_REDIS_REST_URL=https://[id].upstash.io
UPSTASH_REDIS_REST_TOKEN=[token]

# wrangler secret (production)
echo "$UPSTASH_REDIS_REST_URL" | npx wrangler secret put UPSTASH_REDIS_REST_URL
echo "$UPSTASH_REDIS_REST_TOKEN" | npx wrangler secret put UPSTASH_REDIS_REST_TOKEN
```

## Yang Pake Redis di Sendbook

| Fitur | Keterangan | Status |
|---|---|---|
| Rate limiting | 100 req/min per IP | ⬜ Belum |
| Session cache | Better-Auth session | ✅ Bisa |
| Analytics counter | Hitungan real-time | ⬜ Belum |

## Catatan

- Free tier Upstash cukup untuk development (10.000 cmd/hari)
- Redis via REST API — cocok untuk Cloudflare Workers (HTTP, bukan TCP)
