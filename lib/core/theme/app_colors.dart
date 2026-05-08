import 'package:flutter/material.dart';

class AppColors {
  AppColors._();

  // Primary Purple Gradient
  static const Color primaryPurple = Color(0xFF7C3AED);
  static const Color primaryPurpleLight = Color(0xFF9F67FF);
  static const Color primaryPurpleDark = Color(0xFF5B21B6);

  // Blue Accent
  static const Color accentBlue = Color(0xFF3B82F6);
  static const Color accentBlueLight = Color(0xFF60A5FA);
  static const Color accentBlueDark = Color(0xFF1D4ED8);

  // Gradient combinations
  static const LinearGradient primaryGradient = LinearGradient(
    colors: [Color(0xFF7C3AED), Color(0xFF3B82F6)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient purpleGradient = LinearGradient(
    colors: [Color(0xFF9F67FF), Color(0xFF7C3AED)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient blueGradient = LinearGradient(
    colors: [Color(0xFF3B82F6), Color(0xFF2563EB)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient mintGradient = LinearGradient(
    colors: [Color(0xFF10B981), Color(0xFF3B82F6)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient sunsetGradient = LinearGradient(
    colors: [Color(0xFFF59E0B), Color(0xFFEF4444)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient roseGradient = LinearGradient(
    colors: [Color(0xFFEC4899), Color(0xFF7C3AED)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  // Background
  static const Color backgroundLight = Color(0xFFF8F7FF);
  static const Color backgroundCard = Color(0xFFFFFFFF);
  static const Color backgroundSurface = Color(0xFFF1EFFF);
  static const Color backgroundDark = Color(0xFF0F0A1E);
  static const Color backgroundCardDark = Color(0xFF1A1230);
  static const Color backgroundSurfaceDark = Color(0xFF221843);

  // Text
  static const Color textPrimary = Color(0xFF1A0533);
  static const Color textSecondary = Color(0xFF6B7280);
  static const Color textHint = Color(0xFFB0B8C1);
  static const Color textPrimaryDark = Color(0xFFF3F0FF);
  static const Color textSecondaryDark = Color(0xFFAA9FCC);

  // Status colors
  static const Color success = Color(0xFF10B981);
  static const Color error = Color(0xFFEF4444);
  static const Color warning = Color(0xFFF59E0B);
  static const Color info = Color(0xFF3B82F6);

  // Grammar highlight
  static const Color grammarError = Color(0xFFFFEBEB);
  static const Color grammarCorrect = Color(0xFFEBFFF3);
  static const Color grammarErrorText = Color(0xFFEF4444);
  static const Color grammarCorrectText = Color(0xFF10B981);

  // Glassmorphism
  static Color glassWhite = Colors.white.withOpacity(0.15);
  static Color glassBorder = Colors.white.withOpacity(0.25);

  // Shadow
  static Color shadowPurple = const Color(0xFF7C3AED).withOpacity(0.25);
  static Color shadowBlue = const Color(0xFF3B82F6).withOpacity(0.20);
  static Color shadowDark = Colors.black.withOpacity(0.10);
}
