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
├── docs/               # 📓 Dokumentasi (git tracked)
├── docs-link.sh        # 🔄 Sync script: Termux ↔ Obsidian
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
# Install API dependencies
cd apps/api-edge && npm install --ignore-scripts

# Start API dev server
cd apps/api-edge && npm run dev
```

## Dokumentasi

Semua dokumentasi ada di `docs/` — lihat [docs/00-INDEX.md](./docs/direction/00-INDEX.md).

### Baca di Obsidian (Android)
```bash
# Sync dari project ke shared storage (setelah commit)
bash docs-link.sh to-obsidian

# Buka vault Documents/sendbook/ di Obsidian
```

### Edit dari Obsidian
```bash
# Setelah edit di Obsidian, sync balik:
bash docs-link.sh from-obsidian

# Lalu commit dari Termux:
git add docs/ && git commit -m "docs: ..."
```
