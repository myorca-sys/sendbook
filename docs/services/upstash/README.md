# ⚡ Upstash Redis — Caching

> Redis untuk rate limiting API, caching data, dan session store.

| Item | Nilai | Status |
|---|---|---|
| **Email Akun** | (pakai akun GitHub `ngakal`) | ⬜ |
| **Database Name** | `powerful-crow-69427` (instance Orca) | ✅ reuse |
| **Region** | (tidak diketahui, ping OK dari SG) | ✅ |
| **REST URL** | `https://powerful-crow-69427.upstash.io` | ✅ |
| **REST Token** | `gQAAAAAAAQ8zAAIgcDIzNzIxOWVjNDZhMGE0MzU1ODQ0ZmNhOGE0Mzg1OTI3ZA` | ✅ |

## Verifikasi

- ✅ Redis connection diverifikasi: `PONG` dari Termux

## Setup selanjutnya

- [ ] Bisa buat instance baru khusus sendbook (rekomendasi)
- [ ] Atau reuse instance Orca yang sudah ada
- [ ] Copy credentials ke environment:

> ⚠️ Token ini sudah terekspos di git history Orca. Sebaiknya buat instance Redis baru untuk production.
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
