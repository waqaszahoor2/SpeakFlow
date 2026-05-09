'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import BottomNav from '../components/BottomNav';

const user = { name: 'Alex Johnson', level: 'Intermediate', xp: 2840, streak: 14, todayMin: 18, goalMin: 30 };

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  return 'Good Evening';
}

export default function HomePage() {
  const router = useRouter();
  const [pulse, setPulse] = useState(false);
  const today = new Date().getDay(); // 0=Sun
  const dayNames = ['S','M','T','W','T','F','S'];
  const progress = user.todayMin / user.goalMin;

  useEffect(() => {
    const t = setInterval(() => setPulse(p => !p), 2000);
    return () => clearInterval(t);
  }, []);

  const quickActions = [
    { emoji: '📚', label: 'Practice\nTopics',    grad: 'var(--grad-primary)', path: '/topics' },
    { emoji: '❌', label: 'My\nMistakes',        grad: 'var(--grad-sunset)',  path: '/grammar' },
    { emoji: '📖', label: 'Vocabulary',           grad: 'var(--grad-mint)',    path: null },
    { emoji: '🎤', label: 'Pronunciation',        grad: 'var(--grad-rose)',    path: '/conversation' },
  ];

  return (
    <>
      <div style={{ paddingBottom: 'var(--nav-h)', overflowY: 'auto', height: '100vh' }}>
        {/* ── Header ── */}
        <div className="hero-header fade-up">
          <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20 }}>
            <div style={{ width:50, height:50, borderRadius:'50%', background:'var(--grad-rose)',
              border:'2px solid rgba(255,255,255,0.5)', display:'flex', alignItems:'center',
              justifyContent:'center', fontSize:20, fontWeight:700, color:'#fff', flexShrink:0 }}>
              {user.name[0]}
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:12, color:'rgba(255,255,255,0.8)', fontWeight:500 }}>{greeting()} 👋</div>
              <div style={{ fontSize:18, fontWeight:700, color:'#fff' }}>{user.name}</div>
            </div>
            <div style={{ width:44, height:44, borderRadius:'50%', background:'rgba(255,255,255,0.15)',
              border:'1px solid rgba(255,255,255,0.25)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              🔔
            </div>
          </div>
          <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
            <span className="chip">⚡ {user.xp} XP</span>
            <span className="chip">🏆 {user.level}</span>
            <span className="chip">🔥 {user.streak} days</span>
          </div>
        </div>

        <div className="page-content">
          {/* ── AI Tutor Card ── */}
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
              <div style={{ display:'inline-flex', alignItems:'center', gap:6, background:'#fff',
                borderRadius:12, padding:'8px 16px' }}>
                <span style={{ fontSize:16 }}>▶️</span>
                <span style={{ fontSize:13, fontWeight:700, color:'var(--purple)' }}>Start Conversation</span>
              </div>
            </div>
          </div>

          {/* ── Daily Goal ── */}
          <div className="card fade-up" style={{ padding:20 }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:14 }}>
              <span style={{ fontSize:20 }}>🎯</span>
              <span style={{ fontWeight:700, fontSize:15, color:'var(--text)', flex:1 }}>Daily Goal</span>
              <span style={{ background:'var(--grad-primary)', borderRadius:8, padding:'4px 10px',
                fontSize:11, fontWeight:600, color:'#fff' }}>{user.todayMin}/{user.goalMin} min</span>
            </div>
            <div className="progress-bar" style={{ height:10, marginBottom:10 }}>
              <div className="progress-fill" style={{ width:`${Math.min(progress,1)*100}%` }} />
            </div>
            <div style={{ fontSize:12, color:'var(--text-sec)' }}>
              {progress >= 1 ? '✅ Goal achieved! Amazing work!' :
                `${Math.ceil((1-progress)*user.goalMin)} minutes left to hit your goal`}
            </div>
          </div>

          {/* ── Quick Actions ── */}
          <div style={{ fontSize:16, fontWeight:700, color:'var(--text)' }}>Quick Actions</div>
          <div className="qa-grid">
            {quickActions.map((a, i) => (
              <div key={i} className="qa-card fade-up"
                style={{ background: a.grad, animationDelay: `${i*80}ms` }}
                onClick={() => a.path && router.push(a.path)}>
                <span className="qa-emoji">{a.emoji}</span>
                <span className="qa-label" style={{ whiteSpace:'pre-line' }}>{a.label}</span>
              </div>
            ))}
          </div>

          {/* ── Streak ── */}
          <div className="card fade-up" style={{ padding:20 }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:16 }}>
              <span style={{ fontSize:20 }}>🔥</span>
              <span style={{ fontWeight:700, fontSize:15, color:'var(--text)', flex:1 }}>Daily Streak</span>
              <span style={{ fontWeight:700, color:'var(--purple)', fontSize:14 }}>{user.streak} days</span>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between' }}>
              {dayNames.map((d, i) => {
                const active = i < (today === 0 ? 7 : today);
                const isToday = i === (today === 0 ? 6 : today - 1);
                return (
                  <div key={i} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:6 }}>
                    <div style={{ width:36, height:36, borderRadius:'50%', display:'flex',
                      alignItems:'center', justifyContent:'center', fontSize:14,
                      background: active ? 'var(--grad-primary)' : 'var(--surface)',
                      outline: isToday ? '2px solid var(--purple)' : 'none',
                      boxShadow: active ? '0 2px 8px var(--shadow-purple)' : 'none' }}>
                      {active ? '✓' : ''}
                    </div>
                    <span style={{ fontSize:11, fontWeight:600, color: active ? 'var(--purple)' : 'var(--text-hint)' }}>{d}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <BottomNav />
    </>
  );
}
