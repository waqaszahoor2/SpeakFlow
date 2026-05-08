# SpeakFlow — GitHub Publishing Commands
# Run these commands in order from the project directory
# d:\python\projects\AngraziSpoken

# ─────────────────────────────────────────────────────────────
# STEP 1: Initialize Git (skip if already initialized)
# ─────────────────────────────────────────────────────────────
git init
git branch -M main

# ─────────────────────────────────────────────────────────────
# STEP 2: Stage all files
# ─────────────────────────────────────────────────────────────
git add .

# ─────────────────────────────────────────────────────────────
# STEP 3: First commit
# ─────────────────────────────────────────────────────────────
git commit -m "feat: initial release — SpeakFlow v1.0.0

- AI-powered English conversation with Google Gemini 1.5 Flash
- Real-time grammar correction with highlighted mistakes
- Progress dashboard with weekly bar chart and achievement badges
- 8 practice topic categories with difficulty filters
- Daily streak tracker and activity calendar
- Android In-App Update system (flexible + immediate)
- Firebase Remote Config for version gating
- Maintenance mode screen
- Full dark mode support
- Premium Material 3 UI with purple/blue gradient theme
- Smooth flutter_animate transitions throughout"

# ─────────────────────────────────────────────────────────────
# STEP 4: Create GitHub repository
# ─────────────────────────────────────────────────────────────
# Option A — GitHub CLI (recommended):
gh repo create SpeakFlow \
  --public \
  --description "🎙️ AI-powered English Learning app. Practice speaking with Gemini AI, get grammar corrections, track fluency progress." \
  --source=. \
  --remote=origin \
  --push

# Option B — Manual:
# 1. Go to https://github.com/new
# 2. Repository name: SpeakFlow
# 3. Description: 🎙️ AI-powered English Learning app. Practice speaking with Gemini AI, get grammar corrections, track fluency progress.
# 4. Visibility: Public
# 5. Do NOT initialize with README (we have one)
# 6. Click Create repository
# 7. Then run:
git remote add origin https://github.com/YOUR_USERNAME/SpeakFlow.git
git push -u origin main

# ─────────────────────────────────────────────────────────────
# STEP 5: Add GitHub Topics (run after repo is created)
# ─────────────────────────────────────────────────────────────
gh repo edit SpeakFlow --add-topic flutter
gh repo edit SpeakFlow --add-topic dart
gh repo edit SpeakFlow --add-topic ai
gh repo edit SpeakFlow --add-topic english-learning
gh repo edit SpeakFlow --add-topic gemini-ai
gh repo edit SpeakFlow --add-topic grammar-correction
gh repo edit SpeakFlow --add-topic language-learning
gh repo edit SpeakFlow --add-topic mobile-app
gh repo edit SpeakFlow --add-topic android
gh repo edit SpeakFlow --add-topic material-design

# ─────────────────────────────────────────────────────────────
# STEP 6: Create and push a version tag (triggers CI/CD release)
# ─────────────────────────────────────────────────────────────
git tag -a v1.0.0 -m "SpeakFlow v1.0.0 — Initial Release"
git push origin v1.0.0

# ─────────────────────────────────────────────────────────────
# STEP 7: Create GitHub Secrets for APK signing (optional)
# ─────────────────────────────────────────────────────────────
# In GitHub → Your repo → Settings → Secrets and variables → Actions → New secret:
#
# KEYSTORE_BASE64  →  base64 encoded .jks file
# STORE_PASSWORD   →  your keystore store password
# KEY_PASSWORD     →  your key password
# KEY_ALIAS        →  speakflow
#
# To generate the base64 value:
# (Linux/Mac): base64 -i speakflow-release.jks
# (Windows PowerShell):
# [Convert]::ToBase64String([IO.File]::ReadAllBytes("speakflow-release.jks")) | Out-File keystore.b64

# ─────────────────────────────────────────────────────────────
# FUTURE: Push new release
# ─────────────────────────────────────────────────────────────
# 1. Update version in pubspec.yaml (e.g., version: 1.1.0+2)
# 2. Update CHANGELOG.md with new changes
# 3. Commit and tag:
git add pubspec.yaml CHANGELOG.md
git commit -m "chore: bump version to v1.1.0"
git tag -a v1.1.0 -m "SpeakFlow v1.1.0"
git push origin main
git push origin v1.1.0
# GitHub Actions will auto-build and create release!
