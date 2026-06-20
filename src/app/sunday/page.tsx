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
    const day = new Date().toLocaleDateString('en-AU', { weekday: 'long' });
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
          {/* Pot illustration — matched to the actual orange enamel pot */}
          <div style={{ marginBottom: 32 }}>
            <svg width="140" height="138" viewBox="0 0 140 138" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="lidMetal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#E8E8E8" />
                  <stop offset="40%" stopColor="#C0C0C0" />
                  <stop offset="100%" stopColor="#A0A0A0" />
                </linearGradient>
                <linearGradient id="bodyGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#F07820" />
                  <stop offset="60%" stopColor="#E06010" />
                  <stop offset="100%" stopColor="#B84C08" />
                </linearGradient>
                <clipPath id="bodyClip">
                  <path d="M22 52 Q18 100 70 108 Q122 108 118 52 Z" />
                </clipPath>
              </defs>

              {/* Drop shadow */}
              <ellipse cx="70" cy="112" rx="48" ry="10" fill="#3D2B1F" opacity="0.15" />

              {/* Pot body */}
              <path d="M22 52 Q18 100 70 108 Q122 108 118 52 Z" fill="url(#bodyGrad)" />

              {/* Enamel shine on body */}
              <path d="M32 60 Q40 54 60 52" stroke="rgba(255,255,255,0.30)" strokeWidth="3" strokeLinecap="round" />

              {/* Decorative band — geometric botanical motifs like on the real pot */}
              <g clipPath="url(#bodyClip)">
                {/* Band background strip */}
                <rect x="18" y="72" width="104" height="28" fill="#CC2020" opacity="0.18" />

                {/* Motif group 1 */}
                <g transform="translate(26, 74)">
                  <rect x="0" y="0" width="18" height="18" rx="2" fill="#CC2020" stroke="#7A1820" strokeWidth="1.5" />
                  <path d="M9 3 L12 9 L9 15 L6 9 Z" fill="#7A1820" />
                  <circle cx="9" cy="9" r="2" fill="#CC2020" />
                </g>

                {/* Motif group 2 */}
                <g transform="translate(50, 74)">
                  <rect x="0" y="0" width="18" height="18" rx="2" fill="#CC2020" stroke="#7A1820" strokeWidth="1.5" />
                  <path d="M9 2 Q13 9 9 16 Q5 9 9 2 Z" fill="#7A1820" />
                  <circle cx="9" cy="9" r="2.5" fill="#E06010" />
                </g>

                {/* Motif group 3 */}
                <g transform="translate(74, 74)">
                  <rect x="0" y="0" width="18" height="18" rx="2" fill="#CC2020" stroke="#7A1820" strokeWidth="1.5" />
                  <path d="M9 3 L12 9 L9 15 L6 9 Z" fill="#7A1820" />
                  <circle cx="9" cy="9" r="2" fill="#CC2020" />
                </g>

                {/* Motif group 4 */}
                <g transform="translate(98, 74)">
                  <rect x="0" y="0" width="18" height="18" rx="2" fill="#CC2020" stroke="#7A1820" strokeWidth="1.5" />
                  <path d="M9 2 Q13 9 9 16 Q5 9 9 2 Z" fill="#7A1820" />
                  <circle cx="9" cy="9" r="2.5" fill="#E06010" />
                </g>
              </g>

              {/* Handles — small loop handles like on the real pot */}
              <path d="M22 68 Q10 68 10 76 Q10 84 22 82" stroke="#B84C08" strokeWidth="7" strokeLinecap="round" fill="none" />
              <path d="M118 68 Q130 68 130 76 Q130 84 118 82" stroke="#B84C08" strokeWidth="7" strokeLinecap="round" fill="none" />
              {/* Handle orange fill */}
              <path d="M22 68 Q10 68 10 76 Q10 84 22 82" stroke="#E06010" strokeWidth="4" strokeLinecap="round" fill="none" />
              <path d="M118 68 Q130 68 130 76 Q130 84 118 82" stroke="#E06010" strokeWidth="4" strokeLinecap="round" fill="none" />

              {/* Chrome lid rim */}
              <ellipse cx="70" cy="48" rx="46" ry="11" fill="#A0A0A0" />
              <ellipse cx="70" cy="46" rx="46" ry="11" fill="url(#lidMetal)" />
              {/* Lid shine */}
              <path d="M36 42 Q55 39 84 41" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round" />

              {/* Lid knob — black bakelite like on the real pot */}
              <ellipse cx="70" cy="32" rx="10" ry="6" fill="#1A1A1A" />
              <ellipse cx="70" cy="29" rx="10" ry="6" fill="#2A2A2A" />
              <ellipse cx="70" cy="27" rx="10" ry="5" fill="#333" />
              {/* Knob highlight */}
              <ellipse cx="67" cy="26" rx="3" ry="2" fill="rgba(255,255,255,0.15)" />
            </svg>
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
            {day} gathering
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
