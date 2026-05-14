'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RootPage() {
  const router = useRouter();
  useEffect(() => {
    const raw = localStorage.getItem('sf_profile');
    if (raw) {
      try {
        const p = JSON.parse(raw);
        if (p.setupDone) { router.replace('/home'); return; }
      } catch {}
    }
    router.replace('/onboarding');
  }, []);
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', background:'#0f0e1a' }}>
      <div style={{ fontSize:48, animation:'pulse 1.5s ease infinite' }}>🤖</div>
    </div>
  );
}
