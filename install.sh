#!/bin/bash
set -e

BINARY_NAME="tabcut"
INSTALL_PATH="/usr/local/bin/$BINARY_NAME"

echo "📦 Installing $BINARY_NAME..."

# Ensure we're in the directory where the binary exists
if [ ! -f "./$BINARY_NAME" ]; then
  echo "❌ Error: '$BINARY_NAME' binary not found in current directory."
  exit 1
fi

# Ensure binary is executable before copying
chmod +x "./$BINARY_NAME"

# Copy binary to system path
echo "🔧 Copying to $INSTALL_PATH (requires sudo)..."
sudo cp "./$BINARY_NAME" "$INSTALL_PATH"
sudo chmod 755 "$INSTALL_PATH"

# Check if successfully installed
if [ -x "$INSTALL_PATH" ]; then
  echo "✅ $BINARY_NAME installed successfully!"
  echo "💡 Run it using: ${BINARY_NAME} create"
else
  echo "❌ Installation failed. Please check permissions."
  exit 1
fi
