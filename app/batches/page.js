'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import BottomNav from '../components/BottomNav';

const BATCHES = [
  {
    id: 1,
    title: 'Beginner Bootcamp',
    description: 'Start from scratch and build a solid English foundation',
    emoji: '🌱',
    grad: 'var(--grad-mint)',
    level: 'Beginner',
    sessions: 10,
    duration: '2 weeks',
    completed: 0,
    enrolled: false,
    topics: ['Introductions', 'Numbers & Time', 'Daily Routines', 'Shopping'],
  },
  {
    id: 2,
    title: 'IELTS Sprint',
    description: 'Intensive 4-week prep for IELTS band 7+ speaking',
    emoji: '🎯',
    grad: 'var(--grad-primary)',
    level: 'Advanced',
    sessions: 20,
    duration: '4 weeks',
    completed: 0,
    enrolled: false,
    topics: ['Part 1 Fluency', 'Part 2 Long Turn', 'Part 3 Discussion', 'Pronunciation'],
  },
  {
    id: 3,
    title: 'Business English Pro',
    description: 'Master professional communication, emails & presentations',
    emoji: '💼',
    grad: 'var(--grad-blue)',
    level: 'Intermediate',
    sessions: 15,
    duration: '3 weeks',
    completed: 0,
    enrolled: false,
    topics: ['Email Writing', 'Meetings', 'Negotiations', 'Presentations'],
  },
  {
    id: 4,
    title: 'Travel Talk',
    description: 'Communicate confidently in airports, hotels & restaurants',
    emoji: '✈️',
    grad: 'var(--grad-sunset)',
    level: 'Beginner',
    sessions: 8,
    duration: '10 days',
    completed: 0,
    enrolled: false,
    topics: ['Airport', 'Hotel Check-in', 'Ordering Food', 'Navigation'],
  },
  {
    id: 5,
    title: 'Pronunciation Masterclass',
    description: 'Eliminate your accent and speak with native clarity',
    emoji: '🎤',
    grad: 'var(--grad-rose)',
    level: 'Intermediate',
    sessions: 12,
    duration: '3 weeks',
    completed: 0,
    enrolled: false,
    topics: ['Vowel Sounds', 'Consonants', 'Stress & Rhythm', 'Intonation'],
  },
];

function diffClass(d) {
  if (d === 'Advanced') return 'badge badge-advanced';
  if (d === 'Intermediate') return 'badge badge-intermediate';
  return 'badge badge-beginner';
}

export default function BatchesPage() {
  const router = useRouter();
  const [batches, setBatches] = useState(BATCHES);
  const [tab, setTab] = useState('all'); // 'all' | 'enrolled'
  const [expanded, setExpanded] = useState(null);

  const displayed = tab === 'enrolled' ? batches.filter(b => b.enrolled) : batches;

  const toggleEnroll = (id) => {
    setBatches(bs => bs.map(b => b.id === id ? { ...b, enrolled: !b.enrolled, completed: b.enrolled ? 0 : b.completed } : b));
  };

  const enrolledCount = batches.filter(b => b.enrolled).length;
  const completedCount = batches.filter(b => b.enrolled && b.completed === b.sessions).length;

  return (
    <>
      <div style={{ paddingBottom:'calc(var(--nav-h) + 16px)', overflowY:'auto', height:'100vh' }}>
        {/* Header */}
        <div className="hero-header fade-up">
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
            <button onClick={() => router.back()} style={{ width:38, height:38, borderRadius:'50%', background:'rgba(255,255,255,0.2)', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <svg width="16" height="16" fill="none" stroke="#fff" strokeWidth="2.5" viewBox="0 0 24 24"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <div style={{ fontSize:22, fontWeight:800, color:'#fff' }}>📦 Batches</div>
            <div style={{ width:38, height:38 }} />
          </div>
          <div style={{ fontSize:13, color:'rgba(255,255,255,0.8)', marginBottom:14 }}>
            Structured learning courses — focused, timed, and goal-driven! 🏋️
          </div>
          <div style={{ display:'flex', gap:10 }}>
            <div style={{ flex:1, background:'rgba(255,255,255,0.15)', borderRadius:16, padding:'10px 14px', display:'flex', flexDirection:'column', alignItems:'center', gap:2 }}>
              <span style={{ fontSize:20, fontWeight:800, color:'#fff' }}>{enrolledCount}</span>
              <span style={{ fontSize:10, color:'rgba(255,255,255,0.7)', fontWeight:600 }}>Enrolled</span>
            </div>
            <div style={{ flex:1, background:'rgba(255,255,255,0.15)', borderRadius:16, padding:'10px 14px', display:'flex', flexDirection:'column', alignItems:'center', gap:2 }}>
              <span style={{ fontSize:20, fontWeight:800, color:'#fff' }}>{completedCount}</span>
              <span style={{ fontSize:10, color:'rgba(255,255,255,0.7)', fontWeight:600 }}>Completed</span>
            </div>
            <div style={{ flex:1, background:'rgba(255,255,255,0.15)', borderRadius:16, padding:'10px 14px', display:'flex', flexDirection:'column', alignItems:'center', gap:2 }}>
              <span style={{ fontSize:20, fontWeight:800, color:'#fff' }}>{BATCHES.length}</span>
              <span style={{ fontSize:10, color:'rgba(255,255,255,0.7)', fontWeight:600 }}>Available</span>
            </div>
          </div>
        </div>

        <div className="page-content">
          {/* Tabs */}
          <div style={{ display:'flex', gap:10 }}>
            <button className={`filter-tab${tab==='all'?' active':''}`} onClick={() => setTab('all')}>All Batches</button>
            <button className={`filter-tab${tab==='enrolled'?' active':''}`} onClick={() => setTab('enrolled')}>
              My Batches {enrolledCount > 0 && <span style={{ background:'rgba(255,255,255,0.3)', borderRadius:'50%', padding:'1px 6px', fontSize:11, marginLeft:4 }}>{enrolledCount}</span>}
            </button>
          </div>

          {/* Batch Cards */}
          {displayed.map((b, i) => {
            const pct = b.sessions > 0 ? (b.completed / b.sessions) * 100 : 0;
            const isExpanded = expanded === b.id;
            const isComplete = b.completed === b.sessions;
            return (
              <div key={b.id} className="card fade-up" style={{ padding:0, overflow:'hidden', animationDelay:`${i*70}ms` }}>
                {/* Card Header */}
                <div style={{ background: b.grad, padding:20 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:10 }}>
                    <div style={{ width:52, height:52, borderRadius:18, background:'rgba(255,255,255,0.2)', border:'2px solid rgba(255,255,255,0.35)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:26, flexShrink:0 }}>
                      {b.emoji}
                    </div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontWeight:800, fontSize:16, color:'#fff', marginBottom:3 }}>{b.title}</div>
                      <div style={{ display:'flex', alignItems:'center', gap:6, flexWrap:'wrap' }}>
                        <span className={diffClass(b.level)} style={{ fontSize:10 }}>{b.level}</span>
                        <span style={{ fontSize:11, color:'rgba(255,255,255,0.75)', fontWeight:500 }}>⏱ {b.duration}</span>
                        <span style={{ fontSize:11, color:'rgba(255,255,255,0.75)', fontWeight:500 }}>📚 {b.sessions} sessions</span>
                      </div>
                    </div>
                    {isComplete && (
                      <div style={{ background:'rgba(255,255,255,0.25)', borderRadius:20, padding:'4px 10px', fontSize:11, fontWeight:700, color:'#fff' }}>✅ Done</div>
                    )}
                  </div>
                  <div style={{ fontSize:12, color:'rgba(255,255,255,0.85)', lineHeight:1.4, marginBottom:12 }}>{b.description}</div>
                  {b.enrolled && b.completed > 0 && (
                    <div>
                      <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, color:'rgba(255,255,255,0.8)', marginBottom:6 }}>
                        <span>{b.completed}/{b.sessions} sessions</span>
                        <span>{Math.round(pct)}%</span>
                      </div>
                      <div style={{ height:6, borderRadius:6, background:'rgba(255,255,255,0.2)', overflow:'hidden' }}>
                        <div style={{ height:'100%', width:`${pct}%`, background:'rgba(255,255,255,0.9)', borderRadius:6, transition:'width 0.5s' }} />
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Actions */}
                <div style={{ padding:'14px 16px', display:'flex', gap:10, alignItems:'center' }}>
                  <button onClick={() => setExpanded(isExpanded ? null : b.id)}
                    style={{ flex:1, padding:'10px 14px', borderRadius:12, border:'1.5px solid var(--surface)', background:'var(--card)', color:'var(--text-sec)', fontFamily:'Poppins,sans-serif', fontSize:13, fontWeight:600, cursor:'pointer' }}>
                    {isExpanded ? '▲ Hide Topics' : '▼ View Topics'}
                  </button>
                  {b.enrolled ? (
                    <button className="btn-primary" style={{ flex:1, padding:'10px 14px' }}
                      onClick={() => router.push('/conversation')}>
                      {isComplete ? '🔄 Redo' : '▶ Continue'}
                    </button>
                  ) : (
                    <button className="btn-primary" style={{ flex:1, padding:'10px 14px' }}
                      onClick={() => toggleEnroll(b.id)}>
                      ✨ Enroll
                    </button>
                  )}
                </div>

                {/* Expanded topics */}
                {isExpanded && (
                  <div style={{ padding:'0 16px 16px', display:'flex', flexWrap:'wrap', gap:8 }} className="fade-up">
                    {b.topics.map((t, ti) => (
                      <span key={ti} style={{ background:'var(--surface)', borderRadius:20, padding:'6px 14px', fontSize:12, fontWeight:600, color:'var(--text-sec)' }}>
                        {ti < b.completed ? '✅' : '📌'} {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {displayed.length === 0 && (
            <div style={{ textAlign:'center', padding:'40px 0', color:'var(--text-hint)' }}>
              <div style={{ fontSize:48, marginBottom:12 }}>📭</div>
              <div style={{ fontSize:15, fontWeight:600 }}>No batches enrolled yet</div>
              <div style={{ fontSize:13, marginBottom:20 }}>Browse all batches and start one!</div>
              <button className="btn-primary" onClick={() => setTab('all')}>Browse Batches</button>
            </div>
          )}
        </div>
      </div>
      <BottomNav />
    </>
  );
}
