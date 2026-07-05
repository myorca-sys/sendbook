# Supabase — Database

## ⚠️ PERINGATAN: DEV ONLY

Database ini **reuse dari Orca**. Password sudah terekspos di git history Orca.
**Jangan gunakan untuk production.** Buat project Supabase baru sebelum launch publik.

## Koneksi

| Properti | Value |
|---|---|
| Project ref | `ppwocgmumbdbvnqprxrg` |
| Connection string | `postgresql://postgres.ppwocgmumbdbvnqprxrg:Habibiendut1.@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres` |
| Pooler | Supabase connection pooler (port 6543) |
| Direct connection | Port 5432 (not used) |
| Status | ✅ Verified via `/api/health` |

## Schema

### Tables (Sendbook)

```sql
-- Buat dengan 0000_init.sql
CREATE TABLE stores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  address TEXT,
  whatsapp TEXT,
  maps_url TEXT,
  theme JSONB DEFAULT '{}',
  social_links JSONB DEFAULT '{}',
  payment_methods JSONB DEFAULT '{}',
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price INTEGER NOT NULL,
  description TEXT,
  images TEXT[] DEFAULT '{}',
  category TEXT,
  is_available BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID REFERENCES stores(id),
  type TEXT NOT NULL,
  product_id UUID,
  ip_hash TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### Tables (Orca — Abaikan)

Ada juga tabel `scraper_rules`, `watch_history`, `users`, `sessions`, dll dari Orca.
Jangan dihapus — nanti buat project Supabase baru untuk Sendbook sendiri.

## Seed Data

1 store + 6 products (warung-bu-ana). Sudah di-run.

## Migration File

`apps/api-edge/src/db/migrations/0000_init.sql` — berisi CREATE TABLE statements.

## Cara Apply Migration

1. Buka Supabase Dashboard → SQL Editor
2. Paste isi file migration
3. Run
4. (Optional) Run seed.sql untuk data dummy

## Catatan

- Tidak bisa pakai `drizzle-kit` di Android (arm64 not supported)
- Semua migration dijalankan manual via SQL Editor
- Untuk production: create project baru, apply migration, update `DATABASE_URL` env var di Cloudflare Pages


1. Connection string
Copy the connection details for your database.
Details:
Shared Pooler
Forgot your database password?
host:aws-1-ap-southeast-1.pooler.supabase.com
port:5432
database:postgres
user:postgres.mpbtxvgkoekwulzlebjh
Code:
File: Code
```
postgresql://postgres.mpbtxvgkoekwulzlebjh:[YOUR-PASSWORD]@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres
```

1. Configure MCP
Set up your MCP client.
Details:
Add this configuration to ~/.config/opencode/opencode.json:
After adding the configuration, run the following command to authenticate:
This will open your browser to complete the OAuth authentication flow.
Need help?View OpenCode docs
Code:
File: Code
```
1{
2  "$schema": "https://opencode.ai/config.json",
3  "mcp": {
4    "supabase": {
5      "type": "remote",
6      "url": "https://mcp.supabase.com/mcp?project_ref=mpbtxvgkoekwulzlebjh",
7      "enabled": true
8    }
9  }
10}
```

File: Code
```
opencode mcp auth supabase
```

1. Install ORM
Add the ORM to your project.
Code:
File: Code
```
npm install drizzle-orm
```

File: Code
```
npm install drizzle-kit --save-dev
```

2. Configure ORM
Set up your ORM configuration.
Code:
File: .env
```
# Connect to Postgres via the shared transaction-mode pooler (IPv4-only)
DATABASE_URL="postgresql://postgres.mpbtxvgkoekwulzlebjh:[YOUR-PASSWORD]@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres"
```

File: drizzle/schema.ts
```
1import { pgTable, serial, text, varchar } from "drizzle-orm/pg-core";
2
3export const users = pgTable('users', {
4  id: serial('id').primaryKey(),
5  fullName: text('full_name'),
6  phone: varchar('phone', { length: 256 }),
7});
```

File: index.tsx
```
1import { drizzle } from 'drizzle-orm/postgres-js'
2import postgres from 'postgres'
3import { users } from './drizzle/schema'
4
5const connectionString = process.env.DATABASE_URL
6
7// Disable prefetch as it is not supported for "Transaction" pool mode
8const client = postgres(connectionString, { prepare: false })
9const db = drizzle(client);
10
11const allUsers = await db.select().from(users);
```
