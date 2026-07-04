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
#   ./docs-link.sh watch            # Watch mode: auto-sync setiap perubahan
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
  cp -r "$OBS_DIR"/* "$PROJ_DIR"/
  echo "✅ Selesai. Jangan lupa commit dari Termux:"
  echo "   cd ~/projects/sendbook && git add docs/ && git commit -m 'docs: ...'"
  echo "- $(date '+%Y-%m-%d %H:%M') — Sync OBS→PROJ" >> "$SYNC_LOG"
}

watch_mode() {
  echo "👀 Watch mode: memantau perubahan di PROJ..."
  echo "   Tekan Ctrl+C untuk berhenti"
  echo ""
  while true; do
    to_obsidian
    sleep 30
  done
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
