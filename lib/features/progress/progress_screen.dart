import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:fl_chart/fl_chart.dart';
import '../../core/theme/app_colors.dart';
import '../../core/models/models.dart';
import '../../core/models/user_model.dart';

class ProgressScreen extends StatelessWidget {
  const ProgressScreen({super.key});

  static const _weeklyScores = [
    WeeklyScore(day: 'Mon', score: 72, minutes: 18),
    WeeklyScore(day: 'Tue', score: 85, minutes: 25),
    WeeklyScore(day: 'Wed', score: 60, minutes: 12),
    WeeklyScore(day: 'Thu', score: 90, minutes: 30),
    WeeklyScore(day: 'Fri', score: 78, minutes: 22),
    WeeklyScore(day: 'Sat', score: 95, minutes: 35),
    WeeklyScore(day: 'Sun', score: 88, minutes: 28),
  ];

  static const _achievements = [
    Achievement(id: 'first_lesson', title: 'First Steps', description: 'Complete your first lesson', emoji: '🎯', unlocked: true),
    Achievement(id: 'week_streak', title: 'Week Warrior', description: '7-day streak achieved', emoji: '🔥', unlocked: true),
    Achievement(id: 'grammar_master', title: 'Grammar Pro', description: 'Fix 50 grammar mistakes', emoji: '📝', unlocked: true),
    Achievement(id: 'speed_talker', title: 'Speed Talker', description: 'Speak 500 sentences', emoji: '⚡', unlocked: false),
    Achievement(id: 'vocab_king', title: 'Vocab King', description: 'Learn 200 new words', emoji: '👑', unlocked: false),
    Achievement(id: 'fluency_god', title: 'Fluency God', description: 'Reach 95% accuracy', emoji: '🌟', unlocked: false),
  ];

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final user = UserModel.demo();

    return Scaffold(
      backgroundColor: isDark ? AppColors.backgroundDark : AppColors.backgroundLight,
      body: CustomScrollView(
        physics: const BouncingScrollPhysics(),
        slivers: [
          // ── Header
          SliverToBoxAdapter(child: _buildHeader(context, isDark)),

          // ── Stats Row
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(20, 20, 20, 0),
              child: _buildStatsRow(isDark),
            ).animate().fadeIn(delay: 150.ms).slideY(begin: 0.3, end: 0),
          ),

          // ── Weekly Chart
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(20, 20, 20, 0),
              child: _buildWeeklyChart(isDark),
            ).animate().fadeIn(delay: 250.ms).slideY(begin: 0.3, end: 0),
          ),

          // ── Streak Calendar
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(20, 20, 20, 0),
              child: _buildStreakCalendar(isDark, user),
            ).animate().fadeIn(delay: 350.ms).slideY(begin: 0.3, end: 0),
          ),

          // ── Achievements
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(20, 24, 20, 8),
              child: Text('Achievements 🏆',
                  style: Theme.of(context).textTheme.headlineMedium),
            ).animate().fadeIn(delay: 400.ms),
          ),
          SliverPadding(
            padding: const EdgeInsets.symmetric(horizontal: 20),
            sliver: SliverGrid(
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 3,
                crossAxisSpacing: 12,
                mainAxisSpacing: 12,
                childAspectRatio: 0.85,
              ),
              delegate: SliverChildBuilderDelegate(
                (_, i) => _AchievementCard(
                  achievement: _achievements[i],
                  isDark: isDark,
                ).animate().fadeIn(delay: Duration(milliseconds: 450 + i * 60)).scale(
                    begin: const Offset(0.8, 0.8), end: const Offset(1, 1)),
                childCount: _achievements.length,
              ),
            ),
          ),

          const SliverToBoxAdapter(child: SizedBox(height: 110)),
        ],
      ),
    );
  }

  Widget _buildHeader(BuildContext context, bool isDark) {
    return Container(
      padding: EdgeInsets.fromLTRB(20, MediaQuery.of(context).padding.top + 16, 20, 24),
      decoration: const BoxDecoration(
        gradient: AppColors.primaryGradient,
        borderRadius: BorderRadius.only(
          bottomLeft: Radius.circular(32),
          bottomRight: Radius.circular(32),
        ),
      ),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Text('Your Progress', style: GoogleFonts.poppins(
            fontSize: 26, fontWeight: FontWeight.w800, color: Colors.white)),
        const SizedBox(height: 4),
        Text('Keep going — you\'re on fire! 🔥', style: GoogleFonts.poppins(
            fontSize: 14, color: Colors.white.withOpacity(0.8))),
      ]),
    ).animate().fadeIn(duration: 500.ms).slideY(begin: -0.2, end: 0);
  }

  Widget _buildStatsRow(bool isDark) {
    final stats = [
      _StatData(label: 'Accuracy', value: '87%', emoji: '🎯', gradient: AppColors.primaryGradient),
      _StatData(label: 'Speak Time', value: '4.2h', emoji: '⏱️', gradient: AppColors.blueGradient),
      _StatData(label: 'Vocab', value: '284', emoji: '📖', gradient: AppColors.mintGradient),
      _StatData(label: 'Streak', value: '14d', emoji: '🔥', gradient: AppColors.sunsetGradient),
    ];
    return Row(
      children: stats.asMap().entries.map((e) => Expanded(
        child: Padding(
          padding: EdgeInsets.only(left: e.key == 0 ? 0 : 10),
          child: _StatCard(data: e.value, isDark: isDark),
        ),
      )).toList(),
    );
  }

  Widget _buildWeeklyChart(bool isDark) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: isDark ? AppColors.backgroundCardDark : Colors.white,
        borderRadius: BorderRadius.circular(24),
        boxShadow: [BoxShadow(color: AppColors.shadowDark, blurRadius: 20, offset: const Offset(0, 4))],
      ),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Row(children: [
          const Text('📊', style: TextStyle(fontSize: 20)),
          const SizedBox(width: 8),
          Text('Weekly Speaking Score', style: GoogleFonts.poppins(
              fontSize: 15, fontWeight: FontWeight.w700,
              color: isDark ? AppColors.textPrimaryDark : AppColors.textPrimary)),
          const Spacer(),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
            decoration: BoxDecoration(
              gradient: AppColors.primaryGradient,
              borderRadius: BorderRadius.circular(8),
            ),
            child: Text('This Week', style: GoogleFonts.poppins(
                fontSize: 11, fontWeight: FontWeight.w600, color: Colors.white)),
          ),
        ]),
        const SizedBox(height: 20),
        SizedBox(
          height: 160,
          child: BarChart(
            BarChartData(
              alignment: BarChartAlignment.spaceAround,
              maxY: 100,
              barTouchData: BarTouchData(
                touchTooltipData: BarTouchTooltipData(
                  tooltipBgColor: AppColors.primaryPurple,
                  getTooltipItem: (group, groupIndex, rod, rodIndex) =>
                    BarTooltipItem(
                      '${rod.toY.round()}%',
                      GoogleFonts.poppins(color: Colors.white, fontWeight: FontWeight.w600, fontSize: 12),
                    ),
                ),
              ),
              titlesData: FlTitlesData(
                show: true,
                bottomTitles: AxisTitles(sideTitles: SideTitles(
                  showTitles: true,
                  getTitlesWidget: (value, meta) => Padding(
                    padding: const EdgeInsets.only(top: 6),
                    child: Text(_weeklyScores[value.toInt()].day,
                      style: GoogleFonts.poppins(fontSize: 11,
                          color: isDark ? AppColors.textSecondaryDark : AppColors.textSecondary)),
                  ),
                )),
                leftTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
                topTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
                rightTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
              ),
              gridData: FlGridData(
                show: true,
                drawVerticalLine: false,
                horizontalInterval: 25,
                getDrawingHorizontalLine: (_) => FlLine(
                  color: isDark ? Colors.white.withOpacity(0.06) : AppColors.backgroundSurface,
                  strokeWidth: 1,
                ),
              ),
              borderData: FlBorderData(show: false),
              barGroups: _weeklyScores.asMap().entries.map((e) =>
                BarChartGroupData(x: e.key, barRods: [
                  BarChartRodData(
                    toY: e.value.score,
                    width: 22,
                    borderRadius: const BorderRadius.only(
                      topLeft: Radius.circular(8), topRight: Radius.circular(8)),
                    gradient: e.value.score >= 85
                        ? AppColors.primaryGradient
                        : const LinearGradient(
                            colors: [Color(0xFFB39DDB), Color(0xFF9575CD)],
                            begin: Alignment.bottomCenter, end: Alignment.topCenter),
                  ),
                ])).toList(),
            ),
          ),
        ),
      ]),
    );
  }

  Widget _buildStreakCalendar(bool isDark, UserModel user) {
    final today = DateTime.now();
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: isDark ? AppColors.backgroundCardDark : Colors.white,
        borderRadius: BorderRadius.circular(24),
        boxShadow: [BoxShadow(color: AppColors.shadowDark, blurRadius: 20, offset: const Offset(0, 4))],
      ),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Row(children: [
          const Text('🗓️', style: TextStyle(fontSize: 20)),
          const SizedBox(width: 8),
          Text('Activity Calendar', style: GoogleFonts.poppins(
              fontSize: 15, fontWeight: FontWeight.w700,
              color: isDark ? AppColors.textPrimaryDark : AppColors.textPrimary)),
          const Spacer(),
          Text('${user.streakDays} day streak 🔥',
              style: GoogleFonts.poppins(fontSize: 12, fontWeight: FontWeight.w600,
                  color: AppColors.primaryPurple)),
        ]),
        const SizedBox(height: 16),
        GridView.builder(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 7, mainAxisSpacing: 6, crossAxisSpacing: 6),
          itemCount: 28,
          itemBuilder: (_, i) {
            final isActive = i < user.streakDays.clamp(0, 28);
            final isToday = i == today.day - 1;
            return Container(
              decoration: BoxDecoration(
                gradient: isActive ? AppColors.primaryGradient : null,
                color: isActive ? null : isDark
                    ? Colors.white.withOpacity(0.06) : AppColors.backgroundSurface,
                borderRadius: BorderRadius.circular(8),
                border: isToday ? Border.all(color: AppColors.primaryPurple, width: 2) : null,
                boxShadow: isActive ? [BoxShadow(color: AppColors.shadowPurple, blurRadius: 6)] : null,
              ),
              child: isActive ? const Icon(Icons.check_rounded, color: Colors.white, size: 12) : null,
            );
          },
        ),
      ]),
    );
  }
}

class _StatData {
  final String label, value, emoji;
  final LinearGradient gradient;
  const _StatData({required this.label, required this.value, required this.emoji, required this.gradient});
}

class _StatCard extends StatelessWidget {
  final _StatData data;
  final bool isDark;
  const _StatCard({required this.data, required this.isDark});

  @override
  Widget build(BuildContext context) => Container(
    padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 10),
    decoration: BoxDecoration(
      gradient: data.gradient,
      borderRadius: BorderRadius.circular(18),
      boxShadow: [BoxShadow(color: AppColors.shadowPurple, blurRadius: 14, offset: const Offset(0, 6))],
    ),
    child: Column(children: [
      Text(data.emoji, style: const TextStyle(fontSize: 22)),
      const SizedBox(height: 6),
      Text(data.value, style: GoogleFonts.poppins(fontSize: 16, fontWeight: FontWeight.w800, color: Colors.white)),
      Text(data.label, style: GoogleFonts.poppins(fontSize: 10, color: Colors.white.withOpacity(0.8))),
    ]),
  );
}

class _AchievementCard extends StatelessWidget {
  final Achievement achievement;
  final bool isDark;
  const _AchievementCard({required this.achievement, required this.isDark});

  @override
  Widget build(BuildContext context) => Container(
    padding: const EdgeInsets.all(12),
    decoration: BoxDecoration(
      color: achievement.unlocked
          ? null : isDark ? AppColors.backgroundCardDark : Colors.white,
      gradient: achievement.unlocked ? AppColors.primaryGradient : null,
      borderRadius: BorderRadius.circular(18),
      border: achievement.unlocked ? null : Border.all(
          color: isDark ? Colors.white.withOpacity(0.08) : AppColors.backgroundSurface),
      boxShadow: [BoxShadow(
          color: achievement.unlocked ? AppColors.shadowPurple : AppColors.shadowDark,
          blurRadius: 12, offset: const Offset(0, 4))],
    ),
    child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
      Stack(alignment: Alignment.center, children: [
        Text(achievement.emoji, style: TextStyle(
            fontSize: 28, color: achievement.unlocked ? null : Colors.grey)),
        if (!achievement.unlocked)
          Container(
            width: 38, height: 38,
            decoration: BoxDecoration(
              color: isDark ? Colors.black.withOpacity(0.4) : Colors.white.withOpacity(0.7),
              shape: BoxShape.circle,
            ),
            child: const Icon(Icons.lock_rounded, color: AppColors.textHint, size: 16),
          ),
      ]),
      const SizedBox(height: 6),
      Text(achievement.title, textAlign: TextAlign.center,
        style: GoogleFonts.poppins(fontSize: 11, fontWeight: FontWeight.w700,
            color: achievement.unlocked ? Colors.white
                : isDark ? AppColors.textPrimaryDark : AppColors.textPrimary)),
    ]),
  );
}
