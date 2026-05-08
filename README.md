<div align="center">

<img src="https://img.shields.io/badge/SpeakFlow-AI%20English%20Tutor-7C3AED?style=for-the-badge&logo=flutter&logoColor=white" alt="SpeakFlow" height="40"/>

# 🎙️ SpeakFlow — AI English Tutor

### Practice spoken English with a real AI tutor. Get instant grammar corrections, pronunciation feedback, and track your fluency growth.

[![Flutter](https://img.shields.io/badge/Flutter-3.x-02569B?logo=flutter&logoColor=white)](https://flutter.dev)
[![Dart](https://img.shields.io/badge/Dart-3.x-0175C2?logo=dart&logoColor=white)](https://dart.dev)
[![Gemini AI](https://img.shields.io/badge/Powered%20by-Gemini%20AI-4285F4?logo=google&logoColor=white)](https://ai.google.dev)
[![Firebase](https://img.shields.io/badge/Firebase-Remote%20Config-FFCA28?logo=firebase&logoColor=black)](https://firebase.google.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-green)](LICENSE)
[![Platform](https://img.shields.io/badge/Platform-Android-3DDC84?logo=android&logoColor=white)](https://android.com)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen)](CONTRIBUTING.md)

<br/>

**[⬇️ Download APK](#-download--install) · [📸 Screenshots](#-screenshots) · [✨ Features](#-features) · [🚀 Roadmap](#-roadmap)**

</div>

---

## 📲 Download & Install

> **Latest Release: [SpeakFlow v1.0.0](../../releases/latest)**

| Variant | Size | Target |
|---------|------|--------|
| [📦 Universal APK](../../releases/latest/download/app-release.apk) | ~25 MB | All Android devices |
| [📦 arm64-v8a](../../releases/latest/download/app-arm64-v8a-release.apk) | ~18 MB | Modern 64-bit devices |
| [📦 armeabi-v7a](../../releases/latest/download/app-armeabi-v7a-release.apk) | ~17 MB | Older 32-bit devices |

### Installation Steps

1. Download the **Universal APK** from the link above
2. On your Android device: **Settings → Security → Install unknown apps**
3. Enable installation from your **File Manager** or **Browser**
4. Open the downloaded `.apk` file and tap **Install**
5. Open **SpeakFlow** and start speaking! 🎙️

> **Requirements:** Android 5.0 (API 21) or higher · Internet connection for AI features

---

## 📸 Screenshots

<div align="center">

| Onboarding | Home | Conversation |
|:---:|:---:|:---:|
| ![Onboarding](docs/screenshots/onboarding.png) | ![Home](docs/screenshots/home.png) | ![Chat](docs/screenshots/conversation.png) |

| Grammar Correction | Progress | Topics |
|:---:|:---:|:---:|
| ![Grammar](docs/screenshots/grammar.png) | ![Progress](docs/screenshots/progress.png) | ![Topics](docs/screenshots/topics.png) |

</div>

---

## ✨ Features

### 🤖 AI-Powered Conversations
- Chat with **Google Gemini 1.5 Flash** as your English tutor
- Natural, context-aware conversation responses
- 24/7 availability — practice anytime, anywhere

### 📝 Real-Time Grammar Correction
- Automatic detection of grammar mistakes
- Side-by-side error highlighting (red = wrong, green = correct)
- Simple rule explanations for every correction
- "More natural version" suggestions from a native speaker perspective

### 🎤 Voice Practice
- Tap the **floating microphone** to speak
- Visual waveform animation during recording
- Ripple effect mic button with live feedback

### 📊 Progress Tracking
- Weekly speaking score bar chart
- Accuracy %, speaking time, vocabulary count
- 28-day activity calendar with streak tracking
- Achievement badge system (6 badges)

### 📚 Practice Topics
- 8 curated topic categories:
  - ☀️ Daily Conversation · 🎓 IELTS Speaking · 💼 Job Interview
  - ✈️ Travel · 📚 Education · 📊 Business English
  - 🏥 Health & Medical · 📱 Social Media
- Per-topic progress bars and lesson counters
- Search and filter by difficulty level

### 🔄 Smart Auto-Update System
- **Flexible updates** — download in background, restart when ready
- **Immediate (forced) updates** — critical versions block the app
- **Firebase Remote Config** — control update behavior remotely
- **Maintenance mode** — push a maintenance screen without a new release

### 🎨 Premium UI/UX
- Material 3 design with **purple/blue gradient** theme
- Full **dark mode** support
- Smooth `flutter_animate` transitions on every screen
- Glassmorphism cards, floating mic button, animated streaks

---

## 🏗️ Architecture

```
lib/
├── main.dart                    # Entry + UpdateGate
├── core/
│   ├── theme/                   # Colors, Material 3 theme
│   ├── router/                  # GoRouter with shell routes
│   ├── models/                  # Data classes
│   ├── providers/               # Riverpod state (theme, updates)
│   └── services/
│       ├── gemini_service.dart  # Google Gemini API wrapper
│       ├── remote_config_service.dart  # Firebase Remote Config
│       └── update_service.dart  # Play In-App Update + fallback
├── features/                    # One folder per screen
│   ├── onboarding/
│   ├── home/
│   ├── conversation/            # Gemini-powered chat
│   ├── grammar/
│   ├── progress/
│   ├── topics/
│   └── profile/
└── widgets/
    ├── main_scaffold.dart       # Bottom nav shell
    ├── update_dialog.dart       # Flexible update bottom sheet
    └── force_update_screen.dart # Force update + maintenance
```

**State Management:** Riverpod  
**Navigation:** GoRouter (ShellRoute + custom transitions)  
**AI:** google_generative_ai (Gemini 1.5 Flash)  
**Updates:** in_app_update + Firebase Remote Config fallback

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | Flutter 3.x, Dart 3.x |
| UI | Material 3, flutter_animate, fl_chart |
| AI | Google Gemini 1.5 Flash |
| State | Flutter Riverpod |
| Navigation | GoRouter |
| Backend | Firebase Remote Config |
| Updates | Google Play In-App Update API |
| Storage | SharedPreferences, Hive |
| Fonts | Google Fonts (Poppins) |

---

## 🚀 Getting Started (Developers)

### Prerequisites
- [Flutter SDK 3.x](https://docs.flutter.dev/get-started/install)
- Android Studio or VS Code
- Android Emulator or physical device (Android 5.0+)

### Setup

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/SpeakFlow.git
cd SpeakFlow

# Install dependencies
flutter pub get

# Run in debug mode
flutter run

# Build release APK
flutter build apk --release
```

### Firebase Setup (Optional)
See [SETUP_GUIDE.md](SETUP_GUIDE.md) for detailed Firebase, Remote Config, and signing configuration.

---

## 🗺️ Roadmap

- [x] AI conversation with Gemini
- [x] Grammar correction with error highlighting
- [x] Progress dashboard with charts
- [x] Practice topic categories
- [x] Dark mode
- [x] In-app update system
- [x] Firebase Remote Config
- [ ] 🎤 Real speech-to-text (microphone → Whisper API)
- [ ] 🔊 AI voice playback (text-to-speech)
- [ ] 📖 Vocabulary flashcard system
- [ ] 🎯 Pronunciation scoring with AI
- [ ] 💳 Premium subscription (RevenueCat)
- [ ] 🔔 Daily practice push notifications
- [ ] 🌐 Multi-language interface
- [ ] 👥 Social learning & leaderboards
- [ ] 🍎 iOS release

---

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) first.

```bash
git checkout -b feature/your-feature
git commit -m "feat: add your feature"
git push origin feature/your-feature
# Open a Pull Request
```

---

## 📄 License

This project is licensed under the **MIT License** — see [LICENSE](LICENSE) for details.

---

## 📬 Contact

- **Issues & Bugs:** [GitHub Issues](../../issues)
- **Feature Requests:** [GitHub Discussions](../../discussions)
- **Email:** speakflow.app@gmail.com

---

<div align="center">

Built with ❤️ using Flutter & Google Gemini AI

⭐ **Star this repo** if SpeakFlow helped you! It motivates us to keep building.

[![Star History](https://img.shields.io/github/stars/YOUR_USERNAME/SpeakFlow?style=social)](../../stargazers)

</div>
