'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useFamilyData } from '@/lib/context';
import { formatCurrency } from '@/lib/categorizer';
import BottomNav from '@/components/BottomNav';

export default function TravelPage() {
  const { data, isLoaded, saveTravelGoal, transferToTravel } = useFamilyData();
  const [addAmount, setAddAmount] = useState('');
  const [editing, setEditing] = useState(false);
  const [goalName, setGoalName] = useState('');
  const [goalTarget, setGoalTarget] = useState('');
  const [goalDesc, setGoalDesc] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !data.setupComplete) router.replace('/setup');
    if (data.travelGoal) {
      setGoalName(data.travelGoal.name);
      setGoalTarget(data.travelGoal.targetAmount.toString());
      setGoalDesc(data.travelGoal.description);
    }
  }, [isLoaded, data.setupComplete, data.travelGoal, router]);

  if (!isLoaded || !data.setupComplete) return null;

  const goal = data.travelGoal;
  const pct = goal ? Math.min((goal.currentAmount / goal.targetAmount) * 100, 100) : 0;
  const remaining = goal ? goal.targetAmount - goal.currentAmount : 0;

  const handleAdd = () => {
    const amount = parseFloat(addAmount);
    if (amount > 0) {
      transferToTravel(amount);
      setAddAmount('');
    }
  };

  const handleSaveGoal = () => {
    const target = parseFloat(goalTarget);
    if (!goalName || !target) return;
    saveTravelGoal({
      id: goal?.id ?? Math.random().toString(36),
      name: goalName,
      targetAmount: target,
      currentAmount: goal?.currentAmount ?? 0,
      description: goalDesc,
    });
    setEditing(false);
  };

  if (editing || !goal) {
    return (
      <div className="page">
        <header className="app-header">
          <div style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: '1.25rem',
            fontWeight: 700,
            color: '#F5E6C8',
          }}>
            Travel Fund
          </div>
          {goal && (
            <button
              onClick={() => setEditing(false)}
              style={{
                background: 'transparent', border: 'none', cursor: 'pointer',
                fontFamily: 'Nunito, sans-serif', fontSize: '0.85rem',
                color: '#B09070', fontWeight: 700,
              }}
            >
              Cancel
            </button>
          )}
        </header>

        <div style={{ padding: '24px 16px', maxWidth: 480, margin: '0 auto' }}>
          <h2 style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: '1.5rem',
            fontWeight: 700,
            color: '#3D2B1F',
            marginBottom: 24,
          }}>
            {goal ? 'Edit goal' : 'Set a travel goal'}
          </h2>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontFamily: 'Nunito, sans-serif', fontSize: '0.8rem', fontWeight: 700, color: '#8B6B55', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              What are we saving for?
            </label>
            <input
              className="pot-input pot-input-sm"
              value={goalName}
              onChange={e => setGoalName(e.target.value)}
              placeholder="Family holiday, new bike, camping trip..."
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontFamily: 'Nunito, sans-serif', fontSize: '0.8rem', fontWeight: 700, color: '#8B6B55', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              How much do we need?
            </label>
            <input
              className="pot-input pot-input-sm"
              type="number"
              value={goalTarget}
              onChange={e => setGoalTarget(e.target.value)}
              placeholder="3000"
              inputMode="decimal"
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontFamily: 'Nunito, sans-serif', fontSize: '0.8rem', fontWeight: 700, color: '#8B6B55', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Tell us about it
            </label>
            <input
              className="pot-input pot-input-sm"
              value={goalDesc}
              onChange={e => setGoalDesc(e.target.value)}
              placeholder="A beach holiday for the whole family..."
            />
          </div>

          <button
            className="btn-primary"
            onClick={handleSaveGoal}
            disabled={!goalName || !goalTarget}
          >
            {goal ? 'Save changes' : 'Set goal'}
          </button>
        </div>

        <BottomNav />
      </div>
    );
  }

  return (
    <div className="page">
      <header className="app-header">
        <div style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: '1.25rem',
          fontWeight: 700,
          color: '#F5E6C8',
        }}>
          Travel Fund
        </div>
        <button
          onClick={() => setEditing(true)}
          style={{
            background: 'transparent', border: 'none', cursor: 'pointer',
            fontFamily: 'Nunito, sans-serif', fontSize: '0.85rem',
            color: '#B09070', fontWeight: 700,
          }}
        >
          Edit goal
        </button>
      </header>

      <div style={{ padding: '24px 16px', maxWidth: 480, margin: '0 auto' }}>
        {/* Goal card */}
        <div className="surface-elevated" style={{ padding: '24px', marginBottom: 24 }}>
          <div style={{
            fontFamily: 'Nunito, sans-serif',
            fontSize: '0.78rem',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: '#8B6B55',
            marginBottom: 8,
          }}>
            Saving for
          </div>
          <div style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: '1.7rem',
            fontWeight: 700,
            color: '#3D2B1F',
            marginBottom: 4,
          }}>
            {goal.name}
          </div>
          {goal.description && (
            <div style={{
              fontFamily: 'Nunito, sans-serif',
              fontSize: '0.9rem',
              color: '#8B6B55',
              marginBottom: 20,
              lineHeight: 1.5,
            }}>
              {goal.description}
            </div>
          )}

          {/* Big progress number */}
          <div style={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: 12,
            marginBottom: 16,
          }}>
            <div>
              <div style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: '2.8rem',
                fontWeight: 700,
                color: '#4D5928',
                lineHeight: 1,
              }}>
                {formatCurrency(goal.currentAmount)}
              </div>
              <div style={{
                fontFamily: 'Nunito, sans-serif',
                fontSize: '0.85rem',
                color: '#8B6B55',
                marginTop: 4,
              }}>
                of {formatCurrency(goal.targetAmount)} goal
              </div>
            </div>
            <div style={{
              fontFamily: 'Nunito, sans-serif',
              fontSize: '2rem',
              fontWeight: 800,
              color: '#8A9A4A',
              paddingBottom: 4,
            }}>
              {Math.round(pct)}%
            </div>
          </div>

          {/* Travel progress bar */}
          <div className="travel-progress-track">
            <div
              className="travel-progress-fill"
              style={{ width: `${pct}%` }}
            />
          </div>

          <div style={{
            fontFamily: 'Nunito, sans-serif',
            fontSize: '0.85rem',
            color: '#6B7A36',
            marginTop: 10,
            fontWeight: 600,
          }}>
            {remaining > 0
              ? `${formatCurrency(remaining)} to go`
              : 'Goal reached! Time to celebrate.'}
          </div>
        </div>

        {/* Visual motivation — milestone markers */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: 24,
          padding: '0 4px',
        }}>
          {[0.25, 0.5, 0.75, 1.0].map(milestone => {
            const reached = pct / 100 >= milestone;
            return (
              <div key={milestone} style={{ textAlign: 'center' }}>
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: reached ? '#6B7A36' : '#E8D4A8',
                  border: `2px solid ${reached ? '#4D5928' : '#D4C4A0'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 4px',
                  transition: 'background 0.3s',
                }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                    stroke={reached ? '#fff' : '#C4B490'}
                    strokeWidth="2" strokeLinecap="round">
                    {reached
                      ? <polyline points="20 6 9 17 4 12" />
                      : <circle cx="12" cy="12" r="6" />}
                  </svg>
                </div>
                <div style={{
                  fontFamily: 'Nunito, sans-serif',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  color: reached ? '#4D5928' : '#B09070',
                }}>
                  {Math.round(milestone * 100)}%
                </div>
              </div>
            );
          })}
        </div>

        {/* Add money */}
        <div className="surface" style={{ padding: '18px', marginBottom: 16 }}>
          <div style={{
            fontFamily: 'Nunito, sans-serif',
            fontSize: '0.78rem',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: '#8B6B55',
            marginBottom: 12,
          }}>
            Add to the pot
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <input
              className="pot-input"
              type="number"
              value={addAmount}
              onChange={e => setAddAmount(e.target.value)}
              placeholder="$0.00"
              inputMode="decimal"
              style={{ flex: 1 }}
            />
            <button
              className="btn-primary"
              onClick={handleAdd}
              disabled={!addAmount || parseFloat(addAmount) <= 0}
              style={{ width: 'auto', padding: '14px 22px', flexShrink: 0 }}
            >
              Add
            </button>
          </div>
        </div>

        {/* Quick amounts */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
          {[10, 20, 50, 100].map(amt => (
            <button
              key={amt}
              onClick={() => {
                transferToTravel(amt);
              }}
              style={{
                flex: 1,
                padding: '10px 0',
                background: '#F9F0DC',
                border: '1.5px solid #D4C4A0',
                borderRadius: 10,
                fontFamily: 'Nunito, sans-serif',
                fontWeight: 700,
                fontSize: '0.9rem',
                color: '#5D4033',
                cursor: 'pointer',
              }}
            >
              +${amt}
            </button>
          ))}
        </div>

        {/* Encouragement */}
        <div style={{
          background: '#F0F5E4',
          border: '1.5px solid #C8D8A8',
          borderRadius: 12,
          padding: '14px 16px',
          fontFamily: 'Nunito, sans-serif',
          fontSize: '0.9rem',
          color: '#4D5928',
          lineHeight: 1.55,
          textAlign: 'center',
          fontStyle: 'italic',
        }}>
          Every dollar put away is a step closer to making a memory together.
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
