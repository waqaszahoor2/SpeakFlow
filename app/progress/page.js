'use client';
import BottomNav from '../components/BottomNav';

const WEEKLY = [
  { day:'Mon', score:72 }, { day:'Tue', score:85 }, { day:'Wed', score:60 },
  { day:'Thu', score:90 }, { day:'Fri', score:78 }, { day:'Sat', score:95 }, { day:'Sun', score:88 },
];

const STATS = [
  { emoji:'🎯', val:'87%',  lbl:'Accuracy',  grad:'var(--grad-primary)' },
  { emoji:'⏱️', val:'4.2h', lbl:'Speak Time', grad:'var(--grad-blue)' },
  { emoji:'📖', val:'284',  lbl:'Vocab',      grad:'var(--grad-mint)' },
  { emoji:'🔥', val:'14d',  lbl:'Streak',     grad:'var(--grad-sunset)' },
];

const ACHIEVEMENTS = [
  { emoji:'🎯', title:'First Steps',   unlocked:true },
  { emoji:'🔥', title:'Week Warrior',  unlocked:true },
  { emoji:'📝', title:'Grammar Pro',   unlocked:true },
  { emoji:'⚡', title:'Speed Talker',  unlocked:false },
  { emoji:'👑', title:'Vocab King',    unlocked:false },
  { emoji:'🌟', title:'Fluency God',   unlocked:false },
];

export default function ProgressPage() {
  const streakDays = 14;
  const today = new Date().getDate();
  const maxScore = Math.max(...WEEKLY.map(w => w.score));

  return (
    <>
      <div style={{ paddingBottom:'calc(var(--nav-h) + 16px)', overflowY:'auto', height:'100dvh' }}>
        {/* Header */}
        <div className="hero-header fade-up">
          <div style={{ fontSize:26, fontWeight:800, color:'#fff', marginBottom:4 }}>Your Progress</div>
          <div style={{ fontSize:14, color:'rgba(255,255,255,0.8)' }}>Keep going — you're on fire! 🔥</div>
        </div>

        <div className="page-content">
          {/* Stats Row */}
          <div className="stats-grid fade-up">
            {STATS.map((s, i) => (
              <div key={i} className="stat-card" style={{ background: s.grad }}>
                <span style={{ fontSize:22 }}>{s.emoji}</span>
                <span className="val">{s.val}</span>
                <span className="lbl">{s.lbl}</span>
              </div>
            ))}
          </div>

          {/* Weekly Chart */}
          <div className="card fade-up" style={{ padding:20 }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:20 }}>
              <span style={{ fontSize:20 }}>📊</span>
              <span style={{ fontWeight:700, fontSize:15, color:'var(--text)', flex:1 }}>Weekly Speaking Score</span>
              <span style={{ background:'var(--grad-primary)', borderRadius:8, padding:'4px 10px',
                fontSize:11, fontWeight:600, color:'#fff' }}>This Week</span>
            </div>
            <div className="bar-chart" style={{ alignItems:'flex-end' }}>
              {WEEKLY.map((w, i) => (
                <div key={i} className="bar-col">
                  <div className={`bar${w.score < 80 ? ' low' : ''}`}
                    style={{ height:`${(w.score / 100) * 120}px` }} />
                  <span className="bar-lbl">{w.day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Calendar */}
          <div className="card fade-up" style={{ padding:20 }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:16 }}>
              <span style={{ fontSize:20 }}>🗓️</span>
              <span style={{ fontWeight:700, fontSize:15, color:'var(--text)', flex:1 }}>Activity Calendar</span>
              <span style={{ fontSize:12, fontWeight:600, color:'var(--purple)' }}>{streakDays} day streak 🔥</span>
            </div>
            <div className="cal-grid">
              {Array.from({ length: 28 }, (_, i) => (
                <div key={i} className={`cal-cell${i < streakDays ? ' active' : ''}${i === today-1 ? ' today' : ''}`}>
                  {i < streakDays && <span style={{ fontSize:10, color:'#fff' }}>✓</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Achievements */}
          <div style={{ fontSize:16, fontWeight:700, color:'var(--text)' }}>Achievements 🏆</div>
          <div className="ach-grid fade-up">
            {ACHIEVEMENTS.map((a, i) => (
              <div key={i} className={`ach-card${a.unlocked ? ' unlocked' : ''}`}>
                <div className="ach-emoji">{a.emoji}
                  {!a.unlocked && (
                    <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center',
                      justifyContent:'center', background:'rgba(255,255,255,0.65)', borderRadius:'50%', fontSize:12 }}>🔒</div>
                  )}
                </div>
                <span className="ach-title">{a.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <BottomNav />
    </>
  );
}
