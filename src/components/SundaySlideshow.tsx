'use client';

import { useState } from 'react';
import { HistoricalSlide } from '@/data/historical';

interface SundarySlideshowProps {
  slides: HistoricalSlide[];
  onComplete: () => void;
}

export default function SundaySlideshow({ slides, onComplete }: SundarySlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const current = slides[currentIndex];
  const isLast = currentIndex === slides.length - 1;

  if (!current) return null;

  const decadeColors: Record<string, { bg: string; accent: string; text: string }> = {
    '1960s': { bg: '#E06010', accent: '#E87828', text: '#fff' },
    '1970s': { bg: '#C49A1E', accent: '#D4AA2E', text: '#fff' },
    '1980s': { bg: '#6B7A36', accent: '#8A9A4A', text: '#fff' },
    '1990s': { bg: '#5D4033', accent: '#7D5540', text: '#fff' },
  };

  const colors = decadeColors[current.decade] ?? decadeColors['1960s'];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Decade badge */}
      <div style={{
        background: colors.bg,
        padding: '10px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <span style={{
          fontFamily: 'Playfair Display, serif',
          fontWeight: 700,
          fontSize: '1.1rem',
          color: '#fff',
          fontStyle: 'italic',
        }}>
          {current.decade}
        </span>
        <div style={{ display: 'flex', gap: 6 }}>
          {slides.map((_, i) => (
            <div
              key={i}
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: i === currentIndex ? '#fff' : 'rgba(255,255,255,0.35)',
                transition: 'background 0.2s',
              }}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: '24px 20px', overflowY: 'auto' }}>
        {/* Photo placeholder */}
        <div className="photo-card" style={{ marginBottom: 24 }}>
          <div className="photo-inner" style={{ minHeight: 180 }}>
            {/* Vintage sepia-toned placeholder */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(135deg, #C8A876 0%, #A88C60 50%, #887040 100%)',
            }} />
            <div style={{
              position: 'relative',
              zIndex: 1,
              padding: '16px',
              textAlign: 'center',
            }}>
              <div style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: '0.9rem',
                fontStyle: 'italic',
                color: '#F5E6C8',
                lineHeight: 1.5,
                textShadow: '0 1px 4px rgba(0,0,0,0.5)',
              }}>
                {current.imagePrompt}
              </div>
            </div>
            {/* Film grain overlay */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'200\' height=\'200\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\'/%3E%3CfeColorMatrix type=\'saturate\' values=\'0\'/%3E%3C/filter%3E%3Crect width=\'200\' height=\'200\' filter=\'url(%23n)\' opacity=\'0.12\'/%3E%3C/svg%3E")',
              opacity: 0.4,
            }} />
          </div>
          {/* Photo caption strip */}
          <div style={{
            marginTop: 8,
            fontFamily: 'Nunito, sans-serif',
            fontSize: '0.72rem',
            color: '#8B6B55',
            fontStyle: 'italic',
            textAlign: 'center',
          }}>
            {current.source}
          </div>
        </div>

        {/* Year & title */}
        <div style={{ marginBottom: 14 }}>
          <div style={{
            fontFamily: 'Nunito, sans-serif',
            fontSize: '0.78rem',
            fontWeight: 800,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: colors.bg,
            marginBottom: 4,
          }}>
            {current.year}
          </div>
          <h2 style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: '1.5rem',
            fontWeight: 700,
            color: '#3D2B1F',
            margin: 0,
            lineHeight: 1.25,
          }}>
            {current.title}
          </h2>
        </div>

        {/* Content */}
        <p style={{
          fontFamily: 'Nunito, sans-serif',
          fontSize: '1.05rem',
          color: '#5D4033',
          lineHeight: 1.7,
          margin: '0 0 20px',
        }}>
          {current.content}
        </p>

        {/* Stat comparison */}
        {current.stat && (
          <div style={{
            background: '#F9F0DC',
            border: '1.5px solid #D4C4A0',
            borderRadius: 14,
            padding: '14px 18px',
            marginBottom: 20,
          }}>
            <div style={{
              fontFamily: 'Nunito, sans-serif',
              fontSize: '0.78rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: '#8B6B55',
              marginBottom: 10,
            }}>
              {current.stat.label}
            </div>
            <div style={{ display: 'flex', gap: 20 }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#8B6B55', marginBottom: 2 }}>Then</div>
                <div style={{
                  fontFamily: 'Playfair Display, serif',
                  fontSize: '1.2rem',
                  fontWeight: 700,
                  color: colors.bg,
                }}>
                  {current.stat.then}
                </div>
              </div>
              <div style={{ fontSize: '1.4rem', color: '#D4C4A0', alignSelf: 'center' }}>→</div>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#8B6B55', marginBottom: 2 }}>Now</div>
                <div style={{
                  fontFamily: 'Playfair Display, serif',
                  fontSize: '1.2rem',
                  fontWeight: 700,
                  color: '#3D2B1F',
                }}>
                  {current.stat.now}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div style={{ padding: '16px 20px', display: 'flex', gap: 10 }}>
        {currentIndex > 0 && (
          <button
            className="btn-ghost"
            onClick={() => setCurrentIndex(i => i - 1)}
            style={{ flex: 1 }}
          >
            Back
          </button>
        )}
        <button
          className={isLast ? 'btn-primary' : 'btn-secondary'}
          onClick={() => isLast ? onComplete() : setCurrentIndex(i => i + 1)}
          style={{ flex: 2 }}
        >
          {isLast ? 'See this week' : 'Next'}
        </button>
      </div>
    </div>
  );
}
