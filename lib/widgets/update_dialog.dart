import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../core/theme/app_colors.dart';
import '../core/providers/update_provider.dart';
import '../core/services/remote_config_service.dart';

/// Bottom sheet shown for optional (flexible) updates.
class UpdateDialog extends ConsumerWidget {
  const UpdateDialog({super.key});

  static Future<void> show(BuildContext context) {
    return showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => const UpdateDialog(),
    );
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state  = ref.watch(updateProvider);
    final notifier = ref.read(updateProvider.notifier);
    final config = RemoteConfigService.instance;
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Container(
      decoration: BoxDecoration(
        color: isDark ? AppColors.backgroundCardDark : Colors.white,
        borderRadius: const BorderRadius.only(
          topLeft: Radius.circular(32),
          topRight: Radius.circular(32),
        ),
        boxShadow: [
          BoxShadow(color: AppColors.shadowPurple, blurRadius: 40, offset: const Offset(0, -8)),
        ],
      ),
      child: SafeArea(
        top: false,
        child: Padding(
          padding: const EdgeInsets.fromLTRB(24, 8, 24, 24),
          child: Column(mainAxisSize: MainAxisSize.min, children: [
            // Drag handle
            Container(
              width: 40, height: 4,
              margin: const EdgeInsets.only(bottom: 24),
              decoration: BoxDecoration(
                color: isDark ? Colors.white.withOpacity(0.15) : AppColors.textHint.withOpacity(0.3),
                borderRadius: BorderRadius.circular(2),
              ),
            ),

            // Icon
            Container(
              width: 72, height: 72,
              decoration: BoxDecoration(
                gradient: AppColors.primaryGradient,
                shape: BoxShape.circle,
                boxShadow: [BoxShadow(color: AppColors.shadowPurple, blurRadius: 24, offset: const Offset(0, 8))],
              ),
              child: const Center(child: Text('🚀', style: TextStyle(fontSize: 34))),
            ).animate().scale(begin: const Offset(0.5, 0.5), curve: Curves.elasticOut, duration: 700.ms),

            const SizedBox(height: 20),

            Text('Update Available!',
              style: GoogleFonts.poppins(fontSize: 22, fontWeight: FontWeight.w800,
                  color: isDark ? AppColors.textPrimaryDark : AppColors.textPrimary),
            ).animate().fadeIn(delay: 200.ms).slideY(begin: 0.3, end: 0),

            const SizedBox(height: 8),

            Text('Version ${config.latestVersion} is ready',
              style: GoogleFonts.poppins(fontSize: 14, color: AppColors.textSecondary),
            ).animate().fadeIn(delay: 300.ms),

            const SizedBox(height: 20),

            // Update message
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: isDark ? AppColors.backgroundSurfaceDark : AppColors.backgroundSurface,
                borderRadius: BorderRadius.circular(16),
              ),
              child: Text(config.updateMessage,
                style: GoogleFonts.poppins(fontSize: 13, color: AppColors.textSecondary, height: 1.5)),
            ).animate().fadeIn(delay: 350.ms),

            const SizedBox(height: 14),

            // Release notes
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: isDark ? AppColors.backgroundCardDark : AppColors.primaryPurple.withOpacity(0.05),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppColors.primaryPurple.withOpacity(0.15)),
              ),
              child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Text("What's New 📋",
                  style: GoogleFonts.poppins(fontSize: 13, fontWeight: FontWeight.w700,
                      color: AppColors.primaryPurple)),
                const SizedBox(height: 8),
                Text(config.releaseNotes,
                  style: GoogleFonts.poppins(fontSize: 12, color: isDark
                      ? AppColors.textSecondaryDark : AppColors.textSecondary, height: 1.6)),
              ]),
            ).animate().fadeIn(delay: 400.ms),

            const SizedBox(height: 20),

            // Progress (while downloading)
            if (state.phase == UpdatePhase.downloading) ...[
              ClipRRect(
                borderRadius: BorderRadius.circular(8),
                child: LinearProgressIndicator(
                  value: state.downloadProgress,
                  minHeight: 10,
                  backgroundColor: AppColors.backgroundSurface,
                  valueColor: const AlwaysStoppedAnimation<Color>(AppColors.primaryPurple),
                ),
              ),
              const SizedBox(height: 8),
              Text('Downloading… ${(state.downloadProgress * 100).round()}%',
                style: GoogleFonts.poppins(fontSize: 12, color: AppColors.primaryPurple, fontWeight: FontWeight.w600)),
              const SizedBox(height: 14),
            ],

            // Ready to install
            if (state.phase == UpdatePhase.readyToInstall)
              _GradientButton(
                label: 'Restart & Install 🔄',
                onTap: () => notifier.applyUpdate(),
              ).animate().fadeIn().scale(),

            // Download button
            if (state.phase == UpdatePhase.flexibleAvailable)
              _GradientButton(
                label: 'Update Now',
                onTap: () => notifier.startFlexibleDownload(),
              ).animate().fadeIn(delay: 450.ms),

            if (state.phase == UpdatePhase.error)
              _GradientButton(
                label: 'Retry',
                icon: Icons.refresh_rounded,
                onTap: () => notifier.retry(),
              ),

            const SizedBox(height: 12),

            // Dismiss
            if (state.phase != UpdatePhase.downloading && state.phase != UpdatePhase.readyToInstall)
              TextButton(
                onPressed: () {
                  notifier.dismissFlexible();
                  Navigator.of(context).pop();
                },
                child: Text('Maybe Later',
                  style: GoogleFonts.poppins(fontSize: 14, color: AppColors.textSecondary,
                      fontWeight: FontWeight.w600)),
              ),
          ]),
        ),
      ),
    );
  }
}

class _GradientButton extends StatelessWidget {
  final String label;
  final IconData? icon;
  final VoidCallback onTap;
  const _GradientButton({required this.label, this.icon, required this.onTap});

  @override
  Widget build(BuildContext context) => GestureDetector(
    onTap: onTap,
    child: Container(
      width: double.infinity, height: 54,
      decoration: BoxDecoration(
        gradient: AppColors.primaryGradient,
        borderRadius: BorderRadius.circular(18),
        boxShadow: [BoxShadow(color: AppColors.shadowPurple, blurRadius: 16, offset: const Offset(0, 6))],
      ),
      child: Row(mainAxisAlignment: MainAxisAlignment.center, children: [
        if (icon != null) ...[
          Icon(icon, color: Colors.white, size: 20),
          const SizedBox(width: 8),
        ],
        Text(label, style: GoogleFonts.poppins(
            fontSize: 15, fontWeight: FontWeight.w700, color: Colors.white)),
      ]),
    ),
  );
}
