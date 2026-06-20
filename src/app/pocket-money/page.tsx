'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useFamilyData } from '@/lib/context';
import { getCurrentWeekStart } from '@/lib/storage';
import { formatCurrency } from '@/lib/categorizer';
import BottomNav from '@/components/BottomNav';

export default function PocketMoneyPage() {
  const { data, isLoaded, toggleTask, createTask, togglePocketMoney } = useFamilyData();
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskAmount, setNewTaskAmount] = useState('');
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const router = useRouter();

  const children = data.members.filter(m => m.role === 'child');
  const weekStart = getCurrentWeekStart();

  useEffect(() => {
    if (isLoaded && !data.setupComplete) router.replace('/setup');
    if (children.length > 0 && !selectedMemberId) {
      setSelectedMemberId(children[0].id);
    }
  }, [isLoaded, data.setupComplete, children, selectedMemberId, router]);

  if (!isLoaded || !data.setupComplete) return null;

  if (!data.pocketMoneyEnabled) {
    return (
      <div className="page">
        <header className="app-header">
          <div style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: '1.25rem',
            fontWeight: 700,
            color: '#F5E6C8',
          }}>
            Pocket Money
          </div>
        </header>

        <div style={{
          padding: '48px 24px',
          textAlign: 'center',
          maxWidth: 380,
          margin: '0 auto',
        }}>
          <div style={{ fontSize: '3rem', marginBottom: 16 }}>
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none" style={{ display: 'block', margin: '0 auto' }}>
              <circle cx="32" cy="32" r="30" fill="#E8D4A8" stroke="#D4C4A0" strokeWidth="2" />
              <text x="32" y="42" textAnchor="middle" fontSize="28" fill="#E06010" fontFamily="serif">$</text>
            </svg>
          </div>
          <div style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: '1.5rem',
            fontWeight: 700,
            color: '#3D2B1F',
            marginBottom: 10,
          }}>
            Pocket Money
          </div>
          <div style={{
            fontFamily: 'Nunito, sans-serif',
            fontSize: '0.95rem',
            color: '#5D4033',
            lineHeight: 1.6,
            marginBottom: 32,
          }}>
            Give children their own envelope and link it to their weekly chores. A great way to teach money skills early.
          </div>
          <button
            className="btn-primary"
            onClick={togglePocketMoney}
          >
            Turn on Pocket Money
          </button>
        </div>
        <BottomNav />
      </div>
    );
  }

  if (children.length === 0) {
    return (
      <div className="page">
        <header className="app-header">
          <div style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: '1.25rem',
            fontWeight: 700,
            color: '#F5E6C8',
          }}>
            Pocket Money
          </div>
        </header>
        <div style={{ padding: '40px 24px', textAlign: 'center' }}>
          <div style={{
            fontFamily: 'Nunito, sans-serif',
            fontSize: '0.95rem',
            color: '#5D4033',
            lineHeight: 1.6,
            marginBottom: 24,
          }}>
            Add children to your family in the setup to use pocket money.
          </div>
          <button className="btn-secondary" onClick={() => router.push('/setup')}>
            Go to Setup
          </button>
        </div>
        <BottomNav />
      </div>
    );
  }

  const currentChild = data.members.find(m => m.id === selectedMemberId) ?? children[0];
  const currentTasks = data.pocketMoneyTasks.filter(
    t => t.memberId === currentChild?.id && t.weekStart === weekStart
  );
  const earnedThisWeek = currentTasks
    .filter(t => t.isCompleted)
    .reduce((s, t) => s + t.amount, 0);

  const handleAddTask = () => {
    if (!newTaskName || !newTaskAmount || !currentChild) return;
    createTask({
      memberId: currentChild.id,
      name: newTaskName,
      amount: parseFloat(newTaskAmount),
      isCompleted: false,
    });
    setNewTaskName('');
    setNewTaskAmount('');
  };

  const CHORE_SUGGESTIONS = [
    'Feed chickens',
    'Help with dishes',
    'Make bed',
    'Pack school bag',
    'Set the table',
    'Tidy bedroom',
    'Help with laundry',
    'Water the garden',
  ];

  return (
    <div className="page">
      <header className="app-header">
        <div style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: '1.25rem',
          fontWeight: 700,
          color: '#F5E6C8',
        }}>
          Pocket Money
        </div>
        <button
          onClick={togglePocketMoney}
          style={{
            background: 'transparent', border: 'none', cursor: 'pointer',
            fontFamily: 'Nunito, sans-serif', fontSize: '0.82rem',
            color: '#B09070', fontWeight: 700,
          }}
        >
          Turn off
        </button>
      </header>

      <div style={{ padding: '20px 16px', maxWidth: 480, margin: '0 auto' }}>

        {/* Child selector */}
        {children.length > 1 && (
          <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
            {children.map(child => (
              <button
                key={child.id}
                onClick={() => setSelectedMemberId(child.id)}
                style={{
                  flex: 1,
                  padding: '10px',
                  border: `2px solid ${selectedMemberId === child.id ? child.color : '#D4C4A0'}`,
                  borderRadius: 10,
                  background: selectedMemberId === child.id ? child.color : '#F9F0DC',
                  color: selectedMemberId === child.id ? '#fff' : '#3D2B1F',
                  fontFamily: 'Nunito, sans-serif',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                }}
              >
                {child.name}
              </button>
            ))}
          </div>
        )}

        {/* Child earnings summary */}
        <div className="surface" style={{ padding: '20px', marginBottom: 24, textAlign: 'center' }}>
          <div style={{
            fontFamily: 'Nunito, sans-serif',
            fontSize: '0.78rem',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: '#8B6B55',
            marginBottom: 8,
          }}>
            {currentChild?.name} earned this week
          </div>
          <div style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: '3rem',
            fontWeight: 700,
            color: '#4D5928',
            lineHeight: 1,
          }}>
            {formatCurrency(earnedThisWeek)}
          </div>
          <div style={{
            fontFamily: 'Nunito, sans-serif',
            fontSize: '0.85rem',
            color: '#8B6B55',
            marginTop: 6,
          }}>
            {currentTasks.filter(t => t.isCompleted).length} of {currentTasks.length} chores done
          </div>
        </div>

        {/* Chore list */}
        {currentTasks.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <div style={{
              fontFamily: 'Nunito, sans-serif',
              fontSize: '0.78rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: '#8B6B55',
              marginBottom: 10,
            }}>
              This week's chores
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {currentTasks.map(task => (
                <div
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '14px 16px',
                    background: task.isCompleted ? 'rgba(107,122,54,0.1)' : '#F9F0DC',
                    border: `1.5px solid ${task.isCompleted ? '#C8D8A8' : '#D4C4A0'}`,
                    borderRadius: 12,
                    cursor: 'pointer',
                  }}
                >
                  <div style={{
                    width: 26,
                    height: 26,
                    borderRadius: '50%',
                    border: `2px solid ${task.isCompleted ? '#6B7A36' : '#D4C4A0'}`,
                    background: task.isCompleted ? '#6B7A36' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    transition: 'all 0.15s',
                  }}>
                    {task.isCompleted && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                        stroke="#fff" strokeWidth="3" strokeLinecap="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontFamily: 'Nunito, sans-serif',
                      fontWeight: 600,
                      fontSize: '0.95rem',
                      color: task.isCompleted ? '#4D5928' : '#3D2B1F',
                      textDecoration: task.isCompleted ? 'line-through' : 'none',
                    }}>
                      {task.name}
                    </div>
                  </div>
                  <div style={{
                    fontFamily: 'Nunito, sans-serif',
                    fontWeight: 800,
                    fontSize: '0.95rem',
                    color: task.isCompleted ? '#4D5928' : '#5D4033',
                  }}>
                    {formatCurrency(task.amount)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add chore */}
        <div className="surface" style={{ padding: '16px', marginBottom: 16 }}>
          <div style={{
            fontFamily: 'Nunito, sans-serif',
            fontSize: '0.78rem',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: '#8B6B55',
            marginBottom: 12,
          }}>
            Add a chore
          </div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
            <input
              className="pot-input pot-input-sm"
              value={newTaskName}
              onChange={e => setNewTaskName(e.target.value)}
              placeholder="What needs doing?"
              style={{ flex: 1 }}
            />
            <input
              className="pot-input pot-input-sm"
              type="number"
              value={newTaskAmount}
              onChange={e => setNewTaskAmount(e.target.value)}
              placeholder="$"
              inputMode="decimal"
              style={{ width: 70 }}
            />
          </div>

          {/* Quick suggestions */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
            {CHORE_SUGGESTIONS.map(s => (
              <button
                key={s}
                onClick={() => setNewTaskName(s)}
                style={{
                  padding: '5px 11px',
                  background: '#F9F0DC',
                  border: '1.5px solid #D4C4A0',
                  borderRadius: 9999,
                  fontFamily: 'Nunito, sans-serif',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: '#5D4033',
                  cursor: 'pointer',
                }}
              >
                {s}
              </button>
            ))}
          </div>

          <button
            className="btn-secondary"
            onClick={handleAddTask}
            disabled={!newTaskName || !newTaskAmount}
            style={{ width: '100%' }}
          >
            Add chore
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
