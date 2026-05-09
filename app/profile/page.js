'use client';
import { useState } from 'react';
import BottomNav from '../components/BottomNav';

const user = { name:'Alex Johnson', email:'alex@speakflow.ai', level:'Intermediate', xp:2840, streak:14, premium:false };

const levels = ['Beginner','Elementary','Intermediate','Upper-Intermediate','Advanced','Fluent'];
const levelIdx = levels.indexOf(user.level);
const levelPct = Math.round(((levelIdx + 0.6) / levels.length) * 100);

const OPTIONS = [
  { emoji:'🔖', label:'Saved Mistakes', grad:'var(--grad-sunset)' },
  { emoji:'🏆', label:'Achievements',   grad:'var(--grad-primary)' },
  { emoji:'❓', label:'Help & Support', grad:'var(--grad-mint)' },
  { emoji:'🔒', label:'Privacy Policy', grad:'var(--grad-blue)' },
];

export default function ProfilePage() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifs, setNotifs] = useState(true);

  const toggleDark = () => {
    setDarkMode(d => !d);
    document.getElementById('app-root')?.classList.toggle('dark');
  };

  return (
    <>
      <div style={{ paddingBottom:'calc(var(--nav-h) + 16px)', overflowY:'auto', height:'100vh' }}>
        {/* Profile Header */}
        <div className="hero-header fade-up" style={{ paddingBottom:32, textAlign:'center' }}>
          <div style={{ position:'relative', display:'inline-block', marginBottom:14 }}>
            <div style={{ width:90, height:90, borderRadius:'50%', background:'var(--grad-rose)',
              border:'3px solid rgba(255,255,255,0.5)', display:'flex', alignItems:'center',
              justifyContent:'center', fontSize:36, fontWeight:800, color:'#fff',
              boxShadow:'0 8px 24px var(--shadow-purple)', margin:'0 auto' }}>{user.name[0]}</div>
            <div style={{ position:'absolute', bottom:0, right:0, width:28, height:28, borderRadius:'50%',
              background:'#fff', display:'flex', alignItems:'center', justifyContent:'center',
              boxShadow:'0 2px 8px rgba(0,0,0,0.15)', fontSize:13 }}>📷</div>
          </div>
          <div style={{ fontSize:22, fontWeight:800, color:'#fff', marginBottom:4 }}>{user.name}</div>
          <div style={{ fontSize:13, color:'rgba(255,255,255,0.75)', marginBottom:16 }}>{user.email}</div>
          <div style={{ display:'flex', justifyContent:'center', alignItems:'center', gap:0 }}>
            <div className="profile-stat"><span className="val">{user.xp}</span><span className="lbl">XP</span></div>
            <div className="profile-divider" style={{ margin:'0 24px' }} />
            <div className="profile-stat"><span className="val">{user.streak}d</span><span className="lbl">Streak</span></div>
            <div className="profile-divider" style={{ margin:'0 24px' }} />
            <div className="profile-stat"><span className="val">{user.level}</span><span className="lbl">Level</span></div>
          </div>
        </div>

        <div className="page-content">
          {/* Level Card */}
          <div style={{ background:'var(--grad-primary)', borderRadius:22, padding:20,
            boxShadow:'0 8px 24px var(--shadow-purple)' }} className="fade-up">
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:16 }}>
              <span style={{ fontSize:22 }}>🎓</span>
              <span style={{ fontWeight:700, fontSize:15, color:'#fff', flex:1 }}>Learning Level</span>
              <span style={{ background:'rgba(255,255,255,0.2)', border:'1px solid rgba(255,255,255,0.4)',
                borderRadius:20, padding:'5px 12px', fontSize:12, fontWeight:700, color:'#fff' }}>{user.level}</span>
            </div>
            <div style={{ background:'rgba(255,255,255,0.2)', borderRadius:8, height:10, overflow:'hidden', marginBottom:10 }}>
              <div style={{ height:'100%', width:`${levelPct}%`, background:'rgba(255,255,255,0.9)', borderRadius:8, transition:'width 0.5s' }} />
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, color:'rgba(255,255,255,0.75)' }}>
              <span>Beginner</span>
              <span style={{ fontWeight:600, color:'#fff' }}>{levelPct}% to Advanced</span>
              <span>Fluent</span>
            </div>
          </div>

          {/* Subscription */}
          <div className="sub-card fade-up">
            <div style={{ width:52, height:52, borderRadius:16, background: user.premium ? 'var(--grad-sunset)' : 'var(--grad-primary)',
              display:'flex', alignItems:'center', justifyContent:'center', fontSize:24, flexShrink:0 }}>
              {user.premium ? '⭐' : '💫'}
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:700, fontSize:15, color:'var(--text)', marginBottom:2 }}>
                {user.premium ? 'Premium Plan' : 'Free Plan'}
              </div>
              <div style={{ fontSize:12, color:'var(--text-sec)' }}>
                {user.premium ? 'All features unlocked ✨' : 'Upgrade to unlock all features'}
              </div>
            </div>
            {!user.premium && (
              <div style={{ background:'var(--grad-primary)', borderRadius:12, padding:'8px 14px',
                fontSize:12, fontWeight:700, color:'#fff', cursor:'pointer', flexShrink:0 }}>Upgrade</div>
            )}
          </div>

          {/* Settings */}
          <div style={{ fontWeight:700, fontSize:16, color:'var(--text)' }}>Settings</div>
          <div className="settings-card fade-up">
            <div className="settings-row">
              <span style={{ fontSize:20 }}>🌙</span>
              <span style={{ flex:1, fontWeight:600, fontSize:14, color:'var(--text)' }}>Dark Mode</span>
              <button className={`toggle ${darkMode ? 'on' : 'off'}`} onClick={toggleDark} />
            </div>
            <div className="settings-row">
              <span style={{ fontSize:20 }}>🔔</span>
              <span style={{ flex:1, fontWeight:600, fontSize:14, color:'var(--text)' }}>Notifications</span>
              <button className={`toggle ${notifs ? 'on' : 'off'}`} onClick={() => setNotifs(n => !n)} />
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

          {/* More Options */}
          <div className="settings-card fade-up">
            {OPTIONS.map((o, i) => (
              <div key={i} className="settings-row" style={{ cursor:'pointer', borderBottom: i < OPTIONS.length-1 ? undefined : 'none' }}>
                <div style={{ width:38, height:38, borderRadius:12, background: o.grad,
                  display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>{o.emoji}</div>
                <span style={{ flex:1, fontWeight:600, fontSize:14, color:'var(--text)' }}>{o.label}</span>
                <svg width="20" height="20" fill="none" stroke="var(--text-hint)" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="m9 18 6-6-6-6"/>
                </svg>
              </div>
            ))}
          </div>

          {/* Sign Out */}
          <button style={{ width:'100%', height:54, borderRadius:18, border:'1.5px solid rgba(239,68,68,0.3)',
            background:'rgba(239,68,68,0.08)', color:'var(--error)', fontFamily:'Poppins, sans-serif',
            fontSize:15, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center',
            justifyContent:'center', gap:10 }}
            onClick={() => alert('Sign out not implemented')}>
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Sign Out
          </button>
        </div>
      </div>
      <BottomNav />
    </>
  );
}
