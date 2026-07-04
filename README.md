# Sendbook

> **Toko dalam satu link.**
> Platform etalase digital satu halaman untuk UMKM Indonesia.

## Struktur Proyek

```
sendbook/
├── apps/
│   ├── mobile/         # Expo app — Merchant Dashboard
│   ├── api-edge/       # Hono.js API — Cloudflare Workers
│   └── web/            # Astro — Customer Storefront + Landing
├── shared/             # Shared types & config
├── docs/               # 📓 Dokumentasi (symlink → shared storage)
│                       #   Bisa diedit via Obsidian:
│                       #   Buka vault: Documents/sendbook/
├── docs-link.sh        # 🔗 Script recreates symlink on any machine
└── package.json
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

## Development

```bash
# Setup docs link (run once on each machine)
./docs-link.sh termux   # on Android/Obsidian
./docs-link.sh local    # on laptop/desktop

# Install dependencies
cd apps/api-edge && npm install --ignore-scripts

# Start API dev server
cd apps/api-edge && npm run dev
```

## Dokumentasi

Semua dokumentasi ada di `docs/` — lihat [docs/00-INDEX.md](./docs/00-INDEX.md).

**Di Android:** Buka folder `Documents/sendbook/` sebagai vault di Obsidian.
**Di laptop:** `docs/` adalah folder biasa — edit langsung.
