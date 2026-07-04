# Sendbook

> **Toko dalam satu link.**
> Platform etalase digital satu halaman untuk UMKM Indonesia.

## Struktur Proyek

```
sendbook/
├── apps/
│   ├── mobile/      # Expo app — Merchant Dashboard
│   ├── api-edge/    # Hono.js API — Cloudflare Workers
│   └── web/         # Astro — Customer Storefront + Landing
├── shared/
│   ├── config/      # Domains, constants
│   └── types/       # Shared TypeScript types
├── docs/            # Dokumentasi & pitch deck
└── package.json     # pnpm workspaces root
```

## Tech Stack

| Layer | Teknologi |
|---|---|
| **Mobile App** | Expo SDK 56 + React Native 0.85 |
| **API** | Hono.js + Cloudflare Workers |
| **Storefront** | Astro + Cloudflare Pages |
| **Database** | Supabase (PostgreSQL) + Drizzle ORM |
| **Cache** | Upstash Redis |
| **Auth** | Better-Auth |
| **Storage** | Cloudflare R2 |
| **Package** | pnpm workspaces |

## Development

```bash
# Install dependencies
pnpm install

# Start mobile app
cd apps/mobile && npx expo start

# Start API dev server
cd apps/api-edge && pnpm dev

# Start web storefront
cd apps/web && pnpm dev
```
