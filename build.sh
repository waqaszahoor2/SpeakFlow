#!/bin/bash
# Vercel build script for Flutter Web
echo "Cloning Flutter SDK..."
git clone https://github.com/flutter/flutter.git -b stable
export PATH="$PATH:`pwd`/flutter/bin"

echo "Creating web platform support..."
flutter create --platforms web .

echo "Building Flutter Web app..."
flutter build web --release
