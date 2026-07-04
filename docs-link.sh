#!/bin/bash
# docs-link.sh — Recreate docs symlink for different environments
#
# Usage:
#   ./docs-link.sh              # Show current status
#   ./docs-link.sh termux       # Link to Android shared storage (Obsidian)
#   ./docs-link.sh local        # Create real local docs/ directory
#
# On Termux (Android):
#   Symlinks docs/ → Android shared storage so Obsidian can access it.
#   Target: /storage/emulated/0/Documents/sendbook/docs/
#
# On Laptop/Desktop (Linux/macOS/Windows):
#   Creates a real directory docs/ (no shared storage available).
#   The directory is tracked by git as a real folder.

set -e

TARGET_TERMUX="/storage/emulated/0/Documents/sendbook/docs"
DOCS_DIR="$(dirname "$0")/docs"

status() {
  if [ -L "$DOCS_DIR" ]; then
    LINK_TARGET=$(readlink "$DOCS_DIR")
    echo "📎 docs/ is a symlink → $LINK_TARGET"
    if [ -d "$DOCS_DIR" ]; then
      echo "✅ Target is accessible"
    else
      echo "⚠️  Target is NOT accessible (broken link — run on Termux)"
    fi
  elif [ -d "$DOCS_DIR" ]; then
    echo "📁 docs/ is a real directory ($(ls "$DOCS_DIR" | wc -l) files)"
  elif [ ! -e "$DOCS_DIR" ]; then
    echo "❌ docs/ does not exist"
  fi
}

setup_termux() {
  if [ ! -d "$TARGET_TERMUX" ]; then
    echo "❌ Target $TARGET_TERMUX does not exist."
    echo "   Run 'cp -r docs/ \$HOME/storage/documents/sendbook/docs' first"
    exit 1
  fi

  if [ -d "$DOCS_DIR" ] && [ ! -L "$DOCS_DIR" ]; then
    echo "📦 Backing up existing docs/ to docs.bak/ ..."
    rm -rf "$(dirname "$0")/docs.bak"
    cp -r "$DOCS_DIR" "$(dirname "$0")/docs.bak"
    echo "✅ Backed up to docs.bak/"
  fi

  rm -rf "$DOCS_DIR"
  ln -sf "$TARGET_TERMUX" "$DOCS_DIR"
  echo "✅ Symlink created: docs/ → $TARGET_TERMUX"
  status
}

setup_local() {
  if [ -L "$DOCS_DIR" ]; then
    rm "$DOCS_DIR"
    mkdir "$DOCS_DIR"
    echo "# Local docs directory — replace with real content" > "$DOCS_DIR/README.md"
    echo "✅ Real docs/ directory created"
  elif [ ! -d "$DOCS_DIR" ]; then
    mkdir "$DOCS_DIR"
    echo "# Local docs directory — replace with real content" > "$DOCS_DIR/README.md"
    echo "✅ Real docs/ directory created"
  else
    echo "✅ docs/ is already a real directory"
  fi
  status
}

case "${1:-status}" in
  status)
    status
    ;;
  termux)
    setup_termux
    ;;
  local)
    setup_local
    ;;
  *)
    echo "Usage: $0 {status|termux|local}"
    exit 1
    ;;
esac
