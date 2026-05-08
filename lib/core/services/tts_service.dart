import 'package:flutter_tts/flutter_tts.dart';

class TtsService {
  final FlutterTts _flutterTts = FlutterTts();

  // Define our "Agents"
  static final List<VoiceAgent> agents = [
    VoiceAgent(id: 'en-us-x-sfg#female_1', name: 'Emma', region: 'US', description: 'Friendly & Clear'),
    VoiceAgent(id: 'en-gb-x-gbg#male_1', name: 'Oliver', region: 'UK', description: 'Sophisticated British'),
    VoiceAgent(id: 'en-au-x-aud#female_1', name: 'Bella', region: 'AU', description: 'Casual Australian'),
    VoiceAgent(id: 'en-in-x-ene#male_1', name: 'Aryan', region: 'IN', description: 'Clear Neutral Accent'),
  ];

  Future<void> speak(String text, VoiceAgent agent) async {
    await _flutterTts.setLanguage(agent.id.split('#')[0]);
    // Try to set specific voice if supported by the OS
    try {
      await _flutterTts.setVoice({"name": agent.name, "locale": agent.id.split('#')[0]});
    } catch (_) {}
    
    await _flutterTts.setPitch(1.0);
    await _flutterTts.setSpeechRate(0.5);
    await _flutterTts.speak(text);
  }

  Future<void> stop() async {
    await _flutterTts.stop();
  }
}

class VoiceAgent {
  final String id;
  final String name;
  final String region;
  final String description;

  VoiceAgent({required this.id, required this.name, required this.region, required this.description});
}
