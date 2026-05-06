#!/bin/bash
set -euo pipefail

# Package managers
curl -LsSf https://astral.sh/uv/install.sh | sh
corepack enable && corepack prepare pnpm@latest --activate

# Claude Code (native installer, not npm)
curl -fsSL https://claude.ai/install.sh | bash

# Git config (gh auth login must be run manually on first use)
git config --global include.path ~/.gitconfig-host

# Supply chain security: 2-day package resolution lag
export UV_EXCLUDE_NEWER=$(date -d "2 days ago" +%Y-%m-%dT00:00:00Z)
echo 'export UV_EXCLUDE_NEWER=$(date -d "2 days ago" +%Y-%m-%dT00:00:00Z)' >> ~/.bashrc
pnpm config set --global minimum-release-age 2880
