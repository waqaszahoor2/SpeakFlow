'use client';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import { SidebarProvider, useSidebar } from '../context/SidebarContext';

const PUBLIC_PATHS = ['/onboarding', '/'];

function AuthGuard({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Register service worker for offline support
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(err => {
          console.log('SW registration failed: ', err);
        });
      });
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (PUBLIC_PATHS.includes(pathname)) return;
    const raw = localStorage.getItem('sf_profile');
    if (!raw) { router.replace('/onboarding'); return; }
    try {
      const p = JSON.parse(raw);
      if (!p.setupDone) router.replace('/onboarding');
    } catch {
      router.replace('/onboarding');
    }
  }, [pathname]);

  return children;
}

function LayoutContent({ children }) {
  const { toggle } = useSidebar();
  
  return (
    <>
      <button className="menu-toggle" onClick={toggle} aria-label="Open Menu">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
      </button>
      <Sidebar />
      <div id="app-root">
        <AuthGuard>{children}</AuthGuard>
      </div>
    </>
  );
}

export default function LayoutWrapper({ children }) {
  return (
    <SidebarProvider>
      <LayoutContent>{children}</LayoutContent>
    </SidebarProvider>
  );
}
