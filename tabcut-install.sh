#!/bin/bash
set -e

BINARY_NAME="tabcut"
RELEASE_URL="https://github.com/mr-zlaam/tabcut/releases/download/tabcut/tabcut-linux-x64.tar.gz"
TMP_DIR=$(mktemp -d)

echo "📦 Downloading $BINARY_NAME..."
wget -qO "$TMP_DIR/${BINARY_NAME}.tar.gz" "$RELEASE_URL"

echo "📂 Extracting..."
tar -xzf "$TMP_DIR/${BINARY_NAME}.tar.gz" -C "$TMP_DIR"

cd "$TMP_DIR/tabcut"

echo "⚙️ Running install.sh..."
chmod +x ./install.sh
./install.sh

echo "🧹 Cleaning up..."
rm -rf "$TMP_DIR"
!tabcut-install.sh