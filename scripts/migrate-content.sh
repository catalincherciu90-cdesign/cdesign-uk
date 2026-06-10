#!/usr/bin/env bash
# migrate-content.sh
# Copies the old business content from the shared RO KV namespace into the
# dedicated UK KV namespace. UK-specific settings (theme, layout, services,
# site settings) are intentionally NOT copied, so the UK localisation stays intact.
#
# Prerequisites:
#   1. npm install -g wrangler
#   2. wrangler login   (log into the Cloudflare account that owns both namespaces)
#
# Run from the repo root:
#   bash scripts/migrate-content.sh
#
set -uo pipefail

OLD="6c999cb522f04569824a7a97ce497acd"   # old, shared namespace (RO)
NEW="aba4ead89d234af1a1dda8dcd8676308"   # new, dedicated namespace (UK)

# Content keys to migrate (settings/theme/layout/services are deliberately excluded).
KEYS=(
  __gibilan__              # agenda: to-dos, tasks, meetings, deadlines
  __crm__                  # CRM pipeline
  __clients__              # client records
  __oferte__               # offers
  __contracte__            # contracts
  __contract_template__    # contract template
  __blog__                 # blog posts
  __index__                # blog index
  __projects__             # portfolio projects
)

# Allow the newer "kv key" syntax to fall back to the older "kv:key" one.
kv() {
  if wrangler kv key --help >/dev/null 2>&1; then
    wrangler kv key "$@"
  else
    local sub="$1"; shift
    wrangler "kv:key" "$sub" "$@"
  fi
}

mkdir -p kv_backup
echo "Migrating ${#KEYS[@]} keys: $OLD  ->  $NEW"
echo

copied=0; skipped=0; failed=0
for k in "${KEYS[@]}"; do
  printf '  %-22s ' "$k"
  if kv get "$k" --namespace-id "$OLD" > "kv_backup/$k.json" 2>/dev/null && [ -s "kv_backup/$k.json" ]; then
    if kv put "$k" --path "kv_backup/$k.json" --namespace-id "$NEW" >/dev/null 2>&1; then
      echo "copied OK"; copied=$((copied+1))
    else
      echo "WRITE FAILED"; failed=$((failed+1))
    fi
  else
    echo "not found in old DB - skipped"; skipped=$((skipped+1))
  fi
done

echo
echo "Done. copied=$copied  skipped=$skipped  failed=$failed"
echo "Local backup of every fetched value is in ./kv_backup/"
