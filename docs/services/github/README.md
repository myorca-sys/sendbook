# GitHub

> Hosting kode sumber Sendbook, issue tracking, dan CI/CD (opsional).

---

## Isian Konfigurasi

| Item | Nilai | Status |
|---|---|---|
 | **Akun GitHub** | `myorca-sys` | ✅ |
| **Nama Repo** | `sendbook` | ✅ |
| **Visibility** | `public` | ✅ |
| **Remote URL** | `https://github.com/myorca-sys/sendbook.git` (HTTPS) | ✅ |
| **Default Branch** | `main` | ✅ |

## Setup yang sudah dilakukan

- ✅ Repo dibuat: https://github.com/myorca-sys/sendbook
- ✅ Code sudah di-push
- ✅ Remote sudah diset (HTTPS dengan token, lalu dibersihkan dari URL)
- [ ] (Opsional) Set branch protection untuk `main`:
  - Settings → Branches → Add rule
  - Require PR review before merge
- [ ] (Opsional) Setup GitHub Actions untuk CI

## Catatan

- SSH key disarankan (daripada HTTPS + token)
- Simpan secrets (DATABASE_URL, dll) di GitHub Secrets kalau pake Actions
