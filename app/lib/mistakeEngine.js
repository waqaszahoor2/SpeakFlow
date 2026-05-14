// app/lib/mistakeEngine.js
// Runs ONLY on the client (localStorage access)

const KEY_PATTERNS = 'sf_mistake_patterns';
const KEY_CORRECTIONS = 'sf_corrections';
const MAX_PATTERNS = 40;

/* ---------- XP ➜ Level ---------- */
export const XP_THRESHOLDS = [
  { level: 'Beginner',           min: 0   },
  { level: 'Elementary',         min: 80  },
  { level: 'Intermediate',       min: 200 },
  { level: 'Upper-Intermediate', min: 450 },
  { level: 'Advanced',           min: 800 },
];

export function xpToLevel(xp = 0) {
  let result = XP_THRESHOLDS[0].level;
  for (const t of XP_THRESHOLDS) {
    if (xp >= t.min) result = t.level;
  }
  return result;
}

export function nextLevelXp(xp = 0) {
  for (const t of XP_THRESHOLDS) {
    if (xp < t.min) return t.min;
  }
  return null; // already max
}

/* ---------- Pattern helpers ---------- */
export function loadPatterns() {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem(KEY_PATTERNS) || '[]'); } catch { return []; }
}

export function savePattern(correction) {
  // correction = { original, corrected, explanation, natural_version }
  const patterns = loadPatterns();
  const rule = extractRule(correction.explanation || '');
  const existing = patterns.find(p => p.rule === rule);
  if (existing) {
    existing.count += 1;
    existing.lastSeen = Date.now();
    existing.examples.push(correction.original?.slice(0, 80));
    if (existing.examples.length > 5) existing.examples.shift();
  } else {
    patterns.unshift({
      rule,
      count: 1,
      lastSeen: Date.now(),
      examples: [correction.original?.slice(0, 80)],
      corrected: correction.corrected?.slice(0, 100),
    });
  }
  // Keep top patterns by frequency
  patterns.sort((a, b) => b.count - a.count);
  localStorage.setItem(KEY_PATTERNS, JSON.stringify(patterns.slice(0, MAX_PATTERNS)));
}

function extractRule(explanation) {
  // Try to extract the rule category from the explanation
  const lower = explanation.toLowerCase();
  if (lower.includes('tense') || lower.includes('past') || lower.includes('present') || lower.includes('future')) return 'Verb Tense';
  if (lower.includes('article') || lower.includes('"the"') || lower.includes('"a"') || lower.includes('"an"')) return 'Articles (a/an/the)';
  if (lower.includes('plural') || lower.includes('singular')) return 'Plural/Singular Nouns';
  if (lower.includes('preposition') || lower.includes('"in"') || lower.includes('"on"') || lower.includes('"at"')) return 'Prepositions';
  if (lower.includes('subject') || lower.includes('verb agreement')) return 'Subject-Verb Agreement';
  if (lower.includes('pronoun')) return 'Pronouns';
  if (lower.includes('comma') || lower.includes('punctuation') || lower.includes('period')) return 'Punctuation';
  if (lower.includes('spell') || lower.includes('spelling')) return 'Spelling';
  if (lower.includes('word order') || lower.includes('sentence structure')) return 'Word Order';
  if (lower.includes('conditional') || lower.includes('if clause')) return 'Conditionals';
  if (lower.includes('modal') || lower.includes('would') || lower.includes('should') || lower.includes('could')) return 'Modal Verbs';
  if (lower.includes('passive') || lower.includes('active voice')) return 'Passive Voice';
  return 'General Grammar';
}

/* ---------- Build AI context string ---------- */
export function buildMistakeContext(maxPatterns = 5) {
  const patterns = loadPatterns().slice(0, maxPatterns);
  if (patterns.length === 0) return '';
  const lines = patterns.map(p =>
    `- "${p.rule}" (repeated ${p.count}x). Example: "${p.examples[p.examples.length - 1]}"`
  );
  return `\n\nKNOWN WEAKNESSES of this student (recurring mistakes):\n${lines.join('\n')}\nPlease watch for these patterns and proactively correct them in this conversation.`;
}

/* ---------- Correction history ---------- */
export function loadCorrections() {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem(KEY_CORRECTIONS) || '[]'); } catch { return []; }
}

export function saveCorrection(correction) {
  const list = loadCorrections();
  list.unshift({ ...correction, timestamp: Date.now() });
  localStorage.setItem(KEY_CORRECTIONS, JSON.stringify(list.slice(0, 60)));
  savePattern(correction);
}
