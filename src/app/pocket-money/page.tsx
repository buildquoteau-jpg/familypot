'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useFamilyData } from '@/lib/context';
import { getCurrentWeekStart, getMemberBalance, getMemberWeekEarnings } from '@/lib/storage';
import { formatCurrency } from '@/lib/categorizer';
import BottomNav from '@/components/BottomNav';

const SUGGESTED_CHORES = [
  { name: 'Feed chickens', amount: 2 },
  { name: 'Help with dishes', amount: 2 },
  { name: 'Make bed', amount: 1 },
  { name: 'Pack school bag', amount: 1 },
  { name: 'Set the table', amount: 1 },
  { name: 'Tidy bedroom', amount: 2 },
  { name: 'Help with laundry', amount: 2 },
  { name: 'Water the garden', amount: 2 },
  { name: 'Vacuum a room', amount: 3 },
  { name: 'Walk the dog', amount: 3 },
  { name: 'Take out rubbish', amount: 2 },
  { name: 'Help cook dinner', amount: 3 },
];

const MEMBER_COLORS = ['#E06010', '#C49A1E', '#6B7A36', '#5D4033', '#8B6B55'];

export default function PocketMoneyPage() {
  const {
    data, isLoaded, togglePocketMoney, toggleMemberPM,
    toggleTask, addTemplate, deleteTemplate, syncWeekTasks,
  } = useFamilyData();
  const router = useRouter();

  const [selectedMemberId, setSelectedMemberId] = useState<string>('');
  const [showAddChore, setShowAddChore] = useState(false);
  const [newChoreName, setNewChoreName] = useState('');
  const [newChoreAmount, setNewChoreAmount] = useState('');
  const [showManage, setShowManage] = useState(false);

  const weekStart = getCurrentWeekStart();

  useEffect(() => {
    if (isLoaded && !data.setupComplete) router.replace('/setup');
  }, [isLoaded, data.setupComplete, router]);

  // Sync templates to weekly tasks on mount
  useEffect(() => {
    if (isLoaded && data.pocketMoneyEnabled) {
      syncWeekTasks(weekStart);
    }
  }, [isLoaded, data.pocketMoneyEnabled, weekStart, syncWeekTasks]);

  // Select first enabled member by default
  useEffect(() => {
    const enabled = data.members.filter(m => (data.pocketMoneyEnabledMembers ?? []).includes(m.id));
    if (enabled.length > 0 && !selectedMemberId) {
      setSelectedMemberId(enabled[0].id);
    }
  }, [data.members, data.pocketMoneyEnabledMembers, selectedMemberId]);

  if (!isLoaded || !data.setupComplete) return null;

  const enabledMembers = data.members.filter(m =>
    (data.pocketMoneyEnabledMembers ?? []).includes(m.id)
  );

  // ── OFF STATE ──────────────────────────────────────────────────────────────
  if (!data.pocketMoneyEnabled) {
    return (
      <div className="page">
        <header className="app-header">
          <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.25rem', fontWeight: 700, color: '#F5E6C8' }}>
            Pocket Money
          </div>
        </header>

        <div style={{ padding: '48px 24px', textAlign: 'center', maxWidth: 380, margin: '0 auto' }}>
          {/* Coin illustration */}
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none" style={{ display: 'block', margin: '0 auto 24px' }}>
            <circle cx="40" cy="40" r="38" fill="#E8D4A8" stroke="#D4C4A0" strokeWidth="2" />
            <circle cx="40" cy="40" r="30" fill="#F9F0DC" stroke="#E8D4A8" strokeWidth="1.5" />
            <text x="40" y="52" textAnchor="middle" fontSize="30" fill="#E06010" fontFamily="Georgia, serif" fontWeight="bold">$</text>
          </svg>

          <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.6rem', fontWeight: 700, color: '#3D2B1F', marginBottom: 12 }}>
            Pocket Money
          </div>
          <div style={{ fontFamily: 'Nunito, sans-serif', fontSize: '0.95rem', color: '#5D4033', lineHeight: 1.65, marginBottom: 32 }}>
            Give every family member their own envelope. Set weekly chores, mark them done, and watch the savings grow.
          </div>
          <button className="btn-primary" onClick={togglePocketMoney}>
            Turn on Pocket Money
          </button>
        </div>
        <BottomNav />
      </div>
    );
  }

  // ── MEMBER MANAGEMENT ─────────────────────────────────────────────────────
  if (showManage) {
    return (
      <div className="page">
        <header className="app-header">
          <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.25rem', fontWeight: 700, color: '#F5E6C8' }}>
            Manage Members
          </div>
          <button onClick={() => setShowManage(false)}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'Nunito, sans-serif', fontSize: '0.85rem', color: '#B09070', fontWeight: 700 }}>
            Done
          </button>
        </header>

        <div style={{ padding: '20px 16px', maxWidth: 480, margin: '0 auto' }}>
          <div style={{ fontFamily: 'Nunito, sans-serif', fontSize: '0.85rem', color: '#5D4033', marginBottom: 20, lineHeight: 1.55 }}>
            Choose which family members have their own pocket money envelope.
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {data.members.map((member, i) => {
              const isEnabled = (data.pocketMoneyEnabledMembers ?? []).includes(member.id);
              const color = member.color ?? MEMBER_COLORS[i % MEMBER_COLORS.length];
              return (
                <div key={member.id} style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '14px 16px',
                  background: isEnabled ? 'rgba(224,96,16,0.06)' : '#F9F0DC',
                  border: `1.5px solid ${isEnabled ? '#E06010' : '#D4C4A0'}`,
                  borderRadius: 14,
                }}>
                  {/* Avatar */}
                  <div style={{
                    width: 42, height: 42, borderRadius: '50%', background: color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'Playfair Display, serif', fontSize: '1.1rem', fontWeight: 700, color: '#fff',
                    flexShrink: 0,
                  }}>
                    {member.name[0].toUpperCase()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: '0.95rem', color: '#3D2B1F' }}>
                      {member.name}
                    </div>
                    <div style={{ fontFamily: 'Nunito, sans-serif', fontSize: '0.75rem', color: '#8B6B55', textTransform: 'capitalize' }}>
                      {member.role}
                    </div>
                  </div>
                  {/* Toggle */}
                  <button
                    onClick={() => toggleMemberPM(member.id)}
                    style={{
                      width: 48, height: 26, borderRadius: 13,
                      background: isEnabled ? '#E06010' : '#D4C4A0',
                      border: 'none', cursor: 'pointer', position: 'relative',
                      transition: 'background 0.2s', flexShrink: 0,
                    }}
                    aria-label={isEnabled ? 'Disable pocket money' : 'Enable pocket money'}
                  >
                    <div style={{
                      position: 'absolute', top: 3,
                      left: isEnabled ? 25 : 3,
                      width: 20, height: 20, borderRadius: '50%',
                      background: '#fff',
                      transition: 'left 0.2s',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                    }} />
                  </button>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: 32, borderTop: '1px solid #E8D4A8', paddingTop: 20 }}>
            <button
              onClick={() => { togglePocketMoney(); setShowManage(false); }}
              style={{
                width: '100%', padding: '12px', border: '2px solid #E8C4A8', borderRadius: 12,
                background: 'transparent', fontFamily: 'Nunito, sans-serif', fontSize: '0.9rem',
                fontWeight: 700, color: '#B84C08', cursor: 'pointer',
              }}
            >
              Turn off Pocket Money
            </button>
          </div>
        </div>
        <BottomNav />
      </div>
    );
  }

  // ── NO MEMBERS ENABLED ───────────────────────────────────────────────────
  if (enabledMembers.length === 0) {
    return (
      <div className="page">
        <header className="app-header">
          <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.25rem', fontWeight: 700, color: '#F5E6C8' }}>
            Pocket Money
          </div>
          <button onClick={() => setShowManage(true)}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'Nunito, sans-serif', fontSize: '0.85rem', color: '#B09070', fontWeight: 700 }}>
            Manage
          </button>
        </header>

        <div style={{ padding: '40px 24px', textAlign: 'center', maxWidth: 360, margin: '0 auto' }}>
          <div style={{ fontFamily: 'Nunito, sans-serif', fontSize: '0.95rem', color: '#5D4033', lineHeight: 1.6, marginBottom: 24 }}>
            Choose which family members get their own pocket money envelope.
          </div>
          <button className="btn-primary" onClick={() => setShowManage(true)}>
            Choose members
          </button>
        </div>
        <BottomNav />
      </div>
    );
  }

  // ── MAIN VIEW ─────────────────────────────────────────────────────────────
  const currentMember = enabledMembers.find(m => m.id === selectedMemberId) ?? enabledMembers[0];
  const memberColor = currentMember.color ?? MEMBER_COLORS[data.members.indexOf(currentMember) % MEMBER_COLORS.length];

  const weekTasks = data.pocketMoneyTasks.filter(
    t => t.memberId === currentMember.id && t.weekStart === weekStart
  );
  const weekTemplates = (data.pocketMoneyTemplates ?? []).filter(
    t => t.memberId === currentMember.id
  );
  const weekEarnings = getMemberWeekEarnings(data.pocketMoneyTasks, currentMember.id, weekStart);
  const totalBalance = getMemberBalance(data.pocketMoneyTasks, currentMember.id);
  const completedCount = weekTasks.filter(t => t.isCompleted).length;

  const handleAddChore = () => {
    if (!newChoreName || !newChoreAmount) return;
    addTemplate({ memberId: currentMember.id, name: newChoreName, amount: parseFloat(newChoreAmount) });
    syncWeekTasks(weekStart);
    setNewChoreName('');
    setNewChoreAmount('');
    setShowAddChore(false);
  };

  return (
    <div className="page">
      {/* Header */}
      <header className="app-header">
        <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.25rem', fontWeight: 700, color: '#F5E6C8' }}>
          Pocket Money
        </div>
        <button onClick={() => setShowManage(true)}
          style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'Nunito, sans-serif', fontSize: '0.85rem', color: '#B09070', fontWeight: 700 }}>
          Members
        </button>
      </header>

      {/* Member tabs */}
      {enabledMembers.length > 1 && (
        <div style={{ display: 'flex', padding: '10px 16px 0', gap: 8, overflowX: 'auto' }}>
          {enabledMembers.map((member, i) => {
            const col = member.color ?? MEMBER_COLORS[data.members.indexOf(member) % MEMBER_COLORS.length];
            const isSelected = member.id === (selectedMemberId || enabledMembers[0].id);
            return (
              <button
                key={member.id}
                onClick={() => { setSelectedMemberId(member.id); setShowAddChore(false); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '7px 14px', borderRadius: 9999,
                  border: `2px solid ${isSelected ? col : '#D4C4A0'}`,
                  background: isSelected ? col : '#F9F0DC',
                  color: isSelected ? '#fff' : '#3D2B1F',
                  fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: '0.88rem',
                  cursor: 'pointer', flexShrink: 0, whiteSpace: 'nowrap',
                }}
              >
                {member.name}
              </button>
            );
          })}
        </div>
      )}

      <div style={{ padding: '16px 16px 0', maxWidth: 480, margin: '0 auto' }}>

        {/* Personal envelope card */}
        <div style={{
          background: '#F9F0DC',
          border: `1.5px solid #D4C4A0`,
          borderRadius: 14,
          overflow: 'hidden',
          marginBottom: 20,
          boxShadow: '0 4px 20px rgba(61,43,31,0.12)',
        }}>
          {/* Envelope flap with name */}
          <div style={{
            background: memberColor,
            height: 60,
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            paddingTop: 8,
          }}>
            <svg viewBox="0 0 100 60" preserveAspectRatio="none"
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
              <polygon points="0,0 50,50 100,0 100,60 0,60" fill="#F9F0DC" />
            </svg>
            <span style={{
              fontFamily: 'Playfair Display, serif',
              fontStyle: 'italic',
              fontSize: '0.88rem',
              color: 'rgba(255,255,255,0.9)',
              position: 'relative',
              zIndex: 1,
            }}>
              {currentMember.name}&apos;s Pocket Money
            </span>
          </div>

          {/* Balance */}
          <div style={{ padding: '16px 20px 20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <div style={{ fontFamily: 'Nunito, sans-serif', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#8B6B55', marginBottom: 4 }}>
                  Total balance
                </div>
                <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '2.2rem', fontWeight: 700, color: '#3D2B1F', lineHeight: 1 }}>
                  {formatCurrency(totalBalance)}
                </div>
              </div>
              <div>
                <div style={{ fontFamily: 'Nunito, sans-serif', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#8B6B55', marginBottom: 4 }}>
                  This week
                </div>
                <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '2.2rem', fontWeight: 700, color: weekEarnings > 0 ? '#4D5928' : '#B09070', lineHeight: 1 }}>
                  {formatCurrency(weekEarnings)}
                </div>
              </div>
            </div>

            {/* Week progress */}
            {weekTasks.length > 0 && (
              <div style={{ marginTop: 14 }}>
                <div className="progress-track">
                  <div className="progress-fill" style={{
                    width: `${(completedCount / weekTasks.length) * 100}%`,
                    background: memberColor,
                  }} />
                </div>
                <div style={{ fontFamily: 'Nunito, sans-serif', fontSize: '0.72rem', color: '#8B6B55', marginTop: 4 }}>
                  {completedCount} of {weekTasks.length} chores done this week
                </div>
              </div>
            )}
          </div>
        </div>

        {/* This week's chores */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontFamily: 'Nunito, sans-serif', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#8B6B55', marginBottom: 10 }}>
            This week&apos;s chores
          </div>

          {weekTasks.length === 0 && weekTemplates.length === 0 && (
            <div style={{ padding: '20px 0', fontFamily: 'Nunito, sans-serif', fontSize: '0.9rem', color: '#8B6B55', textAlign: 'center' }}>
              No chores set yet — add some below
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {weekTasks.map(task => (
              <button
                key={task.id}
                onClick={() => toggleTask(task.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '14px 16px',
                  background: task.isCompleted ? 'rgba(107,122,54,0.08)' : '#F9F0DC',
                  border: `1.5px solid ${task.isCompleted ? '#C8D8A8' : '#D4C4A0'}`,
                  borderRadius: 12,
                  cursor: 'pointer', textAlign: 'left', width: '100%',
                  transition: 'all 0.15s',
                }}
              >
                {/* Checkbox circle */}
                <div style={{
                  width: 30, height: 30, borderRadius: '50%',
                  border: `2.5px solid ${task.isCompleted ? '#6B7A36' : '#D4C4A0'}`,
                  background: task.isCompleted ? '#6B7A36' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, transition: 'all 0.15s',
                }}>
                  {task.isCompleted && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                      stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: '0.95rem',
                    color: task.isCompleted ? '#4D5928' : '#3D2B1F',
                    textDecoration: task.isCompleted ? 'line-through' : 'none',
                  }}>
                    {task.name}
                  </div>
                </div>
                <div style={{
                  fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: '1rem',
                  color: task.isCompleted ? '#4D5928' : '#5D4033',
                  flexShrink: 0,
                }}>
                  {formatCurrency(task.amount)}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Add / manage chores section */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontFamily: 'Nunito, sans-serif', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#8B6B55', marginBottom: 10 }}>
            Recurring chores
          </div>

          {/* Existing templates */}
          {weekTemplates.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 12 }}>
              {weekTemplates.map(tmpl => (
                <div key={tmpl.id} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 14px',
                  background: '#F9F0DC', border: '1px solid #E8D4A8', borderRadius: 10,
                }}>
                  <div style={{ flex: 1, fontFamily: 'Nunito, sans-serif', fontSize: '0.88rem', color: '#3D2B1F' }}>
                    {tmpl.name}
                  </div>
                  <div style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: '0.85rem', color: '#5D4033' }}>
                    {formatCurrency(tmpl.amount)}
                  </div>
                  <button
                    onClick={() => deleteTemplate(tmpl.id)}
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#C4B490', fontSize: '1.2rem', lineHeight: 1, padding: '2px 4px' }}
                    aria-label="Remove chore"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Add chore */}
          {showAddChore ? (
            <div style={{ background: '#F9F0DC', border: '1.5px solid #D4C4A0', borderRadius: 12, padding: '14px' }}>
              <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                <input
                  className="pot-input pot-input-sm"
                  value={newChoreName}
                  onChange={e => setNewChoreName(e.target.value)}
                  placeholder="Chore name"
                  autoFocus
                  style={{ flex: 1 }}
                />
                <input
                  className="pot-input pot-input-sm"
                  type="number"
                  value={newChoreAmount}
                  onChange={e => setNewChoreAmount(e.target.value)}
                  placeholder="$"
                  inputMode="decimal"
                  style={{ width: 64, textAlign: 'right' }}
                />
              </div>

              {/* Quick-pick suggestions */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
                {SUGGESTED_CHORES.filter(s =>
                  !weekTemplates.some(t => t.name === s.name)
                ).slice(0, 8).map(s => (
                  <button
                    key={s.name}
                    onClick={() => { setNewChoreName(s.name); setNewChoreAmount(s.amount.toString()); }}
                    style={{
                      padding: '4px 10px', background: newChoreName === s.name ? '#E06010' : '#F9F0DC',
                      color: newChoreName === s.name ? '#fff' : '#5D4033',
                      border: '1.5px solid #D4C4A0', borderRadius: 9999,
                      fontFamily: 'Nunito, sans-serif', fontSize: '0.75rem', fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    {s.name} · ${s.amount}
                  </button>
                ))}
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn-ghost" onClick={() => { setShowAddChore(false); setNewChoreName(''); setNewChoreAmount(''); }}
                  style={{ flex: 1 }}>
                  Cancel
                </button>
                <button className="btn-secondary" onClick={handleAddChore}
                  disabled={!newChoreName || !newChoreAmount}
                  style={{ flex: 2 }}>
                  Add chore
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowAddChore(true)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                width: '100%', padding: '12px',
                border: '2px dashed #D4C4A0', borderRadius: 12,
                background: 'transparent', cursor: 'pointer',
                fontFamily: 'Nunito, sans-serif', fontSize: '0.88rem', fontWeight: 700, color: '#8B6B55',
              }}
            >
              <span style={{ fontSize: '1.1rem' }}>+</span>
              Add a chore for {currentMember.name}
            </button>
          )}
        </div>

      </div>
      <BottomNav />
    </div>
  );
}
