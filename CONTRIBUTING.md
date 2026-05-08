# Contributing to SpeakFlow 🎙️

First off — thank you for considering contributing to SpeakFlow! 🙌

We welcome contributions of all kinds: bug reports, feature requests, documentation improvements, and code.

---

## 🐛 Reporting Bugs

1. Check if the issue already exists in [Issues](../../issues)
2. If not, open a new issue using the **Bug Report** template
3. Include:
   - Flutter version (`flutter --version`)
   - Device and Android version
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable

---

## 💡 Suggesting Features

1. Open an issue using the **Feature Request** template
2. Describe the use case clearly
3. Explain why it benefits users

---

## 🔧 Contributing Code

### 1. Fork & Clone

```bash
# Fork the repository on GitHub, then:
git clone https://github.com/YOUR_USERNAME/SpeakFlow.git
cd SpeakFlow
flutter pub get
```

### 2. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

### 3. Make Your Changes

- Follow [Effective Dart](https://dart.dev/effective-dart) style guide
- Keep changes focused — one feature/fix per PR
- Add comments for complex logic
- Update CHANGELOG.md under `[Unreleased]`

### 4. Test Your Changes

```bash
flutter analyze
flutter test
flutter run  # manual test on device/emulator
```

### 5. Commit with Conventional Commits

```bash
git commit -m "feat: add pronunciation scoring screen"
git commit -m "fix: grammar correction not showing on first message"
git commit -m "docs: update README installation steps"
git commit -m "refactor: extract chat bubble to reusable widget"
```

### 6. Push & Open a PR

```bash
git push origin feature/your-feature-name
```

Then open a Pull Request on GitHub with:
- Clear title and description
- Reference to related issue (`Closes #42`)
- Screenshots for UI changes

---

## 📋 Code Style

- Use `flutter format .` before committing
- Use `const` constructors where possible
- Name files with `snake_case`
- Name classes with `PascalCase`
- Keep widgets small and reusable
- Separate business logic from UI

---

## 🏗️ Project Structure

```
lib/
├── core/           # Services, models, providers, theme
├── features/       # One folder per screen
└── widgets/        # Shared reusable widgets
```

---

## 📄 License

By contributing, you agree your contributions will be licensed under the MIT License.
