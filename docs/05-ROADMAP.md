# 🗺️ Roadmap & Milestone

> Timeline pengembangan Sendbook dari V1 sampai long-term.

---

## Timeline Visual

```
MINGGU  1   2   3   4   5   6   7   8   9  10  11  12
        █   █   █   █   █   █   █   █   █   █   █   █

V1      ████████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░
        ░░░░░░░░░░░░░░████████████████████░░░░░░░░░░░░
V1.5                            ░░░░░░████████░░░░░░░░
V2                                      ░░░░░░░░██████

LAUNCH: ██
        Minggu 2-3
```

---

## Fase & Milestone

### 🚀 V1 — "Minimal Storefront" (Minggu 1-2)

**Target rilis:** Minggu ke-2
**Fokus:** Core loop functional — merchant bisa daftar, upload produk, dan punya link toko

| Milestone | Deadline | Deliverable | Status |
|---|---|---|---|
| M0.1 | Fork Orca + bersihkan | Hari 1 | Repo sendbook ready | ✅ |
| M0.2 | Database schema + Auth | Hari 2-3 | Supabase + Better-Auth running | ⬜ |
| M0.3 | Backend API deployed | Hari 4-6 | Semua CRUD endpoint live | ⬜ |
| M0.4 | Mobile app APK siap | Hari 7-11 | Expo app functional di HP | ⬜ |
| M0.5 | Storefront + Landing live | Hari 12-14 | sendbook.id bisa diakses publik | ⬜ |
| M0.6 | 🎯 **LAUNCH V1** | Hari 14 | 5 UMKM testing | ⬜ |

**V1 Features:**
- ✅ Daftar akun (email/Google)
- ✅ Buat toko (nama, slug, alamat, WA)
- ✅ Upload produk (foto dari HP/gallery)
- ✅ Storefront publik (link: `sendbook.id/namatoko`)
- ✅ Grid produk + harga
- ✅ Tombol "Pesan via WA" (auto-fill)
- ✅ QRIS display
- ✅ Landing page
- ✅ Analytics dasar (pengunjung, klik WA)

**V1 Not Included:**
- ❌ Custom domain
- ❌ Payment gateway
- ❌ Multi-store
- ❌ Notifikasi
- ❌ Admin panel
- ❌ AI features

**Success Metrics V1:**
| Metrik | Target |
|---|---|
| Merchant aktif | 50 (5 paying) |
| Storefront page load | <500ms |
| Bug severity | No P0/P1 |
| User feedback | 5 UMKM testing |

---

### 🔄 V1.5 — "Stabilisasi & Monetisasi" (Minggu 3-4)

**Target rilis:** Minggu ke-4
**Fokus:** Fix bug, tambah fitur revenue, persiapan growth

| Milestone | Deadline | Deliverable |
|---|---|---|
| M1.1 | Bug fixes from V1 feedback | Minggu 3 |
| M1.2 | Premium subscription (Midtrans) | Minggu 3 |
| M1.3 | Custom domain untuk Pro | Minggu 3-4 |
| M1.4 | QR code generator di mobile app | Minggu 4 |
| M1.5 | Share card (image) export | Minggu 4 |
| M1.6 | EAS Update channel production | Minggu 4 |

**V1.5 Features:**
- ✅ Subscription payment via Midtrans/Xendit
- ✅ Custom domain (`toko.com` → storefront)
- ✅ QR code download/cetak
- ✅ Share to WhatsApp (pre-filled template)
- ✅ EAS Update OTA channel

**V1.5 Pricing:**
| Tier | Harga | Fitur |
|---|---|---|
| **Free** | Rp0 | 10 produk, branded "Sendbook", basic analytics |
| **Pro** | Rp50k/bulan | Unlimited produk, custom domain, advanced analytics |
| **Lifetime** | Rp500k | Pro selamanya (limited) |

---

### 📈 V2 — "Growth Engine" (Minggu 5-8)

**Target rilis:** Minggu ke-8
**Fokus:** Scale, engagement, payment integration penuh

| Milestone | Deadline | Deliverable |
|---|---|---|
| M2.1 | Payment gateway checkout in-page (Midtrans Snap) | Minggu 5-6 |
| M2.2 | Notification push untuk order masuk | Minggu 6 |
| M2.3 | Multi-store management (satu akun, banyak toko) | Minggu 6-7 |
| M2.4 | Referral program | Minggu 7 |
| M2.5 | Integrasi marketplace (Shopee, Tokopedia link) | Minggu 7-8 |
| M2.6 | Admin dashboard (approval, monitoring) | Minggu 8 |

**V2 Features:**
- ✅ Checkout in-page: pelanggan bisa bayar langsung tanpa WA
- ✅ Push notification ke merchant
- ✅ Multi-store: satu akun kelola beberapa toko
- ✅ Referral: "Ajak UMKM lain, gratis 1 bulan"
- ✅ Link marketplace: Shopee, Tokopedia, TikTok Shop
- ✅ Admin dashboard: approval slug, lihat semua store, block spam

---

### 🚀 V3 — "Ecosystem" (Minggu 9-12+)

**Target rilis:** Minggu ke-12
**Fokus:** AI features, logistik, brand

| Milestone | Deadline | Deliverable |
|---|---|---|
| M3.1 | AI auto-generate deskripsi produk | Minggu 9-10 |
| M3.2 | AI enhance foto produk (background removal, brightness) | Minggu 10 |
| M3.3 | Integrasi ongkir (JNE/Sicepat/Gosend) | Minggu 10-11 |
| M3.4 | Sendbook Branding kit (QR, kartu nama, stiker) | Minggu 11 |
| M3.5 | Analytics insight & rekomendasi | Minggu 11-12 |
| M3.6 | 🎯 **Series A ready** | Minggu 12 |

**V3 Features:**
- 🤖 AI deskripsi: masukkan "Nasi Goreng" → generate deskripsi + keyword
- 🤖 AI foto: auto-crop, brightness, remove background
- 📦 Ongkir: hitung otomatis via API JNE/Sicepat
- 🏪 Branding kit: cetak QR code + kartu nama + stiker toko
- 📊 Insight: "Produk kamu paling laris jam 7 malam. Naikkan harga Rp2rb?"
- 💰 Series A fundraising

---

## Key Performance Indicators

### Product (V1)

| KPI | Target V1 | Target V2 | Target V3 |
|---|---|---|---|
| **Merchant terdaftar** | 500 | 10.000 | 50.000 |
| **Merchant aktif (7d)** | 50 | 2.000 | 15.000 |
| **Paying users** | 5 | 500 | 5.000 |
| **Churn rate** | <20% | <10% | <5% |
| **Storefront page views** | 5.000/bln | 500k/bln | 5M/bln |
| **WhatsApp clicks** | 500/bln | 50k/bln | 500k/bln |

### Technical

| KPI | Target V1 | Target V2 |
|---|---|---|
| **API uptime** | 99% | 99.9% |
| **Storefront load time** | <1s | <500ms |
| **API response (p95)** | <300ms | <150ms |
| **Crash rate (mobile)** | <1% | <0.1% |
| **EAS Update success** | 99% | 99.9% |

### Business

| KPI | Target V1 | Target V2 | Target V3 |
|---|---|---|---|
| **MRR (Monthly Recurring Revenue)** | Rp250rb | Rp25jt | Rp250jt |
| **ARR (Annual Run Rate)** | Rp3jt | Rp300jt | Rp3M |
| **CAC (Customer Acquisition Cost)** | — | Rp50rb | Rp20rb |
| **LTV (Life Time Value)** | — | Rp600rb | Rp3jt |
| **LTV/CAC ratio** | — | 12x | 15x |
| **Burn rate** | Rp0 (self-funded) | Rp10jt/bln | Rp100jt/bln |

---

## Release Checklist (Pre-V1 Launch)

Sebelum V1 launch, pastikan semua ini ter-checklist:

### Infrastructure
- [ ] Domain sendbook.id live
- [ ] Cloudflare DNS configured
- [ ] SSL/HTTPS enabled (Cloudflare Edge)
- [ ] API Workers deployed
- [ ] Pages deployed
- [ ] R2 bucket created & writable
- [ ] Supabase migrations applied
- [ ] Upstash Redis connected

### Security
- [ ] All secrets via `wrangler secret put` (no hardcoded)
- [ ] Turnstile active on signup form
- [ ] CORS restricted
- [ ] Rate limiting active
- [ ] Input validation on all endpoints
- [ ] No scraping/bot code (clean fork)

### Mobile App
- [ ] EAS Build APK generated
- [ ] EAS Update channel configured
- [ ] App installs & runs on Android 14+
- [ ] Camera/gallery permission works
- [ ] Auth flow complete (login/register/Google)
- [ ] Product CRUD works end-to-end
- [ ] E2E: daftar → buat toko → upload 3 produk → copy link → order via WA

### Storefront
- [ ] `sendbook.id` loads landing page
- [ ] `sendbook.id/warung-bu-ana` loads storefront
- [ ] Product grid renders correctly
- [ ] WhatsApp button sends correct template
- [ ] QRIS image displays
- [ ] Mobile responsive (test di HP)

### Documentation
- [ ] README.md complete
- [ ] Cara pakai (3 langkah)
- [ ] Pricing page
- [ ] FAQ (if applicable)

---

## Dependency Graph

```
Fase 0 ──▶ Fase 1 ──▶ Fase 2 ──▶ Fase 3 ──▶ Fase 5
                                  │
                                  └──▶ Fase 4 ──▶
                                    (independen,
                                    bisa paralel
                                    dengan Fase 3)
```

**Catatan:** Fase 3 (Mobile) dan Fase 4 (Storefront) bisa dikerjakan **paralel** karena timnya sama-sama kamu. Tapi rekomendasiku kerjakan berurutan biar fokus: Mobile dulu (lebih kompleks karena native), baru Storefront (lebih ringan karena Astro).
