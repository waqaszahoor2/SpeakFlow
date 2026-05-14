'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { saveCorrection, buildMistakeContext, xpToLevel, nextLevelXp, loadPatterns } from '../lib/mistakeEngine';

let msgId = 0;

const MODELS = [
  { id:'moonshot-v1-8k',   label:'Kimi 8K',   emoji:'🌙', sub:'Built-in ✅' },
  { id:'moonshot-v1-32k',  label:'Kimi 32K',  emoji:'🌙', sub:'Built-in ✅' },
  { id:'gemini-1.5-flash', label:'Gemini Flash', emoji:'✨', sub:'Your key' },
  { id:'gemini-1.5-pro',   label:'Gemini Pro',   emoji:'✨', sub:'Your key' },
];

const ART_STYLES = [
  { id:'realistic',   label:'Realistic',    emoji:'📸', suffix:'photorealistic, ultra-detailed, 8k photography' },
  { id:'watercolor',  label:'Watercolor',   emoji:'🎨', suffix:'watercolor painting, soft brushstrokes, pastel tones, artistic' },
  { id:'anime',       label:'Anime',        emoji:'🎌', suffix:'anime style, vibrant colors, cel-shading, Studio Ghibli inspired' },
  { id:'sketch',      label:'Sketch',       emoji:'✏️', suffix:'pencil sketch, hand-drawn, detailed linework, monochrome' },
  { id:'oil',         label:'Oil Painting', emoji:'🖼️', suffix:'oil painting, textured brushwork, rich colors, museum quality' },
  { id:'digital',     label:'Digital Art',  emoji:'🌟', suffix:'digital illustration, vibrant neon colors, concept art, trending on ArtStation' },
  { id:'fantasy',     label:'Fantasy',      emoji:'🌙', suffix:'fantasy art, magical atmosphere, ethereal lighting, epic scale' },
  { id:'pixel',       label:'Pixel Art',    emoji:'🕹️', suffix:'pixel art, retro 16-bit style, colorful, isometric' },
];

const LEVEL_COLORS = {
  'Beginner':           '#10B981',
  'Elementary':         '#3B82F6',
  'Intermediate':       '#8B5CF6',
  'Upper-Intermediate': '#F59E0B',
  'Advanced':           '#EF4444',
};

function LiveClock() {
  const [now, setNow] = useState(null);
  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(t);
  }, []);
  if (!now) return null;
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const city = tz.split('/').pop().replace(/_/g, ' ');
  const off = -now.getTimezoneOffset() / 60;
  return (
    <span style={{ fontSize:11, color:'var(--text-sec)', fontWeight:500, display:'flex', alignItems:'center', gap:4 }}>
      <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
      {time} · {city} (UTC{off >= 0 ? '+' : ''}{off})
    </span>
  );
}

function ImageBubble({ url, prompt, styleId }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const style = ART_STYLES.find(s => s.id === styleId) || ART_STYLES[0];
  return (
    <div style={{ borderRadius:18, overflow:'hidden', background:'var(--surface)', border:'1px solid var(--surface)', boxShadow:'0 4px 20px rgba(0,0,0,0.12)', position:'relative' }}>
      {/* Style badge */}
      <div style={{ position:'absolute', top:10, left:10, zIndex:2, background:'rgba(0,0,0,0.65)', backdropFilter:'blur(8px)', borderRadius:10, padding:'4px 10px', display:'flex', alignItems:'center', gap:5 }}>
        <span style={{ fontSize:13 }}>{style.emoji}</span>
        <span style={{ fontSize:10, fontWeight:700, color:'#fff' }}>{style.label}</span>
      </div>
      {/* Download button */}
      {loaded && (
        <a href={url} download target="_blank" rel="noopener noreferrer"
          style={{ position:'absolute', top:10, right:10, zIndex:2, background:'rgba(0,0,0,0.65)', backdropFilter:'blur(8px)', borderRadius:10, padding:'6px 10px', color:'#fff', textDecoration:'none', fontSize:13, display:'flex', alignItems:'center', gap:4 }}>
          ⬇ Save
        </a>
      )}
      {/* Loading shimmer */}
      {!loaded && !error && (
        <div style={{ width:'100%', aspectRatio:'3/2', background:'linear-gradient(90deg,var(--surface) 0%,var(--card) 50%,var(--surface) 100%)', backgroundSize:'200% 100%', animation:'shimmer 1.5s infinite', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:10 }}>
          <div style={{ fontSize:32, animation:'pulse 1.5s ease infinite' }}>🎨</div>
          <div style={{ fontSize:12, fontWeight:600, color:'var(--text-hint)' }}>Generating {style.label}…</div>
          <div style={{ width:120, height:3, borderRadius:3, background:'var(--surface)', overflow:'hidden' }}>
            <div style={{ height:'100%', width:'60%', background:'var(--grad-primary)', borderRadius:3, animation:'shimmer 1.5s infinite' }} />
          </div>
        </div>
      )}
      {error && (
        <div style={{ width:'100%', aspectRatio:'3/2', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:8, color:'var(--text-hint)' }}>
          <span style={{ fontSize:32 }}>🖼️</span>
          <span style={{ fontSize:12 }}>Image unavailable</span>
        </div>
      )}
      <img
        src={url} alt={prompt || 'Generated image'}
        onLoad={() => setLoaded(true)}
        onError={() => { setLoaded(true); setError(true); }}
        style={{ width:'100%', display: loaded && !error ? 'block' : 'none', borderRadius:0, maxHeight:340, objectFit:'cover' }}
      />
      {/* Prompt caption */}
      {loaded && !error && prompt && (
        <div style={{ padding:'8px 12px', background:'rgba(0,0,0,0.03)', borderTop:'1px solid var(--surface)', fontSize:11, color:'var(--text-hint)', fontStyle:'italic', lineHeight:1.4 }}>
          🖌️ "{prompt.slice(0, 90)}{prompt.length > 90 ? '…' : ''}"
        </div>
      )}
    </div>
  );
}

export default function ConversationPage() {
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [history, setHistory] = useState([]);
  const [corrections, setCorrections] = useState([]);
  const [profile, setProfile] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [keyInput, setKeyInput] = useState('');
  const [localModel, setLocalModel] = useState('moonshot-v1-8k');
  const [levelUp, setLevelUp] = useState(null);
  const [assessmentCount, setAssessmentCount] = useState(0);
  const [imageStyle, setImageStyle] = useState('realistic');
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);
  const sessionStart = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const raw = localStorage.getItem('sf_profile');
    let p = null;
    if (raw) {
      try { p = JSON.parse(raw); setProfile(p); profileRef.current = p; setLocalModel(p.selectedModel || 'moonshot-v1-8k'); setKeyInput(p.geminiKey || ''); } catch {}
    }
    const intro = p?.englishLevel === 'Beginner'
      ? "Hello! I'm your SpeakFlow AI tutor. Let's start easy — please tell me your name and where you are from."
      : "Hello! I'm your SpeakFlow AI tutor. Let's begin with a quick warm-up. Can you describe what you did yesterday in 2–3 sentences?";
    sendMessage(intro, true, p);
    sessionStart.current = Date.now();
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SR();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';
      recognitionRef.current.onresult = (e) => { setIsListening(false); sendMessage(e.results[0][0].transcript); };
      recognitionRef.current.onerror = () => setIsListening(false);
      recognitionRef.current.onend = () => setIsListening(false);
    }
    return () => {
      const elapsed = Math.floor((Date.now() - (sessionStart.current || Date.now())) / 60000);
      if (elapsed >= 1) {
        const raw2 = localStorage.getItem('sf_profile');
        if (raw2) {
          try {
            const p2 = JSON.parse(raw2);
            const today = new Date().getDay();
            const days = p2.checkedDays || [];
            if (!days.includes(today)) days.push(today);
            const newXp = (p2.xp || 0) + elapsed * 5;
            const newLevel = xpToLevel(newXp);
            const updated = { ...p2, checkedDays: days, todayMin: (p2.todayMin || 0) + elapsed, streak: days.length, xp: newXp, englishLevel: newLevel };
            localStorage.setItem('sf_profile', JSON.stringify(updated));
          } catch {}
        }
      }
    };
  }, []);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isTyping]);

  async function sendMessage(text, isGreeting = false, profileOverride = null) {
    const p = profileOverride || profileRef.current || profile;
    if (!isGreeting) {
      setMessages(m => [...m, { id: ++msgId, role: 'user', text }]);
      setHistory(h => [...h, { role: 'user', text }]);
    }
    setIsTyping(true);
    try {
      const mistakeCtx = buildMistakeContext(4);
      const goals = p?.studyGoals || (p?.studyGoal ? [p.studyGoal] : []);
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text, history,
          model: localModel || p?.selectedModel || 'moonshot-v1-8k',
          clientGeminiKey: keyInput || p?.geminiKey || '',
          level: p?.englishLevel || 'Beginner',
          goals,
          nativeLanguage: p?.nativeLanguage || '',
          mistakeContext: mistakeCtx,
        }),
      });
      const data = await res.json();
      // Build image URL if AI requested one
      let imageUrl = null;
      if (data.imagePrompt) {
        const style = ART_STYLES.find(s => s.id === imageStyle) || ART_STYLES[0];
        const fullPrompt = `${data.imagePrompt}, ${style.suffix}`;
        const seed = Math.floor(Math.random() * 99999);
        imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(fullPrompt)}?width=768&height=512&seed=${seed}&nologo=true&model=flux`;
      }
      // Also detect explicit image request in user message (fallback)
      const isImgRequest = /\b(show|draw|generate|create|paint|sketch|make|give)\s+(me\s+)?(an?\s+)?(image|picture|photo|illustration|drawing|art|painting)\b/i.test(text);
      if (!imageUrl && isImgRequest && !isGreeting) {
        const style = ART_STYLES.find(s => s.id === imageStyle) || ART_STYLES[0];
        const fallbackPrompt = text.replace(/show me|draw|create|generate|make|give me/gi, '').trim();
        const seed = Math.floor(Math.random() * 99999);
        imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(fallbackPrompt + ', ' + style.suffix)}?width=768&height=512&seed=${seed}&nologo=true&model=flux`;
      }
      const aiMsg = { id: ++msgId, role: 'ai', text: data.text, correction: data.correction, isAssessment: data.isAssessment, imageUrl, imagePrompt: data.imagePrompt, imageStyleLabel: imageStyle };
      setMessages(m => [...m, aiMsg]);
      setHistory(h => [...h, { role: 'ai', text: data.text }]);
      if (data.isAssessment) setAssessmentCount(c => c + 1);
      if (data.correction) {
        saveCorrection(data.correction);
        setCorrections(c => [...c, data.correction]);
        const raw = localStorage.getItem('sf_profile');
        if (raw) {
          try {
            const p2 = JSON.parse(raw);
            const oldLevel = p2.englishLevel;
            const newLevel = xpToLevel((p2.xp || 0));
            if (newLevel !== oldLevel) setLevelUp(newLevel);
          } catch {}
        }
      }
    } catch {
      setMessages(m => [...m, { id: ++msgId, role: 'ai', text: '⚠️ Network error. Check your connection.' }]);
    }
    setIsTyping(false);
  }

  function handleSend() {
    const t = input.trim(); if (!t) return;
    setInput(''); sendMessage(t);
  }

  function toggleMic() {
    if (!recognitionRef.current) { alert('Speech recognition not supported. Use Chrome.'); return; }
    if (isListening) { recognitionRef.current.stop(); setIsListening(false); }
    else { recognitionRef.current.start(); setIsListening(true); }
  }

  function resetChat() {
    setMessages([]); setHistory([]); setCorrections([]); setAssessmentCount(0);
    const p = profileRef.current;
    const intro = p?.englishLevel === 'Beginner'
      ? "Hello! Let's start fresh. Tell me your name and something about yourself."
      : "New session! Let's warm up — describe your favorite place in the world.";
    setTimeout(() => sendMessage(intro, true), 100);
  }

  function saveSettings() {
    const raw = localStorage.getItem('sf_profile');
    if (raw) {
      try {
        const p2 = JSON.parse(raw);
        const updated = { ...p2, geminiKey: keyInput.trim(), selectedModel: localModel };
        localStorage.setItem('sf_profile', JSON.stringify(updated));
        setProfile(updated); profileRef.current = updated;
      } catch {}
    }
    setShowSettings(false);
  }

  const activeModel = MODELS.find(m => m.id === localModel) || MODELS[0];
  const currentLevel = profile?.englishLevel || 'Beginner';
  const levelColor = LEVEL_COLORS[currentLevel] || '#7C3AED';
  const patterns = loadPatterns ? loadPatterns() : [];

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100vh', background:'var(--bg)' }}>

      {/* Level-up toast */}
      {levelUp && (
        <div style={{ position:'fixed', top:16, left:'50%', transform:'translateX(-50%)', zIndex:2000, background:'linear-gradient(135deg,#7C3AED,#EC4899)', borderRadius:20, padding:'12px 24px', color:'#fff', fontWeight:700, fontSize:14, boxShadow:'0 8px 32px rgba(124,58,237,0.5)', display:'flex', alignItems:'center', gap:10, animation:'fadeSlideUp 0.4s ease' }}>
          🎉 Level Up! You are now <strong>{levelUp}</strong>!
          <button onClick={() => setLevelUp(null)} style={{ background:'rgba(255,255,255,0.2)', border:'none', borderRadius:'50%', width:24, height:24, color:'#fff', cursor:'pointer', fontSize:14 }}>×</button>
        </div>
      )}

      {/* ── Header ── */}
      <div style={{ background:'var(--card)', borderBottom:'1px solid var(--surface)', flexShrink:0, boxShadow:'0 2px 12px var(--shadow)' }}>
        {/* Timezone + XP strip */}
        <div style={{ background:'linear-gradient(90deg,rgba(124,58,237,0.07),rgba(139,92,246,0.13),rgba(124,58,237,0.07))', borderBottom:'1px solid rgba(124,58,237,0.1)', padding:'5px 16px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <LiveClock />
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <span style={{ fontSize:10, fontWeight:700, color:levelColor, background:`${levelColor}18`, borderRadius:8, padding:'2px 8px' }}>{currentLevel}</span>
            <span style={{ fontSize:10, color:'var(--text-hint)', fontWeight:600 }}>⚡ {profile?.xp || 0} XP</span>
            {assessmentCount > 0 && <span style={{ fontSize:10, color:'var(--purple)', fontWeight:600 }}>📋 {assessmentCount} checks</span>}
          </div>
        </div>

        {/* Main appbar */}
        <div style={{ padding:'10px 16px', display:'flex', alignItems:'center', gap:10 }}>
          <button onClick={() => router.push('/home')} style={{ width:36, height:36, borderRadius:'50%', background:'var(--surface)', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <svg width="15" height="15" fill="none" stroke="var(--text)" strokeWidth="2.5" viewBox="0 0 24 24"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <div style={{ width:38, height:38, borderRadius:'50%', background:'linear-gradient(135deg,#7C3AED,#EC4899)', padding:2, boxShadow:'0 4px 12px var(--shadow-purple)', flexShrink:0 }}>
            <div style={{ width:'100%', height:'100%', borderRadius:'50%', overflow:'hidden', background:'#1a0a3d', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <img src="/logo.png" alt="SF" style={{ width:28, height:28, objectFit:'contain' }} />
            </div>
          </div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontWeight:700, fontSize:14, color:'var(--text)' }}>AI English Tutor</div>
            <div style={{ display:'flex', alignItems:'center', gap:5 }}>
              <div style={{ width:6, height:6, borderRadius:'50%', background:'var(--success)', flexShrink:0 }} />
              <span style={{ fontSize:11, color:'var(--success)', fontWeight:600 }}>{activeModel.emoji} {activeModel.label}</span>
            </div>
          </div>
          {corrections.length > 0 && (
            <button onClick={() => router.push('/grammar')} style={{ background:'#FEF2F2', border:'1px solid rgba(239,68,68,0.25)', borderRadius:12, padding:'5px 10px', cursor:'pointer', display:'flex', alignItems:'center', gap:4 }}>
              <span style={{ fontSize:13 }}>✏️</span>
              <span style={{ fontSize:11, fontWeight:700, color:'#DC2626' }}>{corrections.length}</span>
            </button>
          )}
          <button onClick={() => setShowSettings(s => !s)} style={{ width:36, height:36, borderRadius:'50%', background: showSettings ? 'var(--grad-primary)' : 'var(--surface)', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <svg width="16" height="16" fill="none" stroke={showSettings?'#fff':'var(--text)'} strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06-.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
          </button>
          <button onClick={resetChat} style={{ width:36, height:36, borderRadius:'50%', background:'var(--surface)', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <svg width="16" height="16" fill="none" stroke="var(--text)" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
          </button>
        </div>

        {/* ── Settings Panel ── */}
        {showSettings && (
          <div style={{ borderTop:'1px solid var(--surface)', padding:'14px 16px', background:'var(--bg)' }} className="fade-up">
            <div style={{ fontSize:11, fontWeight:700, color:'var(--text-sec)', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:10 }}>Session Settings</div>
            {/* Model picker */}
            <div style={{ display:'flex', gap:6, overflowX:'auto', paddingBottom:4, marginBottom:12 }}>
              {MODELS.map(m => (
                <button key={m.id} onClick={() => setLocalModel(m.id)}
                  style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:2, padding:'8px 10px', borderRadius:12, border:`2px solid ${localModel===m.id?'var(--purple)':'var(--surface)'}`, background: localModel===m.id?'rgba(124,58,237,0.1)':'var(--card)', cursor:'pointer', fontFamily:'Poppins,sans-serif', flexShrink:0 }}>
                  <span style={{ fontSize:15 }}>{m.emoji}</span>
                  <span style={{ fontSize:10, fontWeight:700, color:localModel===m.id?'var(--purple)':'var(--text-sec)', whiteSpace:'nowrap' }}>{m.label}</span>
                  <span style={{ fontSize:9, color:'var(--text-hint)' }}>{m.sub}</span>
                </button>
              ))}
            </div>
            {/* API key */}
            <div style={{ display:'flex', gap:8, marginBottom:8 }}>
              <input type="password" value={keyInput} onChange={e => setKeyInput(e.target.value)}
                placeholder="Gemini key (optional — Kimi works without one)"
                style={{ flex:1, padding:'10px 13px', borderRadius:12, border:'1.5px solid var(--surface)', background:'var(--card)', fontFamily:'Poppins,sans-serif', fontSize:12, color:'var(--text)', outline:'none' }} />
              <button onClick={saveSettings} style={{ padding:'10px 16px', borderRadius:12, border:'none', background:'var(--grad-primary)', color:'#fff', fontFamily:'Poppins,sans-serif', fontSize:12, fontWeight:700, cursor:'pointer', flexShrink:0 }}>Save</button>
            </div>
            {patterns.length > 0 && (
              <div style={{ background:'rgba(239,68,68,0.05)', border:'1px solid rgba(239,68,68,0.15)', borderRadius:12, padding:'10px 12px' }}>
                <div style={{ fontSize:10, fontWeight:700, color:'#DC2626', marginBottom:6 }}>🎯 Your recurring mistakes (AI is watching these):</div>
                {patterns.slice(0,3).map((p,i) => (
                  <div key={i} style={{ fontSize:11, color:'var(--text-sec)', marginBottom:3 }}>
                    • <strong>{p.rule}</strong> — {p.count}× repeated
                  </div>
                ))}
              </div>
            )}
            {/* Art Style Picker */}
            <div>
              <div style={{ fontSize:11, fontWeight:600, color:'var(--text-hint)', marginBottom:8 }}>🎨 Image Art Style</div>
              <div style={{ display:'flex', gap:6, overflowX:'auto', paddingBottom:4 }}>
                {ART_STYLES.map(s => (
                  <button key={s.id} onClick={() => setImageStyle(s.id)}
                    style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:2, padding:'7px 10px', borderRadius:12, border:`2px solid ${imageStyle===s.id?'var(--purple)':'var(--surface)'}`, background: imageStyle===s.id?'rgba(124,58,237,0.1)':'var(--card)', cursor:'pointer', fontFamily:'Poppins,sans-serif', flexShrink:0, transition:'all 0.18s' }}>
                    <span style={{ fontSize:16 }}>{s.emoji}</span>
                    <span style={{ fontSize:9, fontWeight:700, color:imageStyle===s.id?'var(--purple)':'var(--text-hint)', whiteSpace:'nowrap' }}>{s.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Messages ── */}
      <div style={{ flex:1, overflowY:'auto', padding:'12px 16px 8px', display:'flex', flexDirection:'column', gap:12 }}>
        {messages.length === 0 && !isTyping && (
          <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:14, color:'var(--text-sec)', minHeight:160 }}>
            <div style={{ width:72, height:72, borderRadius:'50%', background:'linear-gradient(135deg,#7C3AED,#EC4899)', padding:3, boxShadow:'0 8px 28px rgba(124,58,237,0.4)', animation:'pulse 2s ease infinite' }}>
              <div style={{ width:'100%', height:'100%', borderRadius:'50%', overflow:'hidden', background:'#1a0a3d', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <img src="/logo.png" alt="SpeakFlow" style={{ width:52, height:52, objectFit:'contain' }} />
              </div>
            </div>
            <span style={{ fontSize:14, fontWeight:600 }}>Starting your {currentLevel} session…</span>
          </div>
        )}

        {messages.map(m => (
          <div key={m.id} style={{ display:'flex', flexDirection:'column', alignItems: m.role==='user'?'flex-end':'flex-start', gap:6 }}>
            {m.isAssessment && m.role === 'ai' && (
              <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:2 }}>
                <div style={{ height:1, flex:1, background:'var(--surface)' }} />
                <span style={{ fontSize:10, fontWeight:700, color:'var(--purple)', background:'rgba(124,58,237,0.1)', borderRadius:8, padding:'2px 8px' }}>📋 Level Check</span>
                <div style={{ height:1, flex:1, background:'var(--surface)' }} />
              </div>
            )}
            <div style={{ display:'flex', alignItems:'flex-end', gap:10, flexDirection: m.role==='user'?'row-reverse':'row' }}>
              {m.role === 'ai' && (
                <div style={{ width:34, height:34, borderRadius:'50%', background:'linear-gradient(135deg,#7C3AED,#EC4899)', padding:2, flexShrink:0, boxShadow:'0 2px 8px rgba(124,58,237,0.3)' }}>
                  <div style={{ width:'100%', height:'100%', borderRadius:'50%', overflow:'hidden', background:'#1a0a3d', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <img src="/logo.png" alt="SF" style={{ width:24, height:24, objectFit:'contain' }} />
                  </div>
                </div>
              )}
              {m.role === 'user' && (
                <div style={{ width:30, height:30, borderRadius:'50%', background:'var(--grad-rose)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:700, color:'#fff', flexShrink:0 }}>
                  {profile?.name?.[0]?.toUpperCase() || 'U'}
                </div>
              )}
              <div className={m.role==='user'?'bubble-user':'bubble-ai'} style={{ animation:'fadeSlideUp 0.3s ease both' }}>{m.text}</div>
            </div>
            {/* ── Generated Image Bubble ── */}
            {m.imageUrl && (
              <div style={{ marginLeft: m.role==='ai' ? 44 : 0, marginRight: m.role==='user' ? 40 : 0, maxWidth:'85%', animation:'fadeSlideUp 0.4s ease both', animationDelay:'0.15s' }}>
                <ImageBubble url={m.imageUrl} prompt={m.imagePrompt} styleId={m.imageStyleLabel} />
              </div>
            )}
            {m.correction && (
              <div style={{ marginLeft:44, display:'flex', alignItems:'center', gap:6, background:'#FEF2F2', border:'1px solid rgba(239,68,68,0.25)', borderRadius:12, padding:'7px 12px', cursor:'pointer', maxWidth:'85%' }}
                onClick={() => router.push('/grammar')}>
                <span style={{ fontSize:13 }}>✏️</span>
                <div>
                  <div style={{ fontSize:11, fontWeight:700, color:'#DC2626' }}>Grammar correction · Tap to see details</div>
                  <div style={{ fontSize:10, color:'#EF4444' }}>"{m.correction.original?.slice(0,40)}..."</div>
                </div>
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div style={{ display:'flex', alignItems:'flex-end', gap:10 }}>
            <div style={{ width:34, height:34, borderRadius:'50%', background:'linear-gradient(135deg,#7C3AED,#EC4899)', padding:2, flexShrink:0 }}>
              <div style={{ width:'100%', height:'100%', borderRadius:'50%', overflow:'hidden', background:'#1a0a3d', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <img src="/logo.png" alt="SF" style={{ width:24, height:24, objectFit:'contain' }} />
              </div>
            </div>
            <div className="bubble-ai" style={{ display:'flex', alignItems:'center', gap:4, minHeight:40 }}>
              <div className="typing-dot" /><div className="typing-dot" /><div className="typing-dot" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* ── Input Area ── */}
      <div style={{ flexShrink:0, padding:'8px 16px 16px', background:'var(--card)', borderTop:'1px solid var(--surface)', boxShadow:'0 -4px 20px rgba(0,0,0,0.06)' }}>
        {isListening && (
          <div style={{ display:'flex', justifyContent:'center', marginBottom:10 }}>
            <div style={{ display:'flex', alignItems:'center', gap:6, background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:20, padding:'5px 14px' }}>
              <div className="waveform" style={{ height:20 }}>
                {Array.from({length:6}).map((_,i) => <div key={i} className="wave-bar" style={{ animationDelay:`${i*0.1}s`, background:'#EF4444' }} />)}
              </div>
              <span style={{ fontSize:11, fontWeight:700, color:'#DC2626' }}>Listening…</span>
            </div>
          </div>
        )}
        {/* Centered mic button */}
        <div style={{ display:'flex', justifyContent:'center', marginBottom:10 }}>
          <button onClick={toggleMic}
            style={{ width:60, height:60, borderRadius:'50%', border:'none', cursor:'pointer', background: isListening ? 'linear-gradient(135deg,#EF4444,#F59E0B)' : 'var(--grad-primary)', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', boxShadow: isListening ? '0 8px 24px rgba(239,68,68,0.4)' : '0 8px 24px var(--shadow-purple)', position:'relative', transition:'all 0.25s', transform: isListening ? 'scale(1.1)' : 'scale(1)' }}>
            {isListening && <><div className="ripple-ring" /><div className="ripple-ring" style={{ animationDelay:'0.4s' }} /></>}
            <svg width="24" height="24" fill="#fff" viewBox="0 0 24 24" style={{ position:'relative', zIndex:1 }}>
              {isListening ? <path d="M6 6h12v12H6z"/> : <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1 1.93c-3.94-.49-7-3.85-7-7.93h2c0 3.31 2.69 6 6 6s6-2.69 6-6h2c0 4.08-3.06 7.44-7 7.93V22h-2v-4.07z"/>}
            </svg>
          </button>
        </div>
        {/* Text + send row */}
        <div style={{ display:'flex', gap:10, alignItems:'center' }}>
          <input ref={inputRef} value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key==='Enter' && !e.shiftKey && handleSend()}
            placeholder={`Type in English (${currentLevel} mode)…`}
            style={{ flex:1, background:'var(--surface)', borderRadius:24, padding:'13px 18px', border:'none', outline:'none', fontFamily:'Poppins,sans-serif', fontSize:14, color:'var(--text)' }} />
          <button onClick={handleSend}
            style={{ width:50, height:50, borderRadius:'50%', background:'var(--grad-primary)', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 14px var(--shadow-purple)', flexShrink:0 }}>
            <svg width="20" height="20" fill="#fff" viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
}
