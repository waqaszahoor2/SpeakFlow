'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import BottomNav from '../components/BottomNav';

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  return 'Good Evening';
}

export default function HomePage() {
  const router = useRouter();
  const [pulse, setPulse] = useState(false);
  const [profile, setProfile] = useState(null);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [goalInput, setGoalInput] = useState('');

  useEffect(() => {
    const raw = localStorage.getItem('sf_profile');
    if (raw) {
      try { setProfile(JSON.parse(raw)); } catch {}
    }
    const t = setInterval(() => setPulse(p => !p), 2000);
    return () => clearInterval(t);
  }, []);

  const saveProfile = (updates) => {
    const next = { ...profile, ...updates };
    setProfile(next);
    localStorage.setItem('sf_profile', JSON.stringify(next));
  };

  const saveGoal = () => {
    const val = parseInt(goalInput, 10);
    if (!val || val < 1 || val > 480) return;
    saveProfile({ dailyGoalMin: val });
    setShowGoalModal(false);
    setGoalInput('');
  };

  if (!profile) return null;

  const { name, englishLevel, xp = 0, dailyGoalMin, todayMin = 0, checkedDays = [] } = profile;
  const today = new Date().getDay();
  const dayNames = ['S','M','T','W','T','F','S'];
  const progress = dailyGoalMin ? todayMin / dailyGoalMin : 0;

  const quickActions = [
    { emoji:'📚', label:'Practice\nTopics',  grad:'var(--grad-primary)', path:'/topics' },
    { emoji:'❌', label:'My\nMistakes',      grad:'var(--grad-sunset)',  path:'/grammar' },
    { emoji:'📖', label:'Vocabulary',         grad:'var(--grad-mint)',    path:'/vocabulary' },
    { emoji:'📦', label:'Batches',            grad:'var(--grad-blue)',    path:'/batches' },
  ];

  return (
    <>
      <div style={{ paddingBottom:'var(--nav-h)', overflowY:'auto', height:'100dvh' }}>
        {/* Header */}
        <div className="hero-header fade-up">
          <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20 }}>
            {/* App logo */}
            <div style={{ width:42, height:42, borderRadius:13, background:'linear-gradient(135deg,#7C3AED,#EC4899)', padding:2, boxShadow:'0 4px 14px rgba(124,58,237,0.4)', flexShrink:0 }}>
              <div style={{ width:'100%', height:'100%', borderRadius:11, overflow:'hidden', background:'#1a0a3d', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <img src="/logo.png" alt="SpeakFlow" style={{ width:32, height:32, objectFit:'contain' }} />
              </div>
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:11, color:'rgba(255,255,255,0.7)', fontWeight:600, letterSpacing:'0.04em' }}>SPEAKFLOW</div>
              <div style={{ fontSize:16, fontWeight:700, color:'#fff' }}>{greeting()}, {name?.split(' ')[0] || 'Learner'} 👋</div>
            </div>
            <div onClick={() => router.push('/profile')}
              style={{ width:42, height:42, borderRadius:'50%', background:'var(--grad-rose)',
                border:'2px solid rgba(255,255,255,0.4)', display:'flex', alignItems:'center',
                justifyContent:'center', fontSize:18, fontWeight:700, color:'#fff', flexShrink:0, cursor:'pointer', boxShadow:'0 4px 12px rgba(236,72,153,0.35)' }}>
              {name ? name[0].toUpperCase() : '?'}
            </div>
          </div>
          <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
            <span className="chip">⚡ {xp} XP</span>
            <span className="chip">🏆 {englishLevel || 'Beginner'}</span>
            {checkedDays.length > 0 && (
              <span className="chip">🔥 {checkedDays.length} day streak</span>
            )}
          </div>
        </div>

        <div className="page-content">
          {/* AI Tutor Card */}
          <div onClick={() => router.push('/conversation')}
            className={pulse ? 'pulse' : ''}
            style={{ background:'var(--grad-primary)', borderRadius:28, padding:24, cursor:'pointer',
              boxShadow:'0 12px 32px var(--shadow-purple)', display:'flex', gap:16, alignItems:'center',
              transition:'transform 0.15s', WebkitTapHighlightColor:'transparent' }}
            onMouseDown={e => e.currentTarget.style.transform='scale(0.98)'}
            onMouseUp={e => e.currentTarget.style.transform='scale(1)'}
            onTouchStart={e => e.currentTarget.style.transform='scale(0.98)'}
            onTouchEnd={e => e.currentTarget.style.transform='scale(1)'}>
            <div style={{ width:72, height:72, borderRadius:'50%', background:'rgba(255,255,255,0.2)',
              border:'2px solid rgba(255,255,255,0.4)', display:'flex', alignItems:'center',
              justifyContent:'center', fontSize:36, flexShrink:0 }}>🤖</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:18, fontWeight:700, color:'#fff', marginBottom:4 }}>AI English Tutor</div>
              <div style={{ fontSize:12, color:'rgba(255,255,255,0.85)', lineHeight:1.4, marginBottom:14 }}>
                Ready to practice? Let's have a conversation! 💬
              </div>
              <div style={{ display:'inline-flex', alignItems:'center', gap:6, background:'#fff', borderRadius:12, padding:'8px 16px' }}>
                <span style={{ fontSize:16 }}>▶️</span>
                <span style={{ fontSize:13, fontWeight:700, color:'var(--purple)' }}>Start Conversation</span>
              </div>
            </div>
          </div>

          {/* Daily Goal — only show when set OR let user set it */}
          {dailyGoalMin ? (
            progress >= 1 ? (
              // Goal achieved banner
              <div className="card fade-up" style={{ padding:18, background:'linear-gradient(135deg,#10B981,#34D399)', display:'flex', alignItems:'center', gap:14 }}>
                <span style={{ fontSize:36 }}>🎯</span>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:800, fontSize:15, color:'#fff' }}>Daily Goal Achieved!</div>
                  <div style={{ fontSize:12, color:'rgba(255,255,255,0.9)' }}>{dailyGoalMin} min of practice today ✅</div>
                </div>
                <button onClick={() => setShowGoalModal(true)} style={{ background:'rgba(255,255,255,0.25)', border:'none', borderRadius:10, padding:'6px 12px', fontSize:11, fontWeight:700, color:'#fff', cursor:'pointer', fontFamily:'Poppins,sans-serif' }}>Edit</button>
              </div>
            ) : (
              <div className="card fade-up" style={{ padding:20 }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:14 }}>
                  <span style={{ fontSize:20 }}>🎯</span>
                  <span style={{ fontWeight:700, fontSize:15, color:'var(--text)', flex:1 }}>Daily Goal</span>
                  <span style={{ background:'var(--grad-primary)', borderRadius:8, padding:'4px 10px', fontSize:11, fontWeight:600, color:'#fff' }}>{todayMin}/{dailyGoalMin} min</span>
                  <button onClick={() => { setGoalInput(String(dailyGoalMin)); setShowGoalModal(true); }} style={{ border:'none', background:'var(--surface)', borderRadius:8, padding:'4px 8px', cursor:'pointer', fontSize:11, color:'var(--text-sec)', fontFamily:'Poppins,sans-serif', fontWeight:600 }}>✏️ Edit</button>
                </div>
                <div className="progress-bar" style={{ height:10, marginBottom:10 }}>
                  <div className="progress-fill" style={{ width:`${Math.min(progress,1)*100}%` }} />
                </div>
                <div style={{ fontSize:12, color:'var(--text-sec)' }}>
                  {Math.ceil((1-progress)*dailyGoalMin)} minutes left to hit your goal
                </div>
              </div>
            )
          ) : (
            <div className="card fade-up" style={{ padding:20, border:'1.5px dashed rgba(124,58,237,0.3)', cursor:'pointer' }}
              onClick={() => setShowGoalModal(true)}>
              <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                <div style={{ width:48, height:48, borderRadius:16, background:'var(--surface)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22 }}>🎯</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:700, fontSize:14, color:'var(--text)', marginBottom:3 }}>Set a Daily Goal</div>
                  <div style={{ fontSize:12, color:'var(--text-sec)' }}>Tap to set how many minutes to study each day</div>
                </div>
                <div style={{ background:'var(--grad-primary)', borderRadius:12, padding:'8px 14px', fontSize:12, fontWeight:700, color:'#fff' }}>Set Goal</div>
              </div>
            </div>
          )}

          {/* Goal Modal */}
          {showGoalModal && (
            <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}
              onClick={e => { if (e.target === e.currentTarget) setShowGoalModal(false); }}>
              <div style={{ background:'var(--card)', borderRadius:24, padding:28, width:'100%', maxWidth:360, boxShadow:'0 20px 60px rgba(0,0,0,0.2)' }} className="fade-up">
                <div style={{ fontWeight:800, fontSize:18, color:'var(--text)', marginBottom:6 }}>🎯 Daily Goal</div>
                <div style={{ fontSize:13, color:'var(--text-sec)', marginBottom:20 }}>How many minutes do you want to study each day?</div>
                <div style={{ display:'flex', gap:8, marginBottom:16, flexWrap:'wrap' }}>
                  {[10,15,20,30,45,60].map(v => (
                    <button key={v} onClick={() => setGoalInput(String(v))}
                      style={{ padding:'8px 14px', borderRadius:20, border:'none',
                        background: goalInput===String(v) ? 'var(--grad-primary)' : 'var(--surface)',
                        color: goalInput===String(v) ? '#fff' : 'var(--text-sec)',
                        fontFamily:'Poppins,sans-serif', fontWeight:600, fontSize:13, cursor:'pointer' }}>
                      {v} min
                    </button>
                  ))}
                </div>
                <input className="input-pill" value={goalInput} onChange={e => setGoalInput(e.target.value)}
                  placeholder="Custom (minutes)..." type="number" min="1" max="480"
                  style={{ width:'100%', marginBottom:16, display:'block', borderRadius:14, padding:'12px 16px', fontSize:14 }} />
                <div style={{ display:'flex', gap:12 }}>
                  <button className="btn-outline" style={{ flex:1 }} onClick={() => setShowGoalModal(false)}>Cancel</button>
                  <button className="btn-primary" style={{ flex:1 }} onClick={saveGoal}>Save Goal</button>
                </div>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div style={{ fontSize:16, fontWeight:700, color:'var(--text)' }}>Quick Actions</div>
          <div className="qa-grid">
            {quickActions.map((a, i) => (
              <div key={i} className="qa-card fade-up"
                style={{ background: a.grad, animationDelay:`${i*80}ms` }}
                onClick={() => a.path && router.push(a.path)}>
                <span className="qa-emoji">{a.emoji}</span>
                <span className="qa-label" style={{ whiteSpace:'pre-line' }}>{a.label}</span>
              </div>
            ))}
          </div>

          {/* Daily Streak */}
          <div className="card fade-up" style={{ padding:20 }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:16 }}>
              <span style={{ fontSize:20 }}>🔥</span>
              <span style={{ fontWeight:700, fontSize:15, color:'var(--text)', flex:1 }}>Daily Streak</span>
              {checkedDays.length > 0 && (
                <span style={{ fontWeight:700, color:'var(--purple)', fontSize:14 }}>{checkedDays.length} days 🔥</span>
              )}
            </div>
            <div style={{ display:'flex', justifyContent:'space-between' }}>
              {dayNames.map((d, i) => {
                const active = checkedDays.includes(i);
                const isToday = i === today;
                return (
                  <div key={i} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:6 }}>
                    <div style={{ width:36, height:36, borderRadius:'50%', display:'flex',
                      alignItems:'center', justifyContent:'center', fontSize:14,
                      background: active ? 'var(--grad-primary)' : 'var(--surface)',
                      outline: isToday ? '2px solid var(--purple)' : 'none',
                      boxShadow: active ? '0 2px 8px var(--shadow-purple)' : 'none' }}>
                      {active ? '✓' : ''}
                    </div>
                    <span style={{ fontSize:11, fontWeight:600, color: active ? 'var(--purple)' : isToday ? 'var(--text)' : 'var(--text-hint)' }}>{d}</span>
                  </div>
                );
              })}
            </div>
            {checkedDays.length === 0 && (
              <div style={{ marginTop:12, textAlign:'center', fontSize:12, color:'var(--text-sec)' }}>
                Complete a practice session to start your streak! 💪
              </div>
            )}
          </div>
        </div>
      </div>
      <BottomNav />
    </>
  );
}
