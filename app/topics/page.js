'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import BottomNav from '../components/BottomNav';

const TOPICS = [
  { id:1, emoji:'☀️', title:'Daily Conversation', sub:'Greetings, small talk & daily routines', difficulty:'Beginner',    done:0, total:20, grad:'var(--grad-primary)' },
  { id:2, emoji:'🎓', title:'IELTS Speaking',     sub:'Band 7+ speaking strategies & practice', difficulty:'Advanced',     done:0, total:30, grad:'var(--grad-blue)' },
  { id:3, emoji:'💼', title:'Job Interview',      sub:'Professional answers for HR & technical rounds', difficulty:'Intermediate', done:0, total:18, grad:'var(--grad-mint)' },
  { id:4, emoji:'✈️', title:'Travel English',    sub:'Airports, hotels, restaurants & navigation', difficulty:'Beginner',  done:0, total:15, grad:'var(--grad-sunset)' },
  { id:5, emoji:'📚', title:'Education',          sub:'Academic presentations, debates & essays', difficulty:'Intermediate', done:0, total:22, grad:'var(--grad-rose)' },
  { id:6, emoji:'📊', title:'Business English',   sub:'Meetings, emails, negotiations & pitches', difficulty:'Advanced',   done:0, total:25, grad:'var(--grad-primary)' },
  { id:7, emoji:'🏥', title:'Health & Medical',   sub:'Doctor visits, symptoms & health discussion', difficulty:'Beginner', done:0, total:12, grad:'var(--grad-mint)' },
  { id:8, emoji:'📱', title:'Social Media',       sub:'Modern slang, trends & online communication', difficulty:'Intermediate', done:0, total:10, grad:'var(--grad-blue)' },
];

const FILTERS = ['All', 'Beginner', 'Intermediate', 'Advanced'];

function diffClass(d) {
  if (d === 'Advanced') return 'badge badge-advanced';
  if (d === 'Intermediate') return 'badge badge-intermediate';
  return 'badge badge-beginner';
}

export default function TopicsPage() {
  const router = useRouter();
  const [filter, setFilter] = useState('All');
  const [query, setQuery] = useState('');

  const filtered = TOPICS.filter(t => {
    const mf = filter === 'All' || t.difficulty === filter;
    const mq = !query || t.title.toLowerCase().includes(query.toLowerCase()) || t.sub.toLowerCase().includes(query.toLowerCase());
    return mf && mq;
  });

  return (
    <>
      <div style={{ paddingBottom:'calc(var(--nav-h) + 16px)', overflowY:'auto', height:'100vh' }}>
        {/* Header */}
        <div className="hero-header fade-up">
          <div style={{ fontSize:26, fontWeight:800, color:'#fff', marginBottom:4 }}>Practice Topics</div>
          <div style={{ fontSize:14, color:'rgba(255,255,255,0.8)' }}>Choose a topic and start speaking! 🚀</div>
        </div>

        <div className="page-content">
          {/* Search */}
          <div className="search-bar">
            <svg width="20" height="20" fill="none" stroke="var(--text-hint)" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input placeholder="Search topics..." value={query} onChange={e => setQuery(e.target.value)} />
            {query && (
              <button onClick={() => setQuery('')} style={{ border:'none', background:'none', cursor:'pointer', color:'var(--text-hint)', fontSize:18 }}>×</button>
            )}
          </div>

          {/* Filters */}
          <div style={{ display:'flex', gap:10, overflowX:'auto', paddingBottom:4 }}>
            {FILTERS.map(f => (
              <button key={f} className={`filter-tab${filter===f?' active':''}`} onClick={() => setFilter(f)}>{f}</button>
            ))}
          </div>

          {/* Topic Cards */}
          {filtered.map((t, i) => {
            const hasDone = t.done > 0;
            const isComplete = t.done >= t.total;
            return (
              <div key={t.id} className="topic-card fade-up" style={{ animationDelay:`${i*60}ms` }}
                onClick={() => router.push('/conversation')}>
                <div className="topic-icon" style={{ background: t.grad }}>{t.emoji}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                    <span style={{ fontWeight:700, fontSize:15, color:'var(--text)', flex:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{t.title}</span>
                    <span className={diffClass(t.difficulty)}>{t.difficulty}</span>
                  </div>
                  <div style={{ fontSize:12, color:'var(--text-sec)', lineHeight:1.4, marginBottom: hasDone ? 10 : 0,
                    overflow:'hidden', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical' }}>{t.sub}</div>

                  {/* Only show progress when user has actually done something */}
                  {hasDone && (
                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                      <div className="progress-bar" style={{ flex:1, height:6 }}>
                        <div className="progress-fill" style={{ width:`${(t.done/t.total)*100}%`, background: t.grad }} />
                      </div>
                      <span style={{ fontSize:11, fontWeight:600, color: isComplete ? 'var(--success)' : 'var(--text-sec)', flexShrink:0 }}>
                        {isComplete ? '✅ Done' : `${t.done}/${t.total}`}
                      </span>
                    </div>
                  )}
                </div>
                <div style={{ width:36, height:36, borderRadius:'50%', background: t.grad,
                  display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
                  boxShadow:'0 4px 12px var(--shadow-purple)' }}>
                  <svg width="18" height="18" fill="#fff" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div style={{ textAlign:'center', padding:'40px 0', color:'var(--text-hint)' }}>
              <div style={{ fontSize:48, marginBottom:12 }}>🔍</div>
              <div style={{ fontSize:15, fontWeight:600 }}>No topics found</div>
              <div style={{ fontSize:13 }}>Try a different search or filter</div>
            </div>
          )}
        </div>
      </div>
      <BottomNav />
    </>
  );
}
