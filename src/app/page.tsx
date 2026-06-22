'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useFamilyData } from '@/lib/context';
import {
  getCurrentWeekStart, getEnvelopeSpentThisWeek,
  getWeekBudget, getWeekTotalBudget, isSunday,
  formatWeekRange, loadFamilyPhoto, saveFamilyPhoto,
  loadKitchenBg,
} from '@/lib/storage';
import { formatCurrency, parseSpendText } from '@/lib/categorizer';
import WeekNavigator from '@/components/WeekNavigator';
import WeekSetup from '@/components/WeekSetup';
import VoiceInput from '@/components/VoiceInput';
import BottomNav from '@/components/BottomNav';

// ─── Botanical flap patterns (one per envelope colour) ──────────────────────
function BotanicalFlap({ color, height = 54 }: { color: string; height?: number }) {
  const patterns: Record<string, React.ReactElement> = {
    '#E06010': (
      <svg width="100%" height={height} viewBox="0 0 120 54" preserveAspectRatio="xMidYMid slice">
        <rect width="120" height="54" fill="#8B2A00"/>
        {[0,24,48,72,96].map(x => [0,27].map(y => (
          <g key={`${x}-${y}`} transform={`translate(${x+3},${y+3})`}>
            <rect width="18" height="18" rx="2.5" fill="#CC3A10" stroke="#6B1800" strokeWidth="1"/>
            <path d="M9 3 L11 7 L9 15 L7 7 Z" fill="#8B2A00"/>
            <circle cx="9" cy="10" r="2" fill="#E05020"/>
          </g>
        )))}
        <polygon points="0,0 60,54 120,0" fill="#FBF2E8"/>
      </svg>
    ),
    '#C49A1E': (
      <svg width="100%" height={height} viewBox="0 0 120 54" preserveAspectRatio="xMidYMid slice">
        <rect width="120" height="54" fill="#7A5E00"/>
        {[0,20,40,60,80,100].map(x => [0,20,40].map(y => (
          <g key={`${x}-${y}`} transform={`translate(${x+2},${y+2})`}>
            <path d="M8 0 L16 8 L8 16 L0 8 Z" fill="#C49A1E" stroke="#7A5E00" strokeWidth="0.8"/>
            <circle cx="8" cy="8" r="2.5" fill="#E0B420"/>
          </g>
        )))}
        <polygon points="0,0 60,54 120,0" fill="#FBF6E0"/>
      </svg>
    ),
    '#6B7A36': (
      <svg width="100%" height={height} viewBox="0 0 120 54" preserveAspectRatio="xMidYMid slice">
        <rect width="120" height="54" fill="#3A4A18"/>
        {[0,30,60,90].map(x => [0,27].map(y => (
          <g key={`${x}-${y}`} transform={`translate(${x+4},${y+2})`}>
            <ellipse cx="11" cy="9" rx="8" ry="5" fill="#6B7A36" stroke="#3A4A18" strokeWidth="1" transform="rotate(-30 11 9)"/>
            <ellipse cx="11" cy="9" rx="8" ry="5" fill="#8A9A4A" stroke="#3A4A18" strokeWidth="1" transform="rotate(30 11 9)"/>
            <line x1="11" y1="0" x2="11" y2="18" stroke="#3A4A18" strokeWidth="1.5"/>
          </g>
        )))}
        <polygon points="0,0 60,54 120,0" fill="#F0F5E4"/>
      </svg>
    ),
    '#5D4033': (
      <svg width="100%" height={height} viewBox="0 0 120 54" preserveAspectRatio="xMidYMid slice">
        <rect width="120" height="54" fill="#2A1808"/>
        {[0,24,48,72,96].map(x => [0,27].map(y => (
          <g key={`${x}-${y}`} transform={`translate(${x+3},${y+3})`}>
            <rect width="18" height="18" rx="2" fill="#5D4033" stroke="#2A1808" strokeWidth="1"/>
            <path d="M9 4 L13 9 L9 14 L5 9 Z" fill="#3D2010" stroke="#7D5040" strokeWidth="0.5"/>
            <circle cx="9" cy="9" r="2" fill="#7D5040"/>
          </g>
        )))}
        <polygon points="0,0 60,54 120,0" fill="#F5EDE8"/>
      </svg>
    ),
  };
  return patterns[color] ?? patterns['#E06010'];
}

// ─── Vintage TV illustration ─────────────────────────────────────────────────
function VintageTV({ message }: { message: string }) {
  return (
    <svg width="110" height="90" viewBox="0 0 110 90" fill="none">
      <rect x="8" y="10" width="94" height="62" rx="8" fill="#3D2B1F"/>
      <rect x="8" y="10" width="94" height="62" rx="8" stroke="#5D4033" strokeWidth="2"/>
      <rect x="16" y="16" width="65" height="48" rx="5" fill="#1A1008"/>
      <rect x="18" y="18" width="61" height="44" rx="4" fill="#0A0804"/>
      <text x="48" y="38" textAnchor="middle" fontFamily="Georgia,serif" fontSize="8" fill="#E8C878" fontStyle="italic">Good work</text>
      <text x="48" y="50" textAnchor="middle" fontFamily="Georgia,serif" fontSize="8" fill="#E8C878" fontStyle="italic">this week!</text>
      <circle cx="90" cy="30" r="5" fill="#5D4033" stroke="#3D2B1F" strokeWidth="1"/>
      <circle cx="90" cy="44" r="5" fill="#5D4033" stroke="#3D2B1F" strokeWidth="1"/>
      <circle cx="90" cy="58" r="5" fill="#C49A1E" stroke="#3D2B1F" strokeWidth="1"/>
      <path d="M40 72 L35 82 M70 72 L75 82" stroke="#5D4033" strokeWidth="5" strokeLinecap="round"/>
      <rect x="30" y="82" width="50" height="6" rx="3" fill="#5D4033"/>
      {/* Antenna */}
      <line x1="40" y1="10" x2="30" y2="2" stroke="#5D4033" strokeWidth="2" strokeLinecap="round"/>
      <line x1="70" y1="10" x2="80" y2="2" stroke="#5D4033" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

// ─── Travel suitcase ─────────────────────────────────────────────────────────
function TravelSuitcase() {
  return (
    <svg width="90" height="80" viewBox="0 0 90 80" fill="none">
      <rect x="20" y="8" width="14" height="6" rx="3" fill="#5D4033" stroke="#3D2B1F" strokeWidth="1.5"/>
      <rect x="8" y="22" width="74" height="50" rx="10" fill="#6B7A36"/>
      <rect x="8" y="22" width="74" height="50" rx="10" stroke="#4D5928" strokeWidth="2"/>
      <rect x="8" y="44" width="74" height="4" fill="#4D5928"/>
      <rect x="20" y="14" width="50" height="8" rx="4" fill="#5D4033" stroke="#3D2B1F" strokeWidth="1.5"/>
      <rect x="4" y="36" width="6" height="18" rx="3" fill="#5D4033"/>
      <rect x="80" y="36" width="6" height="18" rx="3" fill="#5D4033"/>
      {/* Sticker: BALI */}
      <circle cx="38" cy="55" r="12" fill="#E06010" stroke="#fff" strokeWidth="1.5"/>
      <text x="38" y="59" textAnchor="middle" fontFamily="Georgia,serif" fontSize="7" fill="#fff" fontWeight="bold">BALI</text>
      {/* Sticker: star */}
      <circle cx="62" cy="36" r="8" fill="#C49A1E" stroke="#fff" strokeWidth="1.5"/>
      <text x="62" y="40" textAnchor="middle" fontSize="10" fill="#fff">★</text>
    </svg>
  );
}

// ─── Starburst clock ─────────────────────────────────────────────────────────
function StarburstClock() {
  const now = new Date();
  const h = now.getHours() % 12;
  const m = now.getMinutes();
  const hAngle = (h * 30 + m * 0.5) - 90;
  const mAngle = m * 6 - 90;
  return (
    <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
      {[0,30,60,90,120,150,180,210,240,270,300,330].map((a, i) => {
        const rad = a * Math.PI / 180;
        const isLong = i % 3 === 0;
        const r1 = isLong ? 26 : 28;
        const r2 = isLong ? 38 : 34;
        return <line key={a} x1={36 + Math.cos(rad)*r1} y1={36 + Math.sin(rad)*r1} x2={36 + Math.cos(rad)*r2} y2={36 + Math.sin(rad)*r2} stroke="#C49A1E" strokeWidth={isLong ? 2.5 : 1.5} strokeLinecap="round"/>;
      })}
      <circle cx="36" cy="36" r="24" fill="#3D2B1F" stroke="#C49A1E" strokeWidth="2"/>
      <circle cx="36" cy="36" r="20" fill="#2A1808"/>
      {/* Hour hand */}
      <line x1="36" y1="36" x2={36 + Math.cos(hAngle * Math.PI / 180)*13} y2={36 + Math.sin(hAngle * Math.PI / 180)*13} stroke="#F5E6C8" strokeWidth="2.5" strokeLinecap="round"/>
      {/* Minute hand */}
      <line x1="36" y1="36" x2={36 + Math.cos(mAngle * Math.PI / 180)*17} y2={36 + Math.sin(mAngle * Math.PI / 180)*17} stroke="#E06010" strokeWidth="1.8" strokeLinecap="round"/>
      <circle cx="36" cy="36" r="2.5" fill="#E06010"/>
    </svg>
  );
}

// ─── Main page ───────────────────────────────────────────────────────────────
export default function HomePage() {
  const { data, isLoaded, selectedWeekStart, isCurrentWeek, addSpend } = useFamilyData();
  const router = useRouter();
  const [showWeekSetup, setShowWeekSetup] = useState(false);
  const [familyPhoto, setFamilyPhoto] = useState<string | null>(null);
  const [kitchenBg, setKitchenBg] = useState<string | null>(null);
  const [spendInput, setSpendInput] = useState('');
  const [selectedEnvId, setSelectedEnvId] = useState('');
  const [spendSaved, setSpendSaved] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setFamilyPhoto(loadFamilyPhoto());
    setKitchenBg(loadKitchenBg());
  }, []);

  const handlePhotoUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const b64 = ev.target?.result as string;
      saveFamilyPhoto(b64);
      setFamilyPhoto(b64);
    };
    reader.readAsDataURL(file);
  }, []);

  if (!isLoaded) return null;

  const weekStart = selectedWeekStart;
  const activeEnvelopes = data.envelopes
    .filter(e => !e.isTravelFund)
    .sort((a, b) => a.order - b.order);

  const totalBudget = getWeekTotalBudget(data, weekStart);
  const totalSpent = data.envelopes
    .filter(e => !e.isTravelFund && !e.isPocketMoney)
    .reduce((s, e) => s + getEnvelopeSpentThisWeek(data.transactions, e.id, weekStart), 0);

  const recentTx = data.transactions
    .filter(t => t.weekStart === weekStart)
    .slice(0, 6);

  const parsed = spendInput.trim()
    ? parseSpendText(spendInput, data.envelopes.filter(e => !e.isTravelFund && !e.isPocketMoney))
    : null;

  const effectiveEnvId = selectedEnvId ||
    (parsed?.suggestedEnvelopeName
      ? data.envelopes.find(e => e.name === parsed.suggestedEnvelopeName)?.id ?? '' : '');

  const handleAddSpend = () => {
    if (!parsed || parsed.amount <= 0 || !effectiveEnvId) return;
    addSpend(effectiveEnvId, parsed.amount, parsed.description || spendInput);
    setSpendInput('');
    setSelectedEnvId('');
    setSpendSaved(true);
    setTimeout(() => setSpendSaved(false), 1500);
  };

  // How did we do — count envelopes by status
  const envelopeSummary = data.envelopes
    .filter(e => !e.isTravelFund && !e.isPocketMoney && e.weeklyBudget > 0)
    .map(e => {
      const budget = getWeekBudget(data, e.id, weekStart);
      const spent = getEnvelopeSpentThisWeek(data.transactions, e.id, weekStart);
      const ratio = budget > 0 ? spent / budget : 0;
      return { name: e.name, ratio };
    });
  const underCount = envelopeSummary.filter(e => e.ratio <= 1).length;
  const overCount = envelopeSummary.filter(e => e.ratio > 1.1).length;
  const onTarget = envelopeSummary.filter(e => e.ratio > 1 && e.ratio <= 1.1).length;

  if (showWeekSetup) {
    return (
      <div className="page" style={{ display: 'flex', flexDirection: 'column' }}>
        <header className="app-header">
          <Link href="/how-to-use" style={{ textDecoration: 'none' }}>
            <span style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.25rem', fontWeight: 700, color: '#F5E6C8' }}>The Family Pot</span>
          </Link>
          <button onClick={() => setShowWeekSetup(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'Nunito, sans-serif', fontSize: '0.85rem', color: '#B09070', fontWeight: 700 }}>Cancel</button>
        </header>
        <WeekSetup weekStart={weekStart} onDone={() => setShowWeekSetup(false)} />
        <BottomNav />
      </div>
    );
  }

  const displayMembers = data.members.filter(m => m.name !== 'Everyone');

  return (
    <div style={{ background: '#F5E6C8', minHeight: '100vh', paddingBottom: 72 }}>

      {/* ── KITCHEN HERO ───────────────────────────────────────────── */}
      <div
        className="kitchen-hero"
        style={{
          minHeight: 320,
          backgroundImage: kitchenBg ? `url(${kitchenBg})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center bottom',
        }}
      >
        {/* CSS kitchen scene — hidden when photo uploaded */}
        {!kitchenBg && <div className="kitchen-wall" />}
        {!kitchenBg && <div className="kitchen-bench" />}
        {!kitchenBg && (
          <div style={{
            position: 'absolute', right: 0, top: 0, bottom: '28%', width: '18%',
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32'%3E%3Ccircle cx='8' cy='8' r='5' fill='%23C49A1E' opacity='0.35'/%3E%3Ccircle cx='24' cy='24' r='5' fill='%23C49A1E' opacity='0.35'/%3E%3Ccircle cx='8' cy='24' r='3' fill='%23E06010' opacity='0.25'/%3E%3Ccircle cx='24' cy='8' r='3' fill='%23E06010' opacity='0.25'/%3E%3C/svg%3E")`,
            opacity: 0.8,
          }} />
        )}

        {/* Dark overlay on left when using photo — makes white text readable */}
        {kitchenBg && (
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to right, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.2) 45%, transparent 70%)',
            zIndex: 1,
          }} />
        )}

        {/* Left info block */}
        <div style={{
          position: 'absolute', top: 20, left: 24,
          zIndex: 2,
        }}>
          <Link href="/how-to-use" style={{ textDecoration: 'none' }}>
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(1.6rem, 4vw, 2.6rem)', fontWeight: 700, color: kitchenBg ? '#fff' : '#3D2B1F', lineHeight: 1, textShadow: kitchenBg ? '0 2px 8px rgba(0,0,0,0.4)' : 'none' }}>
              The Family Pot
            </div>
            <div style={{ fontFamily: 'Playfair Display, serif', fontStyle: 'italic', fontSize: 'clamp(0.9rem, 2vw, 1.3rem)', color: kitchenBg ? 'rgba(255,255,255,0.85)' : '#6B7A36', marginTop: 2, textShadow: kitchenBg ? '0 1px 4px rgba(0,0,0,0.4)' : 'none' }}>
              Family Money for the Week
            </div>
          </Link>

          {/* Weekly amount box */}
          <div style={{
            marginTop: 16,
            background: '#F9F0DC',
            border: '2px solid #D4C4A0',
            borderRadius: 12,
            padding: '14px 18px',
            minWidth: 200,
            boxShadow: '0 3px 12px rgba(61,43,31,0.15)',
          }}>
            <div style={{ fontFamily: 'Nunito, sans-serif', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#8B6B55', marginBottom: 4 }}>
              This Week's Money
            </div>
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 700, color: '#3D2B1F', lineHeight: 1 }}>
              {formatCurrency(totalBudget)}
            </div>
            <div style={{ fontFamily: 'Nunito, sans-serif', fontSize: '0.75rem', color: '#8B6B55', marginTop: 4 }}>
              {formatCurrency(totalBudget - totalSpent)} remaining · {formatWeekRange(weekStart)}
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <button
                onClick={() => setShowWeekSetup(true)}
                style={{
                  background: '#3D2B1F', color: '#F5E6C8', border: 'none', borderRadius: 8,
                  padding: '7px 14px', fontFamily: 'Nunito, sans-serif', fontWeight: 800,
                  fontSize: '0.78rem', cursor: 'pointer',
                }}
              >
                {totalBudget === 0 ? 'Set up week' : 'Edit week'}
              </button>
              <Link href="/sunday">
                <button style={{
                  background: 'transparent', color: '#5D4033', border: '1.5px solid #D4C4A0', borderRadius: 8,
                  padding: '7px 14px', fontFamily: 'Nunito, sans-serif', fontWeight: 800,
                  fontSize: '0.78rem', cursor: 'pointer',
                }}>
                  How Did We Do?
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Pot — centred on bench */}
        <div style={{
          position: 'absolute', left: '50%', transform: 'translateX(-50%)',
          bottom: '22%', zIndex: 3,
        }}>
          <svg width="130" height="128" viewBox="0 0 140 138" fill="none">
            <defs>
              <linearGradient id="hm-lid" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#E8E8E8"/><stop offset="100%" stopColor="#A0A0A0"/></linearGradient>
              <linearGradient id="hm-body" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#F07820"/><stop offset="100%" stopColor="#B84C08"/></linearGradient>
              <clipPath id="hm-clip"><path d="M22 52 Q18 100 70 108 Q122 108 118 52 Z"/></clipPath>
            </defs>
            <ellipse cx="70" cy="112" rx="48" ry="10" fill="#3D2B1F" opacity="0.2"/>
            <path d="M22 52 Q18 100 70 108 Q122 108 118 52 Z" fill="url(#hm-body)"/>
            <path d="M30 60 Q40 54 60 52" stroke="rgba(255,255,255,0.28)" strokeWidth="3" strokeLinecap="round"/>
            <g clipPath="url(#hm-clip)">
              {[26,50,74,98].map((x, i) => (
                <g key={x} transform={`translate(${x},74)`}>
                  <rect x="0" y="0" width="18" height="18" rx="2" fill="#CC2020" stroke="#7A1820" strokeWidth="1.5"/>
                  {i % 2 === 0
                    ? <path d="M9 3 L12 9 L9 15 L6 9 Z" fill="#7A1820"/>
                    : <path d="M9 2 Q13 9 9 16 Q5 9 9 2 Z" fill="#7A1820"/>}
                  <circle cx="9" cy="9" r="2" fill="#E06010"/>
                </g>
              ))}
            </g>
            <path d="M22 68 Q10 68 10 76 Q10 84 22 82" stroke="#B84C08" strokeWidth="7" strokeLinecap="round" fill="none"/>
            <path d="M118 68 Q130 68 130 76 Q130 84 118 82" stroke="#B84C08" strokeWidth="7" strokeLinecap="round" fill="none"/>
            <path d="M22 68 Q10 68 10 76 Q10 84 22 82" stroke="#E06010" strokeWidth="4" strokeLinecap="round" fill="none"/>
            <path d="M118 68 Q130 68 130 76 Q130 84 118 82" stroke="#E06010" strokeWidth="4" strokeLinecap="round" fill="none"/>
            <ellipse cx="70" cy="48" rx="46" ry="11" fill="#A0A0A0"/>
            <ellipse cx="70" cy="46" rx="46" ry="11" fill="url(#hm-lid)"/>
            <path d="M36 42 Q55 39 84 41" stroke="rgba(255,255,255,0.45)" strokeWidth="2" strokeLinecap="round"/>
            <ellipse cx="70" cy="27" rx="10" ry="5" fill="#333"/>
          </svg>
        </div>

        {/* Family photo (top right) or tap-to-add placeholder */}
        <div style={{
          position: 'absolute', top: 16, right: 90,
          zIndex: 4, cursor: 'pointer',
        }} onClick={() => photoInputRef.current?.click()}>
          {familyPhoto ? (
            <div style={{
              width: 80, height: 80,
              background: '#fff',
              padding: 4,
              borderRadius: 4,
              boxShadow: '2px 3px 10px rgba(0,0,0,0.25)',
              transform: 'rotate(2deg)',
              overflow: 'hidden',
            }}>
              <img src={familyPhoto} alt="Family" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}/>
            </div>
          ) : (
            <div style={{
              width: 72, height: 72, background: 'rgba(245,230,200,0.8)',
              border: '2px dashed #C4B490', borderRadius: 8,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'Nunito, sans-serif', fontSize: '0.6rem', fontWeight: 700,
              color: '#8B6B55', textAlign: 'center', gap: 4,
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C4B490" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
              Tap to add<br/>family photo
            </div>
          )}
          <input ref={photoInputRef} type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: 'none' }}/>
        </div>

        {/* Starburst clock */}
        <div style={{ position: 'absolute', top: 14, right: 20, zIndex: 2 }}>
          <StarburstClock/>
        </div>

        {/* Family name + members */}
        <div style={{
          position: 'absolute', bottom: '30%', left: '50%', transform: 'translateX(-50%)',
          textAlign: 'center', whiteSpace: 'nowrap', zIndex: 2,
        }}>
          <div style={{
            fontFamily: 'Playfair Display, serif',
            fontStyle: 'italic',
            fontSize: 'clamp(0.85rem, 1.8vw, 1.1rem)',
            color: '#5D4033',
            fontWeight: 600,
          }}>
            {displayMembers.map((m, i) => (
              <span key={m.id}>
                {i > 0 && <span style={{ color: '#C4B490', margin: '0 4px' }}>·</span>}
                <span style={{ color: m.color }}>{m.name}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Week navigator strip */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 5 }}>
          <WeekNavigator onSetUpWeek={() => setShowWeekSetup(true)} compact />
        </div>
      </div>

      {/* ── ENVELOPE GRID on timber bench ──────────────────────────── */}
      {/* max-width 1600px so it looks intentional on a TV/wide screen */}
      <div style={{ maxWidth: 1600, margin: '0 auto' }}>
      <div className="envelope-grid">
        {activeEnvelopes.map(envelope => {
          const spent = getEnvelopeSpentThisWeek(data.transactions, envelope.id, weekStart);
          const budget = envelope.isTravelFund
            ? (data.travelGoal?.currentAmount ?? 0)
            : getWeekBudget(data, envelope.id, weekStart);
          const remaining = envelope.isTravelFund
            ? (data.travelGoal?.targetAmount ?? 0) - budget
            : budget - spent;
          const isOver = !envelope.isTravelFund && remaining < 0;
          const pct = budget > 0 ? Math.min((spent / budget) * 100, 100) : 0;
          const href = envelope.isTravelFund ? '/travel' : `/envelope/${envelope.id}`;

          return (
            <Link key={envelope.id} href={href} style={{ textDecoration: 'none' }}>
              <div style={{
                background: '#F9F0DC',
                borderRadius: 10,
                overflow: 'hidden',
                boxShadow: '0 2px 10px rgba(0,0,0,0.35)',
                transition: 'transform 0.1s',
                cursor: 'pointer',
              }}
                onPointerDown={e => (e.currentTarget as HTMLElement).style.transform = 'scale(0.97)'}
                onPointerUp={e => (e.currentTarget as HTMLElement).style.transform = 'scale(1)'}
                onPointerLeave={e => (e.currentTarget as HTMLElement).style.transform = 'scale(1)'}
              >
                {/* Botanical flap */}
                <BotanicalFlap color={envelope.color} />

                {/* Body */}
                <div style={{ padding: '10px 12px 12px' }}>
                  <div style={{
                    fontFamily: 'Playfair Display, serif', fontWeight: 700,
                    fontSize: 'clamp(0.75rem, 1.2vw, 0.9rem)',
                    color: '#3D2B1F', marginBottom: 6,
                  }}>
                    {envelope.name}
                    {envelope.isPocketMoney && (
                      <div style={{ fontFamily: 'Nunito, sans-serif', fontSize: '0.65rem', color: '#8B6B55', fontWeight: 400 }}>Pocket Money</div>
                    )}
                  </div>

                  <div style={{
                    fontFamily: 'Nunito, sans-serif', fontWeight: 800,
                    fontSize: 'clamp(1rem, 1.8vw, 1.3rem)',
                    color: isOver ? '#B84C08' : '#3D2B1F',
                    lineHeight: 1,
                    marginBottom: 2,
                  }}>
                    {formatCurrency(envelope.isTravelFund ? budget : Math.abs(remaining))}
                  </div>
                  <div style={{ fontFamily: 'Nunito, sans-serif', fontSize: '0.65rem', color: '#8B6B55' }}>
                    {envelope.isTravelFund
                      ? `saved for your adventure`
                      : isOver
                      ? `over budget`
                      : `left of ${formatCurrency(budget)}`}
                  </div>

                  {!envelope.isTravelFund && (
                    <div style={{ marginTop: 8 }}>
                      <div style={{ height: 5, background: '#E8D4A8', borderRadius: 9999, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${pct}%`, background: isOver ? '#B84C08' : envelope.color, borderRadius: 9999, transition: 'width 0.3s' }}/>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* ── BOTTOM FOUR PANELS ─────────────────────────────────────── */}
      <div className="dashboard-bottom">

        {/* 1. Add Spending */}
        <div className="dash-panel" style={{ background: '#E06010' }}>
          <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.3rem', fontWeight: 700, color: '#fff', marginBottom: 4 }}>
            Add Spending
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 10 }}>
            <input
              className="pot-input"
              style={{ fontSize: '1rem', background: 'rgba(255,255,255,0.15)', border: '1.5px solid rgba(255,255,255,0.35)', color: '#fff', flex: 1 }}
              value={spendInput}
              onChange={e => { setSpendInput(e.target.value); setSelectedEnvId(''); }}
              onKeyDown={e => e.key === 'Enter' && handleAddSpend()}
              placeholder="Type it... or say it..."
            />
            <VoiceInput onTranscript={t => { setSpendInput(t); setSelectedEnvId(''); }} />
          </div>
          <div style={{ fontFamily: 'Nunito, sans-serif', fontSize: '0.7rem', color: 'rgba(255,255,255,0.7)', marginBottom: 6 }}>
            e.g. $10 school disco lollies
          </div>

          {/* Auto-detected envelope or picker */}
          <div style={{ marginBottom: 10 }}>
            <select
              value={effectiveEnvId}
              onChange={e => setSelectedEnvId(e.target.value)}
              style={{
                width: '100%', padding: '8px 10px', borderRadius: 8,
                background: 'rgba(255,255,255,0.15)', border: '1.5px solid rgba(255,255,255,0.35)',
                color: '#fff', fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: '0.82rem',
                appearance: 'none', cursor: 'pointer',
              }}
            >
              <option value="" style={{ background: '#E06010' }}>
                {parsed?.suggestedEnvelopeName
                  ? `Auto → ${parsed.suggestedEnvelopeName}`
                  : 'Choose envelope...'}
              </option>
              {data.envelopes.filter(e => !e.isTravelFund).map(e => (
                <option key={e.id} value={e.id} style={{ background: '#3D2B1F' }}>{e.name}</option>
              ))}
            </select>
          </div>

          <button
            onClick={handleAddSpend}
            disabled={!spendInput.trim() || !effectiveEnvId || spendSaved}
            style={{
              width: '100%', padding: '11px', background: '#3D2B1F', color: '#F5E6C8',
              border: 'none', borderRadius: 8, fontFamily: 'Nunito, sans-serif',
              fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer',
              opacity: (!spendInput.trim() || !effectiveEnvId) ? 0.5 : 1,
            }}
          >
            {spendSaved ? 'Recorded' : 'Enter'}
          </button>
        </div>

        {/* 2. Recent Spending */}
        <div className="dash-panel" style={{ background: '#F9F0DC', borderLeft: '1px solid #E8D4A8' }}>
          <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.1rem', fontWeight: 700, color: '#3D2B1F', marginBottom: 12 }}>
            Recent Spending
          </div>
          {recentTx.length === 0 ? (
            <div style={{ fontFamily: 'Nunito, sans-serif', fontSize: '0.85rem', color: '#8B6B55', fontStyle: 'italic' }}>
              Nothing recorded yet this week
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {recentTx.map(tx => {
                const env = data.envelopes.find(e => e.id === tx.envelopeId);
                const daysAgo = Math.floor((Date.now() - new Date(tx.date + 'T12:00:00').getTime()) / 86400000);
                const when = daysAgo === 0 ? 'Today' : daysAgo === 1 ? 'Yesterday' : `${daysAgo} days ago`;
                return (
                  <div key={tx.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 0', borderBottom: '1px solid #E8D4A8' }}>
                    <div style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: '0.88rem', color: '#3D2B1F', minWidth: 52 }}>
                      {formatCurrency(tx.amount)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: 'Nunito, sans-serif', fontSize: '0.82rem', color: '#3D2B1F', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                        {tx.description}
                      </div>
                    </div>
                    <div style={{ fontFamily: 'Nunito, sans-serif', fontSize: '0.7rem', fontWeight: 700, color: env?.color ?? '#8B6B55', flexShrink: 0 }}>
                      {env?.name}
                    </div>
                    <div style={{ fontFamily: 'Nunito, sans-serif', fontSize: '0.68rem', color: '#B09070', flexShrink: 0, minWidth: 40, textAlign: 'right' }}>
                      {when}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 3. How Did We Do */}
        <div className="dash-panel" style={{ background: '#F5EDE8', borderLeft: '1px solid #E8D4A8' }}>
          <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.1rem', fontWeight: 700, color: '#3D2B1F', marginBottom: 4 }}>
            How Did We Do?
          </div>
          <div style={{ fontFamily: 'Nunito, sans-serif', fontSize: '0.72rem', color: '#8B6B55', marginBottom: 12 }}>
            Week {isCurrentWeek ? 'in progress' : `of ${formatWeekRange(weekStart)}`}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <VintageTV message=""/>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                { color: '#6B7A36', label: `Stayed under in ${underCount} envelope${underCount !== 1 ? 's' : ''}` },
                { color: '#B84C08', label: `Over by more than $10 in ${overCount}` },
                { color: '#C49A1E', label: `On target in ${onTarget}` },
              ].map(({ color, label }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: color, flexShrink: 0 }}/>
                  <span style={{ fontFamily: 'Nunito, sans-serif', fontSize: '0.72rem', color: '#5D4033' }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
          <Link href="/sunday">
            <button style={{
              marginTop: 14, background: 'transparent', border: 'none', cursor: 'pointer',
              fontFamily: 'Nunito, sans-serif', fontSize: '0.82rem', fontWeight: 800,
              color: '#E06010', padding: 0,
            }}>
              See full review →
            </button>
          </Link>
        </div>

        {/* 4. Travel Kitty */}
        <div className="dash-panel" style={{ background: '#6B7A36' }}>
          <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: 4 }}>
            Travel Kitty
          </div>
          {data.travelGoal ? (
            <>
              <div style={{ display: 'flex', justifyContent: 'center', margin: '8px 0' }}>
                <TravelSuitcase/>
              </div>
              <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.6rem', fontWeight: 700, color: '#fff', textAlign: 'center', lineHeight: 1 }}>
                {formatCurrency(data.travelGoal.currentAmount)}
              </div>
              <div style={{ fontFamily: 'Nunito, sans-serif', fontSize: '0.75rem', color: 'rgba(255,255,255,0.75)', textAlign: 'center', marginBottom: 10 }}>
                Saved for {data.travelGoal.name}
              </div>
              {/* Mini progress */}
              <div style={{ height: 8, background: 'rgba(0,0,0,0.2)', borderRadius: 9999, overflow: 'hidden', marginBottom: 10 }}>
                <div style={{ height: '100%', width: `${Math.min((data.travelGoal.currentAmount / data.travelGoal.targetAmount) * 100, 100)}%`, background: '#fff', borderRadius: 9999 }}/>
              </div>
              <Link href="/travel" style={{ textDecoration: 'none', display: 'block' }}>
                <button style={{
                  width: '100%', padding: '8px', background: '#F9F0DC', color: '#4D5928',
                  border: 'none', borderRadius: 8, fontFamily: 'Nunito, sans-serif',
                  fontWeight: 800, fontSize: '0.82rem', cursor: 'pointer',
                }}>
                  Add to Travel Kitty
                </button>
              </Link>
            </>
          ) : (
            <Link href="/travel">
              <button style={{
                marginTop: 8, background: 'rgba(255,255,255,0.15)', color: '#fff',
                border: '1.5px solid rgba(255,255,255,0.35)', borderRadius: 8,
                padding: '10px 16px', fontFamily: 'Nunito, sans-serif',
                fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer',
              }}>
                Set a travel goal
              </button>
            </Link>
          )}
        </div>
      </div>
      </div> {/* end max-width wrapper */}

      {isSunday() && isCurrentWeek && (
        <div style={{ padding: '12px 16px 0' }}>
          <Link href="/sunday" style={{ textDecoration: 'none' }}>
            <div style={{
              background: '#E06010', borderRadius: 12, padding: '12px 16px',
              display: 'flex', alignItems: 'center', gap: 10,
              boxShadow: '0 3px 12px rgba(224,96,16,0.3)',
            }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#F5E6C8', flexShrink: 0 }}/>
              <div style={{ fontFamily: 'Nunito, sans-serif', color: '#fff', fontSize: '0.9rem', fontWeight: 700 }}>
                It is Sunday — time for the Family Pot
              </div>
              <div style={{ marginLeft: 'auto', color: 'rgba(255,255,255,0.7)', fontSize: '1.2rem' }}>→</div>
            </div>
          </Link>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
