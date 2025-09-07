#!/bin/sh
set -eu

BINARY_NAME="tabcut"
RELEASE_URL="https://github.com/mr-zlaam/tabcut/releases/download/tabcut/tabcut-linux-x64.tar.gz"
TMP_DIR=$(mktemp -d)

cleanup() { rm -rf "$TMP_DIR"; }
trap cleanup EXIT INT TERM

echo "Downloading $BINARY_NAME..."
curl -# -L "$RELEASE_URL" -o "$TMP_DIR/${BINARY_NAME}.tar.gz"

echo "Extracting..."
tar -xzf "$TMP_DIR/${BINARY_NAME}.tar.gz" -C "$TMP_DIR"

INSTALLER_PATH=$(find "$TMP_DIR" -maxdepth 3 -type f -name install.sh -print -quit)

if [ -z "$INSTALLER_PATH" ]; then
  echo "Error: install.sh not found inside archive."
  exit 1
fi

INSTALL_DIR=$(dirname "$INSTALLER_PATH")
echo "Running installer..."
cd "$INSTALL_DIR" || exit 1
chmod +x ./install.sh
./install.sh
