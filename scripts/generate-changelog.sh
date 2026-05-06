#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

{
  echo "# Changelog"
  echo
  echo "Generated from git history. Run \`pnpm changelog\` to refresh."
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
  done < <(git log --pretty=format:'%h|%ad|%s' --date=short)

  echo
} > CHANGELOG.md

echo "Wrote CHANGELOG.md"
