'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useFamilyData } from '@/lib/context';
import { formatCurrency } from '@/lib/categorizer';
import { exportToCSV } from '@/lib/storage';
import { STATE_LABELS, AustralianState } from '@/data/schoolTerms';
import BottomNav from '@/components/BottomNav';

type Tab = 'family' | 'envelopes' | 'members' | 'export';

function SetupContent() {
  const { data, isLoaded, completeSetup, saveEnvelope, createEnvelope, createMember, resetData, setState } = useFamilyData();
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get('tab') as Tab) ?? 'family';

  const [tab, setTab] = useState<Tab>(initialTab);
  const [familyName, setFamilyName] = useState(data.familyName || '');
  const [newEnvName, setNewEnvName] = useState('');
  const [newEnvBudget, setNewEnvBudget] = useState('');
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRole, setNewMemberRole] = useState<'parent' | 'child' | 'grandparent'>('parent');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setFamilyName(data.familyName);
  }, [data.familyName]);

  const MEMBER_COLORS = ['#E06010', '#C49A1E', '#6B7A36', '#5D4033', '#8B6B55'];
  const ENVELOPE_COLORS = ['#E06010', '#C49A1E', '#6B7A36', '#5D4033'];

  const handleSaveFamily = () => {
    completeSetup(familyName || 'Our Family');
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
    if (!data.setupComplete) {
      router.replace('/');
    }
  };

  const handleAddEnvelope = () => {
    if (!newEnvName || !newEnvBudget) return;
    createEnvelope({
      name: newEnvName,
      weeklyBudget: parseFloat(newEnvBudget),
      color: ENVELOPE_COLORS[data.envelopes.length % ENVELOPE_COLORS.length],
      isTravelFund: false,
      isPocketMoney: false,
      order: data.envelopes.length,
    });
    setNewEnvName('');
    setNewEnvBudget('');
  };

  const handleAddMember = () => {
    if (!newMemberName) return;
    createMember({
      name: newMemberName,
      role: newMemberRole,
      color: MEMBER_COLORS[data.members.length % MEMBER_COLORS.length],
    });
    setNewMemberName('');
  };

  const handleExportCSV = () => {
    const csv = exportToCSV(data);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `family-pot-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const TABS: { key: Tab; label: string }[] = [
    { key: 'family', label: 'Family' },
    { key: 'envelopes', label: 'Envelopes' },
    { key: 'members', label: 'Members' },
    { key: 'export', label: 'Export' },
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
          {data.setupComplete ? 'Settings' : 'Welcome to the Family Pot'}
        </div>
        {data.setupComplete && (
          <button
            onClick={() => router.back()}
            style={{
              background: 'transparent', border: 'none', cursor: 'pointer',
              fontFamily: 'Nunito, sans-serif', fontSize: '0.85rem',
              color: '#B09070', fontWeight: 700,
            }}
          >
            Done
          </button>
        )}
      </header>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid #D4C4A0',
        background: '#F9F0DC',
        overflowX: 'auto',
      }}>
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              flex: 1,
              padding: '12px 8px',
              border: 'none',
              background: 'transparent',
              borderBottom: tab === t.key ? '3px solid #E06010' : '3px solid transparent',
              fontFamily: 'Nunito, sans-serif',
              fontWeight: 700,
              fontSize: '0.85rem',
              color: tab === t.key ? '#E06010' : '#8B6B55',
              cursor: 'pointer',
              transition: 'color 0.15s',
              whiteSpace: 'nowrap',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ padding: '24px 16px', maxWidth: 480, margin: '0 auto' }}>

        {/* FAMILY TAB */}
        {tab === 'family' && (
          <div>
            {!data.setupComplete && (
              <p style={{
                fontFamily: 'Nunito, sans-serif',
                fontSize: '0.95rem',
                color: '#5D4033',
                lineHeight: 1.6,
                marginBottom: 24,
              }}>
                The Family Pot is a weekly ritual for talking about money as a family. Let's get started.
              </p>
            )}

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontFamily: 'Nunito, sans-serif', fontSize: '0.8rem', fontWeight: 700, color: '#8B6B55', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Family name
              </label>
              <input
                className="pot-input pot-input-sm"
                value={familyName}
                onChange={e => setFamilyName(e.target.value)}
                placeholder="The Smith Family"
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontFamily: 'Nunito, sans-serif', fontSize: '0.8rem', fontWeight: 700, color: '#8B6B55', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                State / Territory
              </label>
              <select
                value={data.state ?? 'QLD'}
                onChange={e => setState(e.target.value as AustralianState)}
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  border: '2px solid #D4C4A0',
                  borderRadius: 10,
                  fontFamily: 'Nunito, sans-serif',
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: '#3D2B1F',
                  background: '#F9F0DC',
                  outline: 'none',
                  appearance: 'none',
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%238B6B55' strokeWidth='2' fill='none'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 14px center',
                }}
              >
                {(Object.entries(STATE_LABELS) as [AustralianState, string][]).map(([code, label]) => (
                  <option key={code} value={code}>{label}</option>
                ))}
              </select>
              <div style={{ fontFamily: 'Nunito, sans-serif', fontSize: '0.75rem', color: '#8B6B55', marginTop: 5 }}>
                Used to show school term weeks in the calendar
              </div>
            </div>

            <button
              className="btn-primary"
              onClick={handleSaveFamily}
              style={{ marginBottom: 16 }}
            >
              {saved ? 'Saved' : data.setupComplete ? 'Save changes' : 'Get started'}
            </button>

            {data.setupComplete && (
              <>
                <div style={{ marginTop: 32, marginBottom: 12 }}>
                  <div style={{
                    fontFamily: 'Nunito, sans-serif',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: '#8B6B55',
                    marginBottom: 12,
                  }}>
                    Danger zone
                  </div>
                  <button
                    className="btn-ghost"
                    onClick={() => {
                      if (window.confirm('This will clear all data and start fresh. Are you sure?')) {
                        resetData();
                        router.replace('/setup');
                      }
                    }}
                    style={{ color: '#B84C08', borderColor: '#E8C4A8', width: '100%' }}
                  >
                    Reset all data
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* ENVELOPES TAB */}
        {tab === 'envelopes' && (
          <div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
              {data.envelopes.map(env => (
                <div
                  key={env.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '14px 16px',
                    background: '#F9F0DC',
                    border: '1.5px solid #D4C4A0',
                    borderRadius: 12,
                  }}
                >
                  <div style={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    background: env.color,
                    flexShrink: 0,
                  }} />
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontFamily: 'Nunito, sans-serif',
                      fontWeight: 700,
                      fontSize: '0.93rem',
                      color: '#3D2B1F',
                    }}>
                      {env.name}
                    </div>
                    {!env.isTravelFund && (
                      <div style={{ fontSize: '0.78rem', color: '#8B6B55' }}>
                        {formatCurrency(env.weeklyBudget)} per week
                      </div>
                    )}
                  </div>
                  {!env.isTravelFund && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{
                        fontFamily: 'Nunito, sans-serif',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        color: '#5D4033',
                      }}>
                        $
                      </span>
                      <input
                        type="number"
                        defaultValue={env.weeklyBudget}
                        onBlur={e => {
                          const val = parseFloat(e.target.value);
                          if (!isNaN(val) && val !== env.weeklyBudget) {
                            saveEnvelope({ ...env, weeklyBudget: val });
                          }
                        }}
                        style={{
                          width: 70,
                          padding: '6px 8px',
                          border: '1.5px solid #D4C4A0',
                          borderRadius: 8,
                          fontFamily: 'Nunito, sans-serif',
                          fontSize: '0.9rem',
                          fontWeight: 700,
                          color: '#3D2B1F',
                          background: '#fff',
                          outline: 'none',
                        }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Add new */}
            <div className="surface" style={{ padding: '16px' }}>
              <div style={{
                fontFamily: 'Nunito, sans-serif',
                fontSize: '0.78rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: '#8B6B55',
                marginBottom: 12,
              }}>
                Add envelope
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  className="pot-input pot-input-sm"
                  value={newEnvName}
                  onChange={e => setNewEnvName(e.target.value)}
                  placeholder="Name"
                  style={{ flex: 1 }}
                />
                <input
                  className="pot-input pot-input-sm"
                  type="number"
                  value={newEnvBudget}
                  onChange={e => setNewEnvBudget(e.target.value)}
                  placeholder="$"
                  inputMode="decimal"
                  style={{ width: 80 }}
                />
              </div>
              <button
                className="btn-secondary"
                onClick={handleAddEnvelope}
                disabled={!newEnvName || !newEnvBudget}
                style={{ width: '100%', marginTop: 10 }}
              >
                Add
              </button>
            </div>
          </div>
        )}

        {/* MEMBERS TAB */}
        {tab === 'members' && (
          <div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
              {data.members.map(member => (
                <div
                  key={member.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '14px 16px',
                    background: '#F9F0DC',
                    border: '1.5px solid #D4C4A0',
                    borderRadius: 12,
                  }}
                >
                  <div style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: member.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontFamily: 'Playfair Display, serif',
                    fontSize: '1rem',
                    fontWeight: 700,
                    flexShrink: 0,
                  }}>
                    {member.name[0]}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontFamily: 'Nunito, sans-serif',
                      fontWeight: 700,
                      fontSize: '0.95rem',
                      color: '#3D2B1F',
                    }}>
                      {member.name}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#8B6B55', textTransform: 'capitalize' }}>
                      {member.role}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Add member */}
            <div className="surface" style={{ padding: '16px' }}>
              <div style={{
                fontFamily: 'Nunito, sans-serif',
                fontSize: '0.78rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: '#8B6B55',
                marginBottom: 12,
              }}>
                Add family member
              </div>
              <input
                className="pot-input pot-input-sm"
                value={newMemberName}
                onChange={e => setNewMemberName(e.target.value)}
                placeholder="Name"
                style={{ marginBottom: 10 }}
              />
              <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                {(['parent', 'child', 'grandparent'] as const).map(role => (
                  <button
                    key={role}
                    onClick={() => setNewMemberRole(role)}
                    style={{
                      flex: 1,
                      padding: '8px 4px',
                      border: `2px solid ${newMemberRole === role ? '#E06010' : '#D4C4A0'}`,
                      borderRadius: 8,
                      background: newMemberRole === role ? '#E06010' : '#F9F0DC',
                      color: newMemberRole === role ? '#fff' : '#5D4033',
                      fontFamily: 'Nunito, sans-serif',
                      fontWeight: 700,
                      fontSize: '0.78rem',
                      cursor: 'pointer',
                      textTransform: 'capitalize',
                    }}
                  >
                    {role}
                  </button>
                ))}
              </div>
              <button
                className="btn-secondary"
                onClick={handleAddMember}
                disabled={!newMemberName}
                style={{ width: '100%' }}
              >
                Add
              </button>
            </div>
          </div>
        )}

        {/* EXPORT TAB */}
        {tab === 'export' && (
          <div>
            <p style={{
              fontFamily: 'Nunito, sans-serif',
              fontSize: '0.95rem',
              color: '#5D4033',
              lineHeight: 1.6,
              marginBottom: 24,
            }}>
              Export all your spending records as a CSV file. Open in Excel, Google Sheets, or any spreadsheet program.
            </p>

            <div className="surface" style={{ padding: '16px', marginBottom: 16 }}>
              <div style={{ fontFamily: 'Nunito, sans-serif', fontSize: '0.85rem', color: '#8B6B55', marginBottom: 12 }}>
                Your export will include:
              </div>
              {['Date', 'Description', 'Amount', 'Envelope', 'Family Member'].map(field => (
                <div key={field} style={{
                  padding: '8px 0',
                  borderBottom: '1px solid #E8D4A8',
                  fontFamily: 'Nunito, sans-serif',
                  fontSize: '0.88rem',
                  color: '#3D2B1F',
                  fontWeight: 600,
                }}>
                  {field}
                </div>
              ))}
            </div>

            <div style={{
              fontFamily: 'Nunito, sans-serif',
              fontSize: '0.85rem',
              color: '#8B6B55',
              marginBottom: 20,
            }}>
              {data.transactions.length} transaction{data.transactions.length !== 1 ? 's' : ''} recorded
            </div>

            <button
              className="btn-primary"
              onClick={handleExportCSV}
              disabled={data.transactions.length === 0}
            >
              Download CSV
            </button>
          </div>
        )}
      </div>

      {data.setupComplete && <BottomNav />}
    </div>
  );
}

export default function SetupPage() {
  return (
    <Suspense fallback={null}>
      <SetupContent />
    </Suspense>
  );
}
