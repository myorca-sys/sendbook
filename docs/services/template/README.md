# 📋 Template — Service Baru

> Copy folder ini untuk menambah service/tool baru yang digunakan Sendbook.

## Cara Pakai

1. Copy folder `template/` → `nama-service-baru/`
2. Rename file jika perlu
3. Isi semua bagian yang relevan
4. Hapus bagian yang tidak relevan
5. Update `docs/services/README.md` → tambah ke daftar

---

# [Nama Service]

> [Deskripsi singkat: apa yang dilakukan service ini untuk Sendbook]

---

## Isian Konfigurasi

| Item | Nilai | Status |
|---|---|---|
| **Akun** | | ⬜ |
| **Key 1** | | ⬜ |
| **Key 2** | | ⬜ |
| **URL** | | ⬜ |
| **Region** | | ⬜ |

## Langkah Setup

- [ ] Langkah 1:
- [ ] Langkah 2:
- [ ] Langkah 3:

## Environment Variables

```bash
# Untuk .dev.vars
VARIABLE_NAMA=nilai

# Untuk wrangler secret (production)
echo "$VARIABLE_NAMA" | wrangler secret put VARIABLE_NAMA
```

## Catatan

- Catatan penting 1
- Catatan penting 2

## Related

- Link ke service lain yang terintegrasi
- Link ke kode yang menggunakan service ini
