# 🏗️ Arsitektur Sistem: Orca / Anime Scraper Pro (V2.0 - Client-Side Era)

Dokumen ini memetakan seluruh ekosistem teknis, infrastruktur, dan filosofi pengembangan proyek **Orca** . Dirancang dengan prinsip **Efficiency-First**, **$0 Cost Infrastructure**, dan **Apple Human Interface Guidelines (HIG)**.

> **⚠️ DEPRECATION NOTICE:**
> Arsitektur lama yang menggunakan _Telegram Swarm Storage Ingestion_ dan _Cloudflare Workers Tele-Proxy_ secara resmi **telah dihentikan (deprecated)**. Orca kini sepenuhnya berevolusi menjadi platform **100% Fully Client-Side Scraping**, mengeliminasi biaya _bandwidth_ server dan meminimalisasi risiko pemblokiran IP oleh Cloudflare pada sisi server.

---

## 1. 🚀 Core Philosophy

- **100% Client-Side Execution:** Scraping sumber anime dan komik (Manga/Manhwa) dijalankan langsung dari HP pengguna (React Native JS Thread). IP pengguna yang terdistribusi secara organik lolos dari perlindungan _Anti-Bot_ tanpa biaya proxy.
- **Dynamic Scraper Registry:** Aturan scraping (Regex & DOM Selectors) tidak lagi di-_hardcode_ di APK. Konfigurasi ditarik secara dinamis dari API (`HF_API_URL`) saat aplikasi dibuka, membuat APK tahan peluru (_future-proof_) tanpa perlu rilis ulang di Play Store.
- **Dumb UI & Zustand:** Mengadopsi mentalitas performa Native (seperti Stremio). Layar UI hanya menerima data pasif (Smart Store - Dumb Components) tanpa membebani JS Thread dengan DOM parsing.
- **Agentic Loops:** Menggunakan Gemini CLI sebagai orkestrator utama untuk _Analyze, Summarize, & Transform_ di lingkungan Terminal/Workspace.

---

## 2. 🛠️ Tech Stack & Roles (The Client-Side Powerhouse)

| Layer              | Teknologi                       | Peran Utama                                                                                                             |
| :----------------- | :------------------------------ | :---------------------------------------------------------------------------------------------------------------------- |
| **Mobile (Core)**  | Expo React Native (Hermes)      | Mengeksekusi _Client-Side Scraping_ (Kuronime, Bacakomik, dll), _Multi-Resolution Player_ (`expo-video`), dan state UI. |
| **Web (Auth)**     | Next.js 15 (Edge Runtime)       | Aplikasi Web, Landing Page, dan Integrasi _Better-Auth_ di Edge.                                                        |
| **Admin (TUI)**    | Rust (`apps/api-rust`)          | Aplikasi CLI interaktif untuk manajemen database, sinkronisasi anime, dan triage langsung dari terminal.                |
| **Backend (Edge)** | Hono.js (`apps/api-edge`)       | Penyedia metadata, _Cloud Sync History_, dan konfigurasi _Scraper Rules_ (JSON RPC) via Cloudflare Workers.             |
| **Database**       | Supabase (Postgres) Serverless  | Pusat gravitasi (_Source of Truth_) untuk akun, histori tontonan, komentar sosial, dan gamifikasi.                      |
| **Scraper Parser** | `node-html-parser` & `CryptoJS` | _Parser_ HTML yang sangat cepat dan fungsi dekripsi AES bawaan untuk membongkar proteksi video langsung dari HP.        |
| **Deployment**     | Cloudflare Pages & Workers      | Host Frontend Web (Pages) & Host Backend API (Edge).                                                                    |

---

## 3. 🔗 Data Flow & Architecture (Client-Side Engine)

```mermaid
graph TD
    A[Aplikasi Mobile (User IP)] -->|1. Fetch Dynamic Config| B(Backend: api-edge Cloudflare)
    B -->|Return Regex & Selectors JSON| A
    A -->|2. HTTP GET to Source (e.g., Kuronime)| C[Website Bajakan]
    C -->|Return HTML/Encrypted Payloads| A
    A -->|3. Parse (node-html-parser) & Decrypt (AES)| A
    A -->|4. Extract Direct MP4 / M3U8| D{Native Video Player}
    D -->|Play Video directly from Source| E[User Watch Screen]
```

---

## 4. 🗺️ Pemetaan Mesin Klien (Engines)

Orca memisahkan penarikan data ke dalam modul-modul cerdas di sisi klien:

- **Anime Engine (`apps/mobile/lib/anime/engine.ts`):**
  - Melakukan intersep HTML, mendekripsi payload AES (seperti pada sumber Kuronime), dan mengekstrak _Direct URL_ (Mp4Upload, dll) tanpa melewati _backend_.
- **Manga Engine (`apps/mobile/lib/manga/engine.ts`):**
  - Mengunduh gambar komik secara sekuensial dengan perlindungan _AbortController_ dan merender manhwa dengan skema _Anti-Flicker Scrolling_ vertikal absolut (100% menempel tanpa margin).

---

## 5. 📉 Status Tele-Proxy (Sunset)

Sebelumnya, sistem Orca membajak Telegram sebagai penyimpanan objek tidak terbatas untuk HLS segmen video. Arsitektur ini dihapus karena:

1. _Rate-limit_ Telegram semakin ketat dan berpotensi menghapus akun _bot_.
2. Membebani Cloudflare Workers dengan _traffic streaming_ tinggi.
3. _Client-side fetching_ terbukti jauh lebih lincah, lebih sulit diblokir, dan secara literal berbiaya operasional $0 untuk infrastruktur video.

Folder `apps/vault-relay` saat ini dipertahankan hanya sebagai arsip, tidak lagi aktif di production.

---

_Last Updated: Today_
_Author: Gemini CLI x Developer_
