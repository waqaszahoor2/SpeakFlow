'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSidebar } from '../context/SidebarContext';

const NAV = [
  { path: '/home', label: 'Home', icon: (a) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
  )},
  { path: '/topics', label: 'Topics', icon: (a) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
  )},
  { path: '/progress', label: 'Progress', icon: (a) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
  )},
  { path: '/profile', label: 'Profile', icon: (a) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
  )},
];

export default function Sidebar() {
  const pathname = usePathname();
  const { isOpen, close } = useSidebar();

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={close} />}
      <aside className={`sidebar${isOpen ? ' open' : ''}`}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:40 }}>
          <div className="sidebar-logo" style={{ marginBottom:0 }}>SpeakFlow</div>
          <button className="sidebar-close" onClick={close}>×</button>
        </div>
        <nav className="sidebar-nav">
          {NAV.map(({ path, label, icon }) => {
            const active = pathname === path || (pathname === '/' && path === '/home');
            return (
              <Link key={path} href={path} className={`sidebar-item${active ? ' active' : ''}`} onClick={close}>
                {icon(active)}
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>
      
      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ padding: '20px', background: 'rgba(255,255,255,0.05)', borderRadius: '16px' }}>
          <div style={{ fontSize: '13px', color: '#a0a8c0', marginBottom: '8px' }}>Your Progress</div>
          <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ width: '65%', height: '100%', background: 'var(--grad-primary)' }} />
          </div>
        </div>

        <button 
          style={{ 
            display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 18px', 
            borderRadius: '14px', color: '#EF4444', border: 'none', background: 'transparent',
            cursor: 'pointer', fontWeight: '600', transition: 'all 0.2s'
          }}
          onMouseOver={e => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}
          onMouseOut={e => e.currentTarget.style.background = 'transparent'}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '20px', height: '20px' }}>
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
