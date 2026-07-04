# Sendbook — Obsidian Vault

📁 **Buka vault:** Folder `Documents/sendbook/` di Obsidian
🌐 **Source git:** `projects/sendbook/docs/` (via symlink — 2 arah)

## Cara Pakai

1. Buka Obsidian → **Open folder as vault** → pilih `Documents/sendbook/`
2. Edit file `.md` — perubahan langsung kelihatan di Termux
3. Dari Termux, commit:
```bash
cd ~/projects/sendbook
git add docs/
git commit -m "docs: ..."
git push
```

## Struktur Dokumen

```
Documents/sendbook/              ← vault root (Obsidian)
├── .obsidian/                   ← konfigurasi vault (auto)
│
├── docs/                        ← semua dokumentasi
│   ├── 00-INDEX.md              ← daftar isi
│   ├── 01-VISION.md
│   ├── 02-PROBLEM.md
│   ├── 03-ARCHITECTURE.md
│   ├── 04-MASTERY-TODO.md
│   ├── 05-ROADMAP.md
│   ├── 06-PITCH-DECK.md
│   ├── README-OBSIDIAN.md       ← file ini
│   │
│   └── services/                ← konfigurasi service
│       ├── github/
│       ├── cloudflare/
│       ├── supabase/
│       ├── upstash/
│       ├── expo/
│       ├── domain/
│       ├── payment/
│       └── template/            ← copy untuk service baru
```

## Ngapain Aja di Obsidian?

| Aktivitas | Cara |
|---|---|
| **Baca dokumentasi** | Buka file `.md` |
| **Isi konfigurasi service** | Buka `services/[nama]/README.md` → isi tabel |
| **Tambah service baru** | Copy `services/template/` → rename → isi |
| **Track progress** | Update `04-MASTERY-TODO.md` |
| **Edit pitch deck** | Update `06-PITCH-DECK.md` |

## Tips

- Obsidian **Live Preview** biar nyaman
- Bisa pake **Graph View** untuk lihat hubungan antar dokumen
- Jangan lupa **commit & push** dari Termux setelah edit lewat Obsidian
