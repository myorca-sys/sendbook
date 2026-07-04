# 🗄️ Supabase — Database

> PostgreSQL untuk menyimpan data toko, produk, dan analytics.

| Item | Nilai | Status |
|---|---|---|
| **Email Akun** | | ⬜ |
| **Project Name** | `sendbook` | ⬜ |
| **Database Password** | | ⬜ |
| **Region** | Singapore (ap-southeast-1) | ⬜ |
| **Project URL** | `https://xxxxx.supabase.co` | ⬜ |
| **Anon Public Key** | | ⬜ |
| **Service Role Key** | | ⬜ |
| **Database URL (PS Pooling)** | | ⬜ |
| **Database URL (Direct)** | | ⬜ |

## Langkah Setup

### 1. Buat Project
- [ ] Buka [supabase.com](https://supabase.com) → Login
- [ ] **New Project**
- [ ] Nama: `sendbook`
- [ ] Database Password: [isi sendiri, simpan aman]
- [ ] Region: **Southeast Asia** (Singapore)
- [ ] Tunggu provisioning (~2-3 menit)

### 2. Setup Database
- [ ] Buka **SQL Editor**
- [ ] Paste isi `apps/api-edge/src/db/migrations/0000_init.sql`
- [ ] **Run** (membuat tabel: stores, products, analytics_events)
- [ ] Opsional: paste & run `seed.sql` untuk data dummy

### 3. Catat Credentials
- [ ] Buka **Project Settings → Database → Connection string**
- [ ] Copy URL (gunakan `psql` mode dengan pooling)
- [ ] Buka **Project Settings → API**
- [ ] Copy **Project URL** & **anon public key**

### 4. Simpan ke Environment
```bash
# .dev.vars (local dev)
DATABASE_URL=postgresql://postgres:[password]@[host].pooler.supabase.com:6543/postgres

# wrangler secret (production)
echo "DATABASE_URL" | npx wrangler secret put DATABASE_URL
```

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
