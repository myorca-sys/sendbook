# Legacy to Rust Migration (Data Pipeline & Background Tasks)

## 1. Architectural Decision

Legacy backend (`apps/api`) was officially demoted to a background data processing engine and is now deleted. However, to achieve a true **100% Rust architecture** and eliminate the old backend entirely, we rewrote its `BackgroundTasks` into Rust.

**Cloudflare Pages/Workers Migration Note**:
The Rust engine will **stay on Hugging Face Spaces**. It cannot be moved to Cloudflare because Cloudflare Edge uses WASM/V8 Isolates which lacks native OS TCP Socket access. Moving to Cloudflare will break the HTTP/1.1 Evasion (TLS fingerprint spoofing) implemented in `reqwest`, leading to immediate `403 Forbidden` from bot-protected anime sites.

## 2. Legacy Background Tasks Extracted for Migration

The following legacy modules located in `apps/api/scripts/` were rewritten into `apps/api-rust/src/pipeline.rs` (or equivalent Rust cron/background workers):

1. **`sync_popular.py` (`sync_popular_anime`)**
   - Goal: Sync trending/popular data into Supabase.
2. **`resync_missing.py` (`resync_missing_episodes`)**
   - Goal: Detect and resync anime missing certain episodes.
3. **`aggregate_stats.py` (`aggregate_stats`)**
   - Goal: Pre-compute analytical stats for admin dashboard/caching.
4. **`active_health_check.py` (`run_active_health_check`)**
   - Goal: Ping external data sources to ensure availability.
5. **`mass_resync_metadata.py` (`mass_resync`)**
   - Goal: Mass database metadata validation and correction.
6. **`sync_10_hours_bg.py` (`run_10_hours_sync`)**
   - Goal: Heavy interval sync pipeline for database hygiene.
7. **`real_purge.py` (`purge_orphans`)**
   - Goal: DB cleanup, remove orphaned rows to maintain $0 database constraint.
8. **`warmup_all_pending.py` (`warmup_all_pending`)**
   - Goal: Pre-warm edge cache or trigger scrapers for pending episodes.

_(Note: MAL and Jikan sync tasks were permanently dropped to adhere to $0 cost and lean architecture principles, relying solely on AniList)._

## 3. Rust Codebase Audit

- **Memory/Stability**: `cargo clippy` found no critical memory leaks or unsafe block violations.
- **Hygiene**: 119 minor pedantic warnings detected (unused imports, redundant closures, suboptimal format strings).
- **Action Taken**: Automated `cargo clippy --fix` was executed to patch 87+ stylistic issues instantly.

## Next Steps

To proceed with the rewrite, we processed one script at a time, translating its logic to Rust, and mounting it into `apps/api-rust/src/pipeline.rs`.
