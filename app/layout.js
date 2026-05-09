import './globals.css';

export const metadata = {
  title: 'SpeakFlow — AI English Tutor',
  description: 'Practice English with your personal AI tutor. Real-time grammar corrections, voice conversations, and progress tracking.',
  manifest: '/manifest.json',
  icons: { icon: '/icon.png', apple: '/icon.png' },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#7C3AED',
};

import Sidebar from './components/Sidebar';
import { SidebarProvider, useSidebar } from './context/SidebarContext';

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
        {children}
      </div>
    </>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <SidebarProvider>
          <LayoutContent>{children}</LayoutContent>
        </SidebarProvider>
      </body>
    </html>
  );
}
