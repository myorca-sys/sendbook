# 📚 Sendbook — Dokumentasi Proyek

> **Sendbook**: Platform etalase digital satu halaman untuk UMKM Indonesia.
> "Bikin toko online dalam 60 detik, jualan lewat WhatsApp tanpa ribet."

---

## Daftar Dokumen

| # | Dokumen | Isi |
|---|---|---|
| 01 | [VISI & MISI](./01-VISION.md) | Long term vision, misi, value proposition, target pasar, exit strategy |
| 02 | [MASALAH & SOLUSI](./02-PROBLEM.md) | Masalah UMKM, solusi V1, solusi final version, competitive analysis |
| 03 | [ARSITEKTUR TEKNIS](./03-ARCHITECTURE.md) | Tech stack, arsitektur sistem, data flow, service breakdown, security |
| 04 | [MASTERY TODO LIST](./04-MASTERY-TODO.md) | Todo lengkap per fase, dari fork Orca sampai post-launch |
| 05 | [ROADMAP & MILESTONE](./05-ROADMAP.md) | Timeline, fase pengembangan, target rilis, KPI |
| 06 | [PITCH INVESTOR](./06-PITCH-DECK.md) | Business model, market size, monetisasi, proyeksi finansial, ask |

---

## Ringkasan Eksekutif

**Sendbook** adalah platform SaaS yang memungkinkan UMKM memiliki etalase digital satu halaman (link-in-bio untuk dagangan) dalam waktu kurang dari 60 detik. Setiap UMKM mendapat link unik (`sendbook.id/warung-bu-ana`) yang berisi:

- Grid produk dengan foto, nama, dan harga
- Tombol order WhatsApp dengan auto-fill pesan
- Link pembayaran (QRIS, transfer, e-wallet)
- Lokasi toko di Google Maps
- Link sosial media (Instagram, TikTok, Facebook)
- Analytics pengunjung

**Masalah yang dipecahkan:** 65+ juta UMKM di Indonesia mayoritas jualan via WhatsApp tanpa etalase digital yang rapi. Linktree terlalu generik. Marketplace (Tokopedia/Shopee) terlalu kompleks dengan fee tinggi. Sendbook adalah titik tengah: sederhana seperti Linktree, tapi dioptimalkan untuk display produk dan checkout via WhatsApp.

**Tech Stack:** Expo (mobile merchant app) + Hono.js/Cloudflare Workers (API) + Astro/Cloudflare Pages (storefront) + Supabase (database) + Upstash Redis (caching) + Cloudflare R2 (gambar).

---

## Status Proyek

| Status | Detail |
|---|---|
| **Fase** | Perencanaan |
| **Progres** | 0% — dokumentasi & arsitektur |
| **Target V1** | 14 hari pengembangan |
| **Tech Reuse** | Orca project (monorepo, auth, API pattern, deployment) |
