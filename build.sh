#!/bin/bash
# Vercel build script for Flutter Web

if [ ! -d "flutter" ]; then
  echo "Cloning Flutter SDK..."
  git clone https://github.com/flutter/flutter.git -b stable
else
  echo "Flutter SDK already cloned. Skipping..."
fi

export PATH="$PATH:`pwd`/flutter/bin"

echo "Disabling analytics..."
flutter config --no-analytics

echo "Creating .env file for flutter_dotenv..."
touch .env
if [ -n "$GEMINI_API_KEY" ]; then
  echo "GEMINI_API_KEY=$GEMINI_API_KEY" >> .env
else
  echo "GEMINI_API_KEY=" >> .env
fi

echo "Enabling web support..."
flutter config --enable-web

echo "Creating web platform support..."
flutter create --platforms web .

echo "Cleaning previous builds..."
flutter clean

echo "Getting dependencies..."
flutter pub get

echo "Building Flutter Web app..."
flutter build web --release --web-renderer canvaskit

