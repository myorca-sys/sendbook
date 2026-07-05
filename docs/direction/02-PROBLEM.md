# 🎯 Masalah & Solusi

---

## Masalah UMKM yang Diselesaikan

### 1. "Nggak Punya Etalase Digital"

**Masalah:** UMKM jualan via WhatsApp dengan cara mengirim foto satu-per-satu ke pelanggan. Calon pembeli harus scroll chat, nanya "ada apa aja?", dan penjual repot kirim ulang katalog.

**Dampak:**
- Pelanggan males nanya karena ribet
- Penjual buang waktu ngirim ulang foto
- Produk nggak terekspos maksimal
- Kesan tidak profesional

**Solusi Sendbook (V1):** Satu link (`sendbook.id/warung-bu-ana`) yang berisi semua produk + foto + harga + tombol WA. Tinggal kirim link sekali, pelanggan bisa lihat semua.

---

### 2. "Linktree Terlalu Generik Buat Jualan"

**Masalah:** Linktree/tautan.id hanya menampung link sosial media. Nggak ada grid produk, nggak ada harga, nggak ada tombol order.

**Dampak:**
- Pelanggan harus dikirim ke marketplace dulu baru bisa lihat produk
- Bounce rate tinggi: pelanggan buka link, bingung, close
- Linktree nggak optimized untuk conversion

**Solusi Sendbook (V1):** Fokus ke product-first display. Grid produk dengan foto, nama, harga — seperti katalog digital. Tombol "Pesan via WA" langsung, nggak perlu redirect ke mana-mana.

---

### 3. "Marketplace Terlalu Ribet & Fees Tinggi"

**Masalah:** Tokopedia/Shopee punya kurva belajar, perlu stok, ongkir, fee per transaksi (1-5%), kompetisi harga, ulasan.

**Dampak:**
- UMKM mikro kapok karena ribet & fee
- Produk tenggelam di antara ribuan kompetitor
- Harus jual murah karena perang harga

**Solusi Sendbook (V1):** No marketplace. No fee per transaksi. Cuma subscription flat. Penjual tetap terima pembayaran langsung ke rekening/QRIS mereka sendiri. Sendbook cuma etalase — transaksi tetap WA + bayar langsung.

---

### 4. "Bikin Website Mahal & Butuh Developer"

**Masalah:** Website toko online minimal Rp1-5 juta + maintenance bulanan + hosting. Nggak feasible buat UMKM mikro.

**Solusi Sendbook (V1):** Gratis untuk basic (10 produk, branded Sendbook). Pro Rp50k/bulan (unlimited produk, custom domain, analytics). Bisa dari HP. 60 detik jadi.

---

### 5. "Pembayaran Digital Masih Sulit"

**Masalah:** Banyak UMKM nggak punya integrasi pembayaran. Pelanggan nanya "bayarnya gimana?" terus-menerus.

**Dampak:**
- Transaksi gagal karena pembeli bingung cara bayar
- Penjual harus jelasin satu-satu

**Solusi Sendbook (V1):** Tampilkan QRIS image + nomor rekening + e-wallet langsung di halaman storefront. Semua metode pembayaran yang UMKM punya — ditampilkan rapi dalam satu tempat.

---

### 6. "Nggak Tau Performa Jualan"

**Masalah:** UMKM jualan di WA nggak punya data. Berapa orang yang lihat produk? Berapa yang klik WA? Produk mana paling laris?

**Solusi Sendbook (V1):** Analytics dasar: jumlah pengunjung, klik tombol WA, produk paling banyak dilihat.

---

### 7. "Pelanggan Males Ngetik Pesan Order"

**Masalah:** Proses order via WA ribet: pelanggan harus ngetik "Mau pesan X, harga Y, qty Z, alamat A..." — bikin males dan salah-salah.

**Solusi Sendbook (V1):** Tombol "Pesan via WA" per produk → auto-fill template: *"Halo, saya mau pesan [produk] [harga] sebanyak [qty]. Mohon infokan ongkir dan ketersediaan."*

---

## Masalah yang TIDAK Diselesaikan V1 (sengaja)

| Masalah | Alasan | Ditunda Sampai |
|---|---|---|
| Manajemen stok/inventory | Overkill untuk V1, UMKM mikro tahu stoknya sendiri | V2 |
| Pembayaran in-app (checkout penuh) | Complexity tinggi, perlu izin PJP | V2-V3 |
| Logistik/pengiriman terintegrasi | Domain berbeda, partnership perlu scale | V3 |
| Multi-admin / tim | Segmentasi beda | V2 |
| Integrasi marketplace | Biarkan penjual pasang link sendiri | V2 |
| Chat bot / auto-reply | Advanced feature | V3 |

---

## Competitive Analysis

### Direct Competitors

| Fitur | Sendbook | Linktree | Temmu | Tukuya | Tautanku | Tumbuhid.ee |
|---|---|---|---|---|---|---|
| **Product grid display** | ✅ Native | ❌ | ✅ | ✅ | ❌ | ⚠️ Basic |
| **WA auto-fill order** | ✅ Per produk | ❌ | ✅ | ✅ | ✅ | ✅ |
| **QRIS display** | ✅ Native | ❌ | ✅ | ✅ | ✅ via link | ❌ |
| **Setup time** | <60 detik | <60 detik | ~5 menit | ~15 menit | <60 detik | <2 menit |
| **Mobile merchant app** | ✅ Expo | ❌ Web only | ❌ Web only | ❌ Web only | ❌ Web only | ❌ Web only |
| **Free tier** | ✅ 10 produk | ✅ Limited | ✅ | ✅ | ✅ 2 links | ✅ 1 year |
| **Pricing (Pro)** | Rp50k/bln | $5/bln | 1%+0.7% fee | Free+ | Rp50k/thn | Paid |
| **Custom domain** | ✅ Pro | ✅ Paid | ❌ | ❌ | ❌ | ❌ |
| **Analytics** | ✅ Basic | ✅ Paid | ✅ | ✅ | ❌ | ❌ |
| **Payment gateway** | V2 (Midtrans) | ❌ (Stripe only) | ✅ Xendit | ✅ | ❌ | ❌ |
| **Made for Indonesia** | ✅ Sepenuhnya | ❌ Global | ✅ | ✅ | ✅ | ✅ |

### Our Differentiators

1. **Mobile merchant app** — Semua kompetitor web-only. Dengan Expo app, merchant bisa foto produk langsung dari HP, kelola toko offline, dapat notifikasi order.
2. **Setup tercepat** — 60 detik selesai. Nama toko → 3 produk → nomor WA → link siap.
3. **WA-native** — Bukan sekedar tombol WA, tapi flow order lengkap dengan auto-fill template per produk, quantity selector, dan catatan.
4. **Harga terjangkau** — Rp50k/bulan (vs Linktree $5 = Rp80k, tanpa fitur lokal).
5. **Zero transaction fee** — Kami nggak ambil potongan transaksi. UMKM terima FULL.

---

## Solusi Final Version (V3+)

Di versi final, Sendbook bukan cuma etalase — tapi **sistem operasi digital untuk UMKM**:

### Sendbook V3+ Ecosystem

```
┌─────────────────────────────────────────────┐
│                 SENDBOOK                      │
├─────────────────────────────────────────────┤
│  🌐 STOREFRONT (public)                      │
│  • Satu halaman etalase                      │
│  • Grid produk + harga                       │
│  • Tombol WA order auto-fill                 │
│  • QRIS / payment display                    │
│  • Google Maps                               │
│  • Social links                              │
│  • Custom domain                             │
│  • SEO optimized                             │
├─────────────────────────────────────────────┤
│  📱 MERCHANT APP (Expo)                      │
│  • Dashboard + analytics                     │
│  • Manajemen produk (foto dari HP)           │
│  • Notifikasi order masuk                    │
│  • QR code generator (print)                 │
│  • Riwayat pesanan                           │
│  • Multi-store                               │
├─────────────────────────────────────────────┤
│  💳 PAYMENT GATEWAY (V2-V3)                  │
│  • Checkout in-page (Midtrans/Xendit)        │
│  • QRIS, GoPay, OVO, DANA, VC, transfer      │
│  • Split payment (Sendbook fee otomatis)      │
│  • Invoice otomatis via WA                    │
├─────────────────────────────────────────────┤
│  📦 LOGISTIK (V3-V4)                         │
│  • Integrasi JNE/Sicepat/Gosend              │
│  • Auto-calculate ongkir                     │
│  • Tracking number otomatis ke pelanggan      │
├─────────────────────────────────────────────┤
│  🤖 AI FEATURES (V2-V3)                      │
│  • Auto-generate deskripsi produk            │
│  • Enhance foto produk                       │
│  • Suggest kategori & harga                   │
│  • Smart reply untuk chat WA                 │
│  • Rekomendasi produk ke pelanggan            │
├─────────────────────────────────────────────┤
│  📊 ANALYTICS & INSIGHT                      │
│  • Real-time pengunjung                       │
│  • Produk paling dilihat & di-order           │
│  • Jam sibuk order                            │
│  • Demografi pengunjung                      │
│  • Rekomendasi: "naikkin harga?"             │
└─────────────────────────────────────────────┘
```
