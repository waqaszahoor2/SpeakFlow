'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const LEVELS = ['Beginner', 'Elementary', 'Intermediate', 'Upper-Intermediate', 'Advanced'];
const GOALS = [
  { label: 'Get a job abroad', emoji: '💼' },
  { label: 'Pass IELTS/TOEFL', emoji: '🎓' },
  { label: 'Travel confidently', emoji: '✈️' },
  { label: 'Daily conversation', emoji: '💬' },
  { label: 'Business English', emoji: '📊' },
  { label: 'Improve overall', emoji: '🚀' },
];
const LANGUAGES = ['Urdu', 'Hindi', 'Arabic', 'Chinese', 'Spanish', 'French', 'Portuguese', 'Turkish', 'Other'];

const STEPS = ['welcome', 'name', 'details', 'level', 'goal', 'done'];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: '',
    age: '',
    nativeLanguage: '',
    englishLevel: 'Beginner',
    studyGoals: [],
  });
  const [error, setError] = useState('');
  const [animKey, setAnimKey] = useState(0);

  // If already set up, go to home
  useEffect(() => {
    const raw = localStorage.getItem('sf_profile');
    if (raw) {
      try {
        const p = JSON.parse(raw);
        if (p.setupDone) { router.replace('/home'); return; }
      } catch {}
    }
  }, []);

  const advance = () => {
    setError('');
    setAnimKey(k => k + 1);
    setStep(s => s + 1);
  };

  const validateAndAdvance = () => {
    const s = STEPS[step];
    if (s === 'name' && !form.name.trim()) { setError('Please enter your name'); return; }
    if (s === 'details') {
      if (!form.age || isNaN(form.age) || form.age < 8 || form.age > 80) { setError('Please enter a valid age (8–80)'); return; }
      if (!form.nativeLanguage) { setError('Please select your native language'); return; }
    }
    if (s === 'goal' && form.studyGoals.length === 0) { setError('Pick at least one goal'); return; }
    advance();
  };

  const finish = () => {
    const profile = {
      name: form.name.trim(),
      age: form.age,
      nativeLanguage: form.nativeLanguage,
      englishLevel: 'Beginner', // always start from Beginner — XP drives level up
      studyGoals: form.studyGoals,
      studyGoal: form.studyGoals[0] || '',
      geminiKey: '',
      selectedModel: 'gemini-2.5-flash',
      checkedDays: [],
      todayMin: 0,
      xp: 0,
      streak: 0,
      dailyGoalMin: null,
      setupDone: true,
    };
    localStorage.setItem('sf_profile', JSON.stringify(profile));
    router.replace('/home');
  };

  const pct = Math.round((step / (STEPS.length - 1)) * 100);

  const s = STEPS[step];

  return (
    <div style={{ minHeight:'100dvh', background:'linear-gradient(160deg,#1a0a3d 0%,#0f0e1a 60%,#0a1a2e 100%)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'24px 20px', fontFamily:'Inter,sans-serif' }}>
      {/* Progress bar */}
      {step > 0 && step < STEPS.length - 1 && (
        <div style={{ position:'fixed', top:0, left:0, right:0, height:4, background:'rgba(255,255,255,0.1)', zIndex:100 }}>
          <div style={{ height:'100%', width:`${pct}%`, background:'linear-gradient(90deg,#7C3AED,#EC4899)', transition:'width 0.4s ease', borderRadius:2 }} />
        </div>
      )}

      {/* Back button */}
      {step > 0 && step < STEPS.length - 1 && (
        <button onClick={() => { setStep(s => s - 1); setError(''); }} style={{ position:'fixed', top:16, left:16, width:40, height:40, borderRadius:'50%', background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.2)', color:'#fff', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', zIndex:100 }}>
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="m15 18-6-6 6-6"/></svg>
        </button>
      )}

      <div key={animKey} style={{ width:'100%', maxWidth:440, animation:'fadeSlideUp 0.4s ease both' }}>

        {/* ── Welcome ── */}
        {s === 'welcome' && (
          <div style={{ textAlign:'center' }}>
            <div style={{ display:'flex', justifyContent:'center', marginBottom:20 }}>
              <div style={{ width:100, height:100, borderRadius:30, background:'linear-gradient(135deg,#7C3AED,#EC4899)', padding:4, boxShadow:'0 12px 40px rgba(124,58,237,0.5)', animation:'pulse 2s ease infinite' }}>
                <div style={{ width:'100%', height:'100%', borderRadius:26, overflow:'hidden', background:'#1a0a3d', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <img src="/logo.png" alt="SpeakFlow" style={{ width:76, height:76, objectFit:'contain' }} />
                </div>
              </div>
            </div>
            <div style={{ fontSize:32, fontWeight:800, color:'#fff', lineHeight:1.2, marginBottom:12 }}>
              Welcome to<br/>
              <span style={{ background:'linear-gradient(135deg,#7C3AED,#EC4899)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>SpeakFlow</span>
            </div>
            <div style={{ fontSize:15, color:'rgba(255,255,255,0.7)', lineHeight:1.6, marginBottom:40 }}>
              Your personal AI English tutor — powered by the latest AI models. Let's set up your profile in just 1 minute!
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:12, marginBottom:32 }}>
              {['🎯 Personalized learning path','🤖 AI conversations in real English','📝 Grammar corrections & vocabulary','🔥 Streaks to keep you motivated'].map((f,i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:12, background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:14, padding:'12px 16px' }}>
                  <span style={{ fontSize:20 }}>{f.split(' ')[0]}</span>
                  <span style={{ fontSize:13, color:'rgba(255,255,255,0.85)', fontWeight:500 }}>{f.slice(f.indexOf(' ')+1)}</span>
                </div>
              ))}
            </div>
            <button onClick={advance} style={{ width:'100%', padding:'18px', borderRadius:18, border:'none', background:'linear-gradient(135deg,#7C3AED,#8B5CF6)', color:'#fff', fontSize:16, fontWeight:800, cursor:'pointer', boxShadow:'0 12px 32px rgba(124,58,237,0.45)' }}>
              Get Started 🚀
            </button>
          </div>
        )}

        {/* ── Name ── */}
        {s === 'name' && (
          <div>
            <div style={{ fontSize:36, textAlign:'center', marginBottom:16 }}>👋</div>
            <div style={{ fontSize:26, fontWeight:800, color:'#fff', marginBottom:8, textAlign:'center' }}>What's your name?</div>
            <div style={{ fontSize:14, color:'rgba(255,255,255,0.6)', marginBottom:32, textAlign:'center' }}>This is how we'll address you throughout the app</div>
            <input
              autoFocus
              value={form.name}
              onChange={e => { setForm(f => ({ ...f, name: e.target.value })); setError(''); }}
              onKeyDown={e => e.key === 'Enter' && validateAndAdvance()}
              placeholder="Enter your name..."
              style={{ width:'100%', padding:'18px 20px', borderRadius:18, border:`2px solid ${error ? '#EF4444' : 'rgba(124,58,237,0.4)'}`, background:'rgba(255,255,255,0.07)', color:'#fff', fontSize:18, fontWeight:600, fontFamily:'Inter,sans-serif', outline:'none', marginBottom:error?8:24 }}
            />
            {error && <div style={{ color:'#EF4444', fontSize:13, marginBottom:16, textAlign:'center' }}>{error}</div>}
            <button onClick={validateAndAdvance} style={{ width:'100%', padding:'16px', borderRadius:18, border:'none', background:'linear-gradient(135deg,#7C3AED,#8B5CF6)', color:'#fff', fontSize:15, fontWeight:700, cursor:'pointer', boxShadow:'0 8px 24px rgba(124,58,237,0.4)' }}>
              Continue →
            </button>
          </div>
        )}

        {/* ── Details ── */}
        {s === 'details' && (
          <div>
            <div style={{ fontSize:36, textAlign:'center', marginBottom:16 }}>📋</div>
            <div style={{ fontSize:26, fontWeight:800, color:'#fff', marginBottom:8, textAlign:'center' }}>A bit about you</div>
            <div style={{ fontSize:14, color:'rgba(255,255,255,0.6)', marginBottom:28, textAlign:'center' }}>Helps us tailor your experience</div>

            <div style={{ marginBottom:18 }}>
              <label style={{ fontSize:12, fontWeight:700, color:'rgba(255,255,255,0.6)', textTransform:'uppercase', letterSpacing:'0.05em', display:'block', marginBottom:8 }}>Your Age</label>
              <input
                type="number"
                value={form.age}
                onChange={e => { setForm(f => ({ ...f, age: e.target.value })); setError(''); }}
                placeholder="e.g. 22"
                min="8" max="80"
                style={{ width:'100%', padding:'14px 18px', borderRadius:14, border:'2px solid rgba(124,58,237,0.3)', background:'rgba(255,255,255,0.07)', color:'#fff', fontSize:16, fontFamily:'Inter,sans-serif', outline:'none' }}
              />
            </div>

            <div style={{ marginBottom:error?8:24 }}>
              <label style={{ fontSize:12, fontWeight:700, color:'rgba(255,255,255,0.6)', textTransform:'uppercase', letterSpacing:'0.05em', display:'block', marginBottom:8 }}>Native Language</label>
              <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                {LANGUAGES.map(l => (
                  <button key={l} onClick={() => { setForm(f => ({ ...f, nativeLanguage: l })); setError(''); }}
                    style={{ padding:'8px 16px', borderRadius:20, border:`2px solid ${form.nativeLanguage===l?'#7C3AED':'rgba(255,255,255,0.15)'}`, background: form.nativeLanguage===l ? 'rgba(124,58,237,0.3)' : 'rgba(255,255,255,0.06)', color: form.nativeLanguage===l?'#C4B5FD':'rgba(255,255,255,0.7)', fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:'Inter,sans-serif', transition:'all 0.2s' }}>
                    {l}
                  </button>
                ))}
              </div>
            </div>

            {error && <div style={{ color:'#EF4444', fontSize:13, marginBottom:16, textAlign:'center' }}>{error}</div>}
            <button onClick={validateAndAdvance} style={{ width:'100%', padding:'16px', borderRadius:18, border:'none', background:'linear-gradient(135deg,#7C3AED,#8B5CF6)', color:'#fff', fontSize:15, fontWeight:700, cursor:'pointer', boxShadow:'0 8px 24px rgba(124,58,237,0.4)' }}>
              Continue →
            </button>
          </div>
        )}

        {/* ── Level ── */}
        {s === 'level' && (
          <div>
            <div style={{ fontSize:36, textAlign:'center', marginBottom:16 }}>📊</div>
            <div style={{ fontSize:26, fontWeight:800, color:'#fff', marginBottom:8, textAlign:'center' }}>Your English level?</div>
            <div style={{ fontSize:14, color:'rgba(255,255,255,0.6)', marginBottom:28, textAlign:'center' }}>Be honest — we'll tailor the content accordingly</div>
            <div style={{ display:'flex', flexDirection:'column', gap:12, marginBottom:24 }}>
              {LEVELS.map((l, i) => {
                const emojis = ['🌱','📗','📘','📙','🏆'];
                const descs = ['Just starting out','Basic phrases & grammar','Can hold conversations','Near-native fluency','Fluent speaker'];
                const sel = form.englishLevel === l;
                return (
                  <button key={l} onClick={() => setForm(f => ({ ...f, englishLevel: l }))}
                    style={{ display:'flex', alignItems:'center', gap:16, padding:'16px 18px', borderRadius:18, border:`2px solid ${sel?'#7C3AED':'rgba(255,255,255,0.1)'}`, background: sel?'rgba(124,58,237,0.25)':'rgba(255,255,255,0.04)', cursor:'pointer', textAlign:'left', fontFamily:'Inter,sans-serif', transition:'all 0.2s' }}>
                    <span style={{ fontSize:26 }}>{emojis[i]}</span>
                    <div>
                      <div style={{ fontSize:14, fontWeight:700, color:'#fff' }}>{l}</div>
                      <div style={{ fontSize:12, color:'rgba(255,255,255,0.55)' }}>{descs[i]}</div>
                    </div>
                    {sel && <div style={{ marginLeft:'auto', width:22, height:22, borderRadius:'50%', background:'#7C3AED', display:'flex', alignItems:'center', justifyContent:'center' }}><svg width="12" height="12" fill="#fff" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg></div>}
                  </button>
                );
              })}
            </div>
            <button onClick={advance} style={{ width:'100%', padding:'16px', borderRadius:18, border:'none', background:'linear-gradient(135deg,#7C3AED,#8B5CF6)', color:'#fff', fontSize:15, fontWeight:700, cursor:'pointer', boxShadow:'0 8px 24px rgba(124,58,237,0.4)' }}>
              Continue →
            </button>
          </div>
        )}

        {/* ── Goal (multi-select) ── */}
        {s === 'goal' && (
          <div>
            <div style={{ fontSize:36, textAlign:'center', marginBottom:16 }}>🎯</div>
            <div style={{ fontSize:26, fontWeight:800, color:'#fff', marginBottom:8, textAlign:'center' }}>What are your goals?</div>
            <div style={{ fontSize:14, color:'rgba(255,255,255,0.6)', marginBottom:28, textAlign:'center' }}>Select one or more — we'll cover all of them!</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:error?8:24 }}>
              {GOALS.map(g => {
                const sel = form.studyGoals.includes(g.label);
                return (
                  <button key={g.label} onClick={() => {
                    setError('');
                    setForm(f => ({
                      ...f,
                      studyGoals: sel
                        ? f.studyGoals.filter(x => x !== g.label)
                        : [...f.studyGoals, g.label],
                    }));
                  }}
                    style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:8, padding:'16px 10px', borderRadius:18, border:`2px solid ${sel?'#7C3AED':'rgba(255,255,255,0.1)'}`, background: sel?'rgba(124,58,237,0.25)':'rgba(255,255,255,0.04)', cursor:'pointer', fontFamily:'Inter,sans-serif', transition:'all 0.2s', position:'relative' }}>
                    {sel && <div style={{ position:'absolute', top:8, right:8, width:18, height:18, borderRadius:'50%', background:'#7C3AED', display:'flex', alignItems:'center', justifyContent:'center' }}><svg width="10" height="10" fill="#fff" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg></div>}
                    <span style={{ fontSize:28 }}>{g.emoji}</span>
                    <span style={{ fontSize:11, fontWeight:700, color: sel?'#C4B5FD':'rgba(255,255,255,0.75)', textAlign:'center', lineHeight:1.3 }}>{g.label}</span>
                  </button>
                );
              })}
            </div>
            {form.studyGoals.length > 0 && (
              <div style={{ textAlign:'center', fontSize:12, color:'rgba(255,255,255,0.6)', marginBottom:12 }}>✅ {form.studyGoals.length} goal{form.studyGoals.length>1?'s':''} selected</div>
            )}
            {error && <div style={{ color:'#EF4444', fontSize:13, marginBottom:12, textAlign:'center' }}>{error}</div>}
            <button onClick={validateAndAdvance} style={{ width:'100%', padding:'16px', borderRadius:18, border:'none', background:'linear-gradient(135deg,#7C3AED,#8B5CF6)', color:'#fff', fontSize:15, fontWeight:700, cursor:'pointer', boxShadow:'0 8px 24px rgba(124,58,237,0.4)' }}>
              Continue →
            </button>
          </div>
        )}

        {/* ── Done ── */}
        {s === 'done' && (
          <div style={{ textAlign:'center' }}>
            <div style={{ fontSize:80, marginBottom:20 }}>🎉</div>
            <div style={{ fontSize:28, fontWeight:800, color:'#fff', marginBottom:12 }}>
              All set, {form.name.split(' ')[0]}!
            </div>
            <div style={{ fontSize:14, color:'rgba(255,255,255,0.7)', lineHeight:1.6, marginBottom:32 }}>
              Your profile is ready. Let's start your English learning journey! Your sessions are saved on this device automatically.
            </div>
            <div style={{ background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.12)', borderRadius:20, padding:20, marginBottom:32, textAlign:'left' }}>
              {[
                ['👤', 'Name', form.name],
                ['🎂', 'Age', form.age],
                ['🌍', 'Language', form.nativeLanguage],
                ['📊', 'Start Level', 'Beginner (XP-based)'],
                ['🎯', 'Goals', form.studyGoals.join(', ')],
              ].map(([em, lbl, val]) => (
                <div key={lbl} style={{ display:'flex', alignItems:'flex-start', gap:12, padding:'8px 0', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
                  <span style={{ fontSize:18, width:26, flexShrink:0, marginTop:1 }}>{em}</span>
                  <span style={{ fontSize:13, color:'rgba(255,255,255,0.55)', width:90, flexShrink:0 }}>{lbl}</span>
                  <span style={{ fontSize:13, fontWeight:700, color:'#fff', flex:1, lineHeight:1.4 }}>{val}</span>
                </div>
              ))}
            </div>
            <button onClick={finish} style={{ width:'100%', padding:'18px', borderRadius:18, border:'none', background:'linear-gradient(135deg,#7C3AED,#EC4899)', color:'#fff', fontSize:16, fontWeight:800, cursor:'pointer', boxShadow:'0 12px 32px rgba(124,58,237,0.45)' }}>
              Start Learning 🚀
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
