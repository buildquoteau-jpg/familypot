'use client';

import { useState } from 'react';
import { useFamilyData } from '@/lib/context';
import { getCurrentWeekStart, getEnvelopeSpentThisWeek } from '@/lib/storage';
import { formatCurrency, getPositiveLanguage } from '@/lib/categorizer';
import { getDiscussionPrompts } from '@/data/historical';

interface WeeklyReflectionProps {
  onDone: () => void;
}

export default function WeeklyReflection({ onDone }: WeeklyReflectionProps) {
  const { data, transferToTravel } = useFamilyData();
  const [transferAmounts, setTransferAmounts] = useState<Record<string, number>>({});
  const [transferred, setTransferred] = useState(false);

  const weekStart = getCurrentWeekStart();
  const activeEnvelopes = data.envelopes
    .filter(e => !e.isTravelFund && !e.isPocketMoney && e.weeklyBudget > 0)
    .sort((a, b) => a.order - b.order);

  const summary = activeEnvelopes.map(env => {
    const spent = getEnvelopeSpentThisWeek(data.transactions, env.id, weekStart);
    return {
      envelope: env,
      budget: env.weeklyBudget,
      spent,
      remaining: env.weeklyBudget - spent,
    };
  });

  const totalBudget = summary.reduce((s, e) => s + e.budget, 0);
  const totalSpent = summary.reduce((s, e) => s + e.spent, 0);

  const discussionPrompts = getDiscussionPrompts(
    summary.map(s => ({ name: s.envelope.name, budget: s.budget, spent: s.spent }))
  );

  const totalTransfer = Object.values(transferAmounts).reduce((s, n) => s + n, 0);

  const handleTransfer = (envelopeId: string, amount: number) => {
    setTransferAmounts(prev => ({ ...prev, [envelopeId]: amount }));
  };

  const handleConfirmTransfer = () => {
    if (totalTransfer > 0) {
      transferToTravel(totalTransfer);
      setTransferred(true);
    }
    onDone();
  };

  return (
    <div style={{ flex: 1, overflowY: 'auto' }}>
      <div style={{ padding: '0 20px 24px' }}>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <h2 style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: '1.6rem',
            fontWeight: 700,
            color: '#3D2B1F',
            margin: '0 0 6px',
          }}>
            How did we go?
          </h2>
          <div style={{
            fontFamily: 'Nunito, sans-serif',
            fontSize: '0.88rem',
            color: '#8B6B55',
          }}>
            {formatCurrency(totalSpent)} of {formatCurrency(totalBudget)} this week
          </div>
        </div>

        {/* Envelope summary */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
          {summary.map(({ envelope, budget, spent, remaining }) => {
            const pct = budget > 0 ? Math.min((spent / budget) * 100, 100) : 0;
            const isOver = remaining < 0;
            const label = getPositiveLanguage(budget, spent);

            return (
              <div
                key={envelope.id}
                style={{
                  background: '#F9F0DC',
                  border: '1.5px solid #D4C4A0',
                  borderRadius: 12,
                  padding: '14px 16px',
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: 8,
                }}>
                  <div>
                    <div style={{
                      fontFamily: 'Playfair Display, serif',
                      fontWeight: 600,
                      color: '#3D2B1F',
                      fontSize: '1rem',
                    }}>
                      {envelope.name}
                    </div>
                    <div style={{
                      fontFamily: 'Nunito, sans-serif',
                      fontSize: '0.78rem',
                      color: '#8B6B55',
                      marginTop: 2,
                    }}>
                      {label}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', fontFamily: 'Nunito, sans-serif' }}>
                    <div style={{
                      fontSize: '1.1rem',
                      fontWeight: 800,
                      color: isOver ? '#B84C08' : '#3D2B1F',
                    }}>
                      {formatCurrency(spent)}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#8B6B55' }}>
                      of {formatCurrency(budget)}
                    </div>
                  </div>
                </div>

                {/* Progress */}
                <div className="progress-track" style={{ marginBottom: remaining > 5 ? 10 : 0 }}>
                  <div
                    className="progress-fill"
                    style={{
                      width: `${pct}%`,
                      background: isOver ? '#B84C08' : envelope.color,
                    }}
                  />
                </div>

                {/* Transfer to travel option */}
                {remaining > 5 && data.travelGoal && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    marginTop: 8,
                    fontFamily: 'Nunito, sans-serif',
                    fontSize: '0.82rem',
                  }}>
                    <input
                      type="checkbox"
                      id={`transfer-${envelope.id}`}
                      checked={!!transferAmounts[envelope.id]}
                      onChange={e => handleTransfer(envelope.id, e.target.checked ? remaining : 0)}
                      style={{ accentColor: '#6B7A36', width: 16, height: 16 }}
                    />
                    <label
                      htmlFor={`transfer-${envelope.id}`}
                      style={{ color: '#5D4033', cursor: 'pointer' }}
                    >
                      Move {formatCurrency(remaining)} to Travel Fund
                    </label>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Discussion prompts */}
        <div style={{ marginBottom: 28 }}>
          <div style={{
            fontFamily: 'Nunito, sans-serif',
            fontSize: '0.78rem',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: '#8B6B55',
            marginBottom: 14,
          }}>
            Talk about it
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {discussionPrompts.map((prompt, i) => (
              <div
                key={i}
                style={{
                  background: '#F9F0DC',
                  border: '1.5px solid #D4C4A0',
                  borderLeft: '4px solid #E06010',
                  borderRadius: '0 12px 12px 0',
                  padding: '12px 16px',
                  fontFamily: 'Nunito, sans-serif',
                  fontSize: '0.95rem',
                  color: '#3D2B1F',
                  lineHeight: 1.55,
                }}
              >
                {prompt}
              </div>
            ))}
          </div>
        </div>

        {/* Travel fund transfer summary */}
        {totalTransfer > 0 && (
          <div style={{
            background: 'rgba(107,122,54,0.1)',
            border: '1.5px solid #C8D8A8',
            borderRadius: 12,
            padding: '14px 16px',
            marginBottom: 20,
            fontFamily: 'Nunito, sans-serif',
            fontSize: '0.95rem',
            color: '#4D5928',
            fontWeight: 600,
          }}>
            Moving {formatCurrency(totalTransfer)} to the Travel Fund
          </div>
        )}

        {/* Done button */}
        <button className="btn-primary" onClick={handleConfirmTransfer}>
          {totalTransfer > 0 ? `Save & Transfer ${formatCurrency(totalTransfer)}` : 'Set up next week'}
        </button>
      </div>
    </div>
  );
}
