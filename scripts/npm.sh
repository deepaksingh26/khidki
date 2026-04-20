#!/bin/zsh
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
NODE_BIN="$ROOT_DIR/.tools/node-v24.14.1-darwin-arm64/bin"

export PATH="$NODE_BIN:$PATH"
exec npm "$@"

