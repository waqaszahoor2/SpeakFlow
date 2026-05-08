import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../core/theme/app_colors.dart';
import '../core/providers/update_provider.dart';
import '../core/services/remote_config_service.dart';

/// Full-screen forced update — user CANNOT dismiss this.
class ForceUpdateScreen extends ConsumerWidget {
  const ForceUpdateScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final notifier = ref.read(updateProvider.notifier);
    final config   = RemoteConfigService.instance;

    return PopScope(
      canPop: false, // back button disabled
      child: Scaffold(
        body: Container(
          width: double.infinity,
          decoration: const BoxDecoration(gradient: AppColors.primaryGradient),
          child: SafeArea(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 32),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  // Animated icon
                  Container(
                    width: 120, height: 120,
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.15),
                      shape: BoxShape.circle,
                      border: Border.all(color: Colors.white.withOpacity(0.3), width: 2),
                    ),
                    child: const Center(child: Text('⚡', style: TextStyle(fontSize: 56))),
                  )
                      .animate(onPlay: (c) => c.repeat(reverse: true))
                      .scale(begin: const Offset(0.9, 0.9), end: const Offset(1.05, 1.05),
                          duration: 2.seconds, curve: Curves.easeInOut),

                  const SizedBox(height: 36),

                  Text('Update Required',
                    style: GoogleFonts.poppins(fontSize: 30, fontWeight: FontWeight.w800,
                        color: Colors.white),
                    textAlign: TextAlign.center,
                  ).animate().fadeIn(delay: 300.ms).slideY(begin: 0.3, end: 0),

                  const SizedBox(height: 12),

                  Text('Version ${config.latestVersion} is required\nto continue using SpeakFlow.',
                    style: GoogleFonts.poppins(fontSize: 15, color: Colors.white.withOpacity(0.85),
                        height: 1.5),
                    textAlign: TextAlign.center,
                  ).animate().fadeIn(delay: 400.ms),

                  const SizedBox(height: 32),

                  // Release notes card
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.15),
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: Colors.white.withOpacity(0.25)),
                    ),
                    child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                      Text("What's New 📋",
                        style: GoogleFonts.poppins(fontSize: 14, fontWeight: FontWeight.w700,
                            color: Colors.white)),
                      const SizedBox(height: 10),
                      Text(config.releaseNotes,
                        style: GoogleFonts.poppins(fontSize: 13, color: Colors.white.withOpacity(0.85),
                            height: 1.6)),
                    ]),
                  ).animate().fadeIn(delay: 500.ms).slideY(begin: 0.3, end: 0),

                  const SizedBox(height: 36),

                  // Update button
                  GestureDetector(
                    onTap: () => notifier.startImmediateUpdate(),
                    child: Container(
                      width: double.infinity, height: 58,
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(18),
                        boxShadow: [BoxShadow(
                          color: Colors.black.withOpacity(0.15),
                          blurRadius: 20, offset: const Offset(0, 8),
                        )],
                      ),
                      child: Row(mainAxisAlignment: MainAxisAlignment.center, children: [
                        const Icon(Icons.system_update_rounded, color: AppColors.primaryPurple, size: 22),
                        const SizedBox(width: 10),
                        Text('Update Now',
                          style: GoogleFonts.poppins(fontSize: 16, fontWeight: FontWeight.w800,
                              color: AppColors.primaryPurple)),
                      ]),
                    ),
                  ).animate().fadeIn(delay: 600.ms).scale(
                      begin: const Offset(0.9, 0.9), end: const Offset(1, 1)),

                  const SizedBox(height: 24),

                  Text('You must update to continue using the app.',
                    style: GoogleFonts.poppins(fontSize: 12, color: Colors.white.withOpacity(0.6)),
                    textAlign: TextAlign.center,
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

/// Maintenance mode screen
class MaintenanceScreen extends StatelessWidget {
  final String message;
  const MaintenanceScreen({super.key, required this.message});

  @override
  Widget build(BuildContext context) {
    return PopScope(
      canPop: false,
      child: Scaffold(
        body: Container(
          width: double.infinity,
          decoration: const BoxDecoration(gradient: AppColors.blueGradient),
          child: SafeArea(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 32),
              child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
                const Text('🛠️', style: TextStyle(fontSize: 72))
                    .animate(onPlay: (c) => c.repeat(reverse: true))
                    .rotate(begin: -0.05, end: 0.05, duration: 2.seconds),
                const SizedBox(height: 32),
                Text('Under Maintenance',
                  style: GoogleFonts.poppins(fontSize: 28, fontWeight: FontWeight.w800, color: Colors.white),
                  textAlign: TextAlign.center,
                ).animate().fadeIn(delay: 300.ms),
                const SizedBox(height: 16),
                Container(
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.15),
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: Colors.white.withOpacity(0.25)),
                  ),
                  child: Text(message,
                    style: GoogleFonts.poppins(fontSize: 14, color: Colors.white.withOpacity(0.9),
                        height: 1.6),
                    textAlign: TextAlign.center),
                ).animate().fadeIn(delay: 400.ms),
                const SizedBox(height: 32),
                Text('Please check back later.',
                  style: GoogleFonts.poppins(fontSize: 13, color: Colors.white.withOpacity(0.6))),
              ]),
            ),
          ),
        ),
      ),
    );
  }
}
