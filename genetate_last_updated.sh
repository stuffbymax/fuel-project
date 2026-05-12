#!/usr/bin/env bash

set -euo pipefail

FILES=("bradford.csv" "halifax.csv")

latest_epoch=0

for file in "${FILES[@]}"; do
  if [[ -f "$file" ]]; then
    mod_time=$(stat -c %Y "$file")
    if (( mod_time > latest_epoch )); then
      latest_epoch=$mod_time
    fi
  fi
done

if (( latest_epoch == 0 )); then
  echo "No CSV files found."
  exit 1
fi

latest_iso=$(date -u -d @"$latest_epoch" +"%Y-%m-%dT%H:%M:%SZ")

# correct project-relative output folder
OUT_DIR="html/js"
mkdir -p "$OUT_DIR"

cat > "$OUT_DIR/last_updated.js" <<EOF
// Auto-generated file — do not edit

window.LAST_UPDATED = "$latest_iso";
EOF

echo "Updated $OUT_DIR/last_updated.js → $latest_iso"