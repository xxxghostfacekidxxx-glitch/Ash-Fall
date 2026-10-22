#!/usr/bin/env bash
set -euo pipefail

# Developer-only sprite tools. These are not imported into the public site bundle.
# Run from any directory; repositories are cloned shallowly under tools/sprite-tools.
ROOT="$(git rev-parse --show-toplevel)"
DEST="$ROOT/tools/sprite-tools"
mkdir -p "$DEST"

clone_or_update() {
  local name="$1"
  local url="$2"
  local target="$DEST/$name"

  if [ -d "$target/.git" ]; then
    printf '\n== Updating %s ==\n' "$name"
    git -C "$target" pull --ff-only
  elif [ -e "$target" ]; then
    printf 'ERROR: %s exists but is not a Git checkout; refusing to overwrite it.\n' "$target" >&2
    exit 1
  else
    printf '\n== Installing %s ==\n' "$name"
    git clone --depth 1 "$url" "$target"
  fi
}

clone_or_update "sprite-gen" "https://github.com/aldegad/sprite-gen.git"
clone_or_update "pixel-asset-gen" "https://github.com/MozeeB/pixel-asset-gen.git"
clone_or_update "pixel-forge" "https://github.com/KodoRe/pixel-forge.git"
clone_or_update "universal-lpc-modern-sprite-generator" "https://github.com/codyaboyd/Universal-LPC-Modern-Sprite-Generator.git"
clone_or_update "spritebrew" "https://github.com/GAlbanese09/spritebrew.git"

printf '\nAll five source repositories are present under %s\n' "$DEST"
printf 'Review each repository license and included asset license before shipping any output.\n'
