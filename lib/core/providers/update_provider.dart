import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../services/update_service.dart';

// ── Providers ───────────────────────────────────────────────────────────────
final updateProvider =
    StateNotifierProvider<UpdateNotifier, UpdateState>((ref) {
  return UpdateNotifier();
});

// ── State ───────────────────────────────────────────────────────────────────
class UpdateState {
  final UpdatePhase phase;
  final double downloadProgress;
  final String? errorMessage;
  final bool dismissed;

  const UpdateState({
    this.phase = UpdatePhase.idle,
    this.downloadProgress = 0.0,
    this.errorMessage,
    this.dismissed = false,
  });

  UpdateState copyWith({
    UpdatePhase? phase,
    double? downloadProgress,
    String? errorMessage,
    bool? dismissed,
  }) =>
      UpdateState(
        phase: phase ?? this.phase,
        downloadProgress: downloadProgress ?? this.downloadProgress,
        errorMessage: errorMessage,
        dismissed: dismissed ?? this.dismissed,
      );
}

enum UpdatePhase {
  idle,
  checking,
  flexibleAvailable,
  downloading,
  readyToInstall,
  forceRequired,
  error,
  upToDate,
}

// ── Notifier ────────────────────────────────────────────────────────────────
class UpdateNotifier extends StateNotifier<UpdateState> {
  UpdateNotifier() : super(const UpdateState());

  final _updateService = UpdateService.instance;

  Future<void> checkOnStartup() async {
    state = state.copyWith(phase: UpdatePhase.checking);
    try {
      final result = await _updateService.checkForUpdate();
      switch (result) {
        case InAppUpdateCheckResult.noUpdate:
          state = state.copyWith(phase: UpdatePhase.upToDate);
        case InAppUpdateCheckResult.immediateRequired:
          state = state.copyWith(phase: UpdatePhase.forceRequired);
        case InAppUpdateCheckResult.flexibleAvailable:
          state = state.copyWith(phase: UpdatePhase.flexibleAvailable);
      }
    } catch (_) {
      state = state.copyWith(phase: UpdatePhase.idle);
    }
  }

  Future<void> startFlexibleDownload() async {}
  Future<void> applyUpdate() async {}
  Future<void> startImmediateUpdate() async {}
  Future<void> dismissFlexible() async {
    state = state.copyWith(phase: UpdatePhase.idle, dismissed: true);
  }
  void retry() => checkOnStartup();
}
