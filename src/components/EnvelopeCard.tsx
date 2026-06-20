'use client';

import Link from 'next/link';
import { Envelope } from '@/lib/types';
import { formatCurrency } from '@/lib/categorizer';

interface EnvelopeCardProps {
  envelope: Envelope;
  spent: number;
  weeklyBudget: number;
  transactionCount: number;
}

const ENVELOPE_COLORS: Record<string, { bg: string; border: string; flap: string; fill: string }> = {
  '#E06010': { bg: '#FBF2E8', border: '#E8C4A8', flap: '#F0D4B8', fill: '#E06010' },
  '#C49A1E': { bg: '#FBF6E0', border: '#E8D898', flap: '#F0E4A0', fill: '#C49A1E' },
  '#6B7A36': { bg: '#F0F5E4', border: '#C8D8A8', flap: '#D8E8B8', fill: '#6B7A36' },
  '#5D4033': { bg: '#F5EDE8', border: '#D8C4B8', flap: '#E8D4C0', fill: '#5D4033' },
};

function getColors(color: string) {
  return ENVELOPE_COLORS[color] ?? ENVELOPE_COLORS['#E06010'];
}

export default function EnvelopeCard({
  envelope, spent, weeklyBudget, transactionCount,
}: EnvelopeCardProps) {
  const colors = getColors(envelope.color);
  const remaining = weeklyBudget - spent;
  const pct = weeklyBudget > 0 ? Math.min((spent / weeklyBudget) * 100, 100) : 0;
  const isOver = remaining < 0;

  if (envelope.isTravelFund) {
    return (
      <Link href={`/travel`} style={{ display: 'block', textDecoration: 'none' }}>
        <div
          style={{
            background: '#F0F5E4',
            border: '1.5px solid #C8D8A8',
            borderRadius: 14,
            overflow: 'hidden',
            boxShadow: '0 3px 12px rgba(61,43,31,0.1)',
          }}
        >
          {/* Envelope flap */}
          <div style={{ background: '#D8E8B8', height: 44, position: 'relative', overflow: 'hidden' }}>
            <svg
              viewBox="0 0 100 44"
              preserveAspectRatio="none"
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
            >
              <polygon points="0,0 50,44 100,0" fill="#F0F5E4" />
            </svg>
          </div>
          <div style={{ padding: '14px 18px 18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
              <span style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: '1.1rem',
                fontWeight: 700,
                color: '#3D2B1F',
              }}>
                {envelope.name}
              </span>
              <span style={{
                fontSize: '0.7rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: '#6B7A36',
                background: 'rgba(107,122,54,0.12)',
                padding: '3px 8px',
                borderRadius: 9999,
              }}>
                Savings
              </span>
            </div>
            <div style={{ fontFamily: 'Nunito, sans-serif' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#4D5928', lineHeight: 1 }}>
                {formatCurrency(spent)}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#6B7A36', marginTop: 2 }}>
                saved so far
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/envelope/${envelope.id}`} style={{ display: 'block', textDecoration: 'none' }}>
      <div
        style={{
          background: colors.bg,
          border: `1.5px solid ${colors.border}`,
          borderRadius: 14,
          overflow: 'hidden',
          boxShadow: '0 3px 12px rgba(61,43,31,0.1)',
          transition: 'transform 0.12s, box-shadow 0.12s',
        }}
        onPointerDown={e => {
          (e.currentTarget as HTMLElement).style.transform = 'scale(0.98)';
        }}
        onPointerUp={e => {
          (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
        }}
        onPointerLeave={e => {
          (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
        }}
      >
        {/* Envelope flap */}
        <div style={{ background: colors.flap, height: 44, position: 'relative', overflow: 'hidden' }}>
          <svg
            viewBox="0 0 100 44"
            preserveAspectRatio="none"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
          >
            <polygon points="0,0 50,44 100,0" fill={colors.bg} />
          </svg>
        </div>

        {/* Envelope body */}
        <div style={{ padding: '14px 18px 18px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: 12,
          }}>
            <span style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: '1.1rem',
              fontWeight: 700,
              color: '#3D2B1F',
            }}>
              {envelope.name}
            </span>
            {transactionCount > 0 && (
              <span style={{
                fontSize: '0.7rem',
                fontWeight: 700,
                letterSpacing: '0.06em',
                color: '#8B6B55',
              }}>
                {transactionCount} {transactionCount === 1 ? 'spend' : 'spends'}
              </span>
            )}
          </div>

          {/* Amount */}
          <div style={{ marginBottom: 12, fontFamily: 'Nunito, sans-serif' }}>
            <div style={{
              fontSize: '1.9rem',
              fontWeight: 800,
              color: isOver ? '#B84C08' : '#3D2B1F',
              lineHeight: 1,
            }}>
              {formatCurrency(Math.abs(remaining))}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#8B6B55', marginTop: 3 }}>
              {isOver ? 'over budget' : 'remaining'}
              {' · '}
              <span style={{ color: '#5D4033' }}>{formatCurrency(weeklyBudget)} budget</span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="progress-track">
            <div
              className="progress-fill"
              style={{
                width: `${pct}%`,
                background: isOver
                  ? '#B84C08'
                  : pct > 85
                  ? colors.fill
                  : colors.fill,
                opacity: isOver ? 1 : 0.75 + pct / 400,
              }}
            />
          </div>
        </div>
      </div>
    </Link>
  );
}
