# 📱 Strategi Migrasi Expo & Fondasi Sosial (Orca)

Dokumen ini memuat urutan eksekusi (Layer 1-5) untuk memigrasikan aplikasi web Next.js ke React Native (Expo) di dalam arsitektur Strict Monorepo. Urutan ini **tidak boleh dibalik** karena setiap layer bergantung pada layer di bawahnya.

---

## 🏗️ Fondasi Eksekusi (Layer 1-4)

### Layer 1 — Auth (Prioritas Tertinggi)

Ini yang paling kritis. Di Expo, urutannya:

1. Daftar di **Google Cloud Console** → buat OAuth Client ID tipe **iOS** (Expo pakai scheme iOS meski di Android).
2. Setup `expo-auth-session`.
3. Test di Expo Go dulu sebelum build APK (EAS).
   > **Aturan:** Jangan lanjut ke fitur apapun sebelum auth benar-benar stabil. Auth yang rapuh akan merusak semua fitur sosial yang akan datang.

### Layer 2 — Data Layer

Backend tetap sama (Edge/Rust). Yang perlu dipastikan:

- SWR tetap bisa dipakai di Expo. Setup `SWRConfig` di root layout dengan provider yang benar.
- Semua hooks `use-watch-history`, `use-collection`, `use-fetch-video` — mayoritas bisa dimigrasikan dengan perubahan minimal karena logicnya tidak bergantung pada DOM.

### Layer 3 — Navigation Architecture (Expo Router)

Menentukan skalabilitas jangka panjang untuk fitur sosial. Struktur tab saat ini:

```text
apps/mobile/app/(tabs)/
  index.tsx       ← Beranda / Home Feed
  schedule.tsx    ← Jadwal Rilis
  collection.tsx  ← Riwayat & Koleksi
  profile.tsx     ← Profil User
apps/mobile/app/
  explore.tsx         ← Stack screen: Discovery sosial (cari anime/user)
  notifications.tsx   ← Stack screen: Notifikasi sosial (belum ada konten)
  trending.tsx        ← Stack screen: Trending
```

> **Aturan:** Slot `explore` dan `notifications` sengaja dibuat sebagai root stack screen (bukan tab) agar ruang layar lebih luas saat digunakan untuk fitur sosial yang _immersive_.

### Layer 4 — Video Player

**MIGRATION UPDATE:** Penggunaan `expo-video` telah diverifikasi **stabil dan aman**, termasuk interaksi _Custom Seekbar_ menggunakan `PanResponder` yang telah dioptimasi. Isu _force close_ pada perangkat low-end telah teratasi.

**Solusi Final:**
Menggunakan `expo-video` secara penuh.

- Setup sudah menyertakan: landscape lock otomatis saat fullscreen, _Optimistic UI Update_ untuk tombol Play/Pause tanpa _glitch_, dan pelacakan riwayat tontonan real-time (`onProgressUpdate`).
- Ini adalah _core experience_ Orca yang stabil dan memberikan performa pemutaran setara Big Tech (YouTube/Netflix).

---

## 🌐 Layer 5 — Sosial Foundation (Post-Stabilization)

Ini yang membedakan Orca dari sekadar tracker anime. Sebelum implement fitur sosial apapun, putuskan arsitektur **Real-time infrastructure**.

- Jika menggunakan Neon + Drizzle, pikirkan integrasi WebSocket atau SSE (misal: Cloudflare Durable Objects) untuk _feed_ yang hidup.
- **Keputusan Krusial:** Putuskan fitur pertama: komentar, following/follower, atau activity feed? Ketiganya butuh schema DB yang berbeda.

### 💡 Filosofi Fitur Sosial Pertama (The Facebook/TikTok Way)

Fitur sosial pertama yang masuk harus yang paling natural dengan konten (anime).
**Bukan chat, bukan story**, tapi:

- _"Teman kamu sedang nonton apa"_
- _"Episode ini dikomentari 47 orang"_

Itu adalah _hook_ (pancingan) yang membuat orang membuka app bukan karena mau menonton, tapi karena FOMO (ingin tahu apa yang orang lain lakukan). Mekanisme ini yang membuat aplikasi menjadi _addictive_.
