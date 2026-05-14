'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loadCorrections, loadPatterns } from '../lib/mistakeEngine';

export default function GrammarPage() {
  const router = useRouter();
  const [corrections, setCorrections] = useState([]);
  const [patterns, setPatterns] = useState([]);
  const [tab, setTab] = useState('history'); // 'history' | 'patterns'
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    setCorrections(loadCorrections());
    setPatterns(loadPatterns());
  }, []);

  const fmt = (ts) => {
    if (!ts) return '';
    const d = new Date(ts);
    return d.toLocaleDateString([], { month:'short', day:'numeric' }) + ' ' + d.toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' });
  };

  const PATTERN_COLORS = ['#EF4444','#F59E0B','#8B5CF6','#3B82F6','#10B981'];

  return (
    <div style={{ background:'var(--bg)', minHeight:'100vh', display:'flex', flexDirection:'column' }}>
      {/* AppBar */}
      <div style={{ background:'var(--card)', borderBottom:'1px solid var(--surface)', padding:'12px 16px', display:'flex', alignItems:'center', gap:12, flexShrink:0, boxShadow:'0 2px 12px var(--shadow)', paddingTop:'max(12px, env(safe-area-inset-top))' }}>
        <button onClick={() => router.back()} style={{ width:38, height:38, borderRadius:'50%', background:'var(--surface)', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <svg width="16" height="16" fill="none" stroke="var(--text)" strokeWidth="2.5" viewBox="0 0 24 24"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <span style={{ flex:1, fontWeight:700, fontSize:17, color:'var(--text)' }}>✏️ My Mistakes</span>
        <div style={{ background:'rgba(239,68,68,0.12)', borderRadius:12, padding:'5px 12px', fontSize:12, fontWeight:700, color:'#DC2626' }}>
          {corrections.length} saved
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:10, padding:'14px 16px 0' }}>
        {['history','patterns'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            style={{ flex:1, padding:'10px', borderRadius:14, border:'none', background: tab===t ? 'var(--grad-primary)' : 'var(--surface)', color: tab===t ? '#fff' : 'var(--text-sec)', fontFamily:'Poppins,sans-serif', fontWeight:700, fontSize:13, cursor:'pointer', transition:'all 0.2s' }}>
            {t === 'history' ? '📜 Correction History' : '📊 Mistake Patterns'}
          </button>
        ))}
      </div>

      <div style={{ flex:1, overflowY:'auto', padding:'14px 16px 40px', display:'flex', flexDirection:'column', gap:12 }}>

        {/* ── Patterns Tab ── */}
        {tab === 'patterns' && (
          <>
            {patterns.length === 0 ? (
              <div style={{ textAlign:'center', padding:'50px 0', color:'var(--text-hint)' }}>
                <div style={{ fontSize:48, marginBottom:12 }}>🎉</div>
                <div style={{ fontSize:15, fontWeight:600, marginBottom:6 }}>No patterns yet!</div>
                <div style={{ fontSize:13 }}>Practice more and your recurring mistakes will appear here.</div>
              </div>
            ) : (
              <>
                <div style={{ background:'rgba(124,58,237,0.06)', border:'1px solid rgba(124,58,237,0.15)', borderRadius:16, padding:'12px 16px', fontSize:13, color:'var(--text-sec)', lineHeight:1.6 }}>
                  🤖 The AI is <strong>actively watching</strong> these patterns in your conversations and will give you targeted corrections.
                </div>
                {patterns.map((p, i) => {
                  const color = PATTERN_COLORS[i % PATTERN_COLORS.length];
                  const maxCount = patterns[0]?.count || 1;
                  return (
                    <div key={i} className="card fade-up" style={{ padding:16, animationDelay:`${i*60}ms` }}>
                      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
                        <div style={{ width:36, height:36, borderRadius:12, background:`${color}18`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, flexShrink:0 }}>
                          {['📝','⏳','📰','🔗','👤','🔤','❓','🔄','📚','🎯'][i % 10]}
                        </div>
                        <div style={{ flex:1 }}>
                          <div style={{ fontWeight:700, fontSize:14, color:'var(--text)' }}>{p.rule}</div>
                          <div style={{ fontSize:11, color:'var(--text-sec)' }}>Repeated {p.count} time{p.count !== 1 ? 's' : ''}</div>
                        </div>
                        <div style={{ background:`${color}18`, borderRadius:12, padding:'4px 10px', fontSize:12, fontWeight:800, color }}>×{p.count}</div>
                      </div>
                      {/* Frequency bar */}
                      <div style={{ height:6, borderRadius:6, background:'var(--surface)', overflow:'hidden', marginBottom:10 }}>
                        <div style={{ height:'100%', width:`${(p.count/maxCount)*100}%`, background:color, borderRadius:6, transition:'width 0.6s ease' }} />
                      </div>
                      {/* Latest example */}
                      {p.examples?.length > 0 && (
                        <div style={{ background:'var(--surface)', borderRadius:10, padding:'8px 12px' }}>
                          <div style={{ fontSize:10, fontWeight:700, color:'var(--text-hint)', marginBottom:4 }}>LATEST EXAMPLE</div>
                          <div style={{ fontSize:12, color:'var(--text-sec)', fontStyle:'italic' }}>"{p.examples[p.examples.length - 1]}"</div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </>
            )}
          </>
        )}

        {/* ── History Tab ── */}
        {tab === 'history' && (
          <>
            {corrections.length === 0 ? (
              <div style={{ textAlign:'center', padding:'50px 0', color:'var(--text-hint)' }}>
                <div style={{ fontSize:48, marginBottom:12 }}>✅</div>
                <div style={{ fontSize:15, fontWeight:600, marginBottom:6 }}>No mistakes yet!</div>
                <div style={{ fontSize:13, marginBottom:20 }}>Start a conversation and the AI will correct your grammar here.</div>
                <button className="btn-primary" onClick={() => router.push('/conversation')}>Start Practicing</button>
              </div>
            ) : (
              corrections.map((c, i) => {
                const isOpen = selected === i;
                return (
                  <div key={i} className="card fade-up" style={{ padding:0, overflow:'hidden', animationDelay:`${i*50}ms` }}>
                    {/* Header row */}
                    <div style={{ display:'flex', alignItems:'center', gap:10, padding:'14px 16px', cursor:'pointer' }} onClick={() => setSelected(isOpen ? null : i)}>
                      <div style={{ width:32, height:32, borderRadius:10, background:'rgba(239,68,68,0.1)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, flexShrink:0 }}>✏️</div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontSize:13, fontWeight:600, color:'#DC2626', lineHeight:1.4, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                          "{c.original?.slice(0,50)}{c.original?.length > 50 ? '…' : ''}"
                        </div>
                        <div style={{ fontSize:11, color:'var(--text-hint)', marginTop:2 }}>
                          {c.rule && <span style={{ background:'rgba(124,58,237,0.1)', color:'var(--purple)', borderRadius:6, padding:'1px 6px', fontSize:10, fontWeight:600, marginRight:6 }}>{c.rule}</span>}
                          {fmt(c.timestamp)}
                        </div>
                      </div>
                      <svg width="14" height="14" fill="none" stroke="var(--text-hint)" strokeWidth="2" viewBox="0 0 24 24" style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition:'transform 0.2s', flexShrink:0 }}>
                        <path d="m6 9 6 6 6-6"/>
                      </svg>
                    </div>
                    {/* Expanded detail */}
                    {isOpen && (
                      <div style={{ padding:'0 16px 16px', borderTop:'1px solid var(--surface)', display:'flex', flexDirection:'column', gap:12 }} className="fade-up">
                        <div>
                          <div style={{ fontSize:11, fontWeight:700, color:'var(--text-hint)', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:6 }}>Original</div>
                          <div style={{ background:'#FEF2F2', borderRadius:12, padding:'10px 14px', fontSize:13, color:'#DC2626', lineHeight:1.6, fontWeight:500 }}>{c.original}</div>
                        </div>
                        <div>
                          <div style={{ fontSize:11, fontWeight:700, color:'var(--text-hint)', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:6 }}>Corrected</div>
                          <div style={{ background:'#D1FAE5', borderRadius:12, padding:'10px 14px', fontSize:13, color:'#059669', lineHeight:1.6, fontWeight:500 }}>{c.corrected}</div>
                        </div>
                        {c.explanation && (
                          <div>
                            <div style={{ fontSize:11, fontWeight:700, color:'var(--text-hint)', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:6 }}>Explanation</div>
                            <div style={{ background:'var(--surface)', borderRadius:12, padding:'10px 14px', fontSize:13, color:'var(--text-sec)', lineHeight:1.6 }}>{c.explanation}</div>
                          </div>
                        )}
                        {c.natural_version && (
                          <div style={{ background:'var(--grad-primary)', borderRadius:14, padding:'12px 16px' }}>
                            <div style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.7)', marginBottom:6 }}>✨ MORE NATURAL WAY TO SAY IT</div>
                            <div style={{ fontSize:14, color:'#fff', fontStyle:'italic', fontWeight:600, lineHeight:1.5 }}>"{c.natural_version}"</div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </>
        )}
      </div>
    </div>
  );
}
