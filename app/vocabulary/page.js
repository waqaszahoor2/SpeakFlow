'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import BottomNav from '../components/BottomNav';

const CATEGORIES = ['All', 'Business', 'Travel', 'Daily Life', 'Academic'];

const WORDS = [
  { id:1, word:'Eloquent',    meaning:'Fluent or persuasive in speaking or writing', example:'She gave an eloquent speech at the conference.', category:'Academic', level:'Advanced', saved:true },
  { id:2, word:'Negotiate',   meaning:'To try to reach an agreement through discussion', example:'We need to negotiate the terms of the contract.', category:'Business', level:'Intermediate', saved:false },
  { id:3, word:'Itinerary',   meaning:'A planned route or journey; a travel schedule', example:'The tour itinerary includes visits to three cities.', category:'Travel', level:'Intermediate', saved:true },
  { id:4, word:'Diligent',    meaning:'Having or showing care and effort in your work', example:'She is a diligent student who never misses a class.', category:'Academic', level:'Intermediate', saved:false },
  { id:5, word:'Commute',     meaning:'To travel regularly between home and work', example:'He commutes to the office by train every morning.', category:'Daily Life', level:'Beginner', saved:false },
  { id:6, word:'Leverage',    meaning:'Use something to its maximum advantage', example:'The company leveraged social media to grow its brand.', category:'Business', level:'Advanced', saved:true },
  { id:7, word:'Spontaneous', meaning:'Performed or occurring as a natural impulse', example:'The spontaneous trip to the beach was so much fun!', category:'Daily Life', level:'Intermediate', saved:false },
  { id:8, word:'Itinerant',   meaning:'Traveling from place to place', example:'The itinerant musician performed across the country.', category:'Travel', level:'Advanced', saved:false },
  { id:9, word:'Curriculum',  meaning:'The subjects comprising a course of study', example:'The new curriculum focuses on critical thinking skills.', category:'Academic', level:'Intermediate', saved:true },
  { id:10,word:'Liability',   meaning:'The state of being legally responsible for something', example:'The company accepted liability for the accident.', category:'Business', level:'Advanced', saved:false },
];

function diffClass(d) {
  if (d === 'Advanced') return 'badge badge-advanced';
  if (d === 'Intermediate') return 'badge badge-intermediate';
  return 'badge badge-beginner';
}

export default function VocabularyPage() {
  const router = useRouter();
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [words, setWords] = useState(WORDS);
  const [flipped, setFlipped] = useState({});
  const [quizMode, setQuizMode] = useState(false);
  const [quizIdx, setQuizIdx] = useState(0);
  const [quizRevealed, setQuizRevealed] = useState(false);

  const filtered = words.filter(w => {
    const mc = category === 'All' || w.category === category;
    const ms = !search || w.word.toLowerCase().includes(search.toLowerCase()) || w.meaning.toLowerCase().includes(search.toLowerCase());
    return mc && ms;
  });

  const toggleSave = (id) => {
    setWords(ws => ws.map(w => w.id === id ? { ...w, saved: !w.saved } : w));
  };

  const toggleFlip = (id) => {
    setFlipped(f => ({ ...f, [id]: !f[id] }));
  };

  const savedCount = words.filter(w => w.saved).length;

  if (quizMode) {
    const quizWords = filtered;
    if (quizWords.length === 0) return (
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100dvh', gap:16 }}>
        <span style={{ fontSize:48 }}>📚</span>
        <span style={{ fontWeight:700, fontSize:16, color:'var(--text)' }}>No words to quiz!</span>
        <button className="btn-primary" onClick={() => setQuizMode(false)}>Back</button>
      </div>
    );
    const word = quizWords[quizIdx % quizWords.length];
    return (
      <div style={{ display:'flex', flexDirection:'column', height:'100dvh', background:'var(--bg)' }}>
        <div style={{ background:'var(--card)', borderBottom:'1px solid var(--surface)', padding:'12px 16px', display:'flex', alignItems:'center', gap:12, flexShrink:0, boxShadow:'0 2px 12px var(--shadow)' }}>
          <button onClick={() => setQuizMode(false)} style={{ width:38, height:38, borderRadius:'50%', background:'var(--surface)', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <svg width="16" height="16" fill="none" stroke="var(--text)" strokeWidth="2.5" viewBox="0 0 24 24"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <span style={{ flex:1, fontWeight:700, fontSize:16, color:'var(--text)' }}>Vocabulary Quiz</span>
          <span style={{ background:'var(--grad-primary)', borderRadius:20, padding:'5px 14px', fontSize:12, fontWeight:700, color:'#fff' }}>
            {(quizIdx % quizWords.length) + 1}/{quizWords.length}
          </span>
        </div>
        <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:24, gap:20 }}>
          <div style={{ width:'100%', maxWidth:420, background:'var(--grad-primary)', borderRadius:28, padding:32, textAlign:'center', boxShadow:'0 12px 40px var(--shadow-purple)' }}>
            <div style={{ fontSize:13, color:'rgba(255,255,255,0.7)', marginBottom:8, fontWeight:600 }}>What does this mean?</div>
            <div style={{ fontSize:32, fontWeight:800, color:'#fff', marginBottom:16 }}>{word.word}</div>
            <span className={diffClass(word.level)} style={{ fontSize:11 }}>{word.level}</span>
          </div>
          {quizRevealed ? (
            <div style={{ width:'100%', maxWidth:420, background:'var(--card)', borderRadius:24, padding:24, boxShadow:'0 8px 24px var(--shadow)' }} className="fade-up">
              <div style={{ fontSize:14, color:'var(--text)', lineHeight:1.6, marginBottom:12, fontWeight:500 }}>{word.meaning}</div>
              <div style={{ fontSize:13, color:'var(--text-sec)', fontStyle:'italic', borderLeft:'3px solid var(--purple)', paddingLeft:12 }}>&quot;{word.example}&quot;</div>
              <div style={{ display:'flex', gap:12, marginTop:20 }}>
                <button className="btn-outline" style={{ flex:1 }} onClick={() => { setQuizIdx(i => i + 1); setQuizRevealed(false); }}>Next →</button>
                <button className="btn-primary" style={{ flex:1 }} onClick={() => { toggleSave(word.id); setQuizIdx(i => i + 1); setQuizRevealed(false); }}>
                  {word.saved ? '✓ Saved' : '💾 Save'}
                </button>
              </div>
            </div>
          ) : (
            <button className="btn-primary" style={{ width:'100%', maxWidth:420, padding:'16px 24px', fontSize:15 }} onClick={() => setQuizRevealed(true)}>
              Reveal Answer
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      <div style={{ paddingBottom:'calc(var(--nav-h) + 16px)', overflowY:'auto', height:'100dvh' }}>
        {/* Header */}
        <div className="hero-header fade-up">
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
            <button onClick={() => router.back()} style={{ width:38, height:38, borderRadius:'50%', background:'rgba(255,255,255,0.2)', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <svg width="16" height="16" fill="none" stroke="#fff" strokeWidth="2.5" viewBox="0 0 24 24"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <div style={{ fontSize:22, fontWeight:800, color:'#fff' }}>📖 Vocabulary</div>
            <div style={{ background:'rgba(255,255,255,0.2)', borderRadius:20, padding:'5px 12px', fontSize:12, fontWeight:700, color:'#fff' }}>
              💾 {savedCount} saved
            </div>
          </div>
          <div style={{ fontSize:13, color:'rgba(255,255,255,0.8)', marginBottom:14 }}>
            Expand your English vocabulary — learn, quiz, and save! 🚀
          </div>
          <div style={{ display:'flex', gap:10 }}>
            <div style={{ flex:1, background:'rgba(255,255,255,0.15)', borderRadius:16, padding:'10px 14px', display:'flex', flexDirection:'column', alignItems:'center', gap:2 }}>
              <span style={{ fontSize:20, fontWeight:800, color:'#fff' }}>{words.length}</span>
              <span style={{ fontSize:10, color:'rgba(255,255,255,0.7)', fontWeight:600 }}>Total Words</span>
            </div>
            <div style={{ flex:1, background:'rgba(255,255,255,0.15)', borderRadius:16, padding:'10px 14px', display:'flex', flexDirection:'column', alignItems:'center', gap:2 }}>
              <span style={{ fontSize:20, fontWeight:800, color:'#fff' }}>{savedCount}</span>
              <span style={{ fontSize:10, color:'rgba(255,255,255,0.7)', fontWeight:600 }}>Saved</span>
            </div>
            <button onClick={() => { setQuizMode(true); setQuizIdx(0); setQuizRevealed(false); }}
              style={{ flex:1, background:'rgba(255,255,255,0.25)', border:'2px solid rgba(255,255,255,0.4)', borderRadius:16, padding:'10px 14px', cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', gap:2 }}>
              <span style={{ fontSize:20 }}>🧠</span>
              <span style={{ fontSize:10, color:'#fff', fontWeight:700 }}>Quiz Mode</span>
            </button>
          </div>
        </div>

        <div className="page-content">
          {/* Search */}
          <div className="search-bar">
            <svg width="20" height="20" fill="none" stroke="var(--text-hint)" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input placeholder="Search words..." value={search} onChange={e => setSearch(e.target.value)} />
            {search && <button onClick={() => setSearch('')} style={{ border:'none', background:'none', cursor:'pointer', color:'var(--text-hint)', fontSize:18 }}>×</button>}
          </div>

          {/* Category Filters */}
          <div style={{ display:'flex', gap:10, overflowX:'auto', paddingBottom:4 }}>
            {CATEGORIES.map(c => (
              <button key={c} className={`filter-tab${category===c?' active':''}`} onClick={() => setCategory(c)}>{c}</button>
            ))}
          </div>

          {/* Word Cards */}
          {filtered.map((w, i) => (
            <div key={w.id} className="card fade-up" style={{ padding:18, animationDelay:`${i*60}ms`, cursor:'pointer' }}
              onClick={() => toggleFlip(w.id)}>
              <div style={{ display:'flex', alignItems:'flex-start', gap:12 }}>
                <div style={{ flex:1 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4, flexWrap:'wrap' }}>
                    <span style={{ fontWeight:800, fontSize:17, color:'var(--text)' }}>{w.word}</span>
                    <span className={diffClass(w.level)}>{w.level}</span>
                    <span style={{ background:'var(--surface)', borderRadius:8, padding:'2px 8px', fontSize:10, fontWeight:600, color:'var(--text-sec)' }}>{w.category}</span>
                  </div>
                  {flipped[w.id] ? (
                    <div className="fade-up">
                      <div style={{ fontSize:13, color:'var(--text)', lineHeight:1.6, marginBottom:8 }}>{w.meaning}</div>
                      <div style={{ fontSize:12, color:'var(--text-sec)', fontStyle:'italic', borderLeft:'3px solid var(--purple)', paddingLeft:10 }}>&quot;{w.example}&quot;</div>
                    </div>
                  ) : (
                    <div style={{ fontSize:12, color:'var(--text-hint)' }}>Tap to reveal meaning →</div>
                  )}
                </div>
                <button onClick={e => { e.stopPropagation(); toggleSave(w.id); }}
                  style={{ width:36, height:36, borderRadius:12, border:'none', cursor:'pointer', flexShrink:0,
                    background: w.saved ? 'var(--grad-primary)' : 'var(--surface)',
                    display:'flex', alignItems:'center', justifyContent:'center', fontSize:16,
                    boxShadow: w.saved ? '0 4px 12px var(--shadow-purple)' : 'none',
                    transition:'all 0.2s' }}>
                  {w.saved ? '💾' : '🤍'}
                </button>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div style={{ textAlign:'center', padding:'40px 0', color:'var(--text-hint)' }}>
              <div style={{ fontSize:48, marginBottom:12 }}>📭</div>
              <div style={{ fontSize:15, fontWeight:600 }}>No words found</div>
              <div style={{ fontSize:13 }}>Try a different search or category</div>
            </div>
          )}
        </div>
      </div>
      <BottomNav />
    </>
  );
}
