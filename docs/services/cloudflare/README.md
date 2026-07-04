# ☁️ Cloudflare

> Infrastructure utama Sendbook: Workers (API), R2 (gambar), Pages (storefront), DNS (domain).

Cloudflare punya beberapa sub-service yang perlu diatur masing-masing.
Lihat file terpisah untuk detail:

| File | Sub-service | Status |
|---|---|---|
| `workers.md` | API backend (Hono.js) | ⬜ |
| `r2.md` | Image storage (produk) | ⬜ |
| `pages.md` | Storefront + landing page | ⬜ |
| `dns.md` | Custom domain records | ⬜ |

## Akun Cloudflare

| Item | Nilai | Status |
|---|---|---|
| **Email** | `Moehamadhkl@gmail.com` (akun Orca) | ✅ |
| **Account ID** | `cfcb770cf5a91b6505a25d48d476e4c7` | ✅ |
| **API Token** | (pakai token `zenius` dari `.env.cloudflare`) | ✅ |

## Resource yang sudah dibuat

| Resource | Nama | Status |
|---|---|---|
| **Pages** | `sendbook` → `https://sendbook.pages.dev` | ✅ |
| **R2 bucket** | `sendbook-products` | ⬜ (perlu API token baru) |
| **Worker** | `sendbook-api` | ⬜ (perlu deploy dari laptop) |
