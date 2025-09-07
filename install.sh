#!/bin/bash
set -e

BINARY_NAME="tabcut"
INSTALL_PATH="/usr/local/bin/$BINARY_NAME"

echo "🚀 Installing $BINARY_NAME..."

# Ensure the binary exists in the current directory
if [ ! -f "./$BINARY_NAME" ]; then
  echo "❌ Error: '$BINARY_NAME' binary not found in current directory."
  exit 1
fi

# Make the binary executable
chmod +x "./$BINARY_NAME"

# Overwrite existing binary if it exists
if [ -f "$INSTALL_PATH" ]; then
  echo "⚠️ Existing binary detected at $INSTALL_PATH. Overwriting..."
fi

# Copy binary to system path (requires sudo)
echo "🔧 Copying to $INSTALL_PATH..."
sudo cp -f "./$BINARY_NAME" "$INSTALL_PATH"
sudo chmod 755 "$INSTALL_PATH"

# Verify installation
if [ -x "$INSTALL_PATH" ]; then
  echo "✔ $BINARY_NAME installed successfully!"
  echo "💡 Run it using: ${BINARY_NAME} create"
else
  echo "❌ Installation failed. Please check permissions."
  exit 1
fi
