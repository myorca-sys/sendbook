#!/usr/bin/env bash
# docs-link.sh — Sinkronisasi docs antara Termux & Obsidian
#
# Karena Android FUSE filesystem tidak allow symlink dari shared storage,
# kita pake sync manual sebagai gantinya.
#
# Usage:
#   ./docs-link.sh status           # Cek status kedua lokasi
#   ./docs-link.sh to-obsidian      # Copy project/docs → shared (setelah commit)
#   ./docs-link.sh from-obsidian    # Copy shared → project/docs (setelah edit di Obsidian)
#   ./docs-link.sh watch            # Hybrid watch: PROJ→OBS realtime, OBS→PROJ polling 30s
#
# Lokasi:
#   PROJ  = ~/projects/sendbook/docs/                          (git source of truth)
#   OBS   = ~/storage/documents/sendbook/docs/ (diakses Obsidian)

set -e

PROJ_DIR="$(cd "$(dirname "$0")/docs" && pwd)"
OBS_DIR="$HOME/storage/documents/sendbook/docs"
SYNC_LOG="$HOME/storage/documents/sendbook/.sync-log.md"

status() {
  echo "📂 PROJ (git): $PROJ_DIR"
  echo "   Files: $(find "$PROJ_DIR" -type f | wc -l)"
  echo ""
  echo "📂 OBS (Obsidian): $OBS_DIR"
  if [ -d "$OBS_DIR" ]; then
    echo "   Files: $(find "$OBS_DIR" -type f | wc -l)"
  else
    echo "   ⚠️  Not found — jalankan 'to-obsidian' dulu"
  fi
  echo ""
  echo "🔄 Status:"
  if [ -d "$OBS_DIR" ]; then
    set +e
    DIFF=$(diff -rq "$PROJ_DIR" "$OBS_DIR" 2>/dev/null | grep -c "differ\|Only in" || true)
    set -e
    if [ "$DIFF" -eq 0 ]; then
      echo "   ✅ PROJ dan OBS sinkron"
    else
      echo "   ⚠️  $DIFF file berbeda"
    fi
  fi
}

to_obsidian() {
  echo "📤 PROJ → OBS ..."
  mkdir -p "$OBS_DIR"
  cp -r "$PROJ_DIR"/* "$PROJ_DIR"/.* "$OBS_DIR"/ 2>/dev/null || true
  rm -f "$OBS_DIR/.*" 2>/dev/null || true
  echo "✅ Selesai. $(find "$OBS_DIR" -type f | wc -l) file di OBS"
  echo "- $(date '+%Y-%m-%d %H:%M') — Sync PROJ→OBS" >> "$SYNC_LOG"
}

from_obsidian() {
  if [ ! -d "$OBS_DIR" ]; then
    echo "❌ OBS directory not found. Run 'to-obsidian' first."
    exit 1
  fi
  echo "📥 OBS → PROJ ..."
  rsync -a --update "$OBS_DIR"/ "$PROJ_DIR"/
  echo "✅ Selesai. Jangan lupa commit dari Termux:"
  echo "   cd ~/projects/sendbook && git add docs/ && git commit -m 'docs: ...'"
  echo "- $(date '+%Y-%m-%d %H:%M') — Sync OBS→PROJ" >> "$SYNC_LOG"
}

watch_mode() {
  echo "👀 Watch mode: hybrid — realtime PROJ→OBS + polling OBS→PROJ"
  echo "   Tekan Ctrl+C untuk berhenti"
  echo ""

  # Trap exit untuk kill background jobs
  INOTIFY_PID=""
  POLL_PID=""
  cleanup() {
    echo ""
    echo "🛑 Stopping watch mode..."
    [ -n "$INOTIFY_PID" ] && kill "$INOTIFY_PID" 2>/dev/null || true
    [ -n "$POLL_PID" ] && kill "$POLL_PID" 2>/dev/null || true
    exit 0
  }
  trap cleanup SIGINT SIGTERM

  # Sync penuh saat start
  rsync -a --delete "$PROJ_DIR"/ "$OBS_DIR"/
  echo "  ✅ Initial sync PROJ→OBS done"

  # --- PROJ → OBS: realtime via inotify ---
  inotifywait -m -r -e modify,create,delete,move "$PROJ_DIR" --format '%w%f' 2>/dev/null | while read -r file; do
    sleep 1
    rsync -a --delete "$PROJ_DIR"/ "$OBS_DIR"/
  done &
  INOTIFY_PID=$!
  echo "  ✅ inotify PROJ→OBS active (PID $INOTIFY_PID)"

  # --- OBS → PROJ: polling tiap 30 detik ---
  (
    LAST_SYNC=$(date +%s)
    while true; do
      sleep 30
      # Cari file OBS yang lebih baru dari sync terakhir
      NEWER=$(find "$OBS_DIR" -type f -newermt "@$LAST_SYNC" 2>/dev/null | head -5)
      if [ -n "$NEWER" ]; then
        echo "  📥 Detected changes in OBS, syncing to PROJ..."
        rsync -a --update "$OBS_DIR"/ "$PROJ_DIR"/
        echo "  ✅ OBS→PROJ sync done: $(echo "$NEWER" | xargs -I{} basename {})"
        echo "- $(date '+%Y-%m-%d %H:%M') — Auto sync OBS→PROJ" >> "$SYNC_LOG"
      fi
      LAST_SYNC=$(date +%s)
    done
  ) &
  POLL_PID=$!
  echo "  ✅ Polling OBS→PROJ active every 30s (PID $POLL_PID)"

  echo ""
  echo "📋 Watch mode running. Edit di PROJ → realtime sync OBS."
  echo "   Edit di Obsidian → sync balik dalam ≤30 detik."
  echo "   Press Ctrl+C to stop."

  # Tunggu semua background job
  wait
}

case "${1:-status}" in
  status)
    status
    ;;
  to-obsidian|to)
    to_obsidian
    ;;
  from-obsidian|from)
    from_obsidian
    ;;
  watch)
    watch_mode
    ;;
  *)
    echo "Usage: $0 {status|to-obsidian|from-obsidian|watch}"
    exit 1
    ;;
esac
