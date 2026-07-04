# 🦀 RUST MIGRATION & ZERO-COST ARCHITECTURE RUNBOOK

**Proyek:** Orca / Anime Scraper Pro ($0 Cost Infrastructure)
**Dokumen:** Rencana Migrasi Final & Panduan Operasional Agen
**Status Terkini:** 100% Selesai (Seluruh pipeline, provider, social, dan scraper telah bermigrasi ke Rust dan Edge Hono).

---

## BAGIAN 1: BLUEPRINT MIGRASI FINAL (Penyelesaian Arsitektur)

Untuk memastikan infrastruktur stabil tanpa _downtime_ pada aplikasi seluler, 4 tahap ini WAJIB dipertahankan kelancarannya.

### Fase 1: Penuntasan Endpoint Transaksional di Edge (Cloudflare Workers)

Semua aksi tulis/baca spesifik-user harus berada di Edge (Hono.js + Drizzle ORM).

- **Target Route:**
  - `GET /api/v2/social/episode/:anime_id/:ep_num/stats` (Likes & Views)
  - `POST /api/v2/social/episode/like` (Toggle Like)
  - `POST /api/v2/social/report` (Laporan video rusak)
  - `GET /api/v2/social/notifications` (Sistem notifikasi episode baru)
- **Solusi:** Tulis kueri raw SQL Drizzle di `apps/api-edge/src/routes/social.ts` untuk berinteraksi dengan tabel `episode_likes`, `reports`, dan `notifications`. Beban ini sangat ringan dan ideal untuk Edge.

### Fase 2: Pembangunan Mega-Router "Home & Browse" (Rust Axum)

Ini adalah rute paling berat dan kompleks karena menggabungkan GraphQL dan Postgres.

- **Target Route:** `/api/v1/home` dan `/api/v1/browse` (beserta versi manga).
- **Solusi:**
  - Di `apps/api-rust/src/routes/`, buat `home.rs` dan `browse.rs`.
  - **Moka Cache:** Gunakan Moka Cache yang sudah di-setup untuk menahan respons API selama 1-5 menit.
  - **SQLx Join:** Lakukan kueri SQLx untuk mengambil _Trending_, _Latest Updates_ (dari tabel `episodes`), dan _User Watch History_, lalu satukan ke dalam satu JSON berstruktur _1-to-1_ dengan respons sebelumnya.
  - **Smart Route:** Ubah `apps/api-edge/src/routes/v2.ts` agar mem-proxy `/api/v2/home` ke `/api/v1/home` di Rust.

### Fase 3: Migrasi Sisa Scraper Factory (Rust Axum)

- **Target Provider:** Modul Manga (Komiku, Thrive, WpManga).
- **Solusi:** Finalisasi parser HTML menggunakan `scraper` crate dan optimasi Regex.

### Fase 4: QStash Background Synchronization (Rust Axum)

- **Target Route:** `pipeline.rs` (Sinkronisasi otomatis).
- **Solusi:**
  - Sempurnakan endpoint internal `POST /api/v1/internal/sync/:id` di Rust.
  - Buat endpoint `POST /api/v1/internal/cron/sync_releasing` yang akan dipanggil oleh Upstash QStash setiap jam.
  - Endpoint ini akan melakukan iterasi asinkronus (`tokio::spawn`) untuk memanggil metode `search()` dan `fetch_episode_list()` pada seluruh _Rust Provider_, lalu melakukan SQL `UPSERT` ke Supabase.

---

## BAGIAN 2: PANDUAN OPERASIONAL & TROUBLESHOOTING RUST

Ini adalah SOP teknis bagi AI Agent atau Developer di sesi berikutnya untuk menjalankan, mendeploy, dan men-debug infrastruktur Rust dan Edge ini dengan presisi.

### A. Alur Validasi Lokal (Sebelum Deploy)

Jangan pernah langsung men-deploy tanpa memvalidasi struktur Rust.

```bash
cd apps/api-rust
# Cek semua peringatan dan error memory-safety/lifetime
cargo check
# Validasi bahwa kompilasi release dengan optimasi LTO tidak memakan RAM berlebih
cargo build --release
```

**Catatan Penting Error Rust:**

- **E0515 (Temporary value dropped):** Biasanya terjadi saat me-return referensi `&str` dari `String` yang diolah di dalam blok. Gunakan `.to_string()` atau `.clone()`.
- **E0277 (Send Trait Error):** Terjadi jika variabel `!Send` (seperti `scraper::Html` DOM) melintasi batas pemanggilan `.await` pada jaringan. Bungkus proses HTML parsing ke dalam _scope_ terpisah `{ ... }` agar di-_drop_ sebelum `await` berjalan.
- **SQLx Macros (`query!`):** DILARANG menggunakan makro `query!` (dengan tanda seru) karena ia membutuhkan `DATABASE_URL` aktif saat _compile-time_ di Docker Hugging Face. Selalu gunakan metode `sqlx::query("...").bind(...)` agar pengecekan terjadi saat _Runtime_.

### B. Alur Deployment Hugging Face (Rust Axum)

Karena keterbatasan OS Alpine dan dependencies C (OpenSSL), kita menggunakan `rustls` dan multi-stage build.

```bash
# Script atomik untuk mem-push source code (tanpa node_modules/target) ke HF
./scripts/deploy-worker-rust-hf.sh orcanime/orcanime-api-rust
```

- **Dockerfile Tuning:** Jika terjadi _OOM (Out of Memory)_ saat HF me-rebuild kontainer, pastikan `Cargo.toml` memiliki konfigurasi `codegen-units = 16` dan `lto = false`.

### C. Monitoring & Remote Debugging (Zero Downtime)

Terkadang Hugging Face API menutupi pesan error dari Docker Build. Gunakan script monitoring yang sudah dibuat:

```bash
bash scripts/monitor_hf.sh
```

- Script ini akan melakukan iterasi pengecekan status API HF setiap 10 detik. Jika terjadi `BUILD_ERROR`, script akan mengekstrak pesan `errorMessage` murni dari JSON balasan HF.
- **Trik Ekstrem Debugging:** Jika kontainer berhasil di-build tapi _Crash_ saat `RUNNING`, endpoint HTTP tidak akan bisa dihubungi. Ubah perintah terakhir `Dockerfile` menjadi `CMD ["python3", "-m", "http.server", "7860"]` agar kontainer selalu sukses menyala, lalu Anda bisa membaca log `build.log` melalui port web standar.

### D. Penanganan Edge Worker & Proxy Error 1106

Ketika melakukan deploy ke Cloudflare Workers:

```bash
cd apps/api-edge
# Bypass interaktif prompt dari Wrangler
echo "n" | npx wrangler deploy --minify
```

- **Error 1106 (Cloudflare):** Ini terjadi jika Worker mencoba mem-buffer (`arrayBuffer()`) _request body_ yang ukurannya tidak konsisten lalu meneruskannya (Proxy).
- **Solusi:** Lewatkan `request.body` secara _native stream_ tanpa dibaca ke dalam memori.
  ```javascript
  let body = method !== "GET" && method !== "HEAD" ? request.body : null;
  ```

### E. Manajemen Koneksi Database (Supabase)

Karena Supabase Free Tier memiliki batas koneksi bersamaan (PgBouncer):

- **Di Cloudflare Workers:** Selalu gunakan **Hyperdrive** (`env.HYPERDRIVE`) untuk TCP pooling otomatis.
- **Di Rust Axum:** Jangan setel `max_connections(50)` di dalam `sqlx::postgres::PgPoolOptions`. Gunakan angka kecil (5-10) untuk menghindari _Pool Timeout_ dan sambungkan secara eksplisit dengan `.connect()`, bukan `.connect_lazy()`, agar kegagalan dapat dipantau di awal.
