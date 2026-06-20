'use client';

import { useState, useMemo } from 'react';
import { useFamilyData } from '@/lib/context';
import { formatWeekRange, getWeekBudget } from '@/lib/storage';
import { formatCurrency } from '@/lib/categorizer';
import { getTermForDate, getTermWeekNumber, getSchoolHolidayLabel } from '@/data/schoolTerms';

interface WeekSetupProps {
  weekStart: string;
  onDone: () => void;
}

export default function WeekSetup({ weekStart, onDone }: WeekSetupProps) {
  const { data, setupThisWeek } = useFamilyData();

  const activeEnvelopes = data.envelopes
    .filter(e => !e.isTravelFund && !e.isPocketMoney)
    .sort((a, b) => a.order - b.order);

  // Initialise from previous week's budgets or envelope defaults
  const initialAllocations = useMemo(() => {
    const result: Record<string, number> = {};
    for (const env of activeEnvelopes) {
      result[env.id] = getWeekBudget(data, env.id, weekStart);
    }
    return result;
  }, [data, weekStart, activeEnvelopes]);

  const defaultTotal = Object.values(initialAllocations).reduce((s, v) => s + v, 0);
  const [totalAvailable, setTotalAvailable] = useState<string>(defaultTotal.toString());
  const [allocations, setAllocations] = useState<Record<string, string>>(
    Object.fromEntries(
      Object.entries(initialAllocations).map(([k, v]) => [k, v.toString()])
    )
  );

  const state = data.state ?? 'QLD';
  const term = getTermForDate(weekStart, state);
  const weekNum = term ? getTermWeekNumber(weekStart, term) : null;
  const holidayLabel = !term ? getSchoolHolidayLabel(weekStart, state) : null;

  const parsedAllocations = Object.fromEntries(
    Object.entries(allocations).map(([k, v]) => [k, parseFloat(v) || 0])
  );
  const allocatedTotal = Object.values(parsedAllocations).reduce((s, v) => s + v, 0);
  const totalNum = parseFloat(totalAvailable) || 0;
  const unallocated = totalNum - allocatedTotal;
  const isBalanced = Math.abs(unallocated) < 0.01;

  const handleConfirm = () => {
    setupThisWeek(weekStart, parsedAllocations, totalNum);
    onDone();
  };

  const distributeEvenly = () => {
    const total = totalNum;
    const count = activeEnvelopes.length;
    if (!count || !total) return;
    const perEnvelope = Math.floor((total / count) * 100) / 100;
    const remainder = Math.round((total - perEnvelope * count) * 100) / 100;
    const newAllocs: Record<string, string> = {};
    activeEnvelopes.forEach((env, i) => {
      newAllocs[env.id] = (i === 0 ? perEnvelope + remainder : perEnvelope).toString();
    });
    setAllocations(newAllocs);
  };

  const weekDate = new Date(weekStart + 'T12:00:00');
  const weekEndDate = new Date(weekStart + 'T12:00:00');
  weekEndDate.setDate(weekEndDate.getDate() + 6);

  return (
    <div style={{ flex: 1, overflowY: 'auto' }}>
      <div style={{ padding: '20px 16px 32px', maxWidth: 480, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <div style={{
            fontFamily: 'Nunito, sans-serif',
            fontSize: '0.78rem',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: '#8B6B55',
            marginBottom: 6,
          }}>
            {weekDate.toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
          <h2 style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: '1.6rem',
            fontWeight: 700,
            color: '#3D2B1F',
            margin: '0 0 8px',
            lineHeight: 1.2,
          }}>
            {term
              ? `Term ${term.term}, Week ${weekNum}`
              : holidayLabel ?? `Week of ${formatWeekRange(weekStart)}`}
          </h2>
          <div style={{
            fontFamily: 'Nunito, sans-serif',
            fontSize: '0.9rem',
            color: '#5D4033',
            lineHeight: 1.55,
          }}>
            How much is available this week? Divide it up together.
          </div>
        </div>

        {/* Total available */}
        <div style={{ marginBottom: 24 }}>
          <label style={{
            display: 'block',
            fontFamily: 'Nunito, sans-serif',
            fontSize: '0.78rem',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: '#8B6B55',
            marginBottom: 8,
          }}>
            Available this week
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: '1.5rem',
              fontWeight: 700,
              color: '#3D2B1F',
            }}>
              $
            </span>
            <input
              type="number"
              className="pot-input"
              value={totalAvailable}
              onChange={e => setTotalAvailable(e.target.value)}
              placeholder="0"
              inputMode="decimal"
              style={{ fontSize: '2rem', fontWeight: 800, flex: 1 }}
            />
          </div>
        </div>

        {/* Envelope allocations */}
        <div style={{ marginBottom: 8 }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 12,
          }}>
            <div style={{
              fontFamily: 'Nunito, sans-serif',
              fontSize: '0.78rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: '#8B6B55',
            }}>
              Envelope allocations
            </div>
            {totalNum > 0 && (
              <button
                onClick={distributeEvenly}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'Nunito, sans-serif',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: '#E06010',
                  padding: 0,
                }}
              >
                Divide evenly
              </button>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {activeEnvelopes.map(env => (
              <div
                key={env.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 14px',
                  background: '#F9F0DC',
                  border: '1.5px solid #D4C4A0',
                  borderRadius: 12,
                }}
              >
                <div style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: env.color,
                  flexShrink: 0,
                }} />
                <div style={{
                  fontFamily: 'Nunito, sans-serif',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  color: '#3D2B1F',
                  flex: 1,
                }}>
                  {env.name}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{
                    fontFamily: 'Nunito, sans-serif',
                    fontWeight: 700,
                    color: '#8B6B55',
                    fontSize: '0.9rem',
                  }}>
                    $
                  </span>
                  <input
                    type="number"
                    value={allocations[env.id] ?? ''}
                    onChange={e => setAllocations(prev => ({ ...prev, [env.id]: e.target.value }))}
                    inputMode="decimal"
                    style={{
                      width: 80,
                      padding: '6px 8px',
                      border: '1.5px solid #D4C4A0',
                      borderRadius: 8,
                      fontFamily: 'Nunito, sans-serif',
                      fontSize: '1rem',
                      fontWeight: 800,
                      color: '#3D2B1F',
                      background: '#fff',
                      outline: 'none',
                      textAlign: 'right',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Running total */}
        <div style={{
          padding: '14px 16px',
          background: isBalanced ? 'rgba(107,122,54,0.1)' : unallocated > 0 ? '#F9F0DC' : 'rgba(184,76,8,0.08)',
          border: `1.5px solid ${isBalanced ? '#C8D8A8' : unallocated > 0 ? '#D4C4A0' : '#E8B898'}`,
          borderRadius: 12,
          marginBottom: 20,
          marginTop: 12,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontFamily: 'Nunito, sans-serif', fontSize: '0.85rem', color: '#5D4033', fontWeight: 600 }}>
              Allocated
            </span>
            <span style={{ fontFamily: 'Nunito, sans-serif', fontSize: '0.95rem', fontWeight: 800, color: '#3D2B1F' }}>
              {formatCurrency(allocatedTotal)}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: 'Nunito, sans-serif', fontSize: '0.85rem', color: '#5D4033', fontWeight: 600 }}>
              {unallocated >= 0 ? 'Unallocated' : 'Over by'}
            </span>
            <span style={{
              fontFamily: 'Nunito, sans-serif',
              fontSize: '0.95rem',
              fontWeight: 800,
              color: isBalanced ? '#4D5928' : unallocated > 0 ? '#B84C08' : '#B84C08',
            }}>
              {isBalanced ? 'Balanced' : formatCurrency(Math.abs(unallocated))}
            </span>
          </div>
        </div>

        <button
          className="btn-primary"
          onClick={handleConfirm}
          disabled={!totalNum}
        >
          Confirm Week {term ? `— Term ${term.term}, Week ${weekNum}` : ''}
        </button>

        <button
          className="btn-ghost"
          onClick={onDone}
          style={{ width: '100%', marginTop: 10 }}
        >
          Skip for now
        </button>
      </div>
    </div>
  );
}
