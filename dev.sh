#!/usr/bin/env bash
# Starts backend (uvicorn) and frontend (vite) in the same terminal.
# Ctrl+C stops both.
#
# Usage:
#   ./dev.sh
#
# If you prefer separate terminals, keep using Terminals 1 and 2 as before.

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND="$ROOT/backend"
FRONTEND="$ROOT/frontend"

if [[ ! -d "$BACKEND" || ! -d "$FRONTEND" ]]; then
  echo "Expected backend/ and frontend/ next to dev.sh" >&2
  exit 1
fi

cleanup() {
  if [[ -n "${BACKEND_PID:-}" ]] && kill -0 "$BACKEND_PID" 2>/dev/null; then
    kill "$BACKEND_PID" 2>/dev/null || true
  fi
  if [[ -n "${FRONTEND_PID:-}" ]] && kill -0 "$FRONTEND_PID" 2>/dev/null; then
    kill "$FRONTEND_PID" 2>/dev/null || true
  fi
}
trap cleanup EXIT INT TERM

echo "→ backend  http://localhost:8000"
( cd "$BACKEND" && uv run uvicorn app.main:app --reload --port 8000 ) &
BACKEND_PID=$!

echo "→ frontend http://localhost:5173"
( cd "$FRONTEND" && npm run dev ) &
FRONTEND_PID=$!

wait -n "$BACKEND_PID" "$FRONTEND_PID" || true