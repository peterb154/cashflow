#!/usr/bin/env bash
# Drafts a raw commit-log dump to CHANGELOG.draft.md so you can see what's
# changed since the last curated release. The real CHANGELOG.md is written
# by hand for players — this script does NOT overwrite it.
set -euo pipefail

cd "$(dirname "$0")/.."

OUT=CHANGELOG.draft.md

{
  echo "# Changelog draft"
  echo
  echo "Auto-generated from git history. Use as a reference when writing the curated CHANGELOG.md."
  echo "Run \`pnpm changelog:draft\` to refresh this file. This file is gitignored."
  echo

  current_date=""
  while IFS='|' read -r hash date subject; do
    if [[ "$date" != "$current_date" ]]; then
      [[ -n "$current_date" ]] && echo
      echo "## $date"
      echo
      current_date="$date"
    fi
    echo "- $subject (\`$hash\`)"
  done < <(git log --invert-grep --grep='^chore: refresh CHANGELOG' --pretty=format:'%h|%ad|%s' --date=short)

  echo
} > "$OUT"

echo "Wrote $OUT"
