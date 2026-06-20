'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useFamilyData } from '@/lib/context';
import {
  getEnvelopeSpentThisWeek,
  isSunday,
  formatDate,
  getWeekBudget,
  getWeekTotalBudget,
  loadFamilyPhoto,
  saveFamilyPhoto,
  removeFamilyPhoto,
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
  const [familyPhoto, setFamilyPhoto] = useState<string | null>(null);
  const [photoMenuOpen, setPhotoMenuOpen] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isLoaded && !data.setupComplete) router.replace('/setup');
  }, [isLoaded, data.setupComplete, router]);

  useEffect(() => {
    setFamilyPhoto(loadFamilyPhoto());
  }, []);

  const handlePhotoChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const base64 = ev.target?.result as string;
      saveFamilyPhoto(base64);
      setFamilyPhoto(base64);
      setPhotoMenuOpen(false);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  }, []);

  const handleRemovePhoto = useCallback(() => {
    removeFamilyPhoto();
    setFamilyPhoto(null);
    setPhotoMenuOpen(false);
  }, []);

  if (!isLoaded || !data.setupComplete) return null;

  if (showWeekSetup) {
    return (
      <div className="page" style={{ display: 'flex', flexDirection: 'column' }}>
        <header className="app-header">
          <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.25rem', fontWeight: 700, color: '#F5E6C8' }}>
            Set up this week
          </div>
          <button onClick={() => setShowWeekSetup(false)}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'Nunito, sans-serif', fontSize: '0.85rem', color: '#B09070', fontWeight: 700 }}>
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
    .slice(0, 5);

  // Display members: show all, including pets
  const displayMembers = data.members.filter(m => m.name !== 'Everyone');

  return (
    <div className="page">
      {/* Header */}
      <header className="app-header">
        <Link href="/how-to-use" style={{ textDecoration: 'none' }}>
          <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.25rem', fontWeight: 700, color: '#F5E6C8', letterSpacing: '0.01em' }}>
            The Family Pot
          </div>
        </Link>
        <Link href="/setup" style={{ textDecoration: 'none' }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#B09070" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
            </svg>
          </div>
        </Link>
      </header>

      {/* ── FAMILY SECTION ─────────────────────────────────────── */}
      <div style={{
        padding: '28px 20px 24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        background: 'linear-gradient(180deg, #EDD9B0 0%, #F5E6C8 100%)',
        borderBottom: '1px solid #D4C4A0',
      }}>

        {/* Polaroid photo */}
        <div style={{ position: 'relative', marginBottom: 20 }}>
          <div
            className="polaroid"
            onClick={() => familyPhoto ? setPhotoMenuOpen(v => !v) : photoInputRef.current?.click()}
            role="button"
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && (familyPhoto ? setPhotoMenuOpen(v => !v) : photoInputRef.current?.click())}
            aria-label={familyPhoto ? 'Change or remove family photo' : 'Add family photo'}
          >
            {familyPhoto ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={familyPhoto} alt="Family photo" className="polaroid-photo" />
            ) : (
              <div className="polaroid-placeholder">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#B09070" strokeWidth="1.5" strokeLinecap="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
                <span style={{ fontFamily: 'Nunito, sans-serif', fontSize: '0.78rem', fontWeight: 700, color: '#B09070', textAlign: 'center', lineHeight: 1.4 }}>
                  Tap to add<br />a family photo
                </span>
              </div>
            )}
            <div className="polaroid-caption">
              {data.familyName}
            </div>
          </div>

          {/* Photo action menu */}
          {photoMenuOpen && familyPhoto && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              marginTop: 8,
              background: '#F9F0DC',
              border: '1.5px solid #D4C4A0',
              borderRadius: 12,
              overflow: 'hidden',
              boxShadow: '0 4px 16px rgba(61,43,31,0.16)',
              zIndex: 10,
              minWidth: 160,
            }}>
              <button
                onClick={() => { photoInputRef.current?.click(); setPhotoMenuOpen(false); }}
                style={{ display: 'block', width: '100%', padding: '12px 16px', background: 'transparent', border: 'none', borderBottom: '1px solid #E8D4A8', fontFamily: 'Nunito, sans-serif', fontSize: '0.88rem', fontWeight: 700, color: '#3D2B1F', cursor: 'pointer', textAlign: 'left' }}
              >
                Change photo
              </button>
              <button
                onClick={handleRemovePhoto}
                style={{ display: 'block', width: '100%', padding: '12px 16px', background: 'transparent', border: 'none', fontFamily: 'Nunito, sans-serif', fontSize: '0.88rem', fontWeight: 700, color: '#B84C08', cursor: 'pointer', textAlign: 'left' }}
              >
                Remove photo
              </button>
            </div>
          )}
        </div>

        {/* Hidden file input */}
        <input
          ref={photoInputRef}
          type="file"
          accept="image/*"
          onChange={handlePhotoChange}
          style={{ display: 'none' }}
        />

        {/* Family member names */}
        {displayMembers.length > 0 ? (
          <div className="member-ribbon">
            {displayMembers.map((member, i) => (
              <span key={member.id} style={{ display: 'inline-flex', alignItems: 'center' }}>
                {i > 0 && <span className="member-ribbon-dot">·</span>}
                <span className="member-ribbon-name" style={{ color: member.color ?? '#5D4033' }}>
                  {member.name}
                </span>
              </span>
            ))}
          </div>
        ) : (
          <div style={{ fontFamily: 'Nunito, sans-serif', fontSize: '0.88rem', color: '#B09070' }}>
            <Link href="/setup?tab=members" style={{ color: '#E06010', fontWeight: 700, textDecoration: 'none' }}>
              Add family members
            </Link>
          </div>
        )}
      </div>

      {/* Click-away to close photo menu */}
      {photoMenuOpen && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 9 }}
          onClick={() => setPhotoMenuOpen(false)}
        />
      )}

      {/* ── WEEK NAVIGATOR ─────────────────────────────────────── */}
      <WeekNavigator onSetUpWeek={() => setShowWeekSetup(true)} />

      {/* Sunday prompt */}
      {isSunday() && isCurrentWeek && (
        <Link href="/sunday" style={{ textDecoration: 'none', display: 'block', padding: '10px 16px 0' }}>
          <div style={{ background: '#E06010', borderRadius: 12, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10, boxShadow: '0 3px 12px rgba(224,96,16,0.3)' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#F5E6C8', flexShrink: 0 }} />
            <div style={{ fontFamily: 'Nunito, sans-serif', color: '#fff', fontSize: '0.9rem', fontWeight: 700 }}>
              It is Sunday — time for the Family Pot
            </div>
            <div style={{ marginLeft: 'auto', color: 'rgba(255,255,255,0.7)', fontSize: '1.2rem' }}>→</div>
          </div>
        </Link>
      )}

      {/* ── WEEK SNAPSHOT ──────────────────────────────────────── */}
      <div style={{ padding: '16px 16px 0' }}>
        <div className="surface" style={{ padding: '16px 18px', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '2rem', fontWeight: 700, color: remaining >= 0 ? '#3D2B1F' : '#B84C08', lineHeight: 1 }}>
                {formatCurrency(Math.abs(remaining))}
              </div>
              <div style={{ fontFamily: 'Nunito, sans-serif', fontSize: '0.8rem', color: '#8B6B55', marginTop: 4 }}>
                {remaining >= 0 ? 'remaining' : 'over budget'} · {formatCurrency(totalSpent)} spent
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: 'Nunito, sans-serif', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#8B6B55', marginBottom: 4 }}>
                Budget
              </div>
              <div style={{ fontFamily: 'Nunito, sans-serif', fontSize: '1.1rem', fontWeight: 800, color: '#3D2B1F' }}>
                {formatCurrency(totalBudget)}
              </div>
            </div>
          </div>
          {totalBudget > 0 && (
            <div style={{ marginTop: 12 }}>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${Math.min((totalSpent / totalBudget) * 100, 100)}%`, background: remaining < 0 ? '#B84C08' : '#E06010' }} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── SPEND ENTRY ────────────────────────────────────────── */}
      {isCurrentWeek ? (
        <SpendEntry />
      ) : (
        <div style={{ padding: '0 16px 8px' }}>
          <div style={{ textAlign: 'center', padding: '14px', background: '#F9F0DC', border: '1.5px solid #D4C4A0', borderRadius: 12, fontFamily: 'Nunito, sans-serif', fontSize: '0.88rem', color: '#8B6B55' }}>
            Viewing a past week — spending can only be added to the current week
          </div>
        </div>
      )}

      {/* ── RECENT TRANSACTIONS ────────────────────────────────── */}
      {recentTransactions.length > 0 && (
        <div style={{ padding: '20px 16px 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <div style={{ fontFamily: 'Nunito, sans-serif', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#8B6B55' }}>
              Recent spends
            </div>
            <Link href="/envelopes" style={{ fontFamily: 'Nunito, sans-serif', fontSize: '0.78rem', fontWeight: 700, color: '#E06010', textDecoration: 'none' }}>
              All envelopes
            </Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {recentTransactions.map((tx, i) => {
              const envelope = data.envelopes.find(e => e.id === tx.envelopeId);
              return (
                <div key={tx.id} style={{
                  display: 'flex', alignItems: 'center', padding: '11px 14px',
                  background: '#F9F0DC',
                  borderRadius: i === 0 ? '12px 12px 2px 2px' : i === recentTransactions.length - 1 ? '2px 2px 12px 12px' : '2px',
                  border: '1px solid #E8D4A8', gap: 12,
                }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: envelope?.color ?? '#E06010', flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: 'Nunito, sans-serif', fontSize: '0.93rem', fontWeight: 600, color: '#3D2B1F', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {tx.description}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#8B6B55', marginTop: 1 }}>
                      {envelope?.name} · {formatDate(tx.date)}
                    </div>
                  </div>
                  <div style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: '0.95rem', color: '#3D2B1F', flexShrink: 0 }}>
                    {formatCurrency(tx.amount)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── QUICK LINKS ────────────────────────────────────────── */}
      <div style={{ padding: '20px 16px 0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {[
          { href: '/envelopes', label: 'Envelopes', sub: `${activeEnvelopes.length} this week` },
          { href: '/travel', label: 'Travel Fund', sub: data.travelGoal ? formatCurrency(data.travelGoal.currentAmount) : 'Set a goal' },
          { href: '/sunday', label: 'Sunday session', sub: 'History · Reflection' },
          { href: '/pocket-money', label: 'Pocket Money', sub: data.pocketMoneyEnabled ? 'On' : 'Tap to set up' },
        ].map(({ href, label, sub }) => (
          <Link key={href} href={href} style={{ textDecoration: 'none' }}>
            <div style={{ background: '#F9F0DC', border: '1.5px solid #D4C4A0', borderRadius: 12, padding: '12px 14px' }}>
              <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '0.95rem', fontWeight: 600, color: '#3D2B1F', marginBottom: 3 }}>
                {label}
              </div>
              <div style={{ fontFamily: 'Nunito, sans-serif', fontSize: '0.75rem', color: '#8B6B55' }}>
                {sub}
              </div>
            </div>
          </Link>
        ))}
      </div>

      <BottomNav />
    </div>
  );
}
