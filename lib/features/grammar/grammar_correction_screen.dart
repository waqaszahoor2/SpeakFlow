import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../core/theme/app_colors.dart';
import '../../core/models/models.dart';

class GrammarCorrectionScreen extends StatelessWidget {
  const GrammarCorrectionScreen({super.key});

  static final _demo = GrammarCorrection(
    original: 'I go to store yesterday to buy some grocery.',
    corrected: 'I went to the store yesterday to buy some groceries.',
    explanation:
        'Two errors were found: (1) "go" should be "went" since this is a past tense sentence. '
        '(2) "store" needs the definite article "the". (3) "grocery" is a mass noun here — use "groceries" (plural).',
    naturalVersion: 'I popped by the store yesterday to pick up some groceries.',
    errors: [
      GrammarError(wrong: 'go', right: 'went', rule: 'Past simple tense'),
      GrammarError(wrong: 'store', right: 'the store', rule: 'Definite article'),
      GrammarError(wrong: 'grocery', right: 'groceries', rule: 'Plural noun'),
    ],
  );

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return Scaffold(
      backgroundColor: isDark ? AppColors.backgroundDark : AppColors.backgroundLight,
      appBar: AppBar(
        leading: IconButton(
          icon: Container(
            width: 38, height: 38,
            decoration: BoxDecoration(
              color: isDark ? Colors.white.withOpacity(0.08) : AppColors.backgroundSurface,
              shape: BoxShape.circle,
            ),
            child: const Icon(Icons.arrow_back_ios_rounded, size: 18),
          ),
          onPressed: () => context.pop(),
        ),
        title: Text('Grammar Correction',
            style: GoogleFonts.poppins(fontSize: 17, fontWeight: FontWeight.w700,
                color: isDark ? AppColors.textPrimaryDark : AppColors.textPrimary)),
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: 16),
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
              decoration: BoxDecoration(
                gradient: AppColors.primaryGradient,
                borderRadius: BorderRadius.circular(20),
              ),
              child: Text('Save', style: GoogleFonts.poppins(
                  fontSize: 13, fontWeight: FontWeight.w600, color: Colors.white)),
            ),
          ),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.fromLTRB(20, 8, 20, 40),
        physics: const BouncingScrollPhysics(),
        children: [
          // ── Original sentence
          _SectionLabel(label: '🗣️ Your Original Sentence', isDark: isDark),
          const SizedBox(height: 10),
          _GrammarCard(
            color: AppColors.grammarError,
            border: AppColors.grammarErrorText.withOpacity(0.25),
            child: _HighlightedText(
              text: _demo.original,
              wrongs: _demo.errors.map((e) => e.wrong).toList(),
              wrongColor: AppColors.grammarErrorText,
              isDark: isDark,
            ),
          ).animate().fadeIn(delay: 100.ms).slideY(begin: 0.2, end: 0),

          const SizedBox(height: 20),

          // ── Corrected sentence
          _SectionLabel(label: '✅ Corrected Sentence', isDark: isDark),
          const SizedBox(height: 10),
          _GrammarCard(
            color: AppColors.grammarCorrect,
            border: AppColors.grammarCorrectText.withOpacity(0.25),
            child: _HighlightedText(
              text: _demo.corrected,
              wrongs: _demo.errors.map((e) => e.right).toList(),
              wrongColor: AppColors.grammarCorrectText,
              isDark: isDark,
            ),
          ).animate().fadeIn(delay: 200.ms).slideY(begin: 0.2, end: 0),

          const SizedBox(height: 20),

          // ── Error breakdown
          _SectionLabel(label: '🔍 Error Breakdown', isDark: isDark),
          const SizedBox(height: 10),
          ..._demo.errors.asMap().entries.map((e) =>
            Padding(
              padding: const EdgeInsets.only(bottom: 10),
              child: _ErrorRow(error: e.value, index: e.key + 1, isDark: isDark)
                  .animate().fadeIn(delay: Duration(milliseconds: 280 + e.key * 80)).slideX(begin: -0.2, end: 0),
            ),
          ),

          const SizedBox(height: 20),

          // ── Explanation
          _SectionLabel(label: '📚 Explanation', isDark: isDark),
          const SizedBox(height: 10),
          _GrammarCard(
            color: isDark ? AppColors.backgroundCardDark : Colors.white,
            border: isDark ? Colors.white.withOpacity(0.08) : AppColors.primaryPurple.withOpacity(0.12),
            child: Text(_demo.explanation,
              style: GoogleFonts.poppins(fontSize: 14, color: isDark
                  ? AppColors.textPrimaryDark : AppColors.textPrimary, height: 1.6)),
          ).animate().fadeIn(delay: 450.ms).slideY(begin: 0.2, end: 0),

          const SizedBox(height: 20),

          // ── More Natural Version
          _SectionLabel(label: '💬 More Natural Version', isDark: isDark),
          const SizedBox(height: 10),
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              gradient: AppColors.primaryGradient,
              borderRadius: BorderRadius.circular(20),
              boxShadow: [BoxShadow(color: AppColors.shadowPurple, blurRadius: 20, offset: const Offset(0, 8))],
            ),
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Row(children: [
                const Text('✨', style: TextStyle(fontSize: 18)),
                const SizedBox(width: 8),
                Text('Native Speaker Version',
                    style: GoogleFonts.poppins(fontSize: 13, fontWeight: FontWeight.w600,
                        color: Colors.white.withOpacity(0.8))),
              ]),
              const SizedBox(height: 10),
              Text('"${_demo.naturalVersion}"',
                style: GoogleFonts.poppins(fontSize: 16, fontWeight: FontWeight.w600,
                    color: Colors.white, fontStyle: FontStyle.italic, height: 1.4)),
            ]),
          ).animate().fadeIn(delay: 550.ms).slideY(begin: 0.2, end: 0),

          const SizedBox(height: 24),

          // ── Action buttons
          Row(children: [
            Expanded(child: _OutlineBtn(
              label: 'Practice Again',
              icon: Icons.refresh_rounded,
              onTap: () => context.pop(),
              isDark: isDark,
            )),
            const SizedBox(width: 12),
            Expanded(child: _GradientBtn(
              label: 'Save Mistake',
              icon: Icons.bookmark_add_rounded,
              onTap: () {},
            )),
          ]).animate().fadeIn(delay: 650.ms),
        ],
      ),
    );
  }
}

class _SectionLabel extends StatelessWidget {
  final String label;
  final bool isDark;
  const _SectionLabel({required this.label, required this.isDark});

  @override
  Widget build(BuildContext context) => Text(label,
    style: GoogleFonts.poppins(fontSize: 14, fontWeight: FontWeight.w700,
        color: isDark ? AppColors.textPrimaryDark : AppColors.textPrimary));
}

class _GrammarCard extends StatelessWidget {
  final Widget child;
  final Color color;
  final Color border;
  const _GrammarCard({required this.child, required this.color, required this.border});

  @override
  Widget build(BuildContext context) => Container(
    width: double.infinity,
    padding: const EdgeInsets.all(18),
    decoration: BoxDecoration(
      color: color,
      borderRadius: BorderRadius.circular(18),
      border: Border.all(color: border, width: 1.2),
    ),
    child: child,
  );
}

class _HighlightedText extends StatelessWidget {
  final String text;
  final List<String> wrongs;
  final Color wrongColor;
  final bool isDark;
  const _HighlightedText({required this.text, required this.wrongs,
      required this.wrongColor, required this.isDark});

  @override
  Widget build(BuildContext context) {
    final words = text.split(' ');
    return Wrap(spacing: 4, runSpacing: 4, children: words.map((w) {
      final clean = w.replaceAll(RegExp(r'[.,!?]'), '');
      final isWrong = wrongs.any((x) => x.toLowerCase() == clean.toLowerCase());
      return Container(
        padding: isWrong ? const EdgeInsets.symmetric(horizontal: 6, vertical: 2) : EdgeInsets.zero,
        decoration: isWrong ? BoxDecoration(
          color: wrongColor.withOpacity(0.15),
          borderRadius: BorderRadius.circular(6),
          border: Border.all(color: wrongColor.withOpacity(0.4)),
        ) : null,
        child: Text(w,
          style: GoogleFonts.poppins(fontSize: 15, fontWeight: FontWeight.w500,
            color: isWrong ? wrongColor : (isDark ? AppColors.textPrimaryDark : AppColors.textPrimary),
            decoration: isWrong ? TextDecoration.underline : null,
            decorationColor: wrongColor,
          )),
      );
    }).toList());
  }
}

class _ErrorRow extends StatelessWidget {
  final GrammarError error;
  final int index;
  final bool isDark;
  const _ErrorRow({required this.error, required this.index, required this.isDark});

  @override
  Widget build(BuildContext context) => Container(
    padding: const EdgeInsets.all(14),
    decoration: BoxDecoration(
      color: isDark ? AppColors.backgroundCardDark : Colors.white,
      borderRadius: BorderRadius.circular(16),
      border: Border.all(color: isDark ? Colors.white.withOpacity(0.06) : AppColors.backgroundSurface),
      boxShadow: [BoxShadow(color: AppColors.shadowDark, blurRadius: 10)],
    ),
    child: Row(children: [
      Container(
        width: 28, height: 28,
        decoration: BoxDecoration(gradient: AppColors.primaryGradient, shape: BoxShape.circle),
        child: Center(child: Text('$index',
          style: GoogleFonts.poppins(fontSize: 12, fontWeight: FontWeight.w700, color: Colors.white))),
      ),
      const SizedBox(width: 12),
      Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Row(children: [
          Container(padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
            decoration: BoxDecoration(color: AppColors.grammarError, borderRadius: BorderRadius.circular(6)),
            child: Text(error.wrong, style: GoogleFonts.poppins(fontSize: 13, fontWeight: FontWeight.w600,
                color: AppColors.grammarErrorText))),
          const Padding(padding: EdgeInsets.symmetric(horizontal: 8),
            child: Icon(Icons.arrow_forward_rounded, size: 14, color: AppColors.textHint)),
          Container(padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
            decoration: BoxDecoration(color: AppColors.grammarCorrect, borderRadius: BorderRadius.circular(6)),
            child: Text(error.right, style: GoogleFonts.poppins(fontSize: 13, fontWeight: FontWeight.w600,
                color: AppColors.grammarCorrectText))),
        ]),
        const SizedBox(height: 4),
        Text(error.rule, style: GoogleFonts.poppins(fontSize: 11, color: AppColors.textSecondary)),
      ])),
    ]),
  );
}

class _GradientBtn extends StatelessWidget {
  final String label;
  final IconData icon;
  final VoidCallback onTap;
  const _GradientBtn({required this.label, required this.icon, required this.onTap});

  @override
  Widget build(BuildContext context) => GestureDetector(
    onTap: onTap,
    child: Container(
      height: 52,
      decoration: BoxDecoration(
        gradient: AppColors.primaryGradient,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [BoxShadow(color: AppColors.shadowPurple, blurRadius: 16, offset: const Offset(0, 6))],
      ),
      child: Row(mainAxisAlignment: MainAxisAlignment.center, children: [
        Icon(icon, color: Colors.white, size: 18),
        const SizedBox(width: 8),
        Text(label, style: GoogleFonts.poppins(fontSize: 13, fontWeight: FontWeight.w700, color: Colors.white)),
      ]),
    ),
  );
}

class _OutlineBtn extends StatelessWidget {
  final String label;
  final IconData icon;
  final VoidCallback onTap;
  final bool isDark;
  const _OutlineBtn({required this.label, required this.icon, required this.onTap, required this.isDark});

  @override
  Widget build(BuildContext context) => GestureDetector(
    onTap: onTap,
    child: Container(
      height: 52,
      decoration: BoxDecoration(
        color: isDark ? AppColors.backgroundCardDark : Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.primaryPurple.withOpacity(0.4)),
      ),
      child: Row(mainAxisAlignment: MainAxisAlignment.center, children: [
        Icon(icon, color: AppColors.primaryPurple, size: 18),
        const SizedBox(width: 8),
        Text(label, style: GoogleFonts.poppins(fontSize: 13, fontWeight: FontWeight.w700,
            color: AppColors.primaryPurple)),
      ]),
    ),
  );
}
