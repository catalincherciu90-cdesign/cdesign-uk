#!/usr/bin/env bash
# Sincronizează definițiile agenților din repo-ul `ai-agenti` (sursa oficială)
# în .claude/agents al acestui repo. Rulează automat la SessionStart.
#
# Sursa de adevăr este `ai-agenti/agents/`. Acest script doar OGLINDEȘTE acel
# folder aici — nu edita agenții în acest repo, modificările vor fi suprascrise.
#
# Dacă repo-ul ai-agenti nu este disponibil, păstrăm copia existentă (commit-uită)
# ca fallback și ieșim curat, fără a bloca sesiunea.
set -euo pipefail

# Rădăcina repo-ului curent
REPO_ROOT="${CLAUDE_PROJECT_DIR:-$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)}"
DEST="$REPO_ROOT/.claude/agents"

# Candidați pentru sursa agenților (prima potrivire câștigă):
#   1. variabila de mediu AI_AGENTI_PATH (poate fi repo-ul sau folderul agents/)
#   2. repo-ul ai-agenti ca sibling al acestui repo
#   3. $HOME/ai-agenti
CANDIDATES=(
  "${AI_AGENTI_PATH:-}/agents"
  "${AI_AGENTI_PATH:-}"
  "$REPO_ROOT/../ai-agenti/agents"
  "$HOME/ai-agenti/agents"
)

SRC=""
for c in "${CANDIDATES[@]}"; do
  if [ -n "${c%/agents}" ] && [ -d "$c" ] && [ -f "$c/cosmin.md" ]; then
    SRC="$c"
    break
  fi
done

if [ -z "$SRC" ]; then
  echo "sync-agents: repo-ul ai-agenti nu a fost găsit; folosesc copia existentă din .claude/agents." >&2
  exit 0
fi

mkdir -p "$DEST"

# Oglindire (rsync dacă există, altfel cp), inclusiv ștergerea agenților dispăruți
if command -v rsync >/dev/null 2>&1; then
  rsync -a --delete "$SRC/" "$DEST/"
else
  rm -rf "${DEST:?}"/*
  cp -a "$SRC/." "$DEST/"
fi

echo "sync-agents: agenți sincronizați din $SRC" >&2
exit 0
