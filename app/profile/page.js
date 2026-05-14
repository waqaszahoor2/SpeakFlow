'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import BottomNav from '../components/BottomNav';

const LEVELS = ['Beginner', 'Elementary', 'Intermediate', 'Upper-Intermediate', 'Advanced'];
const LANGUAGES = ['Urdu', 'Hindi', 'Arabic', 'Chinese', 'Spanish', 'French', 'Portuguese', 'Turkish', 'Other'];
const GOALS = ['Get a job abroad','Pass IELTS/TOEFL','Travel confidently','Daily conversation','Business English','Improve overall'];

const MODELS = [
  { id:'moonshot-v1-8k',   label:'Kimi 8K',   sub:'Fast · Moonshot AI',              emoji:'🌙', provider:'kimi' },
  { id:'moonshot-v1-32k',  label:'Kimi 32K',  sub:'Long context · Moonshot AI',      emoji:'🌙', provider:'kimi' },
  { id:'moonshot-v1-128k', label:'Kimi 128K', sub:'Max context · Moonshot AI',       emoji:'🌙', provider:'kimi' },
  { id:'gemini-1.5-flash', label:'Gemini Flash', sub:'Fast · Google',                emoji:'✨', provider:'gemini' },
  { id:'gemini-1.5-pro',   label:'Gemini Pro',   sub:'Powerful · Google (needs key)', emoji:'✨', provider:'gemini' },
];

const DEFAULT = {
  name:'', age:'', nativeLanguage:'', englishLevel:'Beginner', studyGoal:'', studyGoals:[],
  geminiKey:'', selectedModel:'moonshot-v1-8k', xp:0, streak:0, setupDone:true,
  checkedDays:[], todayMin:0, dailyGoalMin:null,
};

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfileState] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [darkMode, setDarkMode] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [keySaved, setKeySaved] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem('sf_profile');
    if (raw) {
      const p = { ...DEFAULT, ...JSON.parse(raw) };
      setProfileState(p);
      setForm(p);
    }
  }, []);

  if (!profile) return null;

  const saveProfile = (updates) => {
    const next = { ...profile, ...updates };
    setProfileState(next);
    localStorage.setItem('sf_profile', JSON.stringify(next));
    return next;
  };

  const handleSave = () => {
    saveProfile(form);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const saveGeminiKey = () => {
    saveProfile({ geminiKey: form.geminiKey?.trim() || '' });
    setProfileState(p => ({ ...p, geminiKey: form.geminiKey?.trim() || '' }));
    setShowKey(false);
    setKeySaved(true);
    setTimeout(() => setKeySaved(false), 3000);
  };

  const toggleDark = () => {
    setDarkMode(d => !d);
    document.getElementById('app-root')?.classList.toggle('dark');
  };

  const levels = LEVELS;
  const levelIdx = levels.indexOf(profile.englishLevel);
  const levelPct = Math.round(((Math.max(0,levelIdx) + 0.5) / levels.length) * 100);
  const maskedKey = profile.geminiKey
    ? `${profile.geminiKey.slice(0,6)}${'•'.repeat(Math.max(0, profile.geminiKey.length-10))}${profile.geminiKey.slice(-4)}`
    : '';

  const selectedModelObj = MODELS.find(m => m.id === profile.selectedModel) || MODELS[0];

  return (
    <>
      <div style={{ paddingBottom:'calc(var(--nav-h) + 16px)', overflowY:'auto', height:'100vh' }}>

        {/* ── Header ── */}
        <div className="hero-header fade-up" style={{ paddingBottom:32, textAlign:'center' }}>
          <div style={{ position:'relative', display:'inline-block', marginBottom:14 }}>
            {/* Logo ring */}
            <div style={{ width:96, height:96, borderRadius:'50%', background:'linear-gradient(135deg,#7C3AED,#EC4899)', padding:3, margin:'0 auto', boxShadow:'0 8px 28px rgba(124,58,237,0.5)' }}>
              <div style={{ width:'100%', height:'100%', borderRadius:'50%', overflow:'hidden', background:'#1a0a3d', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <img src="/logo.png" alt="SpeakFlow" style={{ width:72, height:72, objectFit:'contain' }} />
              </div>
            </div>
            <button onClick={() => setEditing(true)}
              style={{ position:'absolute', bottom:2, right:2, width:28, height:28, borderRadius:'50%',
                background:'#fff', display:'flex', alignItems:'center', justifyContent:'center',
                boxShadow:'0 2px 10px rgba(0,0,0,0.2)', fontSize:13, border:'none', cursor:'pointer', zIndex:1 }}>✏️</button>
          </div>
          <div style={{ fontSize:22, fontWeight:800, color:'#fff', marginBottom:2 }}>{profile.name || 'Learner'}</div>
          {profile.age && <div style={{ fontSize:12, color:'rgba(255,255,255,0.65)', marginBottom:4 }}>Age {profile.age} · {profile.nativeLanguage}</div>}
          {(profile.studyGoals?.length > 0 || profile.studyGoal) && (
            <div style={{ display:'flex', flexWrap:'wrap', justifyContent:'center', gap:4, marginBottom:14 }}>
              {(profile.studyGoals?.length > 0 ? profile.studyGoals : [profile.studyGoal]).map(g => (
                <span key={g} style={{ background:'rgba(255,255,255,0.15)', borderRadius:10, padding:'3px 10px', fontSize:11, fontWeight:600, color:'rgba(255,255,255,0.9)' }}>🎯 {g}</span>
              ))}
            </div>
          )}
          <div style={{ display:'flex', justifyContent:'center', alignItems:'center', gap:0 }}>
            <div className="profile-stat"><span className="val">{profile.xp || 0}</span><span className="lbl">XP</span></div>
            <div className="profile-divider" style={{ margin:'0 24px' }} />
            <div className="profile-stat"><span className="val">{(profile.checkedDays||[]).length}d</span><span className="lbl">Streak</span></div>
            <div className="profile-divider" style={{ margin:'0 24px' }} />
            <div className="profile-stat"><span className="val">{profile.englishLevel?.split('-')[0]}</span><span className="lbl">Level</span></div>
          </div>
        </div>

        <div className="page-content">

          {/* Success toast */}
          {saved && (
            <div style={{ background:'#D1FAE5', border:'1px solid rgba(16,185,129,0.3)', borderRadius:14, padding:'12px 16px', fontSize:13, fontWeight:600, color:'#059669', display:'flex', alignItems:'center', gap:8 }} className="fade-up">
              ✅ Profile saved successfully!
            </div>
          )}

          {/* ── Edit Modal ── */}
          {editing && (
            <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', zIndex:1000, display:'flex', alignItems:'flex-end', justifyContent:'center' }}
              onClick={e => { if (e.target === e.currentTarget) setEditing(false); }}>
              <div style={{ background:'var(--card)', borderRadius:'28px 28px 0 0', padding:'28px 24px 40px', width:'100%', maxWidth:560, maxHeight:'90vh', overflowY:'auto' }} className="fade-up">
                <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:24 }}>
                  <div style={{ width:44, height:44, borderRadius:14, background:'linear-gradient(135deg,#7C3AED,#EC4899)', padding:2, boxShadow:'0 4px 12px rgba(124,58,237,0.35)', flexShrink:0 }}>
                    <div style={{ width:'100%', height:'100%', borderRadius:12, overflow:'hidden', background:'#1a0a3d', display:'flex', alignItems:'center', justifyContent:'center' }}>
                      <img src="/logo.png" alt="SpeakFlow" style={{ width:34, height:34, objectFit:'contain' }} />
                    </div>
                  </div>
                  <div style={{ fontWeight:800, fontSize:20, color:'var(--text)' }}>Edit Profile</div>
                </div>

                <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
                  <div>
                    <label style={{ fontSize:12, fontWeight:700, color:'var(--text-sec)', textTransform:'uppercase', letterSpacing:'0.05em', display:'block', marginBottom:6 }}>Full Name</label>
                    <input value={form.name} onChange={e => setForm(f=>({...f,name:e.target.value}))} placeholder="Your name"
                      style={{ width:'100%', padding:'13px 16px', borderRadius:14, border:'1.5px solid var(--surface)', background:'var(--surface)', fontFamily:'Poppins,sans-serif', fontSize:14, color:'var(--text)', outline:'none' }} />
                  </div>
                  <div>
                    <label style={{ fontSize:12, fontWeight:700, color:'var(--text-sec)', textTransform:'uppercase', letterSpacing:'0.05em', display:'block', marginBottom:6 }}>Age</label>
                    <input type="number" value={form.age} onChange={e => setForm(f=>({...f,age:e.target.value}))} placeholder="Your age" min="8" max="80"
                      style={{ width:'100%', padding:'13px 16px', borderRadius:14, border:'1.5px solid var(--surface)', background:'var(--surface)', fontFamily:'Poppins,sans-serif', fontSize:14, color:'var(--text)', outline:'none' }} />
                  </div>
                  <div>
                    <label style={{ fontSize:12, fontWeight:700, color:'var(--text-sec)', textTransform:'uppercase', letterSpacing:'0.05em', display:'block', marginBottom:8 }}>Native Language</label>
                    <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                      {LANGUAGES.map(l => (
                        <button key={l} onClick={() => setForm(f=>({...f,nativeLanguage:l}))}
                          style={{ padding:'7px 14px', borderRadius:20, border:`1.5px solid ${form.nativeLanguage===l?'var(--purple)':'var(--surface)'}`, background:form.nativeLanguage===l?'rgba(124,58,237,0.12)':'var(--surface)', color:form.nativeLanguage===l?'var(--purple)':'var(--text-sec)', fontFamily:'Poppins,sans-serif', fontWeight:600, fontSize:12, cursor:'pointer' }}>
                          {l}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize:12, fontWeight:700, color:'var(--text-sec)', textTransform:'uppercase', letterSpacing:'0.05em', display:'block', marginBottom:8 }}>English Level</label>
                    <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                      {LEVELS.map(l => (
                        <button key={l} onClick={() => setForm(f=>({...f,englishLevel:l}))}
                          style={{ padding:'7px 14px', borderRadius:20, border:`1.5px solid ${form.englishLevel===l?'var(--purple)':'var(--surface)'}`, background:form.englishLevel===l?'rgba(124,58,237,0.12)':'var(--surface)', color:form.englishLevel===l?'var(--purple)':'var(--text-sec)', fontFamily:'Poppins,sans-serif', fontWeight:600, fontSize:12, cursor:'pointer' }}>
                          {l}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize:12, fontWeight:700, color:'var(--text-sec)', textTransform:'uppercase', letterSpacing:'0.05em', display:'block', marginBottom:8 }}>Study Goals <span style={{ color:'var(--purple)', fontWeight:500, textTransform:'none', fontSize:11 }}>(select multiple)</span></label>
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
                      {GOALS.map(g => {
                        const goals = form.studyGoals || (form.studyGoal ? [form.studyGoal] : []);
                        const sel = goals.includes(g);
                        return (
                          <button key={g} onClick={() => setForm(f => {
                            const cur = f.studyGoals || (f.studyGoal ? [f.studyGoal] : []);
                            const next = sel ? cur.filter(x => x !== g) : [...cur, g];
                            return { ...f, studyGoals: next, studyGoal: next[0] || '' };
                          })}
                            style={{ padding:'10px 12px', borderRadius:14, border:`1.5px solid ${sel?'var(--purple)':'var(--surface)'}`, background:sel?'rgba(124,58,237,0.12)':'var(--surface)', color:sel?'var(--purple)':'var(--text-sec)', fontFamily:'Poppins,sans-serif', fontWeight:600, fontSize:12, cursor:'pointer', textAlign:'left', position:'relative' }}>
                            {sel && <span style={{ position:'absolute', top:5, right:6, fontSize:10 }}>✅</span>}
                            {g}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div style={{ display:'flex', gap:12, marginTop:24 }}>
                  <button className="btn-outline" style={{ flex:1 }} onClick={() => setEditing(false)}>Cancel</button>
                  <button className="btn-primary" style={{ flex:2 }} onClick={handleSave}>💾 Save Changes</button>
                </div>
              </div>
            </div>
          )}

          {/* ── Level Progress ── */}
          <div style={{ background:'var(--grad-primary)', borderRadius:22, padding:20, boxShadow:'0 8px 24px var(--shadow-purple)' }} className="fade-up">
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:14 }}>
              <span style={{ fontSize:22 }}>🎓</span>
              <span style={{ fontWeight:700, fontSize:15, color:'#fff', flex:1 }}>Learning Level</span>
              <span style={{ background:'rgba(255,255,255,0.2)', border:'1px solid rgba(255,255,255,0.4)', borderRadius:20, padding:'5px 12px', fontSize:12, fontWeight:700, color:'#fff' }}>{profile.englishLevel}</span>
            </div>
            <div style={{ background:'rgba(255,255,255,0.2)', borderRadius:8, height:10, overflow:'hidden', marginBottom:10 }}>
              <div style={{ height:'100%', width:`${levelPct}%`, background:'rgba(255,255,255,0.9)', borderRadius:8, transition:'width 0.5s' }} />
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, color:'rgba(255,255,255,0.75)' }}>
              <span>Beginner</span><span style={{ fontWeight:600, color:'#fff' }}>{levelPct}% progress</span><span>Advanced</span>
            </div>
          </div>

          {/* ── AI Model Selection ── */}
          <div style={{ fontWeight:700, fontSize:16, color:'var(--text)' }}>🤖 AI Model</div>
          <div className="card fade-up" style={{ padding:16 }}>
            {/* Current selection preview */}
            <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:14, padding:'12px 14px', background:'var(--surface)', borderRadius:14 }}>
              <span style={{ fontSize:24 }}>{selectedModelObj.emoji}</span>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:700, fontSize:14, color:'var(--text)' }}>{selectedModelObj.label}</div>
                <div style={{ fontSize:12, color:'var(--text-sec)' }}>{selectedModelObj.sub}</div>
              </div>
              <div style={{ background:'var(--grad-primary)', borderRadius:8, padding:'3px 10px', fontSize:10, fontWeight:700, color:'#fff' }}>Active</div>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {MODELS.map(m => {
                const sel = profile.selectedModel === m.id;
                return (
                  <button key={m.id} onClick={() => saveProfile({ selectedModel: m.id })}
                    style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 14px', borderRadius:14,
                      border:`2px solid ${sel ? 'var(--purple)' : 'var(--surface)'}`,
                      background: sel ? 'rgba(124,58,237,0.08)' : 'transparent',
                      cursor:'pointer', fontFamily:'Poppins,sans-serif', transition:'all 0.2s', width:'100%', textAlign:'left' }}>
                    <span style={{ fontSize:20 }}>{m.emoji}</span>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:13, fontWeight:700, color:'var(--text)' }}>{m.label}</div>
                      <div style={{ fontSize:11, color:'var(--text-sec)' }}>{m.sub}</div>
                    </div>
                    {sel && (
                      <div style={{ width:20, height:20, borderRadius:'50%', background:'var(--purple)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                        <svg width="11" height="11" fill="#fff" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Gemini API Key ── */}
          <div style={{ fontWeight:700, fontSize:16, color:'var(--text)' }}>🔑 Gemini API Key</div>
          <div className="settings-card fade-up">
            <div className="settings-row" style={{ flexDirection:'column', alignItems:'flex-start', gap:10, borderBottom:'none' }}>
              <div style={{ display:'flex', alignItems:'center', gap:10, width:'100%' }}>
                <span style={{ fontSize:20 }}>🔑</span>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:700, fontSize:14, color:'var(--text)' }}>Google Gemini Key</div>
                  <div style={{ fontSize:11, color: profile.geminiKey ? 'var(--success)' : 'var(--text-sec)' }}>
                    {profile.geminiKey ? `✅ Key saved: ${maskedKey}` : 'Required only for Gemini models'}
                  </div>
                </div>
                <button onClick={() => setShowKey(s => !s)}
                  style={{ background: profile.geminiKey ? 'var(--surface)' : 'var(--grad-primary)', borderRadius:12, padding:'7px 14px', fontSize:12, fontWeight:700, color: profile.geminiKey ? 'var(--text-sec)' : '#fff', border:'none', cursor:'pointer', fontFamily:'Poppins,sans-serif', flexShrink:0 }}>
                  {profile.geminiKey ? '✏️ Edit' : '+ Add'}
                </button>
              </div>
              {showKey && (
                <div style={{ width:'100%', display:'flex', flexDirection:'column', gap:10 }} className="fade-up">
                  <input type="password" value={form.geminiKey || ''} onChange={e => setForm(f=>({...f,geminiKey:e.target.value}))} placeholder="AIza..."
                    style={{ width:'100%', padding:'12px 16px', borderRadius:14, border:'1.5px solid rgba(124,58,237,0.25)', background:'var(--surface)', fontFamily:'Poppins,sans-serif', fontSize:13, color:'var(--text)', outline:'none' }} />
                  <div style={{ fontSize:11, color:'var(--text-hint)', lineHeight:1.5 }}>
                    💡 Get a free key at{' '}
                    <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer" style={{ color:'var(--purple)', fontWeight:600 }}>aistudio.google.com/apikey</a>
                  </div>
                  <div style={{ display:'flex', gap:10 }}>
                    {profile.geminiKey && (
                      <button onClick={() => { saveProfile({ geminiKey:'' }); setForm(f=>({...f,geminiKey:''})); setShowKey(false); }}
                        style={{ flex:1, padding:'10px', borderRadius:12, border:'1px solid rgba(239,68,68,0.3)', background:'rgba(239,68,68,0.08)', color:'var(--error)', fontFamily:'Poppins,sans-serif', fontSize:13, fontWeight:600, cursor:'pointer' }}>
                        🗑️ Remove
                      </button>
                    )}
                    <button className="btn-primary" style={{ flex:2, padding:'10px' }} onClick={saveGeminiKey}>💾 Save Key</button>
                  </div>
                </div>
              )}
              {keySaved && (
                <div style={{ width:'100%', background:'#D1FAE5', borderRadius:12, padding:'10px 14px', fontSize:12, fontWeight:600, color:'#059669' }} className="fade-up">
                  ✅ Key saved! You can now use Gemini models.
                </div>
              )}
              <div style={{ width:'100%', padding:'10px 14px', background:'rgba(124,58,237,0.06)', borderRadius:12, fontSize:12, color:'var(--text-sec)', lineHeight:1.5 }}>
                💡 <strong>Kimi models work without any key</strong> — they use the server's built-in key. Gemini requires your own.
              </div>
            </div>
          </div>

          {/* ── App Settings ── */}
          <div style={{ fontWeight:700, fontSize:16, color:'var(--text)' }}>Settings</div>
          <div className="settings-card fade-up">
            <div className="settings-row">
              <span style={{ fontSize:20 }}>🌙</span>
              <span style={{ flex:1, fontWeight:600, fontSize:14, color:'var(--text)' }}>Dark Mode</span>
              <button className={`toggle ${darkMode ? 'on' : 'off'}`} onClick={toggleDark} />
            </div>
            <div className="settings-row">
              <span style={{ fontSize:20 }}>🌐</span>
              <span style={{ flex:1, fontWeight:600, fontSize:14, color:'var(--text)' }}>App Language</span>
              <span style={{ fontWeight:600, fontSize:13, color:'var(--purple)' }}>English</span>
            </div>
            <div className="settings-row" style={{ borderBottom:'none' }}>
              <span style={{ fontSize:20 }}>🔊</span>
              <span style={{ flex:1, fontWeight:600, fontSize:14, color:'var(--text)' }}>Voice Speed</span>
              <span style={{ fontWeight:600, fontSize:13, color:'var(--purple)' }}>Normal</span>
            </div>
          </div>

          {/* ── Reset ── */}
          <button style={{ width:'100%', height:54, borderRadius:18, border:'1.5px solid rgba(239,68,68,0.3)', background:'rgba(239,68,68,0.08)', color:'var(--error)', fontFamily:'Poppins, sans-serif', fontSize:14, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:10 }}
            onClick={() => { if (confirm('Reset all data and go back to onboarding?')) { localStorage.removeItem('sf_profile'); router.replace('/onboarding'); } }}>
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>
            </svg>
            Reset & Start Over
          </button>
        </div>
      </div>
      <BottomNav />
    </>
  );
}
