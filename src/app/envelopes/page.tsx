'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useFamilyData } from '@/lib/context';
import WeekSetup from '@/components/WeekSetup';
import {
  getEnvelopeSpentThisWeek,
  getEnvelopeTransactionsThisWeek,
  getWeekBudget,
  getWeekTotalBudget,
} from '@/lib/storage';
import { formatCurrency } from '@/lib/categorizer';
import EnvelopeCard from '@/components/EnvelopeCard';
import WeekNavigator from '@/components/WeekNavigator';
import BottomNav from '@/components/BottomNav';

export default function EnvelopesPage() {
  const { data, isLoaded, selectedWeekStart } = useFamilyData();
  const router = useRouter();
  const [showWeekSetup, setShowWeekSetup] = useState(false);

  useEffect(() => {
    if (isLoaded && !data.setupComplete) router.replace('/setup');
  }, [isLoaded, data.setupComplete, router]);

  if (!isLoaded || !data.setupComplete) return null;

  if (showWeekSetup) {
    return (
      <div style={{ minHeight: '100vh', background: '#F5E6C8' }}>
        <header className="app-header">
          <span style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.2rem', fontWeight: 700, color: '#F5E6C8' }}>Set up this week</span>
          <button onClick={() => setShowWeekSetup(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'Nunito, sans-serif', fontSize: '0.85rem', color: '#B09070', fontWeight: 700 }}>Cancel</button>
        </header>
        <WeekSetup weekStart={selectedWeekStart} onDone={() => setShowWeekSetup(false)} />
        <BottomNav />
      </div>
    );
  }

  const regularEnvelopes = data.envelopes
    .filter(e => !e.isTravelFund && !e.isPocketMoney)
    .sort((a, b) => a.order - b.order);

  const travelEnvelope = data.envelopes.find(e => e.isTravelFund);

  const totalBudget = getWeekTotalBudget(data, selectedWeekStart);
  const totalSpent = regularEnvelopes.reduce(
    (s, e) => s + getEnvelopeSpentThisWeek(data.transactions, e.id, selectedWeekStart),
    0
  );

  return (
    <div className="page">
      {/* Header */}
      <header className="app-header">
        <div style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: '1.3rem',
          fontWeight: 700,
          color: '#F5E6C8',
        }}>
          Envelopes
        </div>
        <Link href="/setup" style={{ textDecoration: 'none' }}>
          <span style={{
            fontFamily: 'Nunito, sans-serif',
            fontSize: '0.82rem',
            fontWeight: 700,
            color: '#B09070',
          }}>
            Edit
          </span>
        </Link>
      </header>

      <WeekNavigator compact onSetUpWeek={() => setShowWeekSetup(true)} />

      <div style={{ padding: '16px 16px 0', maxWidth: 480, margin: '0 auto' }}>

        {/* Weekly overview */}
        <div className="surface" style={{ padding: '18px', marginBottom: 20 }}>
          <div style={{
            fontFamily: 'Nunito, sans-serif',
            fontSize: '0.78rem',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: '#8B6B55',
            marginBottom: 4,
          }}>
            Week summary
          </div>
          <div style={{ display: 'flex', gap: 24, alignItems: 'flex-end' }}>
            <div>
              <div style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: '2rem',
                fontWeight: 700,
                color: '#3D2B1F',
                lineHeight: 1,
              }}>
                {formatCurrency(totalBudget - totalSpent)}
              </div>
              <div style={{
                fontFamily: 'Nunito, sans-serif',
                fontSize: '0.8rem',
                color: '#8B6B55',
                marginTop: 3,
              }}>
                remaining of {formatCurrency(totalBudget)}
              </div>
            </div>
          </div>
          <div style={{ marginTop: 12 }}>
            <div className="progress-track">
              <div
                className="progress-fill"
                style={{
                  width: `${Math.min((totalSpent / totalBudget) * 100, 100)}%`,
                  background: totalSpent > totalBudget ? '#B84C08' : '#E06010',
                }}
              />
            </div>
          </div>
        </div>

        {/* Envelope grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
          {regularEnvelopes.map(envelope => {
            const spent = getEnvelopeSpentThisWeek(data.transactions, envelope.id, selectedWeekStart);
            const budget = getWeekBudget(data, envelope.id, selectedWeekStart);
            const txCount = getEnvelopeTransactionsThisWeek(data.transactions, envelope.id, selectedWeekStart).length;
            return (
              <EnvelopeCard
                key={envelope.id}
                envelope={envelope}
                spent={spent}
                weeklyBudget={budget}
                transactionCount={txCount}
              />
            );
          })}
        </div>

        {/* Travel fund */}
        {travelEnvelope && data.travelGoal && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <EnvelopeCard
                envelope={travelEnvelope}
                spent={data.travelGoal.currentAmount}
                weeklyBudget={0}
                transactionCount={0}
              />
            </div>
          </div>
        )}

        {/* Add envelope */}
        <Link
          href="/setup?tab=envelopes"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            padding: '14px',
            border: '2px dashed #D4C4A0',
            borderRadius: 14,
            fontFamily: 'Nunito, sans-serif',
            fontSize: '0.9rem',
            fontWeight: 700,
            color: '#8B6B55',
            textDecoration: 'none',
          }}
        >
          <span style={{ fontSize: '1.2rem' }}>+</span>
          Add envelope
        </Link>
      </div>

      <BottomNav />
    </div>
  );
}
