#!/usr/bin/env bash
set -euo pipefail

cd "$(git rev-parse --show-toplevel)"

last_msg=$(git log -1 --pretty=%s 2>/dev/null || echo "")
if [[ "$last_msg" == chore:\ bump\ version* ]]; then
  exit 0
fi

npm version patch --no-git-tag-version --no-workspaces-update 2>/dev/null
new_version=$(node -p "require('./package.json').version")

git add package.json package-lock.json
git commit -m "chore: bump version to ${new_version}"

branch=$(git rev-parse --abbrev-ref HEAD)
git push origin "$branch"
