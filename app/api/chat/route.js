// app/api/chat/route.js
import { GoogleGenerativeAI } from '@google/generative-ai';

/* ──────────────────────────────────────────────
   LEVEL → CONVERSATION STYLE MAP
────────────────────────────────────────────── */
const LEVEL_GUIDE = {
  'Beginner': `
    - Use very simple vocabulary (A1-A2 level).
    - Short sentences of 5–10 words.
    - Speak very slowly and clearly.
    - Avoid idioms or complex phrases entirely.
    - Always offer multiple choice when asking questions.
    - Praise every correct attempt enthusiastically.`,
  'Elementary': `
    - Use basic vocabulary (A2-B1 level).
    - Introduce simple idioms with explanations.
    - Sentences of 10–15 words.
    - Ask simple open questions.
    - Offer hints when the student struggles.`,
  'Intermediate': `
    - Use everyday vocabulary (B1-B2 level).
    - Use common idioms naturally.
    - Encourage longer answers.
    - Discuss opinions and reasons.
    - Correct errors without over-explaining.`,
  'Upper-Intermediate': `
    - Use varied, rich vocabulary (B2-C1 level).
    - Use idioms, phrasal verbs, and nuanced expressions.
    - Debate topics and explore multiple perspectives.
    - Challenge the student to elaborate.
    - Give concise, precise corrections.`,
  'Advanced': `
    - Use sophisticated vocabulary (C1-C2 level).
    - Use academic and professional expressions.
    - Engage in complex, abstract discussions.
    - Focus on subtle nuance and register differences.
    - Only correct truly significant errors.`,
};

/* ──────────────────────────────────────────────
   GOAL → TOPIC FOCUS
────────────────────────────────────────────── */
const GOAL_GUIDE = {
  'Get a job abroad':    'Focus on professional English, CV language, interview answers, and workplace vocabulary.',
  'Pass IELTS/TOEFL':   'Focus on IELTS Speaking Part 1-3 structure, formal academic language, and pronunciation.',
  'Travel confidently':  'Focus on travel scenarios: airports, hotels, restaurants, directions, and emergencies.',
  'Daily conversation':  'Focus on casual everyday English: small talk, expressing opinions, telling stories.',
  'Business English':    'Focus on meetings, emails, negotiations, presentations, and professional etiquette.',
  'Improve overall':     'Cover a wide range of topics to build all-round English fluency.',
};

/* ──────────────────────────────────────────────
   SYSTEM PROMPT BUILDER
────────────────────────────────────────────── */
function buildSystemPrompt({ level, goals, mistakeContext, nativeLanguage }) {
  const levelStyle = LEVEL_GUIDE[level] || LEVEL_GUIDE['Beginner'];
  const goalFocus = Array.isArray(goals) && goals.length
    ? goals.map(g => GOAL_GUIDE[g] || '').filter(Boolean).join(' ')
    : (GOAL_GUIDE[goals] || 'Improve general English fluency.');

  return `You are SpeakFlow — a world-class, adaptive AI English tutor. You are warm, encouraging, and brilliant at teaching.

## YOUR STUDENT
- Current English Level: **${level}**
- Native Language: ${nativeLanguage || 'Unknown'}
- Study Goals: ${Array.isArray(goals) ? goals.join(', ') : goals || 'General improvement'}

## CONVERSATION STYLE for ${level}:
${levelStyle}

## GOAL-BASED FOCUS:
${goalFocus}${mistakeContext}

## HOW YOU WORK:
1. Have natural, engaging conversations tailored to the student's level.
2. After EVERY user message, check for grammar, vocabulary, and usage errors.
3. Always respond NATURALLY FIRST (2–4 sentences), then add corrections if needed.
4. Use this format ONLY when there IS a mistake:
   📝 **Quick correction:** [brief explanation]
5. Proactively introduce vocabulary and expressions relevant to the student's goals.
6. Every 3–5 exchanges, gently increase complexity to push the student to level up.
7. Occasionally ask follow-up questions to keep the conversation flowing.

## IMAGE GENERATION:
When the student asks you to show, draw, generate, or create an image of something, OR when showing a visual would greatly help explain a concept (e.g., vocabulary about objects, places, animals, food, etc.), include this tag ANYWHERE in your response:
[IMAGE: a highly detailed visual description for image generation, include art style hints, lighting, mood, and specific details. Write 15-25 words.]

Examples:
- User says "show me a cat" → include: [IMAGE: a fluffy orange tabby cat sitting on a sunny windowsill, warm golden light, photorealistic style]
- User says "what does a marketplace look like?" → include: [IMAGE: a colorful outdoor marketplace with fresh vegetables and spices, busy vendors, vibrant colors, cinematic style]
- User asks about past tense with "travel" → you might include: [IMAGE: a person with a backpack at a beautiful mountain vista, warm sunset light, travel photography style]

Only generate images when genuinely useful or requested. Do NOT generate images for every message.

## ASSESSMENT QUESTIONS (use periodically, NOT every message):
When you detect the student is improving, ask a slightly harder question.
When you detect repeated struggles, simplify and rephrase.

## CORRECTION FORMAT:
When you find an error, ALSO append this JSON block at the very end of your response:
[CORRECTION]{"original":"...","corrected":"...","explanation":"...","natural_version":"...","rule":"..."}[/CORRECTION]

Do NOT include [CORRECTION] if the student's message is grammatically correct.

## ASSESSMENT QUESTIONS FORMAT:
When asking a level-check question, prepend: [ASSESSMENT]
Example: [ASSESSMENT] Can you tell me about a time you felt proud of yourself?

Remember: You adapt. The student's level may grow — if they consistently answer correctly, gradually upgrade the conversation complexity.`;
}

/* ──────────────────────────────────────────────
   KIMI (OpenAI-compatible) CALL
────────────────────────────────────────────── */
async function callKimi(model, messages) {
  // Use environment variable first, then fallback to the provided key so Vercel deploys instantly work
  const key = process.env.KIMI_API_KEY || 'sk-HCvCBY2f61gD4YRaAy6oKt9F2vPa3qI1z6eGiRj4uD6mJ80I';
  if (!key) throw new Error('Kimi API key not configured on server.');
  const res = await fetch('https://api.moonshot.cn/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
    body: JSON.stringify({ model, messages, temperature: 0.85, max_tokens: 600 }),
  });
    if (res.status === 401) throw new Error('Kimi API key is invalid, revoked, or expired. Please generate a new key.');
    throw new Error(`Kimi API error ${res.status}: ${await res.text()}`);
  }
  return (await res.json()).choices?.[0]?.message?.content ?? '';
}

/* ──────────────────────────────────────────────
   MAIN HANDLER
────────────────────────────────────────────── */
export async function POST(req) {
  try {
    const {
      message,
      history,
      model = 'moonshot-v1-8k',
      clientGeminiKey,
      // Adaptive context from client
      level = 'Beginner',
      goals = [],
      nativeLanguage = '',
      mistakeContext = '',
    } = await req.json();

    const systemPrompt = buildSystemPrompt({ level, goals, mistakeContext, nativeLanguage });
    const isKimi = model.startsWith('moonshot');

    /* ── Parse the raw AI response ── */
    function parseResponse(raw) {
      const corrMatch = raw.match(/\[CORRECTION\]([\s\S]*?)\[\/CORRECTION\]/);
      let correction = null;
      if (corrMatch) {
        try { correction = JSON.parse(corrMatch[1].trim()); } catch (_) {}
      }
      // Extract image prompt
      const imgMatch = raw.match(/\[IMAGE:\s*([\s\S]*?)\]/);
      const imagePrompt = imgMatch ? imgMatch[1].trim() : null;

      const isAssessment = raw.includes('[ASSESSMENT]');
      let text = raw
        .replace(/\[CORRECTION\][\s\S]*?\[\/CORRECTION\]/g, '')
        .replace(/\[ASSESSMENT\]/g, '')
        .replace(/\[IMAGE:[\s\S]*?\]/g, '')
        .trim();
      return { text, correction, isAssessment, imagePrompt };
    }

    /* ── KIMI BRANCH ── */
    if (isKimi) {
      const msgs = [
        { role: 'system', content: systemPrompt },
        ...(history || []).map(m => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.text })),
        { role: 'user', content: message },
      ];
      return Response.json(parseResponse(await callKimi(model, msgs)));
    }

    /* ── GEMINI BRANCH ── */
    // Use client key, then server env variable, then provided fallback
    const apiKey = clientGeminiKey?.trim() || process.env.GEMINI_API_KEY || 'AIzaSyB7IxsBKovopAxiaUb8KblE_w24U6CLJDM';
    if (!apiKey || apiKey === 'your_actual_api_key_here') {
      return Response.json({
        text: "⚠️ No Gemini API key. Tap ⚙️ in the header and enter your key from [aistudio.google.com](https://aistudio.google.com), or switch to a Kimi model (no key needed).",
        correction: null, isAssessment: false,
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const geminiModel = genAI.getGenerativeModel({
      model,
      systemInstruction: systemPrompt,
      generationConfig: { temperature: 0.85, maxOutputTokens: 600 },
    });
    const chat = geminiModel.startChat({
      history: (history || []).map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }],
      })),
    });
    const result = await chat.sendMessage(message);
    return Response.json(parseResponse(result.response.text()));

  } catch (err) {
    const msg = err.message || '';
    if (msg.includes('API_KEY_INVALID') || msg.includes('401') || msg.includes('404')) {
      return Response.json({ text: "⚠️ The Gemini API key is invalid, expired, or doesn't have access to this model. Please generate a new key at aistudio.google.com and update it in the settings panel (⚙️).", correction: null }, { status: 401 });
    }
    if (msg.includes('quota') || msg.includes('429')) {
      return Response.json({ text: "⚠️ API quota exceeded. Please check your API provider billing or try again later.", correction: null }, { status: 429 });
    }
    return Response.json({ text: `⚠️ Error: ${msg}`, correction: null }, { status: 500 });
  }
}
