'use client';
import Sidebar from './Sidebar';
import { SidebarProvider, useSidebar } from '../context/SidebarContext';

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

export default function LayoutWrapper({ children }) {
  return (
    <SidebarProvider>
      <LayoutContent>{children}</LayoutContent>
    </SidebarProvider>
  );
}
