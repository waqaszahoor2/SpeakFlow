class UserModel {
  final String id;
  final String name;
  final String email;
  final String? avatarUrl;
  final String level; // Beginner, Intermediate, Advanced
  final int streakDays;
  final int totalXP;
  final int weeklyGoalMinutes;
  final int todayMinutes;
  final List<String> achievements;
  final bool isPremium;
  final DateTime joinedAt;

  const UserModel({
    required this.id,
    required this.name,
    required this.email,
    this.avatarUrl,
    this.level = 'Intermediate',
    this.streakDays = 0,
    this.totalXP = 0,
    this.weeklyGoalMinutes = 30,
    this.todayMinutes = 0,
    this.achievements = const [],
    this.isPremium = false,
    required this.joinedAt,
  });

  factory UserModel.demo() => UserModel(
        id: 'u001',
        name: 'Alex Johnson',
        email: 'alex@example.com',
        level: 'Intermediate',
        streakDays: 14,
        totalXP: 2850,
        weeklyGoalMinutes: 30,
        todayMinutes: 18,
        achievements: ['first_lesson', 'week_streak', 'grammar_master'],
        isPremium: true,
        joinedAt: DateTime(2024, 1, 15),
      );

  UserModel copyWith({
    int? streakDays,
    int? totalXP,
    int? todayMinutes,
    List<String>? achievements,
    String? level,
  }) =>
      UserModel(
        id: id,
        name: name,
        email: email,
        avatarUrl: avatarUrl,
        level: level ?? this.level,
        streakDays: streakDays ?? this.streakDays,
        totalXP: totalXP ?? this.totalXP,
        weeklyGoalMinutes: weeklyGoalMinutes,
        todayMinutes: todayMinutes ?? this.todayMinutes,
        achievements: achievements ?? this.achievements,
        isPremium: isPremium,
        joinedAt: joinedAt,
      );
}
