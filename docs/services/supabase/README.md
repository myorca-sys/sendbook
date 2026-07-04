# 🗄️ Supabase — Database

> PostgreSQL untuk menyimpan data toko, produk, dan analytics.

| Item | Nilai | Status |
|---|---|---|
| **Email Akun** | `Moehamadhkl@gmail.com` (sama dengan Cloudflare) | ✅ |
| **Project Name** | `ppwocgmumbdbvnqprxrg` (project Orca) | ✅ reuse |
| **Database Password** | `Habibiendut1.` | ✅ |
| **Region** | Singapore (ap-southeast-1) ✅ |
| **Project URL** | `https://ppwocgmumbdbvnqprxrg.supabase.co` | ✅ |
| **Database URL (PS Pooling)** | `postgresql://postgres.ppwocgmumbdbvnqprxrg:Habibiendut1.@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres` | ✅ |
| **Database URL (Direct)** | `postgresql://postgres.ppwocgmumbdbvnqprxrg:Habibiendut1.@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres` | ✅ |

## Setup yang sudah dilakukan

- ✅ Migration `0000_init.sql` dijalankan (tabel: stores, products, analytics_events)
- ✅ Seed data dijalankan (1 store + 6 products)
- ✅ DB connection diverifikasi (langsung dari Termux via node-postgres)

## Migration

Setiap perubahan schema → generate migration SQL baru:

```sql
-- 1. Buat file SQL baru di apps/api-edge/src/db/migrations/
-- 2. Jalankan manual di Supabase SQL Editor
-- 3. Update seed.sql jika perlu
```

## Catatan

- Jangan pakai project Supabase Orca yang lama (data scraper)
- Gunakan **connection pooling** (port 6543) untuk Cloudflare Workers
- RLS (Row Level Security) bisa diaktifkan nanti untuk keamanan tambahan
