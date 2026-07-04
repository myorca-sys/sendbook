# Cloudflare DNS — Domain Records

> Mengarahkan domain sendbook.id ke Cloudflare Pages & Workers.

| Item | Nilai | Status |
|---|---|---|
| **Domain** | `sendbook.id` | ⬜ |
| **Nameserver** | (diisi Cloudflare setelah add domain) | ⬜ |

## DNS Records

| Type | Name | Target | Proxy |
|---|---|---|---|
| `CNAME` | `@` (root) | `sendbook.pages.dev` | ✅ (orange cloud) |
| `CNAME` | `api` | `sendbook-api.workers.dev` | ✅ (orange cloud) |
| `CNAME` | `www` | `sendbook.id` | ✅ |

## Langkah Setup

- [ ] Beli domain `sendbook.id` di registrar (Niagahoster/Domainesia)
- [ ] Add domain ke Cloudflare → ikuti instruksi ganti nameserver
- [ ] Tunggu propagasi (beberapa jam - 24 jam)
- [ ] Add DNS records sesuai tabel di atas
- [ ] Test: `curl https://sendbook.id` & `curl https://api.sendbook.id/health`
