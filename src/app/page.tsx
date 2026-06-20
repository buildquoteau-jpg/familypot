'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useFamilyData } from '@/lib/context';
import {
  getEnvelopeSpentThisWeek,
  getEnvelopeTransactionsThisWeek,
  isSunday,
  formatDate,
  getWeekBudget,
  getWeekTotalBudget,
  formatWeekRange,
} from '@/lib/storage';
import { formatCurrency } from '@/lib/categorizer';
import SpendEntry from '@/components/SpendEntry';
import WeekNavigator from '@/components/WeekNavigator';
import WeekSetup from '@/components/WeekSetup';
import BottomNav from '@/components/BottomNav';

export default function HomePage() {
  const { data, isLoaded, selectedWeekStart, isCurrentWeek } = useFamilyData();
  const router = useRouter();
  const [showWeekSetup, setShowWeekSetup] = useState(false);

  useEffect(() => {
    if (isLoaded && !data.setupComplete) {
      router.replace('/setup');
    }
  }, [isLoaded, data.setupComplete, router]);

  if (!isLoaded || !data.setupComplete) return null;

  if (showWeekSetup) {
    return (
      <div className="page" style={{ display: 'flex', flexDirection: 'column' }}>
        <header className="app-header">
          <div style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: '1.25rem',
            fontWeight: 700,
            color: '#F5E6C8',
          }}>
            Set up this week
          </div>
          <button
            onClick={() => setShowWeekSetup(false)}
            style={{
              background: 'transparent', border: 'none', cursor: 'pointer',
              fontFamily: 'Nunito, sans-serif', fontSize: '0.85rem',
              color: '#B09070', fontWeight: 700,
            }}
          >
            Cancel
          </button>
        </header>
        <WeekSetup weekStart={selectedWeekStart} onDone={() => setShowWeekSetup(false)} />
        <BottomNav />
      </div>
    );
  }

  const activeEnvelopes = data.envelopes
    .filter(e => !e.isTravelFund && !e.isPocketMoney)
    .sort((a, b) => a.order - b.order);

  const totalBudget = getWeekTotalBudget(data, selectedWeekStart);
  const totalSpent = activeEnvelopes.reduce(
    (s, e) => s + getEnvelopeSpentThisWeek(data.transactions, e.id, selectedWeekStart),
    0
  );
  const remaining = totalBudget - totalSpent;

  const recentTransactions = data.transactions
    .filter(t => t.weekStart === selectedWeekStart)
    .slice(0, 8);

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

      {/* Week navigator */}
      <WeekNavigator onSetUpWeek={() => setShowWeekSetup(true)} />

      {/* Sunday prompt */}
      {isSunday() && isCurrentWeek && (
        <Link href="/sunday" style={{ textDecoration: 'none', display: 'block', padding: '10px 16px 0' }}>
          <div style={{
            background: '#E06010',
            borderRadius: 12,
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            boxShadow: '0 3px 12px rgba(224,96,16,0.3)',
          }}>
            <div style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: '#F5E6C8',
              flexShrink: 0,
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
            marginBottom: 4,
          }}>
            {isCurrentWeek ? 'Remaining this week' : `Week of ${formatWeekRange(selectedWeekStart)}`}
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

      {/* Spend entry — only show for current week */}
      {isCurrentWeek ? (
        <SpendEntry />
      ) : (
        <div style={{ padding: '0 16px 8px' }}>
          <div style={{
            textAlign: 'center',
            padding: '16px',
            background: '#F9F0DC',
            border: '1.5px solid #D4C4A0',
            borderRadius: 12,
            fontFamily: 'Nunito, sans-serif',
            fontSize: '0.88rem',
            color: '#8B6B55',
          }}>
            Viewing a past week — spending can only be added to the current week
          </div>
        </div>
      )}

      {/* Envelope quick view */}
      {activeEnvelopes.length > 0 && (
        <div style={{ padding: '16px 16px 0' }}>
          <div style={{
            fontFamily: 'Nunito, sans-serif',
            fontSize: '0.78rem',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: '#8B6B55',
            marginBottom: 8,
          }}>
            Envelopes
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {activeEnvelopes.map(env => {
              const budget = getWeekBudget(data, env.id, selectedWeekStart);
              const spent = getEnvelopeSpentThisWeek(data.transactions, env.id, selectedWeekStart);
              const rem = budget - spent;
              const pct = budget > 0 ? Math.min((spent / budget) * 100, 100) : 0;
              return (
                <Link
                  key={env.id}
                  href={`/envelope/${env.id}`}
                  style={{ textDecoration: 'none' }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '10px 14px',
                    background: '#F9F0DC',
                    border: '1px solid #E8D4A8',
                    borderRadius: 10,
                    gap: 10,
                  }}>
                    <div style={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      background: env.color,
                      flexShrink: 0,
                    }} />
                    <div style={{
                      flex: 1,
                      fontFamily: 'Nunito, sans-serif',
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      color: '#3D2B1F',
                    }}>
                      {env.name}
                    </div>
                    <div style={{ width: 60, marginRight: 8 }}>
                      <div className="progress-track" style={{ height: 5 }}>
                        <div
                          className="progress-fill"
                          style={{ width: `${pct}%`, background: rem < 0 ? '#B84C08' : env.color }}
                        />
                      </div>
                    </div>
                    <div style={{
                      fontFamily: 'Nunito, sans-serif',
                      fontWeight: 800,
                      fontSize: '0.88rem',
                      color: rem < 0 ? '#B84C08' : '#3D2B1F',
                      minWidth: 52,
                      textAlign: 'right',
                    }}>
                      {formatCurrency(Math.abs(rem))}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Recent transactions */}
      {recentTransactions.length > 0 && (
        <div style={{ padding: '20px 16px 0' }}>
          <div style={{
            fontFamily: 'Nunito, sans-serif',
            fontSize: '0.78rem',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: '#8B6B55',
            marginBottom: 10,
          }}>
            Recent spends
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
                    <div style={{ fontSize: '0.75rem', color: '#8B6B55', marginTop: 1 }}>
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
        </div>
      )}

      <BottomNav />
    </div>
  );
}
