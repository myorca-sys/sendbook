# 📚 Sendbook — Dokumentasi Proyek

> **Sendbook**: Platform etalase digital satu halaman untuk UMKM Indonesia.

---

## Dokumen Inti

| # | File | Isi |
|---|---|---|
| 01 | [VISI & MISI](./01-VISION.md) | Visi 5 tahun, misi, target pasar, exit strategy |
| 02 | [MASALAH & SOLUSI](./02-PROBLEM.md) | 7 masalah UMKM, solusi V1 vs final, kompetitor |
| 03 | [ARSITEKTUR TEKNIS](./03-ARCHITECTURE.md) | Tech stack, data flow, schema, API endpoints |
| 04 | [MASTERY TODO](./04-MASTERY-TODO.md) | Progress pengerjaan per fase |
| 05 | [ROADMAP](./05-ROADMAP.md) | Timeline, milestones, KPI, targets |
| 06 | [PITCH DECK](./06-PITCH-DECK.md) | Business model, market size, proyeksi, funding |

## Services & Tools

> Setup & konfigurasi setiap software/layanan yang digunakan.

| Folder | Isi |
|---|---|
| [`services/github/`](./services/github/) | Repo, remote, CI/CD |
| [`services/cloudflare/`](./services/cloudflare/) | Workers, R2, Pages, DNS |
| [`services/supabase/`](./services/supabase/) | Database PostgreSQL |
| [`services/upstash/`](./services/upstash/) | Redis caching |
| [`services/expo/`](./services/expo/) | Expo / EAS mobile build |
| [`services/domain/`](./services/domain/) | Domain sendbook.id |
| [`services/payment/`](./services/payment/) | Payment gateway (V2) |
| [`services/template/`](./services/template/) | Template untuk service baru |

## Referensi

| File | Isi |
|---|---|
| [README-OBSIDIAN.md](./README-OBSIDIAN.md) | Cara pakai vault Obsidian |

## Cara Kontribusi

**Menambah service baru:**
```
cp -r services/template services/nama-service-baru
# Edit README.md di folder baru
# Update services/README.md daftar
```

**Mengupdate isian service:**
Langsung edit file `README.md` di folder service-nya.
