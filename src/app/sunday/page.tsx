'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useFamilyData } from '@/lib/context';
import { getSlidesForSunday } from '@/data/historical';
import SundaySlideshow from '@/components/SundaySlideshow';
import WeeklyReflection from '@/components/WeeklyReflection';
import BottomNav from '@/components/BottomNav';

type Phase = 'intro' | 'slideshow' | 'reflection' | 'done';

export default function SundayPage() {
  const { data, isLoaded, markSundayBriefingDone } = useFamilyData();
  const [phase, setPhase] = useState<Phase>('intro');
  const router = useRouter();

  const slides = getSlidesForSunday();

  useEffect(() => {
    if (isLoaded && !data.setupComplete) router.replace('/setup');
  }, [isLoaded, data.setupComplete, router]);

  useEffect(() => {
    if (phase === 'done') {
      markSundayBriefingDone();
      router.replace('/');
    }
  }, [phase, markSundayBriefingDone, router]);

  if (!isLoaded || !data.setupComplete) return null;
  if (phase === 'done') return null;

  if (phase === 'intro') {
    return (
      <div className="page">
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 24px',
          textAlign: 'center',
        }}>
          <div style={{ marginBottom: 28 }}>
            <img
              src="/images/pot.png"
              alt="The Family Pot"
              style={{ width: 280, height: 'auto', display: 'block', margin: '0 auto' }}
            />
          </div>

          <div style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: '2rem',
            fontWeight: 700,
            color: '#3D2B1F',
            marginBottom: 10,
            lineHeight: 1.2,
          }}>
            The Family Pot
          </div>
          <div style={{
            fontFamily: 'Nunito, sans-serif',
            fontSize: '1rem',
            color: '#8B6B55',
            marginBottom: 8,
          }}>
            Sunday gathering
          </div>
          <div style={{
            fontFamily: 'Nunito, sans-serif',
            fontSize: '0.95rem',
            color: '#5D4033',
            lineHeight: 1.6,
            maxWidth: 300,
            marginBottom: 40,
          }}>
            Time for the family to sit together, look back at the week, and plan ahead.
          </div>

          <button
            className="btn-primary"
            style={{ maxWidth: 280 }}
            onClick={() => setPhase('slideshow')}
          >
            Start
          </button>

          <button
            className="btn-ghost"
            style={{ marginTop: 12, maxWidth: 280 }}
            onClick={() => setPhase('reflection')}
          >
            Skip to this week
          </button>
        </div>
        <BottomNav />
      </div>
    );
  }

  if (phase === 'slideshow') {
    return (
      <div className="page" style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <SundaySlideshow
          slides={slides}
          onComplete={() => setPhase('reflection')}
        />
        <BottomNav />
      </div>
    );
  }

  // reflection phase
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
        <button
          onClick={() => setPhase('slideshow')}
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'Nunito, sans-serif',
            fontSize: '0.82rem',
            color: '#B09070',
            fontWeight: 700,
          }}
        >
          Back to history
        </button>
      </header>
      <WeeklyReflection onDone={() => setPhase('done')} />
      <BottomNav />
    </div>
  );
}
