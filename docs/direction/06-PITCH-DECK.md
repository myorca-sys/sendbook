# 💰 Pitch Deck — Sendbook

> Dokumen ini untuk persiapan fundraising ketika Sendbook sudah memiliki basis user yang solid.
> **Siap digunakan ketika:** 1.000+ paying users atau MRR Rp25jt+.

---

## Executive Summary

**Sendbook** adalah platform etalase digital satu halaman untuk 65+ juta UMKM Indonesia. Dengan Sendbook, setiap pedagang bisa membuat toko online yang profesional dalam 60 detik — cukup dari HP — tanpa perlu website, tanpa potongan transaksi, dan terintegrasi langsung dengan WhatsApp.

Kami menjembatani celah antara Linktree (terlalu generik) dan marketplace (terlalu kompleks) dengan solusi yang **sesederhana katalog WA, sekuat toko online.**

| Metrik Kunci | Data |
|---|---|
| **TAM Indonesia** | 65 juta UMKM |
| **Revenue Model** | Subscription SaaS (Rp50k/bln) |
| **TAM dalam Rupiah** | Rp39 triliun/tahun |
| **Tim** | Solo founder (technical — AI-orchestrated development) |
| **Tahap** | Pre-seed / Bootstrapped |
| **Funding Ask** | Rp1-5 miliar (Series A, saat traction terbukti) |

---

## Problem

### Masalah UMKM di Indonesia

1. **65 juta UMKM = 99% dari seluruh bisnis di Indonesia**, tapi hanya ~24% yang terdigitalisasi
2. **Mayoritas jualan via WhatsApp** — mengirim foto satu per satu ke pelanggan, tidak efisien
3. **Linktree terlalu generik** — tidak ada display produk, harga, atau tombol order
4. **Marketplace (Tokopedia/Shopee) terlalu kompleks** — kurva belajar tinggi, fee per transaksi 1-5%, kompetisi harga ketat
5. **Bikin website sendiri mahal** — Rp1-5 juta + maintenance, tidak feasible untuk UMKM mikro
6. **Tidak ada data** — UMKM tidak tahu berapa orang yang melihat produk mereka, produk mana yang paling diminati

### Validasi Masalah

> "Saya jualan kue di WA, setiap hari harus kirim ulang foto ke pelanggan yang beda-beda. Capek."
> — **Ibu RT, penjual kue rumahan**

> "Pasang Linktree cuma bisa link Instagram dan WA, nggak bisa display harga. Pelanggan tetap tanya 'berapa?'"
> — **Mahasiswa, jualan streetwear**

---

## Solution

### Sendbook — "Toko dalam Satu Link"

**Untuk UMKM:**
1. Daftar (60 detik) — nama toko, nomor WA, 3 foto produk
2. Dapat link: `sendbook.id/warung-bu-ana`
3. Share link ke pelanggan — mereka lihat produk + harga + tombol WA

**Untuk Pelanggan:**
1. Buka link — lihat semua produk + harga + foto
2. Tap "Pesan via WA" — pesan terisi otomatis
3. Bayar via QRIS/transfer — selesai

**Kenapa UMKM akan suka:**
- ✅ Setup 60 detik dari HP
- ✅ Zero fee transaksi
- ✅ Rp0 untuk mulai (free tier 10 produk)
- ✅ Kerja 100% via WhatsApp — nggak perluubah kebiasaan
- ✅ Link bisa dipasang di Instagram, TikTok, Facebook, atau dicetak jadi QR

---

## Why Now?

| Faktor | Kondisi Saat Ini |
|---|---|
| **Digitalisasi UMKM** | Pemerintah targetkan 30 juta UMKM digital di 2025-2026 |
| **QRIS adoption** | 31+ juta merchant QRIS (Bank Indonesia) |
| **WA Business** | 50%+ UMKM Indonesia jualan via WhatsApp |
| **Linktree popularity** | Linktree sudah jadi standar "link in bio" tapi belum optimized untuk jualan |
| **AI tools maturity** | Cloudflare Workers, Supabase, EAS — infrastruktur murah & matang |

**Timing tepat.** UMKM sudah terbiasa dengan link-in-bio (berkat Linktree), QRIS sudah dimana-mana, WA adalah platform universal. Sendbook tinggal menghubungkan ketiganya.

---

## Market Size

### Top-Down

| Layer | Kalkulasi | Value |
|---|---|---|
| **TAM** (Total Addressable Market) | 65 juta UMKM × Rp600k/thn (Rp50k/bln) | **Rp39 triliun** |
| **SAM** (Serviceable Addressable Market) | UMKM yang sudah digital: 24% × 65jt = 15.6jt × Rp600k | **Rp9.4 triliun** |
| **SOM** (Serviceable Obtainable Market) | Target tahun 3: 50k paying × Rp600k | **Rp30 miliar** |

### Bottom-Up (Proyeksi Realistis)

| Tahun | Paying Users | Monthly Revenue (MRR) | Annual Revenue (ARR) |
|---|---|---|---|
| **V1 Launch (Bulan 1)** | 5 | Rp250rb | Rp3jt |
| **Tahun 1** | 100 | Rp5jt | Rp60jt |
| **Tahun 2** | 1.000 | Rp50jt | Rp600jt |
| **Tahun 3** | 5.000 | Rp250jt | Rp3M |
| **Tahun 4** | 20.000 | Rp1M | Rp12M |
| **Tahun 5** | 50.000+ | Rp2.5M+ | Rp30M+ |

---

## Business Model

### Revenue Streams

| Stream | Deskripsi | V1 | V2+ |
|---|---|---|---|
| **Subscription Pro** | Rp50k/bln (unlimited produk, custom domain, analytics) | ✅ | ✅ |
| **Subscription Lifetime** | Rp500k (one-time) | ✅ | ✅ |
| **Transaction Fee** | 1-2% untuk checkout in-page (Midtrans/Xendit) | ❌ | V2 |
| **Affiliate/Referral** | Komisi dari referral | ❌ | V2 |
| **Sendbook Branding** | Cetak QR card, stiker, kartu nama | ❌ | V3 |
| **AI Features** | Premium AI deskripsi, AI foto enhance | ❌ | V3 |
| **Marketplace Promo** | UMKM bayar untuk featured / promoted | ❌ | V4 |

### Pricing Strategy

| Tier | Harga | Value | Positioning |
|---|---|---|---|
| **Free** | Rp0 | Cukup untuk mulai | Top of funnel — akuisisi massal |
| **Pro** | Rp50k/bln | Setara 1-2x transaksi | Revenue core |
| **Pro Lifetime** | Rp500k (~9 bulan) | Diskon untuk komitmen awal | Early adopter incentive |

### Unit Economics

| Metrik | Estimasi |
|---|---|
| **CAC (paid)** | Rp20-50rb (referral, organic, IG) |
| **CAC (free)** | Rp0 (organic) |
| **ARPU (Average Revenue Per User)** | Rp50k/bln (Pro) |
| **Gross Margin** | 85-90% (cloud infra) |
| **LTV (12 bulan)** | Rp600k |
| **LTV/CAC** | 12-30x |
| **Payback Period** | 1-2 bulan |
| **Churn Rate Target** | <5%/bulan |

---

## Product

### V1 (Launch)
> **"Etalase digital 60 detik — fokus ke core loop: daftar → upload produk → share link → order WA"**

**[Lihat detail fitur di dokumen PROBLEM.md (Solusi V1)](./02-PROBLEM.md)**

### V3 (Matured)
> **"Sistem operasi digital untuk UMKM — etalase, pembayaran, AI, logistik"**

**[Lihat detail fitur final di dokumen PROBLEM.md (Final Version)](./02-PROBLEM.md)**

### Screenshot Mockup (placeholder)

```
┌──────────────────────┐     ┌──────────────────────┐
│  Merchant App        │     │  Storefront (Web)     │
│                      │     │                       │
│  📊 Dashboard        │     │  Warung Bu Ana        │
│  Pengunjung: 45      │     │  ┌───┐ ┌───┐ ┌───┐   │
│  Klik WA: 12         │     │  │ 🍛│ │ 🍜│ │ 🥟│   │
│                      │     │  │15k│ │12k│ │10k│   │
│  [+ Tambah Produk]   │     │  └───┘ └───┘ └───┘   │
│  ┌─ Nasi Goreng ─┐   │     │                       │
│  │ Rp15.000      │   │     │  [🛒 Pesan via WA]    │
│  └───────────────┘   │     │                       │
└──────────────────────┘     └──────────────────────┘
```

---

## Traction & Milestones

### Saat Ini
- **Status:** Pre-development (perencanaan & arsitektur)
- **Tim:** Solo founder, technical (AI-orchestrated)
- **Pendanaan:** Bootstrapped
- **Tech:** Infrastructure dari Orca project (sudah teruji)

### Target Pre-Seed (Sebelum Cari Investor)

| Milestone | Target | Deadline |
|---|---|---|
| V1 Launch | 5 UMKM testing | Minggu 2-3 |
| 10 paying users | MRR Rp500rb | Bulan 2 |
| Product-market fit validated | NPS >40 | Bulan 3 |
| 100 paying users | MRR Rp5jt | Bulan 6 |
| **Series A ready** | **MRR Rp25jt+** | **Bulan 12** |

---

## Competition

### Competitive Landscape

| Pesaing | Kekuatan | Kelemahan | Sendbook Advantage |
|---|---|---|---|
| **Linktree** | Brand global, 50M+ users | No product catalog, WA-only link, $5/bln | Product grid, WA auto-order, QRIS |
| **Temmu** | Payment Xendit, WA integration | Relatif baru, web-only | Mobile app, 60s setup, lebih simple |
| **Tukuya** | All-in-one UMKM suite | Terlalu kompleks untuk mikro | Fokus ke mikro — zero bloat |
| **Tautanku** | Super murah (Rp50k/thn) | Sangat basic, no catalog | Product grid + analytics |
| **SociaBuzz** | Donation + digital products | Fee 5%, bukan untuk produk fisik | Zero transaction fee |
| **GoDaddy Link in Bio** | Brand trust, Rp20k/bln | No product catalog, generic | Product-first, WA-native |

### Our Moat

1. **Mobile merchant app** — Semua kompetitor web-only. Dengan Expo app, merchant bisa foto produk langsung dari HP, kelola toko offline.
2. **Setup 60 detik** — Tercepat di kelasnya. Pesai ng lain 5-15 menit.
3. **Zero transaction fee** — Kami tidak ambil potongan. UMKM tidak dipotong dua kali (subscription + fee).
4. **WA-native flow** — Bukan sekedar tombol WA, tapi order flow lengkap dengan auto-fill template.
5. **Indonesia-first** — QRIS, GoPay, OVO, DANA, transfer bank — semua dibangun dari awal untuk ekosistem Indonesia.
6. **Biaya operasional sangat rendah** — Infrastruktur Cloudflare + Supabase + Upstash = <$50/bln untuk 10k stores.

---

## Financial Projections

### Revenue Forecast (5 Tahun)

```
Tahun 1:     Rp60jt   ARR    (100 paying × Rp50k × 12)
Tahun 2:    Rp600jt   ARR    (1.000 paying)
Tahun 3:    Rp3M      ARR    (5.000 paying)
Tahun 4:    Rp12M     ARR    (20.000 paying)
Tahun 5:    Rp30M     ARR    (50.000 paying)
```

### Cost Structure

| Item | Monthly (V1) | Monthly (10k stores) |
|---|---|---|
| Cloudflare (Workers + R2) | $0 | ~$10 |
| Supabase (Postgres) | $0 (free tier) | ~$25 |
| Upstash Redis | $0 (free tier) | ~$5 |
| EAS Build | $0 (30 build/mo free) | $0 |
| Domain | ~$2 | ~$2 |
| **Total** | **~$2/bln** | **~$42/bln** |
| **Developer** | **$0 (solo)** | **$2.000-5.000 (tim 2-5 org)** |

### Margin

| Tahun | Revenue | Cost (Infra + Tim) | Margin |
|---|---|---|---|
| 1 | Rp60jt | Rp5jt (infra only) | **90%+** |
| 2 | Rp600jt | Rp150jt (infra + 2 org) | **75%** |
| 3 | Rp3M | Rp900jt (infra + 5 org) | **70%** |

---

## Funding Ask

### Series A (Saat Traction Terbukti)

| Item | Detail |
|---|---|
| **Tahap** | Series A |
| **Target** | $200k - $500k (Rp3M - Rp8M) |
| **Traction Required** | 1.000+ paying users, MRR Rp50jt+ |
| **Use of Funds** | |
| | **40%** — Product & engineering (AI features, payment, logistik) |
| | **30%** — Marketing & akuisisi (IG, TikTok, referral program) |
| | **20%** — Tim (full-stack developer, support) |
| | **10%** — Operational (legal, server scaling) |
| **Investor Profile** | Angel investor / VC fokus UMKM / Impact investor |
| **Target Investors** | AC Ventures, East Ventures, BRI Ventures, Mandiri Capital, Init-6 |

### Pitch One-Liner untuk Investor

> "Sendbook adalah Linktree untuk 65 juta UMKM Indonesia — memberikan setiap pedagang etalase digital profesional dalam 60 detik, tanpa potongan transaksi, dan terintegrasi dengan WhatsApp, QRIS, dan pembayaran Indonesia."

### Why Us?

| Pertanyaan Investor | Jawaban |
|---|---|
| **Kenapa founder ini?** | Founder mampu mengorkestrasi AI untuk membangun full-stack production-grade app sendirian. Terbukti dari Orca project (kompleksitas: Expo + Hono.js + Rust + Cloudflare). |
| **Kenapa sekarang?** | 65 juta UMKM, 31+ juta QRIS, 50%+ jualan via WA. Infrastruktur matang (Workers, Supabase, EAS). Ekosistem siap. |
| **Kenapa bukan copy-cat?** | Mobile merchant app + WA-native flow + 60s setup + zero transaction fee. Kombinasi yang belum ada di Indonesia. |
| **Bagaimana skalabilitasnya?** | Cloudflare Workers auto-scale. Supabase handles 100k+ connections. Arsitektur serverless = scale tanpa ops. |
| **Bagaimana cara akuisisi?** | Bottom-up: organic via UMKM existing, referral (fitur produk), konten TikTok/IG, partnership komunitas UMKM. |

---

## Risks & Mitigation

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| **Competitor copies features** | Medium | Medium | Build brand trust & community. Mobile app moat — kompetitor butuh waktu develop |
| **Churn tinggi** | Medium | High | Fokus ke engagement bukan cuma akuisisi. Feature request loop dengan UMKM |
| **Scalability issues** | Low | High | Arsitektur serverless (Cloudflare auto-scale). Sudah teruji di Orca |
| **Regulasi (PDP, PJP)** | Medium | Medium | Konsultasi legal sejak V2. Encrypt data. Sederhanakan — kami hanya etalase, bukan payment processor |
| **Founder burnout** | Medium | High | Fokus V1 dulu, baru rekrut setelah product-market fit. AI sebagai force multiplier |
| **UMKM tech literacy rendah** | Low | Medium | UI super simple (60 detik setup). Onboarding wizard. Support via WA |

---

## Call to Action

### Saat Ini (Pre-Seed)

🚀 **Langkah selanjutnya:**
1. ✅ Eksekusi V1 dalam 14 hari (fork Orca → build → launch)
2. ✅ Onboard 5 UMKM tester
3. ✅ Iterasi berdasarkan feedback
4. ❌ **Investor:** belum diperlukan — bootstrap dulu sampai traction terbukti

### Nanti (Series A — 6-12 bulan lagi)

💰 Hubungi: `founder@sendbook.id`
📊 Deck lengkap + data traction: tersedia saat MRR Rp25jt+

---

## Appendix

### Referensi & Data

- [Kemenkop UKM — Data UMKM 2024](https://kemenkopukm.go.id)
- [Bank Indonesia — Statistik QRIS 2025](https://bi.go.id)
- [Ipsos — E-commerce Landscape Indonesia 2025](https://ipsos.com)
- [Google/Temasek/Bain — e-Conomy SEA 2024](https://economysea.withgoogle.com)
- [Linktree — Company Overview](https://linktr.ee/s/about)

### Tech Stack Validasi

Seluruh tech stack Sendbook sudah teruji di Orca project:
- Expo SDK 56 + React Native 0.85 — ✅ production tested
- Hono.js + Cloudflare Workers — ✅ production tested
- Drizzle ORM + Supabase Postgres — ✅ production tested
- Better-Auth — ✅ production tested
- Upstash Redis — ✅ production tested
- Astro + Cloudflare Pages — ✅ production tested

### Dokumen Terkait

| Dokumen | Link |
|---|---|
| Visi & Misi | [01-VISION.md](./01-VISION.md) |
| Masalah & Solusi | [02-PROBLEM.md](./02-PROBLEM.md) |
| Arsitektur Teknis | [03-ARCHITECTURE.md](../technical/03-ARCHITECTURE.md) |
| Mastery Todo List | [04-MASTERY-TODO.md](../technical/04-MASTERY-TODO.md) |
| Roadmap | [05-ROADMAP.md](./05-ROADMAP.md) |
