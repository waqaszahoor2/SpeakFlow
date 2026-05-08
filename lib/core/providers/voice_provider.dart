import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../services/tts_service.dart';

final voiceProvider = StateNotifierProvider<VoiceNotifier, VoiceAgent>((ref) {
  return VoiceNotifier();
});

class VoiceNotifier extends StateNotifier<VoiceAgent> {
  VoiceNotifier() : super(TtsService.agents.first);

  void setAgent(VoiceAgent agent) {
    state = agent;
  }
}
