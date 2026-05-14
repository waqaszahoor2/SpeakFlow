// app/hooks/useProfile.js
'use client';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export const DEFAULT_PROFILE = {
  name: '',
  age: '',
  studyGoal: '',
  nativeLanguage: '',
  englishLevel: 'Beginner',
  dailyGoalMin: null,
  geminiKey: '',
  selectedModel: 'moonshot-v1-8k',
  checkedDays: [],
  todayMin: 0,
  xp: 0,
  streak: 0,
  setupDone: false,
};

const PUBLIC_PATHS = ['/onboarding', '/'];

export function useProfile() {
  const [profile, setProfileState] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const raw = localStorage.getItem('sf_profile');
    if (raw) {
      try {
        setProfileState({ ...DEFAULT_PROFILE, ...JSON.parse(raw) });
      } catch {
        setProfileState({ ...DEFAULT_PROFILE });
      }
    } else {
      setProfileState({ ...DEFAULT_PROFILE });
    }
    setLoaded(true);
  }, []);

  // Redirect to onboarding if setup not done
  useEffect(() => {
    if (!loaded) return;
    if (!profile?.setupDone && !PUBLIC_PATHS.includes(pathname)) {
      router.replace('/onboarding');
    }
  }, [loaded, profile, pathname]);

  const saveProfile = (updates) => {
    const next = { ...profile, ...updates };
    setProfileState(next);
    localStorage.setItem('sf_profile', JSON.stringify(next));
    return next;
  };

  return { profile, saveProfile, loaded };
}
