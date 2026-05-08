import 'dart:math';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../core/theme/app_colors.dart';
import '../../core/models/models.dart';
import '../../core/services/gemini_service.dart';

class ConversationScreen extends StatefulWidget {
  const ConversationScreen({super.key});
  @override
  State<ConversationScreen> createState() => _ConversationScreenState();
}

class _ConversationScreenState extends State<ConversationScreen>
    with TickerProviderStateMixin {
  final _textCtrl   = TextEditingController();
  final _scrollCtrl = ScrollController();
  final _gemini     = GeminiService();
  final List<ChatMessage> _messages = [];

  bool _isListening = false;
  bool _isAITyping  = false;
  GrammarCorrection? _lastCorrection;

  late AnimationController _rippleCtrl;
  late AnimationController _waveCtrl;
  late Animation<double>   _ripple;

  @override
  void initState() {
    super.initState();
    _rippleCtrl = AnimationController(vsync: this, duration: 1000.ms)..repeat();
    _waveCtrl   = AnimationController(vsync: this, duration: 700.ms)..repeat(reverse: true);
    _ripple     = Tween<double>(begin: 1.0, end: 1.6)
        .animate(CurvedAnimation(parent: _rippleCtrl, curve: Curves.easeOut));

    // Trigger initial AI greeting
    Future.delayed(600.ms, _sendGreeting);
  }

  @override
  void dispose() {
    _rippleCtrl.dispose();
    _waveCtrl.dispose();
    _textCtrl.dispose();
    _scrollCtrl.dispose();
    super.dispose();
  }

  // ── Greeting ─────────────────────────────────────────────────────────────
  Future<void> _sendGreeting() async {
    await _callGemini("Hello! Please introduce yourself as my English tutor.");
  }

  // ── Send user message ────────────────────────────────────────────────────
  Future<void> _sendUser(String text) async {
    if (text.trim().isEmpty) return;
    _textCtrl.clear();

    setState(() {
      _messages.add(ChatMessage(
        id: '${DateTime.now().millisecondsSinceEpoch}',
        text: text.trim(),
        role: MessageRole.user,
        timestamp: DateTime.now(),
      ));
    });
    _scrollDown();
    await _callGemini(text.trim());
  }

  // ── Call Gemini API ───────────────────────────────────────────────────────
  Future<void> _callGemini(String userText) async {
    setState(() => _isAITyping = true);
    _scrollDown();

    try {
      final response = await _gemini.sendMessage(userText);

      GrammarCorrection? correction;
      if (response.hasCorrection) {
        final c = response.correction!;
        correction = GrammarCorrection(
          original: c.original,
          corrected: c.corrected,
          explanation: c.explanation,
          naturalVersion: c.naturalVersion,
        );
        _lastCorrection = correction;
      }

      if (!mounted) return;
      setState(() {
        _isAITyping = false;
        _messages.add(ChatMessage(
          id: '${DateTime.now().millisecondsSinceEpoch}',
          text: response.text,
          role: MessageRole.ai,
          timestamp: DateTime.now(),
          grammarCorrection: correction,
          hasAudio: true,
        ));
      });
    } on GeminiException catch (e) {
      if (!mounted) return;
      setState(() {
        _isAITyping = false;
        _messages.add(ChatMessage(
          id: '${DateTime.now().millisecondsSinceEpoch}',
          text: '⚠️ ${e.message}',
          role: MessageRole.ai,
          timestamp: DateTime.now(),
        ));
      });
    }
    _scrollDown();
  }

  // ── Mic toggle (simulated STT) ────────────────────────────────────────────
  void _toggleMic() {
    setState(() => _isListening = !_isListening);
    if (_isListening) {
      Future.delayed(3.seconds, () {
        if (mounted && _isListening) {
          setState(() => _isListening = false);
          _sendUser('I go to store yesterday to buy some grocery.');
        }
      });
    }
  }

  void _scrollDown() => Future.delayed(120.ms, () {
    if (_scrollCtrl.hasClients) {
      _scrollCtrl.animateTo(
        _scrollCtrl.position.maxScrollExtent,
        duration: 400.ms,
        curve: Curves.easeOutCubic,
      );
    }
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return Scaffold(
      backgroundColor: isDark ? AppColors.backgroundDark : AppColors.backgroundLight,
      appBar: _appBar(context, isDark),
      body: Column(children: [
        Expanded(child: _messageList(isDark)),
        _inputBar(isDark),
      ]),
    );
  }

  // ── AppBar ────────────────────────────────────────────────────────────────
  PreferredSizeWidget _appBar(BuildContext context, bool isDark) => AppBar(
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
    title: Row(children: [
      Container(
        width: 40, height: 40,
        decoration: BoxDecoration(
          gradient: AppColors.primaryGradient,
          shape: BoxShape.circle,
          boxShadow: [BoxShadow(color: AppColors.shadowPurple, blurRadius: 12)],
        ),
        child: const Center(child: Text('🤖', style: TextStyle(fontSize: 20))),
      ),
      const SizedBox(width: 10),
      Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Text('AI English Tutor', style: GoogleFonts.poppins(
            fontSize: 15, fontWeight: FontWeight.w700,
            color: isDark ? AppColors.textPrimaryDark : AppColors.textPrimary)),
        Row(children: [
          Container(width: 7, height: 7,
              decoration: const BoxDecoration(color: AppColors.success, shape: BoxShape.circle)),
          const SizedBox(width: 4),
          Text('Powered by Gemini', style: GoogleFonts.poppins(fontSize: 11, color: AppColors.success)),
        ]),
      ]),
    ]),
    actions: [
      IconButton(
        icon: const Icon(Icons.refresh_rounded),
        tooltip: 'Reset conversation',
        onPressed: () {
          _gemini.resetChat();
          setState(() { _messages.clear(); _lastCorrection = null; });
          Future.delayed(400.ms, _sendGreeting);
        },
      ),
    ],
  );

  // ── Message list ──────────────────────────────────────────────────────────
  Widget _messageList(bool isDark) => _messages.isEmpty && !_isAITyping
      ? Center(
          child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
            const Text('🤖', style: TextStyle(fontSize: 56))
                .animate().scale(begin: const Offset(0.5, 0.5), duration: 600.ms, curve: Curves.elasticOut),
            const SizedBox(height: 12),
            Text('Starting conversation…',
                style: GoogleFonts.poppins(fontSize: 15, color: AppColors.textSecondary)),
          ]),
        )
      : ListView.builder(
          controller: _scrollCtrl,
          padding: const EdgeInsets.fromLTRB(16, 12, 16, 8),
          physics: const BouncingScrollPhysics(),
          itemCount: _messages.length + (_isAITyping ? 1 : 0),
          itemBuilder: (_, i) {
            if (i == _messages.length && _isAITyping) return _typingBubble(isDark);
            final m = _messages[i];
            return m.isUser
                ? _UserBubble(msg: m, isDark: isDark)
                : _AIBubble(msg: m, isDark: isDark,
                    onGrammar: () => context.push('/grammar'));
          },
        );

  // ── Typing indicator ──────────────────────────────────────────────────────
  Widget _typingBubble(bool isDark) => Padding(
    padding: const EdgeInsets.symmetric(vertical: 8),
    child: Row(children: [
      Container(width: 36, height: 36,
          decoration: BoxDecoration(gradient: AppColors.primaryGradient, shape: BoxShape.circle),
          child: const Center(child: Text('🤖', style: TextStyle(fontSize: 18)))),
      const SizedBox(width: 10),
      Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        decoration: BoxDecoration(
          color: isDark ? AppColors.backgroundCardDark : Colors.white,
          borderRadius: const BorderRadius.only(
            topLeft: Radius.circular(4), topRight: Radius.circular(20),
            bottomLeft: Radius.circular(20), bottomRight: Radius.circular(20),
          ),
          boxShadow: [BoxShadow(color: AppColors.shadowDark, blurRadius: 10)],
        ),
        child: Row(mainAxisSize: MainAxisSize.min,
          children: List.generate(3, (i) => AnimatedBuilder(
            animation: _waveCtrl,
            builder: (_, __) => Container(
              margin: const EdgeInsets.symmetric(horizontal: 2),
              width: 8,
              height: 8 + 6 * sin((_waveCtrl.value * pi) + i * pi / 2).abs(),
              decoration: BoxDecoration(
                color: AppColors.primaryPurple.withOpacity(0.6),
                borderRadius: BorderRadius.circular(4),
              ),
            ),
          )),
        ),
      ),
    ]),
  );

  // ── Input bar ─────────────────────────────────────────────────────────────
  Widget _inputBar(bool isDark) => Container(
    decoration: BoxDecoration(
      color: isDark ? AppColors.backgroundCardDark : Colors.white,
      boxShadow: [BoxShadow(color: AppColors.shadowDark, blurRadius: 20, offset: const Offset(0, -4))],
      borderRadius: const BorderRadius.only(
          topLeft: Radius.circular(28), topRight: Radius.circular(28)),
    ),
    child: SafeArea(top: false, child: Padding(
      padding: const EdgeInsets.fromLTRB(16, 16, 16, 16),
      child: Column(children: [
        if (_isListening) ...[_waveform(), const SizedBox(height: 12)],
        Row(children: [
          Expanded(child: Container(
            decoration: BoxDecoration(
              color: isDark ? AppColors.backgroundSurfaceDark : AppColors.backgroundSurface,
              borderRadius: BorderRadius.circular(20),
            ),
            child: TextField(
              controller: _textCtrl,
              onSubmitted: _sendUser,
              maxLines: 3, minLines: 1,
              style: GoogleFonts.poppins(fontSize: 14,
                  color: isDark ? AppColors.textPrimaryDark : AppColors.textPrimary),
              decoration: InputDecoration(
                hintText: 'Type or tap 🎤 to speak…',
                border: InputBorder.none,
                contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                hintStyle: GoogleFonts.poppins(fontSize: 13, color: AppColors.textHint),
              ),
            ),
          )),
          const SizedBox(width: 10),
          GestureDetector(
            onTap: () => _sendUser(_textCtrl.text),
            child: Container(
              width: 44, height: 44,
              decoration: BoxDecoration(
                gradient: AppColors.primaryGradient,
                borderRadius: BorderRadius.circular(14),
                boxShadow: [BoxShadow(color: AppColors.shadowPurple, blurRadius: 10)],
              ),
              child: const Icon(Icons.send_rounded, color: Colors.white, size: 20),
            ),
          ),
        ]),
        const SizedBox(height: 14),
        GestureDetector(
          onTap: _toggleMic,
          child: AnimatedBuilder(
            animation: _rippleCtrl,
            builder: (_, child) => Stack(alignment: Alignment.center, children: [
              if (_isListening) ...List.generate(3, (i) => Transform.scale(
                scale: 1.0 + i * 0.25 + (_ripple.value - 1.0) * (1 - i * 0.3),
                child: Container(width: 70, height: 70,
                  decoration: BoxDecoration(shape: BoxShape.circle,
                    color: AppColors.primaryPurple.withOpacity(0.14 - i * 0.04))),
              )),
              child!,
            ]),
            child: Container(
              width: 70, height: 70,
              decoration: BoxDecoration(
                gradient: _isListening ? AppColors.sunsetGradient : AppColors.primaryGradient,
                shape: BoxShape.circle,
                boxShadow: [BoxShadow(
                  color: _isListening ? AppColors.shadowBlue : AppColors.shadowPurple,
                  blurRadius: 20, offset: const Offset(0, 8),
                )],
              ),
              child: Icon(_isListening ? Icons.stop_rounded : Icons.mic_rounded,
                  color: Colors.white, size: 30),
            ),
          ),
        ),
        const SizedBox(height: 6),
        Text(
          _isListening ? 'Listening… tap to stop' : 'Tap to speak',
          style: GoogleFonts.poppins(fontSize: 11,
            color: _isListening ? AppColors.error : AppColors.textHint,
            fontWeight: FontWeight.w500),
        ),
      ]),
    )),
  );

  Widget _waveform() => SizedBox(height: 40,
    child: AnimatedBuilder(animation: _waveCtrl, builder: (_, __) =>
      Row(mainAxisAlignment: MainAxisAlignment.center,
        children: List.generate(22, (i) {
          final h = 6 + 20 * sin((_waveCtrl.value * pi * 2) + i * 0.4).abs();
          return Container(
            margin: const EdgeInsets.symmetric(horizontal: 2),
            width: 4, height: h,
            decoration: BoxDecoration(
              gradient: AppColors.primaryGradient,
              borderRadius: BorderRadius.circular(2),
            ),
          );
        }),
      ),
    ),
  );
}

// ── User Bubble ────────────────────────────────────────────────────────────
class _UserBubble extends StatelessWidget {
  final ChatMessage msg;
  final bool isDark;
  const _UserBubble({required this.msg, required this.isDark});

  @override
  Widget build(BuildContext context) => Padding(
    padding: const EdgeInsets.symmetric(vertical: 6),
    child: Row(mainAxisAlignment: MainAxisAlignment.end,
      crossAxisAlignment: CrossAxisAlignment.end, children: [
      Flexible(child: Container(
        constraints: BoxConstraints(maxWidth: MediaQuery.of(context).size.width * 0.72),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        decoration: BoxDecoration(
          gradient: AppColors.primaryGradient,
          borderRadius: const BorderRadius.only(
            topLeft: Radius.circular(20), topRight: Radius.circular(4),
            bottomLeft: Radius.circular(20), bottomRight: Radius.circular(20),
          ),
          boxShadow: [BoxShadow(color: AppColors.shadowPurple, blurRadius: 12, offset: const Offset(0, 4))],
        ),
        child: Text(msg.text,
            style: GoogleFonts.poppins(fontSize: 14, color: Colors.white, height: 1.4)),
      )),
      const SizedBox(width: 8),
      Container(width: 32, height: 32,
        decoration: BoxDecoration(gradient: AppColors.roseGradient, shape: BoxShape.circle),
        child: Center(child: Text('A',
          style: GoogleFonts.poppins(fontSize: 14, fontWeight: FontWeight.w700, color: Colors.white))),
      ),
    ]),
  ).animate().fadeIn(duration: 300.ms).slideX(begin: 0.3, end: 0);
}

// ── AI Bubble ──────────────────────────────────────────────────────────────
class _AIBubble extends StatelessWidget {
  final ChatMessage msg;
  final bool isDark;
  final VoidCallback onGrammar;
  const _AIBubble({required this.msg, required this.isDark, required this.onGrammar});

  @override
  Widget build(BuildContext context) => Padding(
    padding: const EdgeInsets.symmetric(vertical: 6),
    child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Row(crossAxisAlignment: CrossAxisAlignment.end, children: [
        Container(width: 36, height: 36,
          decoration: BoxDecoration(gradient: AppColors.primaryGradient, shape: BoxShape.circle,
            boxShadow: [BoxShadow(color: AppColors.shadowPurple, blurRadius: 8)]),
          child: const Center(child: Text('🤖', style: TextStyle(fontSize: 18)))),
        const SizedBox(width: 10),
        Flexible(child: Container(
          constraints: BoxConstraints(maxWidth: MediaQuery.of(context).size.width * 0.72),
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          decoration: BoxDecoration(
            color: isDark ? AppColors.backgroundCardDark : Colors.white,
            borderRadius: const BorderRadius.only(
              topLeft: Radius.circular(4), topRight: Radius.circular(20),
              bottomLeft: Radius.circular(20), bottomRight: Radius.circular(20),
            ),
            boxShadow: [BoxShadow(color: AppColors.shadowDark, blurRadius: 12, offset: const Offset(0, 4))],
          ),
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Text(msg.text,
              style: GoogleFonts.poppins(fontSize: 14, height: 1.5,
                color: isDark ? AppColors.textPrimaryDark : AppColors.textPrimary)),
            if (msg.hasAudio) ...[
              const SizedBox(height: 8),
              Row(mainAxisSize: MainAxisSize.min, children: [
                const Icon(Icons.play_circle_outline_rounded, color: AppColors.primaryPurple, size: 18),
                const SizedBox(width: 4),
                Text('Play voice', style: GoogleFonts.poppins(fontSize: 11,
                    color: AppColors.primaryPurple, fontWeight: FontWeight.w600)),
              ]),
            ],
          ]),
        )),
      ]),
      if (msg.hasCorrection) ...[
        const SizedBox(height: 8),
        Padding(padding: const EdgeInsets.only(left: 46),
          child: GestureDetector(onTap: onGrammar,
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
              decoration: BoxDecoration(
                color: AppColors.grammarError,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: AppColors.grammarErrorText.withOpacity(0.3)),
              ),
              child: Row(mainAxisSize: MainAxisSize.min, children: [
                const Icon(Icons.auto_fix_high_rounded, color: AppColors.grammarErrorText, size: 16),
                const SizedBox(width: 6),
                Text('Grammar correction found · Tap to view',
                  style: GoogleFonts.poppins(fontSize: 11,
                    color: AppColors.grammarErrorText, fontWeight: FontWeight.w600)),
              ]),
            ),
          ),
        ),
      ],
    ]),
  ).animate().fadeIn(duration: 300.ms).slideX(begin: -0.3, end: 0);
}
