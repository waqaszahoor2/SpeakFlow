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

echo "Creating web platform support..."
flutter create --platforms web .

echo "Getting dependencies..."
flutter pub get

echo "Building Flutter Web app..."
flutter build web --release
