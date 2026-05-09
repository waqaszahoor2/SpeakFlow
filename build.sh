#!/bin/bash
set -e  # Exit immediately on any error

echo "=============================="
echo " SpeakFlow — Vercel Build"
echo "=============================="

# ── 1. Clone Flutter SDK (stable channel) ─────────────────────────
if [ ! -d "flutter" ]; then
  echo "[1/7] Cloning Flutter SDK (stable)..."
  git clone https://github.com/flutter/flutter.git --depth=1 -b stable --quiet
else
  echo "[1/7] Flutter SDK already present, pulling latest..."
  cd flutter && git pull --quiet && cd ..
fi

export PATH="$PATH:$(pwd)/flutter/bin"

# ── 2. Verify Flutter ─────────────────────────────────────────────
echo "[2/7] Verifying Flutter installation..."
flutter --version
flutter config --no-analytics
flutter config --enable-web

# ── 3. Generate .env file ─────────────────────────────────────────
echo "[3/7] Writing .env file..."
cat > .env <<EOF
GEMINI_API_KEY=${GEMINI_API_KEY:-}
EOF
echo ".env file written."

# ── 4. Ensure web platform files exist ──────────────────────────
echo "[4/7] Ensuring web platform support..."
if [ ! -d "web" ]; then
  echo "  web/ directory missing — running flutter create --platforms web"
  flutter create --platforms web . --quiet
else
  echo "  web/ directory already exists. Skipping."
fi

# ── 5. Get dependencies ───────────────────────────────────────────
echo "[5/7] Getting dependencies..."
flutter pub get

# ── 6. Build for web (release) ───────────────────────────────────
echo "[6/7] Building Flutter Web (release)..."
flutter build web --release

# ── 7. Done ───────────────────────────────────────────────────────
echo "[7/7] Build complete! Output is in build/web/"
ls -lh build/web/
