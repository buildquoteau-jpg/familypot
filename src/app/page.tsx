'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useFamilyData } from '@/lib/context';
import {
  getCurrentWeekStart,
  getEnvelopeSpentThisWeek,
  isSunday,
  formatDate,
} from '@/lib/storage';
import { formatCurrency } from '@/lib/categorizer';
import SpendEntry from '@/components/SpendEntry';
import BottomNav from '@/components/BottomNav';

export default function HomePage() {
  const { data, isLoaded } = useFamilyData();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !data.setupComplete) {
      router.replace('/setup');
    }
  }, [isLoaded, data.setupComplete, router]);

  if (!isLoaded || !data.setupComplete) return null;

  const weekStart = getCurrentWeekStart();
  const recentTransactions = data.transactions
    .filter(t => t.weekStart === weekStart)
    .slice(0, 8);

  const totalBudget = data.envelopes
    .filter(e => !e.isTravelFund && !e.isPocketMoney)
    .reduce((s, e) => s + e.weeklyBudget, 0);

  const totalSpent = data.envelopes
    .filter(e => !e.isTravelFund && !e.isPocketMoney)
    .reduce((s, e) => s + getEnvelopeSpentThisWeek(data.transactions, e.id, weekStart), 0);

  const remaining = totalBudget - totalSpent;

  return (
    <div className="page">
      {/* Header */}
      <header className="app-header">
        <div>
          <div style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: '1.25rem',
            fontWeight: 700,
            color: '#F5E6C8',
            letterSpacing: '0.01em',
          }}>
            The Family Pot
          </div>
          <div style={{
            fontFamily: 'Nunito, sans-serif',
            fontSize: '0.72rem',
            color: '#B09070',
            letterSpacing: '0.04em',
            marginTop: 1,
          }}>
            {data.familyName}
          </div>
        </div>
        <Link href="/setup" style={{ textDecoration: 'none' }}>
          <div style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="#B09070" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
            </svg>
          </div>
        </Link>
      </header>

      {/* Sunday prompt */}
      {isSunday() && (
        <Link href="/sunday" style={{ textDecoration: 'none', display: 'block', padding: '10px 16px 0' }}>
          <div style={{
            background: '#E06010',
            borderRadius: 12,
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            boxShadow: '0 3px 12px rgba(196,87,42,0.3)',
          }}>
            <div style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: '#F5E6C8',
              flexShrink: 0,
              animation: 'pulse-ring 1.5s ease infinite',
            }} />
            <div style={{
              fontFamily: 'Nunito, sans-serif',
              color: '#fff',
              fontSize: '0.9rem',
              fontWeight: 700,
            }}>
              It is Sunday — time for the Family Pot
            </div>
            <div style={{ marginLeft: 'auto', color: 'rgba(255,255,255,0.7)', fontSize: '1.2rem' }}>
              →
            </div>
          </div>
        </Link>
      )}

      {/* Weekly balance */}
      <div style={{ padding: '16px 16px 0' }}>
        <div className="surface" style={{ padding: '20px 20px 18px', marginBottom: 24 }}>
          <div style={{
            fontFamily: 'Nunito, sans-serif',
            fontSize: '0.78rem',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: '#8B6B55',
            marginBottom: 8,
          }}>
            Remaining this week
          </div>
          <div style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: '2.8rem',
            fontWeight: 700,
            color: remaining >= 0 ? '#3D2B1F' : '#B84C08',
            lineHeight: 1,
            marginBottom: 8,
          }}>
            {formatCurrency(Math.abs(remaining))}
          </div>
          <div style={{
            fontFamily: 'Nunito, sans-serif',
            fontSize: '0.85rem',
            color: '#8B6B55',
          }}>
            {formatCurrency(totalSpent)} spent of {formatCurrency(totalBudget)} budget
          </div>
          {totalBudget > 0 && (
            <div style={{ marginTop: 14 }}>
              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{
                    width: `${Math.min((totalSpent / totalBudget) * 100, 100)}%`,
                    background: remaining < 0 ? '#B84C08' : '#E06010',
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Spend entry */}
      <SpendEntry />

      {/* Recent transactions */}
      {recentTransactions.length > 0 && (
        <div style={{ padding: '28px 16px 0' }}>
          <div style={{
            fontFamily: 'Nunito, sans-serif',
            fontSize: '0.78rem',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: '#8B6B55',
            marginBottom: 12,
          }}>
            This week
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {recentTransactions.map((tx, i) => {
              const envelope = data.envelopes.find(e => e.id === tx.envelopeId);
              return (
                <div
                  key={tx.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '11px 14px',
                    background: '#F9F0DC',
                    borderRadius: i === 0 ? '12px 12px 2px 2px'
                      : i === recentTransactions.length - 1 ? '2px 2px 12px 12px'
                      : '2px',
                    border: '1px solid #E8D4A8',
                    gap: 12,
                    animation: 'slideUp 0.2s ease both',
                    animationDelay: `${i * 0.04}s`,
                  }}
                >
                  <div style={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    background: envelope?.color ?? '#E06010',
                    flexShrink: 0,
                  }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontFamily: 'Nunito, sans-serif',
                      fontSize: '0.93rem',
                      fontWeight: 600,
                      color: '#3D2B1F',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}>
                      {tx.description}
                    </div>
                    <div style={{
                      fontSize: '0.75rem',
                      color: '#8B6B55',
                      marginTop: 1,
                    }}>
                      {envelope?.name} · {formatDate(tx.date)}
                    </div>
                  </div>
                  <div style={{
                    fontFamily: 'Nunito, sans-serif',
                    fontWeight: 800,
                    fontSize: '0.95rem',
                    color: '#3D2B1F',
                    flexShrink: 0,
                  }}>
                    {formatCurrency(tx.amount)}
                  </div>
                </div>
              );
            })}
          </div>
          {data.transactions.filter(t => t.weekStart === weekStart).length > 8 && (
            <Link
              href="/envelopes"
              style={{
                display: 'block',
                textAlign: 'center',
                padding: '12px',
                fontFamily: 'Nunito, sans-serif',
                fontSize: '0.85rem',
                fontWeight: 700,
                color: '#E06010',
                textDecoration: 'none',
                marginTop: 6,
              }}
            >
              See all envelopes
            </Link>
          )}
        </div>
      )}

      <BottomNav />
    </div>
  );
}
