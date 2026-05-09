// app/api/chat/route.js
import { GoogleGenerativeAI } from '@google/generative-ai';

const SYSTEM = `You are SpeakFlow, a friendly and encouraging AI English tutor.
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
[CORRECTION]{"original":"...","corrected":"...","explanation":"...","natural_version":"..."}[/CORRECTION]

Do NOT include the [CORRECTION] block if there are no mistakes.`;

export async function POST(req) {
  try {
    const { message, history } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return Response.json({
        text: "⚠️ No API key configured. Please set GEMINI_API_KEY in Vercel environment variables.",
        correction: null,
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: SYSTEM,
      generationConfig: { temperature: 0.8, maxOutputTokens: 512 },
    });

    const chat = model.startChat({
      history: (history || []).map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }],
      })),
    });

    const result = await chat.sendMessage(message);
    const raw = result.response.text();

    // Parse correction block
    const match = raw.match(/\[CORRECTION\]([\s\S]*?)\[\/CORRECTION\]/);
    let correction = null;
    if (match) {
      try { correction = JSON.parse(match[1].trim()); } catch (_) {}
    }
    const text = raw.replace(/\[CORRECTION\][\s\S]*?\[\/CORRECTION\]/g, '').trim();

    return Response.json({ text, correction });
  } catch (err) {
    return Response.json({
      text: `⚠️ Error: ${err.message}`,
      correction: null,
    }, { status: 500 });
  }
}
