'use client';
import { useRouter } from 'next/navigation';
import BottomNav from './components/BottomNav';

export default function RootPage() {
  const router = useRouter();
  if (typeof window !== 'undefined') router.replace('/home');
  return null;
}
