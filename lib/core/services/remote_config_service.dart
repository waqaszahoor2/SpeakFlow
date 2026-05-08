/// Manages app configuration with local defaults only.
/// No Firebase required — everything works offline by default.
/// To add Firebase Remote Config later, replace this service.
class RemoteConfigService {
  static RemoteConfigService? _instance;
  static RemoteConfigService get instance =>
      _instance ??= RemoteConfigService._();
  RemoteConfigService._();

  bool _initialized = false;

  Future<void> initialize() async {
    if (_initialized) return;
    _initialized = true;
  }

  Future<void> refresh() async {}

  // ── Getters — all use safe local defaults ───────────────────────────────
  String get minRequiredVersion => '1.0.0';
  String get latestVersion => '1.0.0';
  bool get forceUpdate => false;
  bool get optionalUpdate => false;
  String get updateMessage =>
      'A new version of SpeakFlow is available! Update now for the latest features.';
  String get releaseNotes =>
      '• AI conversation improvements\n• Grammar detection enhanced\n• Bug fixes & performance boost';
  bool get maintenanceMode => false;
  String get maintenanceMessage =>
      'SpeakFlow is under maintenance. We\'ll be back shortly! 🛠️';
  bool get aiEnabled => true;
}

enum UpdateStatus { upToDate, available, forceRequired }
