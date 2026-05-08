import 'dart:convert';
import 'package:google_generative_ai/google_generative_ai.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

class GeminiService {
  static String get _apiKey => dotenv.env['GEMINI_API_KEY'] ?? '';

  static const String _systemPrompt = '''
You are SpeakFlow, a friendly and encouraging AI English tutor.
Your role is to:
1. Have natural English conversations with the student.
2. Gently correct any grammar mistakes in their messages.
3. Suggest more natural phrasings when appropriate.
4. Explain grammar rules simply and clearly.
5. Keep responses concise (2-4 sentences max) unless explaining grammar.
6. Be warm, supportive and encouraging.
7. Occasionally introduce new vocabulary or expressions.

When you detect a grammar mistake:
- First respond naturally to what they said.
- Then add a brief correction note starting with "📝 Quick correction:".

Format your grammar correction as JSON at the end when there IS a mistake:
[CORRECTION]{
  "original": "...",
  "corrected": "...",
  "explanation": "...",
  "natural_version": "..."
}[/CORRECTION]

Do NOT include the [CORRECTION] block if there are no mistakes.
''';

  late final GenerativeModel _model;
  late final ChatSession _chat;
  bool _initialized = false;

  GeminiService() {
    _init();
  }

  void _init() {
    try {
      _model = GenerativeModel(
        model: 'gemini-1.5-flash',
        apiKey: _apiKey,
        systemInstruction: Content.system(_systemPrompt),
        generationConfig: GenerationConfig(
          temperature: 0.8,
          maxOutputTokens: 512,
          topP: 0.95,
        ),
      );
      _chat = _model.startChat();
      _initialized = true;
    } catch (e) {
      _initialized = false;
    }
  }

  /// Returns the AI tutor response text.
  /// Throws [GeminiException] on failure.
  Future<GeminiResponse> sendMessage(String userMessage) async {
    if (!_initialized) {
      return GeminiResponse(
        text: "I'm having trouble connecting to AI. Please check your internet and try again.",
        correction: null,
      );
    }

    try {
      final response = await _chat.sendMessage(Content.text(userMessage));
      final rawText = response.text ?? '';
      return _parseResponse(rawText);
    } on GenerativeAIException catch (e) {
      throw GeminiException('AI error: ${e.message}');
    } catch (e) {
      throw GeminiException('Network error. Please check your connection.');
    }
  }

  GeminiResponse _parseResponse(String raw) {
    GrammarCorrectionData? correction;

    // Extract the [CORRECTION] block if present
    final correctionRegex = RegExp(
      r'\[CORRECTION\](.*?)\[/CORRECTION\]',
      dotAll: true,
    );
    final match = correctionRegex.firstMatch(raw);

    if (match != null) {
      try {
        final jsonStr = match.group(1)!.trim();
        final decoded = _parseJson(jsonStr);
        correction = GrammarCorrectionData(
          original: decoded['original'] ?? '',
          corrected: decoded['corrected'] ?? '',
          explanation: decoded['explanation'] ?? '',
          naturalVersion: decoded['natural_version'] ?? '',
        );
      } catch (_) {
        // If JSON parsing fails, just show the text
      }
    }

    // Remove the [CORRECTION] block from the displayed text
    final displayText = raw.replaceAll(correctionRegex, '').trim();

    return GeminiResponse(text: displayText, correction: correction);
  }

  Map<String, dynamic> _parseJson(String json) {
    try {
      return jsonDecode(json);
    } catch (e) {
      return {};
    }
  }

  /// Restart the conversation (clears history)
  void resetChat() {
    _init();
  }
}

class GeminiResponse {
  final String text;
  final GrammarCorrectionData? correction;
  bool get hasCorrection => correction != null;

  const GeminiResponse({required this.text, required this.correction});
}

class GrammarCorrectionData {
  final String original;
  final String corrected;
  final String explanation;
  final String naturalVersion;

  const GrammarCorrectionData({
    required this.original,
    required this.corrected,
    required this.explanation,
    required this.naturalVersion,
  });
}

class GeminiException implements Exception {
  final String message;
  const GeminiException(this.message);
  @override
  String toString() => message;
}
