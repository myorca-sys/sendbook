# 📱 Expo / EAS — Mobile App

> Build & distribusi aplikasi Android untuk merchant Sendbook.

| Item | Nilai | Status |
|---|---|---|
| **Akun Expo** | | ⬜ |
| **EAS Project ID** | | ⬜ |
| **App Name** | `Sendbook` | ✅ (di app.json) |
| **Bundle ID** | `com.sendbook.app` | ✅ (di app.json) |
| **EAS Build Profile** | `production` | ⬜ |

## Langkah Setup (Dari Laptop)

> ⚠️ Expo butuh laptop/PC — tidak bisa dari Termux (butuh native modules)

- [ ] Install EAS CLI: `npm install -g eas-cli`
- [ ] Login: `eas login`
- [ ] Init project di folder mobile: `cd apps/mobile && eas init`
- [ ] Copy **projectId** ke `apps/mobile/app.json` → `extra.eas.projectId`
- [ ] Setup build profile:
```bash
eas build:configure
```
- [ ] Build APK:
```bash
eas build --platform android --profile production
```

## EAS Update (OTA)

Untuk update JS tanpa rebuild APK:
```bash
eas update --branch production --message "fix: ..."
```

## Distribusi

- APK bisa didistribusikan via link (download langsung)
- Tidak perlu Play Store untuk V1
- Upload APK ke Cloudflare R2 atau Google Drive
- Merchant download APK via link WhatsApp

## Catatan

- **EAS Build** gratis 30 build/bulan (cukup untuk development)
- **EAS Update** gratis unlimited untuk update JS
- Build APK pertama butuh ~10-15 menit
- Update selanjutnya via EAS Update (hitungan detik, tanpa rebuild)
