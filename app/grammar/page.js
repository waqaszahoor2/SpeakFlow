'use client';
import { useRouter } from 'next/navigation';

const DEMO = {
  original: 'I go to store yesterday to buy some grocery.',
  corrected: 'I went to the store yesterday to buy some groceries.',
  explanation: 'Three errors were found:\n(1) "go" should be "went" — this is a past tense sentence.\n(2) "store" needs the definite article "the".\n(3) "grocery" is a mass noun — use the plural "groceries".',
  natural: 'I popped by the store yesterday to pick up some groceries.',
  errors: [
    { wrong: 'go',      right: 'went',       rule: 'Past simple tense' },
    { wrong: 'store',   right: 'the store',  rule: 'Definite article' },
    { wrong: 'grocery', right: 'groceries',  rule: 'Plural noun' },
  ],
};

function HighlightedText({ text, highlights, highlightColor, bgColor }) {
  const words = text.split(' ');
  return (
    <div style={{ display:'flex', flexWrap:'wrap', gap:4, lineHeight:1.6 }}>
      {words.map((w, i) => {
        const clean = w.replace(/[.,!?]/g, '');
        const isHit = highlights.some(h => h.toLowerCase() === clean.toLowerCase());
        return (
          <span key={i} style={{
            padding: isHit ? '2px 6px' : undefined,
            background: isHit ? bgColor : undefined,
            border: isHit ? `1px solid ${highlightColor}40` : undefined,
            borderRadius: isHit ? 6 : undefined,
            color: isHit ? highlightColor : 'var(--text)',
            textDecoration: isHit ? 'underline' : undefined,
            textDecorationColor: isHit ? highlightColor : undefined,
            fontSize: 15, fontWeight: 500,
          }}>{w}</span>
        );
      })}
    </div>
  );
}

export default function GrammarPage() {
  const router = useRouter();

  return (
    <div style={{ background:'var(--bg)', minHeight:'100vh', display:'flex', flexDirection:'column' }}>
      {/* AppBar */}
      <div style={{ background:'var(--card)', borderBottom:'1px solid var(--surface)',
        padding:'12px 16px', display:'flex', alignItems:'center', gap:12, flexShrink:0,
        boxShadow:'0 2px 12px var(--shadow)', paddingTop:'max(12px, env(safe-area-inset-top))' }}>
        <button onClick={() => router.back()} style={{ width:38, height:38, borderRadius:'50%',
          background:'var(--surface)', border:'none', cursor:'pointer',
          display:'flex', alignItems:'center', justifyContent:'center' }}>
          <svg width="16" height="16" fill="none" stroke="var(--text)" strokeWidth="2.5" viewBox="0 0 24 24">
            <path d="m15 18-6-6 6-6"/>
          </svg>
        </button>
        <span style={{ flex:1, fontWeight:700, fontSize:17, color:'var(--text)' }}>Grammar Correction</span>
        <div style={{ background:'var(--grad-primary)', borderRadius:20, padding:'6px 14px',
          fontSize:13, fontWeight:600, color:'#fff', cursor:'pointer' }}>Save</div>
      </div>

      {/* Content */}
      <div style={{ flex:1, overflowY:'auto', padding:'16px 20px 40px', display:'flex', flexDirection:'column', gap:20 }}>

        {/* Original */}
        <div>
          <div style={{ fontWeight:700, fontSize:14, color:'var(--text)', marginBottom:10 }}>🗣️ Your Original Sentence</div>
          <div className="grammar-card grammar-error-card fade-up">
            <HighlightedText text={DEMO.original}
              highlights={DEMO.errors.map(e => e.wrong)}
              highlightColor="#DC2626" bgColor="#FEE2E2" />
          </div>
        </div>

        {/* Corrected */}
        <div>
          <div style={{ fontWeight:700, fontSize:14, color:'var(--text)', marginBottom:10 }}>✅ Corrected Sentence</div>
          <div className="grammar-card grammar-correct-card fade-up">
            <HighlightedText text={DEMO.corrected}
              highlights={DEMO.errors.map(e => e.right)}
              highlightColor="#059669" bgColor="#D1FAE5" />
          </div>
        </div>

        {/* Error Breakdown */}
        <div>
          <div style={{ fontWeight:700, fontSize:14, color:'var(--text)', marginBottom:10 }}>🔍 Error Breakdown</div>
          {DEMO.errors.map((e, i) => (
            <div key={i} className="card fade-up" style={{ padding:14, marginBottom:10,
              animationDelay:`${i*80}ms` }}>
              <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                <div style={{ width:28, height:28, borderRadius:'50%', background:'var(--grad-primary)',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:12, fontWeight:700, color:'#fff', flexShrink:0 }}>{i+1}</div>
                <div style={{ flex:1 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4, flexWrap:'wrap' }}>
                    <span style={{ background:'#FEE2E2', borderRadius:6, padding:'3px 8px',
                      fontSize:13, fontWeight:600, color:'#DC2626' }}>{e.wrong}</span>
                    <svg width="14" height="14" fill="none" stroke="var(--text-hint)" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M5 12h14m-7-7 7 7-7 7"/>
                    </svg>
                    <span style={{ background:'#D1FAE5', borderRadius:6, padding:'3px 8px',
                      fontSize:13, fontWeight:600, color:'#059669' }}>{e.right}</span>
                  </div>
                  <div style={{ fontSize:11, color:'var(--text-sec)' }}>{e.rule}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Explanation */}
        <div>
          <div style={{ fontWeight:700, fontSize:14, color:'var(--text)', marginBottom:10 }}>📚 Explanation</div>
          <div className="card grammar-card fade-up" style={{ border:'1px solid rgba(124,58,237,0.12)' }}>
            <p style={{ fontSize:14, color:'var(--text)', lineHeight:1.7, margin:0, whiteSpace:'pre-line' }}>
              {DEMO.explanation}
            </p>
          </div>
        </div>

        {/* Natural Version */}
        <div>
          <div style={{ fontWeight:700, fontSize:14, color:'var(--text)', marginBottom:10 }}>💬 More Natural Version</div>
          <div className="fade-up" style={{ background:'var(--grad-primary)', borderRadius:20, padding:20,
            boxShadow:'0 8px 24px var(--shadow-purple)' }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
              <span style={{ fontSize:18 }}>✨</span>
              <span style={{ fontSize:13, fontWeight:600, color:'rgba(255,255,255,0.8)' }}>Native Speaker Version</span>
            </div>
            <p style={{ fontSize:16, fontWeight:600, color:'#fff', fontStyle:'italic',
              lineHeight:1.5, margin:0 }}>"{DEMO.natural}"</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display:'flex', gap:12 }} className="fade-up">
          <button className="btn-outline" style={{ flex:1 }} onClick={() => router.back()}>
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>
            </svg>
            Practice Again
          </button>
          <button className="btn-primary" style={{ flex:1 }}>
            <svg width="16" height="16" fill="#fff" viewBox="0 0 24 24">
              <path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z"/>
            </svg>
            Save Mistake
          </button>
        </div>
      </div>
    </div>
  );
}
