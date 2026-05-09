'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

let msgId = 0;

export default function ConversationPage() {
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [history, setHistory] = useState([]);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    sendMessage("Hello! Please introduce yourself as my English tutor.", true);
    // Setup Speech Recognition
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SR();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';
      recognitionRef.current.onresult = (e) => {
        const transcript = e.results[0][0].transcript;
        setIsListening(false);
        sendMessage(transcript, false);
      };
      recognitionRef.current.onerror = () => setIsListening(false);
      recognitionRef.current.onend = () => setIsListening(false);
    }
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  async function sendMessage(text, isGreeting = false) {
    if (!isGreeting) {
      const userMsg = { id: ++msgId, role: 'user', text };
      setMessages(m => [...m, userMsg]);
      setHistory(h => [...h, { role: 'user', text }]);
    }
    setIsTyping(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history }),
      });
      const data = await res.json();
      const aiMsg = { id: ++msgId, role: 'ai', text: data.text, correction: data.correction };
      setMessages(m => [...m, aiMsg]);
      setHistory(h => [...h, { role: 'ai', text: data.text }]);
    } catch {
      setMessages(m => [...m, { id: ++msgId, role: 'ai', text: '⚠️ Network error. Please check your connection.' }]);
    }
    setIsTyping(false);
  }

  function handleSend() {
    const t = input.trim();
    if (!t) return;
    setInput('');
    sendMessage(t);
  }

  function toggleMic() {
    if (!recognitionRef.current) {
      alert('Speech recognition not supported in this browser. Try Chrome.');
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  }

  function resetChat() {
    setMessages([]);
    setHistory([]);
    setTimeout(() => sendMessage("Hello! Please introduce yourself as my English tutor.", true), 100);
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100vh', background:'var(--bg)' }}>
      {/* AppBar */}
      <div style={{ background:'var(--card)', borderBottom:'1px solid var(--surface)',
        padding:'12px 16px', display:'flex', alignItems:'center', gap:12,
        boxShadow:'0 2px 12px var(--shadow)', flexShrink:0, paddingTop:'max(12px, env(safe-area-inset-top))' }}>
        <button onClick={() => router.push('/home')} style={{ width:38, height:38, borderRadius:'50%',
          background:'var(--surface)', border:'none', cursor:'pointer', display:'flex',
          alignItems:'center', justifyContent:'center', flexShrink:0 }}>
          <svg width="16" height="16" fill="none" stroke="var(--text)" strokeWidth="2.5" viewBox="0 0 24 24">
            <path d="m15 18-6-6 6-6"/>
          </svg>
        </button>
        <div style={{ width:40, height:40, borderRadius:'50%', background:'var(--grad-primary)',
          display:'flex', alignItems:'center', justifyContent:'center', fontSize:20,
          boxShadow:'0 4px 12px var(--shadow-purple)', flexShrink:0 }}>🤖</div>
        <div style={{ flex:1 }}>
          <div style={{ fontWeight:700, fontSize:15, color:'var(--text)' }}>AI English Tutor</div>
          <div style={{ display:'flex', alignItems:'center', gap:5 }}>
            <div style={{ width:7, height:7, borderRadius:'50%', background:'var(--success)' }} />
            <span style={{ fontSize:11, color:'var(--success)', fontWeight:600 }}>Powered by Gemini</span>
          </div>
        </div>
        <button onClick={resetChat} style={{ width:38, height:38, borderRadius:'50%', background:'var(--surface)',
          border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <svg width="18" height="18" fill="none" stroke="var(--text)" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
            <path d="M3 3v5h5"/>
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div style={{ flex:1, overflowY:'auto', padding:'12px 16px', display:'flex', flexDirection:'column', gap:12 }}>
        {messages.length === 0 && !isTyping && (
          <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center',
            justifyContent:'center', gap:12, color:'var(--text-sec)' }}>
            <span style={{ fontSize:56 }}>🤖</span>
            <span style={{ fontSize:15, fontWeight:600 }}>Starting conversation…</span>
          </div>
        )}

        {messages.map(m => (
          <div key={m.id} style={{ display:'flex', flexDirection:'column',
            alignItems: m.role === 'user' ? 'flex-end' : 'flex-start', gap:8 }}>
            <div style={{ display:'flex', alignItems:'flex-end', gap:10,
              flexDirection: m.role === 'user' ? 'row-reverse' : 'row' }}>
              {m.role === 'ai' && (
                <div style={{ width:36, height:36, borderRadius:'50%', background:'var(--grad-primary)',
                  display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, flexShrink:0 }}>🤖</div>
              )}
              {m.role === 'user' && (
                <div style={{ width:32, height:32, borderRadius:'50%', background:'var(--grad-rose)',
                  display:'flex', alignItems:'center', justifyContent:'center', fontSize:14,
                  fontWeight:700, color:'#fff', flexShrink:0 }}>A</div>
              )}
              <div className={m.role === 'user' ? 'bubble-user' : 'bubble-ai'}
                style={{ animation:'fadeSlideUp 0.3s ease both' }}>
                {m.text}
              </div>
            </div>
            {m.correction && (
              <div style={{ marginLeft:46, display:'flex', alignItems:'center', gap:6,
                background:'#FEF2F2', border:'1px solid rgba(239,68,68,0.3)',
                borderRadius:12, padding:'8px 12px', cursor:'pointer', maxWidth:'85%' }}
                onClick={() => router.push('/grammar')}>
                <span style={{ fontSize:16 }}>✏️</span>
                <span style={{ fontSize:11, fontWeight:600, color:'#DC2626' }}>
                  Grammar correction found · Tap to view
                </span>
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div style={{ display:'flex', alignItems:'flex-end', gap:10 }}>
            <div style={{ width:36, height:36, borderRadius:'50%', background:'var(--grad-primary)',
              display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>🤖</div>
            <div className="bubble-ai" style={{ display:'flex', alignItems:'center', gap:4, minHeight:44 }}>
              <div className="typing-dot" />
              <div className="typing-dot" />
              <div className="typing-dot" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input Bar */}
      <div className="input-bar">
        {isListening && (
          <div style={{ position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)', marginBottom: 15 }}>
            <div className="waveform">
              {Array.from({length:8}).map((_,i) => (
                <div key={i} className="wave-bar" style={{ animationDelay:`${i*0.1}s` }} />
              ))}
            </div>
          </div>
        )}
        
        <input 
          ref={inputRef} 
          className="input-pill"
          value={input} 
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
          placeholder="Type a message..." 
        />

        <button className="btn-send" onClick={handleSend} title="Send">
          <svg width="22" height="22" fill="#fff" viewBox="0 0 24 24">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
          </svg>
        </button>

        <button 
          className={`btn-send mic-btn${isListening ? ' listening' : ''}`} 
          onClick={toggleMic}
          title={isListening ? "Stop listening" : "Start speaking"}
        >
          {isListening && <><div className="ripple-ring" /><div className="ripple-ring" /></>}
          <svg width="24" height="24" fill="#fff" viewBox="0 0 24 24" style={{ position:'relative', zIndex:1 }}>
            {isListening
              ? <path d="M6 6h12v12H6z"/>
              : <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1 1.93c-3.94-.49-7-3.85-7-7.93h2c0 3.31 2.69 6 6 6s6-2.69 6-6h2c0 4.08-3.06 7.44-7 7.93V22h-2v-4.07z"/>}
          </svg>
        </button>
      </div>
    </div>
  );
}
