#!/bin/bash
set -e

BINARY_NAME="tabcut"
BINARY_RUN="tabcut create"
INSTALL_PATH="/usr/local/bin/$BINARY_NAME"

echo "📦 Installing $BINARY_NAME..."

# Check if binary exists
if [ ! -f "$BINARY_NAME" ]; then
  echo "❌ Error: '$BINARY_NAME' binary not found in current directory."
  exit 1
fi

# Copy binary to /usr/local/bin
echo "🔧 Copying binary to $INSTALL_PATH (requires sudo)"
sudo cp "$BINARY_NAME" "$INSTALL_PATH"
sudo chmod +x "$INSTALL_PATH"

# Confirm
echo "✅ $BINARY_NAME installed successfully!"
echo "💡 Run it using: $BINARY_RUN"
