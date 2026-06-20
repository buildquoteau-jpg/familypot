'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useFamilyData } from '@/lib/context';
import WeeklyReflection from '@/components/WeeklyReflection';
import BottomNav from '@/components/BottomNav';

export default function ReflectionPage() {
  const { data, isLoaded } = useFamilyData();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !data.setupComplete) router.replace('/setup');
  }, [isLoaded, data.setupComplete, router]);

  if (!isLoaded || !data.setupComplete) return null;

  return (
    <div className="page" style={{ display: 'flex', flexDirection: 'column' }}>
      <header className="app-header">
        <div style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: '1.25rem',
          fontWeight: 700,
          color: '#F5E6C8',
        }}>
          This week
        </div>
      </header>

      <WeeklyReflection onDone={() => router.push('/')} />
      <BottomNav />
    </div>
  );
}
