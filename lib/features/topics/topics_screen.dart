import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../core/theme/app_colors.dart';
import '../../core/models/models.dart';

class TopicsScreen extends StatefulWidget {
  const TopicsScreen({super.key});
  @override
  State<TopicsScreen> createState() => _TopicsScreenState();
}

class _TopicsScreenState extends State<TopicsScreen> {
  final _searchCtrl = TextEditingController();
  String _filter = 'All';
  String _query = '';

  static const _filters = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  static const _topics = [
    PracticeTopicModel(
      id: '1', title: 'Daily Conversation', subtitle: 'Greetings, small talk & daily routines',
      emoji: '☀️', totalLessons: 20, completedLessons: 14, difficulty: 'Beginner',
      tags: ['Beginner'], gradientType: 'primary',
    ),
    PracticeTopicModel(
      id: '2', title: 'IELTS Speaking', subtitle: 'Band 7+ speaking strategies & practice',
      emoji: '🎓', totalLessons: 30, completedLessons: 8, difficulty: 'Advanced',
      tags: ['Advanced'], gradientType: 'blue',
    ),
    PracticeTopicModel(
      id: '3', title: 'Job Interview', subtitle: 'Professional answers for HR & technical rounds',
      emoji: '💼', totalLessons: 18, completedLessons: 5, difficulty: 'Intermediate',
      tags: ['Intermediate'], gradientType: 'mint',
    ),
    PracticeTopicModel(
      id: '4', title: 'Travel English', subtitle: 'Airports, hotels, restaurants & navigation',
      emoji: '✈️', totalLessons: 15, completedLessons: 15, difficulty: 'Beginner',
      tags: ['Beginner'], gradientType: 'sunset',
    ),
    PracticeTopicModel(
      id: '5', title: 'Education', subtitle: 'Academic presentations, debates & essays',
      emoji: '📚', totalLessons: 22, completedLessons: 10, difficulty: 'Intermediate',
      tags: ['Intermediate'], gradientType: 'rose',
    ),
    PracticeTopicModel(
      id: '6', title: 'Business English', subtitle: 'Meetings, emails, negotiations & pitches',
      emoji: '📊', totalLessons: 25, completedLessons: 3, difficulty: 'Advanced',
      tags: ['Advanced'], gradientType: 'primary',
    ),
    PracticeTopicModel(
      id: '7', title: 'Health & Medical', subtitle: 'Doctor visits, symptoms & health discussion',
      emoji: '🏥', totalLessons: 12, completedLessons: 0, difficulty: 'Beginner',
      tags: ['Beginner'], gradientType: 'mint',
    ),
    PracticeTopicModel(
      id: '8', title: 'Social Media', subtitle: 'Modern slang, trends & online communication',
      emoji: '📱', totalLessons: 10, completedLessons: 7, difficulty: 'Intermediate',
      tags: ['Intermediate'], gradientType: 'blue',
    ),
  ];

  List<PracticeTopicModel> get _filtered => _topics.where((t) {
    final matchesFilter = _filter == 'All' || t.difficulty == _filter;
    final matchesSearch = _query.isEmpty ||
        t.title.toLowerCase().contains(_query.toLowerCase()) ||
        t.subtitle.toLowerCase().contains(_query.toLowerCase());
    return matchesFilter && matchesSearch;
  }).toList();

  LinearGradient _gradient(String type) {
    switch (type) {
      case 'blue': return AppColors.blueGradient;
      case 'mint': return AppColors.mintGradient;
      case 'sunset': return AppColors.sunsetGradient;
      case 'rose': return AppColors.roseGradient;
      default: return AppColors.primaryGradient;
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return Scaffold(
      backgroundColor: isDark ? AppColors.backgroundDark : AppColors.backgroundLight,
      body: CustomScrollView(
        physics: const BouncingScrollPhysics(),
        slivers: [
          SliverToBoxAdapter(child: _buildHeader(isDark)),
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(20, 16, 20, 0),
              child: _buildSearchBar(isDark),
            ).animate().fadeIn(delay: 150.ms),
          ),
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(20, 14, 0, 0),
              child: _buildFilterTabs(isDark),
            ).animate().fadeIn(delay: 200.ms),
          ),
          SliverPadding(
            padding: const EdgeInsets.fromLTRB(20, 16, 20, 0),
            sliver: SliverList(
              delegate: SliverChildBuilderDelegate(
                (_, i) => Padding(
                  padding: const EdgeInsets.only(bottom: 14),
                  child: _TopicCard(
                    topic: _filtered[i],
                    gradient: _gradient(_filtered[i].gradientType),
                    isDark: isDark,
                    onTap: () => context.push('/conversation'),
                  ).animate().fadeIn(delay: Duration(milliseconds: 250 + i * 70)).slideY(begin: 0.3, end: 0),
                ),
                childCount: _filtered.length,
              ),
            ),
          ),
          const SliverToBoxAdapter(child: SizedBox(height: 110)),
        ],
      ),
    );
  }

  Widget _buildHeader(bool isDark) => Container(
    padding: EdgeInsets.fromLTRB(20, MediaQuery.of(context).padding.top + 16, 20, 24),
    decoration: const BoxDecoration(
      gradient: AppColors.primaryGradient,
      borderRadius: BorderRadius.only(
        bottomLeft: Radius.circular(32),
        bottomRight: Radius.circular(32),
      ),
    ),
    child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Text('Practice Topics', style: GoogleFonts.poppins(
          fontSize: 26, fontWeight: FontWeight.w800, color: Colors.white)),
      const SizedBox(height: 4),
      Text('Choose a topic and start speaking! 🚀', style: GoogleFonts.poppins(
          fontSize: 14, color: Colors.white.withOpacity(0.8))),
    ]),
  ).animate().fadeIn(duration: 500.ms).slideY(begin: -0.2, end: 0);

  Widget _buildSearchBar(bool isDark) => Container(
    decoration: BoxDecoration(
      color: isDark ? AppColors.backgroundCardDark : Colors.white,
      borderRadius: BorderRadius.circular(18),
      boxShadow: [BoxShadow(color: AppColors.shadowDark, blurRadius: 16, offset: const Offset(0, 4))],
    ),
    child: TextField(
      controller: _searchCtrl,
      onChanged: (v) => setState(() => _query = v),
      style: GoogleFonts.poppins(fontSize: 14,
          color: isDark ? AppColors.textPrimaryDark : AppColors.textPrimary),
      decoration: InputDecoration(
        hintText: 'Search topics...',
        hintStyle: GoogleFonts.poppins(fontSize: 14, color: AppColors.textHint),
        prefixIcon: const Icon(Icons.search_rounded, color: AppColors.textHint),
        suffixIcon: _query.isNotEmpty
            ? IconButton(
                icon: const Icon(Icons.clear_rounded, color: AppColors.textHint),
                onPressed: () { _searchCtrl.clear(); setState(() => _query = ''); })
            : null,
        border: InputBorder.none,
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      ),
    ),
  );

  Widget _buildFilterTabs(bool isDark) => SingleChildScrollView(
    scrollDirection: Axis.horizontal,
    padding: const EdgeInsets.only(right: 20),
    child: Row(
      children: _filters.map((f) {
        final selected = _filter == f;
        return Padding(
          padding: const EdgeInsets.only(right: 10),
          child: GestureDetector(
            onTap: () => setState(() => _filter = f),
            child: AnimatedContainer(
              duration: const Duration(milliseconds: 250),
              padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 9),
              decoration: BoxDecoration(
                gradient: selected ? AppColors.primaryGradient : null,
                color: selected ? null : isDark ? AppColors.backgroundCardDark : Colors.white,
                borderRadius: BorderRadius.circular(24),
                boxShadow: selected ? [BoxShadow(color: AppColors.shadowPurple, blurRadius: 12)] : null,
                border: selected ? null : Border.all(
                    color: isDark ? Colors.white.withOpacity(0.1) : AppColors.backgroundSurface),
              ),
              child: Text(f, style: GoogleFonts.poppins(
                fontSize: 13, fontWeight: FontWeight.w600,
                color: selected ? Colors.white
                    : isDark ? AppColors.textSecondaryDark : AppColors.textSecondary,
              )),
            ),
          ),
        );
      }).toList(),
    ),
  );
}

class _TopicCard extends StatelessWidget {
  final PracticeTopicModel topic;
  final LinearGradient gradient;
  final bool isDark;
  final VoidCallback onTap;
  const _TopicCard({required this.topic, required this.gradient,
      required this.isDark, required this.onTap});

  @override
  Widget build(BuildContext context) => GestureDetector(
    onTap: onTap,
    child: Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: isDark ? AppColors.backgroundCardDark : Colors.white,
        borderRadius: BorderRadius.circular(22),
        boxShadow: [BoxShadow(color: AppColors.shadowDark, blurRadius: 16, offset: const Offset(0, 4))],
      ),
      child: Row(children: [
        Container(
          width: 60, height: 60,
          decoration: BoxDecoration(
            gradient: gradient,
            borderRadius: BorderRadius.circular(18),
            boxShadow: [BoxShadow(color: AppColors.shadowPurple, blurRadius: 12, offset: const Offset(0, 4))],
          ),
          child: Center(child: Text(topic.emoji, style: const TextStyle(fontSize: 28))),
        ),
        const SizedBox(width: 14),
        Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Row(children: [
            Expanded(child: Text(topic.title,
              style: GoogleFonts.poppins(fontSize: 15, fontWeight: FontWeight.w700,
                  color: isDark ? AppColors.textPrimaryDark : AppColors.textPrimary))),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
              decoration: BoxDecoration(
                color: _difficultyColor(topic.difficulty).withOpacity(0.15),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Text(topic.difficulty, style: GoogleFonts.poppins(
                  fontSize: 10, fontWeight: FontWeight.w600,
                  color: _difficultyColor(topic.difficulty))),
            ),
          ]),
          const SizedBox(height: 4),
          Text(topic.subtitle, maxLines: 2, overflow: TextOverflow.ellipsis,
            style: GoogleFonts.poppins(fontSize: 12, color: AppColors.textSecondary, height: 1.4)),
          const SizedBox(height: 10),
          Row(children: [
            Expanded(child: ClipRRect(
              borderRadius: BorderRadius.circular(4),
              child: LinearProgressIndicator(
                value: topic.progress,
                minHeight: 6,
                backgroundColor: isDark ? Colors.white.withOpacity(0.08) : AppColors.backgroundSurface,
                valueColor: AlwaysStoppedAnimation<Color>(gradient.colors.first),
              ),
            )),
            const SizedBox(width: 10),
            Text('${topic.completedLessons}/${topic.totalLessons}',
              style: GoogleFonts.poppins(fontSize: 11, fontWeight: FontWeight.w600,
                  color: isDark ? AppColors.textSecondaryDark : AppColors.textSecondary)),
          ]),
        ])),
        const SizedBox(width: 10),
        Container(
          width: 36, height: 36,
          decoration: BoxDecoration(gradient: gradient, shape: BoxShape.circle),
          child: const Icon(Icons.play_arrow_rounded, color: Colors.white, size: 20),
        ),
      ]),
    ),
  );

  Color _difficultyColor(String d) {
    switch (d) {
      case 'Advanced': return AppColors.error;
      case 'Intermediate': return AppColors.warning;
      default: return AppColors.success;
    }
  }
}
