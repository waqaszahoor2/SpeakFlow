import 'package:connectivity_plus/connectivity_plus.dart';
import 'remote_config_service.dart';

/// Handles update checking without Google Play dependency.
/// Works with direct APK installs — no Play Store required.
class UpdateService {
  static UpdateService? _instance;
  static UpdateService get instance => _instance ??= UpdateService._();
  UpdateService._();

  Future<bool> get _hasConnection async {
    final result = await Connectivity().checkConnectivity();
    return !result.contains(ConnectivityResult.none);
  }

  /// Returns update result. Always returns noUpdate for direct APK builds.
  Future<InAppUpdateCheckResult> checkForUpdate() async {
    if (!await _hasConnection) return InAppUpdateCheckResult.noUpdate;
    // No Play Store needed — always up to date for direct installs
    return InAppUpdateCheckResult.noUpdate;
  }

  Future<bool> startFlexibleUpdate({void Function(double)? onProgress}) async {
    return false;
  }

  Future<void> completeFlexibleUpdate() async {}

  Future<void> startImmediateUpdate() async {}
}

enum InAppUpdateCheckResult {
  noUpdate,
  flexibleAvailable,
  immediateRequired,
}
