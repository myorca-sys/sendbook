# 💳 Payment Gateway — Midtrans / Xendit

> 🔮 **Future feature.** Belum diimplementasikan di V1.

Untuk V1, transaksi tetap via WhatsApp (pelanggan TF/QRIS langsung ke merchant).
Payment gateway akan diintegrasikan di V2 untuk checkout in-page.

| Item | Nilai | Status |
|---|---|---|
| **Penyedia** | Midtrans / Xendit | ⬜ |
| **Merchant ID** | | ⬜ |
| **Server Key** | | ⬜ |
| **Client Key** | | ⬜ |
| **Environment** | Sandbox / Production | ⬜ |

## Rencana Integrasi (V2)

- [ ] Daftar akun Midtrans/Xendit
- [ ] Mode sandbox untuk development
- [ ] Integrasi Snap API (checkout page)
- [ ] Webhook handler untuk notifikasi pembayaran
- [ ] Split payment: merchant langsung terima dana (tanpa melalui kami)

## Catatan

- Sendbook tidak memegang dana — payment gateway langsung ke merchant
- Revenue Sendbook dari subscription, BUKAN potongan transaksi
- Integrasi payment baru dilakukan setelah V1 stabil & ada traction
