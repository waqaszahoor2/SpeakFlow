enum MessageRole { user, ai }

enum MessageStatus { sending, sent, error }

class ChatMessage {
  final String id;
  final String text;
  final MessageRole role;
  final MessageStatus status;
  final DateTime timestamp;
  final GrammarCorrection? grammarCorrection;
  final bool hasAudio;

  const ChatMessage({
    required this.id,
    required this.text,
    required this.role,
    this.status = MessageStatus.sent,
    required this.timestamp,
    this.grammarCorrection,
    this.hasAudio = false,
  });

  bool get isUser => role == MessageRole.user;
  bool get isAI => role == MessageRole.ai;
  bool get hasCorrection => grammarCorrection != null;
}

class GrammarCorrection {
  final String original;
  final String corrected;
  final String explanation;
  final String naturalVersion;
  final List<GrammarError> errors;

  const GrammarCorrection({
    required this.original,
    required this.corrected,
    required this.explanation,
    required this.naturalVersion,
    this.errors = const [],
  });
}

class GrammarError {
  final String wrong;
  final String right;
  final String rule;

  const GrammarError({
    required this.wrong,
    required this.right,
    required this.rule,
  });
}

class PracticeTopicModel {
  final String id;
  final String title;
  final String subtitle;
  final String emoji;
  final int totalLessons;
  final int completedLessons;
  final String difficulty; // Easy, Medium, Hard
  final List<String> tags;
  final String gradientType;

  const PracticeTopicModel({
    required this.id,
    required this.title,
    required this.subtitle,
    required this.emoji,
    required this.totalLessons,
    this.completedLessons = 0,
    required this.difficulty,
    this.tags = const [],
    required this.gradientType,
  });

  double get progress =>
      totalLessons == 0 ? 0 : completedLessons / totalLessons;
}

class WeeklyScore {
  final String day;
  final double score;
  final int minutes;

  const WeeklyScore({
    required this.day,
    required this.score,
    required this.minutes,
  });
}

class Achievement {
  final String id;
  final String title;
  final String description;
  final String emoji;
  final bool unlocked;

  const Achievement({
    required this.id,
    required this.title,
    required this.description,
    required this.emoji,
    this.unlocked = false,
  });
}
