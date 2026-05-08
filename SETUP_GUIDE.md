# SpeakFlow — Complete Setup & Integration Guide

## Step 1 — Install Flutter

Flutter is not installed. Install it first:

```powershell
winget install Google.FlutterSDK
```
Or download from https://docs.flutter.dev/get-started/install/windows  
Add `C:\flutter\bin` to PATH, then verify:
```powershell
flutter doctor
```

---

## Step 2 — Get Dependencies

```powershell
cd d:\python\projects\AngraziSpoken
flutter pub get
```

---

## Step 3 — Firebase Setup (for Remote Config + Updates)

1. Go to https://console.firebase.google.com → Add project → name it `SpeakFlow`
2. Add Android app with package `com.speakflow.app`
3. Download `google-services.json` → place at `android/app/google-services.json`
4. Uncomment Firebase lines in `android/app/build.gradle` and `android/build.gradle`
5. Remote Config → Get started → Import `firebase_remote_config_template.json` → Publish

Generate firebase_options.dart:
```powershell
dart pub global activate flutterfire_cli
flutterfire configure
```

Then uncomment in `main.dart`:
```dart
await Firebase.initializeApp(options: DefaultFirebaseOptions.currentPlatform);
```

---

## Step 4 — Gemini AI (Already Wired)

Key is set in `lib/core/services/gemini_service.dart`.

**Before production**, move key to Firebase Remote Config:
```dart
// RemoteConfigService:
String get geminiApiKey => _config.getString('gemini_api_key');

// GeminiService:
static String get _apiKey => RemoteConfigService.instance.geminiApiKey;
```

---

## Step 5 — Android Signing (for Play Store)

```powershell
keytool -genkey -v -keystore speakflow-release.jks -keyalg RSA -keysize 2048 -validity 10000 -alias speakflow
```

Create `android/key.properties`:
```
storePassword=YOUR_STORE_PASSWORD
keyPassword=YOUR_KEY_PASSWORD
keyAlias=speakflow
storeFile=../../speakflow-release.jks
```

Build release APK:
```powershell
flutter build apk --release
flutter build appbundle --release
```

---

## Step 6 — Remote Config Update Control

| Parameter | Example | Effect |
|-----------|---------|--------|
| `min_required_version` | `1.0.1` | Force users on 1.0.0 to update |
| `force_update` | `true` | Force ALL users to update now |
| `optional_update` | `true` | Show dismissible update sheet |
| `maintenance_mode` | `true` | Block app with maintenance screen |
| `release_notes` | `"Bug fixes"` | Shown in update dialog |

---

## Step 7 — Test Update Flows

Without Play Store, temporarily set in `update_provider.dart`:
```dart
// Test flexible update sheet:
state = state.copyWith(phase: UpdatePhase.flexibleAvailable); return;

// Test force update screen:
state = state.copyWith(phase: UpdatePhase.forceRequired); return;

// Test maintenance screen:
// Set maintenance_mode=true in Firebase Remote Config
```

---

## Step 8 — Run the App

```powershell
flutter devices          # list connected devices
flutter run              # run in debug mode
flutter run --release    # run in release mode
```

---

## Screens & Routes

| Screen | Route | Features |
|--------|-------|---------|
| Onboarding | `/onboarding` | 3 slides, animated |
| Home | `/home` | AI card, streak, quick actions |
| Conversation | `/conversation` | Live Gemini AI, mic, waveform |
| Grammar | `/grammar` | Highlighted errors, explanation |
| Progress | `/progress` | Charts, achievements |
| Topics | `/topics` | Search, filter, progress bars |
| Profile | `/profile` | Dark mode, level, subscription |

---

## Security Checklist

- [ ] Move Gemini API key out of source code (use Remote Config)
- [x] `key.properties` excluded from git
- [x] `google-services.json` excluded from git
- [x] ProGuard enabled for release builds
- [x] minSdkVersion 21 set for in_app_update

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `flutter` not recognized | Install Flutter SDK, add to PATH |
| `in_app_update` fails | Only works on Play Store builds |
| Gemini empty response | Check internet + API key validity |
| Firebase error | Ensure google-services.json is placed correctly |
