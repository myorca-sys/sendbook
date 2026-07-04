# GitHub

> Hosting kode sumber Sendbook, issue tracking, dan CI/CD (opsional).

---

## Isian Konfigurasi

| Item | Nilai | Status |
|---|---|---|
| **Akun GitHub** | | ⬜ |
| **Nama Repo** | `sendbook` | ⬜ |
| **Visibility** | `public` / `private` | ⬜ |
| **Remote URL** | `git@github.com:[user]/sendbook.git` | ⬜ |
| **Default Branch** | `main` | ⬜ |

## Langkah Setup

- [ ] Buat repo di github.com (jangan init README — sudah ada)
- [ ] Set remote & push:
```bash
cd ~/projects/sendbook
git remote add origin git@github.com:[username]/sendbook.git
git push -u origin main
```
- [ ] (Opsional) Set branch protection untuk `main`:
  - Settings → Branches → Add rule
  - Require PR review before merge
- [ ] (Opsional) Setup GitHub Actions untuk CI

## Catatan

- SSH key disarankan (daripada HTTPS + token)
- Simpan secrets (DATABASE_URL, dll) di GitHub Secrets kalau pake Actions
