import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../core/theme/app_colors.dart';
import '../../core/models/user_model.dart';
import '../../core/providers/theme_provider.dart';

class ProfileScreen extends ConsumerWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final user = UserModel.demo();
    final themeNotifier = ref.read(themeProvider.notifier);
    final isCurrentlyDark = ref.watch(themeProvider) == ThemeMode.dark;

    return Scaffold(
      backgroundColor: isDark ? AppColors.backgroundDark : AppColors.backgroundLight,
      body: CustomScrollView(
        physics: const BouncingScrollPhysics(),
        slivers: [
          // ── Profile Header
          SliverToBoxAdapter(child: _buildProfileHeader(context, user, isDark)),

          // ── Level Card
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(20, 20, 20, 0),
              child: _buildLevelCard(isDark, user),
            ).animate().fadeIn(delay: 150.ms).slideY(begin: 0.3, end: 0),
          ),

          // ── Subscription Card
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(20, 14, 20, 0),
              child: _buildSubscriptionCard(isDark, user),
            ).animate().fadeIn(delay: 220.ms).slideY(begin: 0.3, end: 0),
          ),

          // ── Settings Section
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(20, 24, 20, 8),
              child: Text('Settings', style: Theme.of(context).textTheme.headlineMedium),
            ).animate().fadeIn(delay: 280.ms),
          ),

          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: _buildSettingsCard(context, isDark, isCurrentlyDark, themeNotifier),
            ).animate().fadeIn(delay: 320.ms).slideY(begin: 0.3, end: 0),
          ),

          // ── More Options
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(20, 16, 20, 0),
              child: _buildMoreOptions(context, isDark),
            ).animate().fadeIn(delay: 400.ms).slideY(begin: 0.3, end: 0),
          ),

          // ── Sign Out
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(20, 20, 20, 0),
              child: _buildSignOutBtn(context),
            ).animate().fadeIn(delay: 480.ms),
          ),

          const SliverToBoxAdapter(child: SizedBox(height: 110)),
        ],
      ),
    );
  }

  Widget _buildProfileHeader(BuildContext context, UserModel user, bool isDark) {
    return Container(
      padding: EdgeInsets.fromLTRB(20, MediaQuery.of(context).padding.top + 16, 20, 32),
      decoration: const BoxDecoration(
        gradient: AppColors.primaryGradient,
        borderRadius: BorderRadius.only(
          bottomLeft: Radius.circular(36),
          bottomRight: Radius.circular(36),
        ),
      ),
      child: Column(children: [
        // Avatar
        Stack(alignment: Alignment.bottomRight, children: [
          Container(
            width: 90, height: 90,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              gradient: AppColors.roseGradient,
              border: Border.all(color: Colors.white.withOpacity(0.5), width: 3),
              boxShadow: [BoxShadow(color: AppColors.shadowPurple, blurRadius: 20, offset: const Offset(0, 8))],
            ),
            child: Center(child: Text(
              user.name.substring(0, 1),
              style: GoogleFonts.poppins(fontSize: 36, fontWeight: FontWeight.w800, color: Colors.white),
            )),
          ),
          Container(
            width: 28, height: 28,
            decoration: BoxDecoration(
              color: Colors.white,
              shape: BoxShape.circle,
              boxShadow: [BoxShadow(color: AppColors.shadowDark, blurRadius: 8)],
            ),
            child: const Icon(Icons.camera_alt_rounded, size: 14, color: AppColors.primaryPurple),
          ),
        ]),
        const SizedBox(height: 14),
        Text(user.name, style: GoogleFonts.poppins(
            fontSize: 22, fontWeight: FontWeight.w800, color: Colors.white)),
        const SizedBox(height: 4),
        Text(user.email, style: GoogleFonts.poppins(
            fontSize: 13, color: Colors.white.withOpacity(0.75))),
        const SizedBox(height: 16),
        // Stats row
        Row(mainAxisAlignment: MainAxisAlignment.center, children: [
          _ProfileStat(label: 'XP', value: '${user.totalXP}'),
          _ProfileDivider(),
          _ProfileStat(label: 'Streak', value: '${user.streakDays}d'),
          _ProfileDivider(),
          _ProfileStat(label: 'Level', value: user.level),
        ]),
      ]),
    ).animate().fadeIn(duration: 500.ms).slideY(begin: -0.2, end: 0);
  }

  Widget _buildLevelCard(bool isDark, UserModel user) {
    const levels = ['Beginner', 'Elementary', 'Intermediate', 'Upper-Intermediate', 'Advanced', 'Fluent'];
    final idx = levels.indexOf(user.level).clamp(0, levels.length - 1);
    final progress = (idx + 0.6) / levels.length;

    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: AppColors.primaryGradient,
        borderRadius: BorderRadius.circular(22),
        boxShadow: [BoxShadow(color: AppColors.shadowPurple, blurRadius: 20, offset: const Offset(0, 8))],
      ),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Row(children: [
          const Text('🎓', style: TextStyle(fontSize: 22)),
          const SizedBox(width: 8),
          Text('Learning Level', style: GoogleFonts.poppins(
              fontSize: 15, fontWeight: FontWeight.w700, color: Colors.white)),
          const Spacer(),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 5),
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.2),
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: Colors.white.withOpacity(0.4)),
            ),
            child: Text(user.level, style: GoogleFonts.poppins(
                fontSize: 12, fontWeight: FontWeight.w700, color: Colors.white)),
          ),
        ]),
        const SizedBox(height: 16),
        ClipRRect(
          borderRadius: BorderRadius.circular(8),
          child: LinearProgressIndicator(
            value: progress,
            minHeight: 10,
            backgroundColor: Colors.white.withOpacity(0.2),
            valueColor: const AlwaysStoppedAnimation<Color>(Colors.white),
          ),
        ),
        const SizedBox(height: 10),
        Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
          Text('Beginner', style: GoogleFonts.poppins(fontSize: 11, color: Colors.white.withOpacity(0.7))),
          Text('${(progress * 100).round()}% to Advanced',
              style: GoogleFonts.poppins(fontSize: 11, fontWeight: FontWeight.w600, color: Colors.white)),
          Text('Fluent', style: GoogleFonts.poppins(fontSize: 11, color: Colors.white.withOpacity(0.7))),
        ]),
      ]),
    );
  }

  Widget _buildSubscriptionCard(bool isDark, UserModel user) {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: isDark ? AppColors.backgroundCardDark : Colors.white,
        borderRadius: BorderRadius.circular(22),
        boxShadow: [BoxShadow(color: AppColors.shadowDark, blurRadius: 16, offset: const Offset(0, 4))],
        border: Border.all(
          color: user.isPremium
              ? const Color(0xFFFBBF24).withOpacity(0.4)
              : AppColors.primaryPurple.withOpacity(0.15),
        ),
      ),
      child: Row(children: [
        Container(
          width: 52, height: 52,
          decoration: BoxDecoration(
            gradient: user.isPremium ? AppColors.sunsetGradient : AppColors.primaryGradient,
            borderRadius: BorderRadius.circular(16),
          ),
          child: Center(child: Icon(
            user.isPremium ? Icons.workspace_premium_rounded : Icons.star_outline_rounded,
            color: Colors.white, size: 26,
          )),
        ),
        const SizedBox(width: 14),
        Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text(user.isPremium ? 'Premium Plan' : 'Free Plan',
            style: GoogleFonts.poppins(fontSize: 15, fontWeight: FontWeight.w700,
                color: isDark ? AppColors.textPrimaryDark : AppColors.textPrimary)),
          const SizedBox(height: 2),
          Text(user.isPremium ? 'All features unlocked ✨' : 'Upgrade to unlock all features',
            style: GoogleFonts.poppins(fontSize: 12, color: AppColors.textSecondary)),
        ])),
        if (!user.isPremium)
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
            decoration: BoxDecoration(
              gradient: AppColors.primaryGradient,
              borderRadius: BorderRadius.circular(12),
            ),
            child: Text('Upgrade', style: GoogleFonts.poppins(
                fontSize: 12, fontWeight: FontWeight.w700, color: Colors.white)),
          ),
        if (user.isPremium)
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
            decoration: BoxDecoration(
              color: const Color(0xFFFBBF24).withOpacity(0.15),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Text('Active', style: GoogleFonts.poppins(
                fontSize: 12, fontWeight: FontWeight.w700, color: const Color(0xFFF59E0B))),
          ),
      ]),
    );
  }

  Widget _buildSettingsCard(BuildContext context, bool isDark, bool isCurrentlyDark, ThemeNotifier notifier) {
    return Container(
      decoration: BoxDecoration(
        color: isDark ? AppColors.backgroundCardDark : Colors.white,
        borderRadius: BorderRadius.circular(22),
        boxShadow: [BoxShadow(color: AppColors.shadowDark, blurRadius: 16, offset: const Offset(0, 4))],
      ),
      child: Column(children: [
        _SettingsTile(
          icon: Icons.dark_mode_rounded,
          label: 'Dark Mode',
          isDark: isDark,
          trailing: Switch.adaptive(
            value: isCurrentlyDark,
            onChanged: (_) => notifier.toggleTheme(),
            activeColor: AppColors.primaryPurple,
          ),
        ),
        _Divider(isDark: isDark),
        _SettingsTile(
          icon: Icons.notifications_rounded,
          label: 'Notifications',
          isDark: isDark,
          trailing: Switch.adaptive(
            value: true,
            onChanged: (_) {},
            activeColor: AppColors.primaryPurple,
          ),
        ),
        _Divider(isDark: isDark),
        _SettingsTile(
          icon: Icons.language_rounded,
          label: 'App Language',
          isDark: isDark,
          trailing: Text('English', style: GoogleFonts.poppins(
              fontSize: 13, color: AppColors.primaryPurple, fontWeight: FontWeight.w600)),
        ),
        _Divider(isDark: isDark),
        _SettingsTile(
          icon: Icons.volume_up_rounded,
          label: 'Voice Speed',
          isDark: isDark,
          trailing: Text('Normal', style: GoogleFonts.poppins(
              fontSize: 13, color: AppColors.primaryPurple, fontWeight: FontWeight.w600)),
        ),
      ]),
    );
  }

  Widget _buildMoreOptions(BuildContext context, bool isDark) {
    final options = [
      _OptionData(icon: Icons.bookmark_rounded, label: 'Saved Mistakes', color: AppColors.sunsetGradient),
      _OptionData(icon: Icons.emoji_events_rounded, label: 'Achievements', color: AppColors.primaryGradient),
      _OptionData(icon: Icons.help_outline_rounded, label: 'Help & Support', color: AppColors.mintGradient),
      _OptionData(icon: Icons.privacy_tip_outlined, label: 'Privacy Policy', color: AppColors.blueGradient),
    ];
    return Container(
      decoration: BoxDecoration(
        color: isDark ? AppColors.backgroundCardDark : Colors.white,
        borderRadius: BorderRadius.circular(22),
        boxShadow: [BoxShadow(color: AppColors.shadowDark, blurRadius: 16, offset: const Offset(0, 4))],
      ),
      child: Column(children: options.asMap().entries.map((e) => Column(children: [
        GestureDetector(
          onTap: () {},
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 14),
            child: Row(children: [
              Container(
                width: 38, height: 38,
                decoration: BoxDecoration(gradient: e.value.color, borderRadius: BorderRadius.circular(12)),
                child: Icon(e.value.icon, color: Colors.white, size: 20),
              ),
              const SizedBox(width: 14),
              Expanded(child: Text(e.value.label, style: GoogleFonts.poppins(
                  fontSize: 14, fontWeight: FontWeight.w600,
                  color: isDark ? AppColors.textPrimaryDark : AppColors.textPrimary))),
              Icon(Icons.chevron_right_rounded,
                  color: isDark ? AppColors.textSecondaryDark : AppColors.textHint),
            ]),
          ),
        ),
        if (e.key < options.length - 1) _Divider(isDark: isDark),
      ])).toList()),
    );
  }

  Widget _buildSignOutBtn(BuildContext context) => GestureDetector(
    onTap: () => ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Sign out not implemented')),
    ),
    child: Container(
      width: double.infinity,
      height: 54,
      decoration: BoxDecoration(
        color: AppColors.error.withOpacity(0.1),
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: AppColors.error.withOpacity(0.3)),
      ),
      child: Row(mainAxisAlignment: MainAxisAlignment.center, children: [
        const Icon(Icons.logout_rounded, color: AppColors.error, size: 20),
        const SizedBox(width: 10),
        Text('Sign Out', style: GoogleFonts.poppins(
            fontSize: 15, fontWeight: FontWeight.w700, color: AppColors.error)),
      ]),
    ),
  );
}

class _ProfileStat extends StatelessWidget {
  final String label, value;
  const _ProfileStat({required this.label, required this.value});
  @override
  Widget build(BuildContext context) => Column(children: [
    Text(value, style: GoogleFonts.poppins(
        fontSize: 20, fontWeight: FontWeight.w800, color: Colors.white)),
    Text(label, style: GoogleFonts.poppins(
        fontSize: 11, color: Colors.white.withOpacity(0.7))),
  ]);
}

class _ProfileDivider extends StatelessWidget {
  @override
  Widget build(BuildContext context) => Container(
    width: 1, height: 36, margin: const EdgeInsets.symmetric(horizontal: 24),
    color: Colors.white.withOpacity(0.25),
  );
}

class _SettingsTile extends StatelessWidget {
  final IconData icon;
  final String label;
  final Widget trailing;
  final bool isDark;
  const _SettingsTile({required this.icon, required this.label,
      required this.trailing, required this.isDark});
  @override
  Widget build(BuildContext context) => Padding(
    padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 4),
    child: Row(children: [
      Icon(icon, color: AppColors.primaryPurple, size: 22),
      const SizedBox(width: 14),
      Expanded(child: Text(label, style: GoogleFonts.poppins(
          fontSize: 14, fontWeight: FontWeight.w600,
          color: isDark ? AppColors.textPrimaryDark : AppColors.textPrimary))),
      trailing,
    ]),
  );
}

class _Divider extends StatelessWidget {
  final bool isDark;
  const _Divider({required this.isDark});
  @override
  Widget build(BuildContext context) => Padding(
    padding: const EdgeInsets.symmetric(horizontal: 18),
    child: Divider(height: 1,
        color: isDark ? Colors.white.withOpacity(0.06) : AppColors.backgroundSurface),
  );
}

class _OptionData {
  final IconData icon;
  final String label;
  final LinearGradient color;
  const _OptionData({required this.icon, required this.label, required this.color});
}
