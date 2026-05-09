'use client';
import { usePathname, useRouter } from 'next/navigation';

const NAV = [
  { path: '/home', label: 'Home', icon: (a) => (
    <svg viewBox="0 0 24 24" fill={a ? '#fff' : 'currentColor'}><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
  )},
  { path: '/topics', label: 'Topics', icon: (a) => (
    <svg viewBox="0 0 24 24" fill={a ? '#fff' : 'currentColor'}><path d="M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1zm0 13.5c-1.1-.35-2.3-.5-3.5-.5-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5 1.2 0 2.4.15 3.5.5v11.5z"/></svg>
  )},
  { path: '/progress', label: 'Progress', icon: (a) => (
    <svg viewBox="0 0 24 24" fill={a ? '#fff' : 'currentColor'}><path d="M5 9.2h3V19H5zM10.6 5h2.8v14h-2.8zm5.6 8H19v6h-2.8z"/></svg>
  )},
  { path: '/profile', label: 'Profile', icon: (a) => (
    <svg viewBox="0 0 24 24" fill={a ? '#fff' : 'currentColor'}><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
  )},
];

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  if (pathname === '/conversation' || pathname === '/grammar') return null;
  return (
    <nav className="bottom-nav">
      {NAV.map(({ path, label, icon }) => {
        const active = pathname === path || (pathname === '/' && path === '/home');
        return (
          <button key={path} className={`nav-item${active ? ' active' : ''}`} onClick={() => router.push(path)}>
            {icon(active)}
            <span>{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
