'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useFamilyData } from '@/lib/context';
import {
  getCurrentWeekStart,
  getEnvelopeSpentThisWeek,
  getEnvelopeTransactionsThisWeek,
  formatDate,
} from '@/lib/storage';
import { formatCurrency } from '@/lib/categorizer';
import BottomNav from '@/components/BottomNav';

export default function EnvelopePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data, removeTransaction, transferToTravel } = useFamilyData();
  const router = useRouter();

  const envelope = data.envelopes.find(e => e.id === id);
  if (!envelope) {
    return (
      <div style={{ padding: 20, fontFamily: 'Nunito, sans-serif' }}>
        Envelope not found.{' '}
        <Link href="/envelopes">Back</Link>
      </div>
    );
  }

  const weekStart = getCurrentWeekStart();
  const spent = getEnvelopeSpentThisWeek(data.transactions, envelope.id, weekStart);
  const transactions = getEnvelopeTransactionsThisWeek(data.transactions, envelope.id, weekStart);
  const remaining = envelope.weeklyBudget - spent;
  const pct = envelope.weeklyBudget > 0
    ? Math.min((spent / envelope.weeklyBudget) * 100, 100)
    : 0;
  const isOver = remaining < 0;

  const ENVELOPE_BG: Record<string, string> = {
    '#E06010': '#FBF2E8',
    '#C49A1E': '#FBF6E0',
    '#6B7A36': '#F0F5E4',
    '#5D4033': '#F5EDE8',
  };
  const bg = ENVELOPE_BG[envelope.color] ?? '#F9F0DC';

  return (
    <div className="page" style={{ background: bg }}>
      {/* Header */}
      <header style={{
        background: envelope.color,
        padding: '14px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}>
        <button
          onClick={() => router.back()}
          style={{
            background: 'rgba(255,255,255,0.15)',
            border: 'none',
            borderRadius: '50%',
            width: 36,
            height: 36,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
        </button>
        <div>
          <div style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: '1.3rem',
            fontWeight: 700,
            color: '#fff',
          }}>
            {envelope.name}
          </div>
          <div style={{
            fontFamily: 'Nunito, sans-serif',
            fontSize: '0.75rem',
            color: 'rgba(255,255,255,0.75)',
            marginTop: 1,
          }}>
            {new Date(weekStart + 'T12:00:00').toLocaleDateString('en-AU', {
              day: 'numeric', month: 'long',
            })} — this week
          </div>
        </div>
      </header>

      <div style={{ padding: '20px 16px', maxWidth: 480, margin: '0 auto' }}>

        {/* Envelope visual */}
        <div style={{
          background: '#F9F0DC',
          border: `1.5px solid #D4C4A0`,
          borderRadius: 14,
          overflow: 'hidden',
          marginBottom: 20,
          boxShadow: '0 4px 20px rgba(61,43,31,0.12)',
        }}>
          {/* Open envelope flap */}
          <div style={{
            background: '#EDD9B0',
            height: 60,
            position: 'relative',
            overflow: 'visible',
          }}>
            <svg
              viewBox="0 0 100 60"
              preserveAspectRatio="none"
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
            >
              {/* Open flap - pointing down like an open envelope */}
              <polygon points="0,0 50,50 100,0 100,60 0,60" fill="#F9F0DC" />
            </svg>
            <div style={{
              position: 'absolute',
              top: 10,
              left: '50%',
              transform: 'translateX(-50%)',
              fontFamily: 'Playfair Display, serif',
              fontStyle: 'italic',
              fontSize: '0.85rem',
              color: '#8B6B55',
            }}>
              {envelope.name}
            </div>
          </div>

          {/* Envelope contents */}
          <div style={{ padding: '20px 20px 24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 20 }}>
              {[
                { label: 'Budget', value: envelope.weeklyBudget, color: '#5D4033' },
                { label: 'Spent', value: spent, color: '#3D2B1F' },
                { label: remaining < 0 ? 'Over' : 'Left', value: Math.abs(remaining), color: isOver ? '#B84C08' : '#4D5928' },
              ].map(({ label, value, color }) => (
                <div key={label} style={{ textAlign: 'center' }}>
                  <div style={{
                    fontFamily: 'Nunito, sans-serif',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: '#8B6B55',
                    marginBottom: 4,
                  }}>
                    {label}
                  </div>
                  <div style={{
                    fontFamily: 'Playfair Display, serif',
                    fontSize: '1.35rem',
                    fontWeight: 700,
                    color,
                  }}>
                    {formatCurrency(value)}
                  </div>
                </div>
              ))}
            </div>

            {/* Progress bar */}
            <div className="progress-track">
              <div
                className="progress-fill"
                style={{
                  width: `${pct}%`,
                  background: isOver ? '#B84C08' : envelope.color,
                }}
              />
            </div>
          </div>
        </div>

        {/* Transfer to travel */}
        {remaining > 5 && data.travelGoal && (
          <button
            className="btn-secondary"
            style={{ width: '100%', marginBottom: 16 }}
            onClick={() => {
              transferToTravel(remaining);
              router.push('/travel');
            }}
          >
            Move {formatCurrency(remaining)} to Travel Fund
          </button>
        )}

        {/* Transactions */}
        <div style={{
          fontFamily: 'Nunito, sans-serif',
          fontSize: '0.78rem',
          fontWeight: 700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: '#8B6B55',
          marginBottom: 10,
        }}>
          Transactions this week
        </div>

        {transactions.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '28px 0',
            fontFamily: 'Nunito, sans-serif',
            color: '#8B6B55',
            fontSize: '0.95rem',
          }}>
            Nothing recorded yet this week
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {transactions.map((tx, i) => {
              const member = data.members.find(m => m.id === tx.memberId);
              return (
                <div
                  key={tx.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px 14px',
                    background: '#F9F0DC',
                    borderRadius: i === 0 ? '12px 12px 2px 2px'
                      : i === transactions.length - 1 ? '2px 2px 12px 12px'
                      : '2px',
                    border: '1px solid #E8D4A8',
                    gap: 12,
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontFamily: 'Nunito, sans-serif',
                      fontSize: '0.93rem',
                      fontWeight: 600,
                      color: '#3D2B1F',
                    }}>
                      {tx.description}
                    </div>
                    <div style={{
                      fontSize: '0.75rem',
                      color: '#8B6B55',
                      marginTop: 2,
                    }}>
                      {formatDate(tx.date)}
                      {member && member.name !== 'Everyone' && ` · ${member.name}`}
                    </div>
                  </div>
                  <div style={{
                    fontFamily: 'Nunito, sans-serif',
                    fontWeight: 800,
                    fontSize: '1rem',
                    color: '#3D2B1F',
                    flexShrink: 0,
                  }}>
                    {formatCurrency(tx.amount)}
                  </div>
                  <button
                    onClick={() => removeTransaction(tx.id)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '4px',
                      color: '#C4B490',
                      fontSize: '1.1rem',
                      lineHeight: 1,
                      flexShrink: 0,
                    }}
                    aria-label="Delete transaction"
                  >
                    ×
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Back to add spend */}
        <div style={{ marginTop: 20 }}>
          <Link
            href="/"
            style={{
              display: 'block',
              textAlign: 'center',
              padding: '14px',
              border: '2px solid #D4C4A0',
              borderRadius: 12,
              fontFamily: 'Nunito, sans-serif',
              fontSize: '0.95rem',
              fontWeight: 700,
              color: '#E06010',
              textDecoration: 'none',
            }}
          >
            + Add spend to {envelope.name}
          </Link>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
