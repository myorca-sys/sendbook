# Sendbook — Dokumentasi Proyek

Etalase digital satu halaman untuk UMKM Indonesia.
Dibangun di Termux (Android), deploy ke Cloudflare via GitHub.

## Dokumen Inti

| # | File | Isi |
|---|---|---|
| 01 | [VISI & MISI](./01-VISION.md) | Visi 5 tahun, misi, target pasar, exit strategy |
| 02 | [MASALAH & SOLUSI](./02-PROBLEM.md) | 7 masalah UMKM, solusi V1 vs final, kompetitor |
| 03 | [ARSITEKTUR TEKNIS](../technical/03-ARCHITECTURE.md) | Tech stack, data flow, schema, API endpoints |
| 04 | [MASTERY TODO](../technical/04-MASTERY-TODO.md) | Progress pengerjaan per fase |
| 05 | [ROADMAP](./05-ROADMAP.md) | Timeline, milestones, KPI, targets |
| 06 | [PITCH DECK](./06-PITCH-DECK.md) | Business model, market size, proyeksi, funding |

## Services & Tools

| Folder | Isi |
|---|---|
| [`services/github/`](../services/github/) | Repo, remote, CI/CD |
| [`services/cloudflare/`](../services/cloudflare/) | Account, Pages, Functions, R2, DNS |
| [`services/supabase/`](../services/supabase/) | Database PostgreSQL |
| [`services/upstash/`](../services/upstash/) | Redis caching |
| [`services/expo/`](../services/expo/) | Expo / EAS mobile build |
| [`services/domain/`](../services/domain/) | Domain sendbook.id |
| [`services/payment/`](../services/payment/) | Payment gateway (V2) |
| [`services/template/`](../services/template/) | Template untuk service baru |

## Context untuk AI Session Berikutnya

Baca file berikut urut:
1. [03-ARCHITECTURE.md](../technical/03-ARCHITECTURE.md) — Paham tech stack & struktur
2. [04-MASTERY-TODO.md](../technical/04-MASTERY-TODO.md) — Lihat progress terbaru
3. Service docs di [services/](../services/) — Credentials yang sudah diverifikasi

## Catatan Platform

- **Device**: Termux (Android arm64). Dev tools (wrangler, workerd, esbuild) **tidak support**.
- **Deploy**: Push ke GitHub → Cloudflare Pages auto-deploy.
- **npm**: Wajib `--ignore-scripts` kalau ada package yang install workerd.
