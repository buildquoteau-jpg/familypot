'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useFamilyData } from '@/lib/context';
import {
  getEnvelopeSpentThisWeek, getWeekBudget, getWeekTotalBudget,
  isSunday, formatWeekRange, loadFamilyPhoto, saveFamilyPhoto,
} from '@/lib/storage';
import { formatCurrency, parseSpendText } from '@/lib/categorizer';
import WeekNavigator from '@/components/WeekNavigator';
import WeekSetup from '@/components/WeekSetup';
import VoiceInput from '@/components/VoiceInput';
import BottomNav from '@/components/BottomNav';

// Cycle through flap images by envelope order index
const FLAP_IMAGES = [
  'flap-orange1',  // 0 — bold orange botanical
  'flap-yellow1',  // 1 — mustard sunflower
  'flap-green',    // 2 — dark green flowers
  'flap-orange',   // 3 — golden diamond
  'flap-yellow',   // 4 — orange star geometric
  'flap-green1',   // 5 — sage leaf
  'flap-orange1',  // 6 — rotate (add brown when ready)
  'flap-green1',   // 7 — travel / extra
];

function flapSrc(order: number, ext: 'avif' | 'png') {
  const name = FLAP_IMAGES[order % FLAP_IMAGES.length];
  return `/images/${name}.${ext}`;
}

// ── Envelope card using real image ───────────────────────────────────────────
function EnvelopeCard({
  envelope, spent, budget, href,
}: {
  envelope: { id: string; name: string; color: string; isTravelFund: boolean; isPocketMoney: boolean; order: number };
  spent: number;
  budget: number;
  href: string;
}) {
  const remaining = envelope.isTravelFund ? budget : budget - spent;
  const isOver = !envelope.isTravelFund && remaining < 0;
  const pct = budget > 0 ? Math.min((spent / budget) * 100, 100) : 0;

  return (
    <Link href={href} style={{ textDecoration: 'none', display: 'block' }}>
      {/*
        No overflow:hidden or box-shadow here — those create a rectangle
        and make transparent corners appear white.
        Instead: drop-shadow filter follows the actual envelope silhouette.
      */}
      <div
        style={{ position: 'relative', cursor: 'pointer', transition: 'transform 0.1s, filter 0.1s' }}
        onPointerDown={e => (e.currentTarget as HTMLElement).style.transform = 'scale(0.97)'}
        onPointerUp={e => (e.currentTarget as HTMLElement).style.transform = 'scale(1)'}
        onPointerLeave={e => (e.currentTarget as HTMLElement).style.transform = 'scale(1)'}
      >
        {/* Full envelope image — transparent areas show bench texture behind */}
        <picture>
          <source srcSet={flapSrc(envelope.order, 'avif')} type="image/avif" />
          <img
            src={flapSrc(envelope.order, 'png')}
            alt={envelope.name}
            style={{
              width: '100%',
              display: 'block',
              filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.5))',
            }}
          />
        </picture>

        {/* Text overlaid on the cream body — no background fill needed, image provides it */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '6% 10% 8%',
        }}>
          <div style={{
            fontFamily: 'Playfair Display, serif',
            fontWeight: 700,
            fontSize: 'clamp(0.75rem, 1.2vw, 0.92rem)',
            color: '#3D2B1F',
            marginBottom: 2,
          }}>
            {envelope.name}
            {envelope.isPocketMoney && (
              <div style={{ fontFamily: 'Nunito, sans-serif', fontSize: '0.62rem', color: '#8B6B55', fontWeight: 400 }}>Pocket Money</div>
            )}
          </div>
          <div style={{
            fontFamily: 'Nunito, sans-serif',
            fontWeight: 800,
            fontSize: 'clamp(1rem, 1.8vw, 1.3rem)',
            color: isOver ? '#B84C08' : '#3D2B1F',
            lineHeight: 1,
          }}>
            {formatCurrency(Math.abs(remaining))}
          </div>
          <div style={{ fontFamily: 'Nunito, sans-serif', fontSize: '0.62rem', color: '#5D4033', marginBottom: 4 }}>
            {envelope.isTravelFund ? 'saved so far' : isOver ? 'over budget' : `left of ${formatCurrency(budget)}`}
          </div>
          {!envelope.isTravelFund && (
            <div style={{ height: 5, background: 'rgba(61,43,31,0.18)', borderRadius: 9999, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${pct}%`, background: isOver ? '#B84C08' : '#E06010', borderRadius: 9999 }} />
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

// ── Starburst clock (still SVG — it's a live clock) ──────────────────────────
function StarburstClock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 30000);
    return () => clearInterval(id);
  }, []);
  const h = time.getHours() % 12, m = time.getMinutes();
  const hA = (h * 30 + m * 0.5) - 90, mA = m * 6 - 90;
  const toXY = (a: number, r: number) => [36 + Math.cos(a * Math.PI / 180) * r, 36 + Math.sin(a * Math.PI / 180) * r];
  return (
    <svg width="68" height="68" viewBox="0 0 72 72" fill="none">
      {[0,30,60,90,120,150,180,210,240,270,300,330].map((a, i) => {
        const long = i % 3 === 0;
        const [x1, y1] = toXY(a, long ? 26 : 28);
        const [x2, y2] = toXY(a, long ? 38 : 34);
        return <line key={a} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#C49A1E" strokeWidth={long ? 2.5 : 1.5} strokeLinecap="round" />;
      })}
      <circle cx="36" cy="36" r="24" fill="#3D2B1F" stroke="#C49A1E" strokeWidth="2" />
      <circle cx="36" cy="36" r="20" fill="#2A1808" />
      <line x1="36" y1="36" x2={toXY(hA, 13)[0]} y2={toXY(hA, 13)[1]} stroke="#F5E6C8" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="36" y1="36" x2={toXY(mA, 17)[0]} y2={toXY(mA, 17)[1]} stroke="#E06010" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="36" cy="36" r="2.5" fill="#E06010" />
    </svg>
  );
}

// ── Main home page ────────────────────────────────────────────────────────────
export default function HomePage() {
  const { data, isLoaded, selectedWeekStart, addSpend } = useFamilyData();
  const [showWeekSetup, setShowWeekSetup] = useState(false);
  const [familyPhoto, setFamilyPhoto] = useState<string | null>(null);
  const [spendInput, setSpendInput] = useState('');
  const [selectedEnvId, setSelectedEnvId] = useState('');
  const [spendSaved, setSpendSaved] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setFamilyPhoto(loadFamilyPhoto()); }, []);

  const handlePhotoUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => { const b64 = ev.target?.result as string; saveFamilyPhoto(b64); setFamilyPhoto(b64); };
    reader.readAsDataURL(file);
  }, []);

  if (!isLoaded) return null;

  const weekStart = selectedWeekStart;
  const activeEnvelopes = data.envelopes.filter(e => !e.isTravelFund).sort((a, b) => a.order - b.order);
  const travelEnvelope = data.envelopes.find(e => e.isTravelFund);
  const allDisplayEnvelopes = travelEnvelope ? [...activeEnvelopes, travelEnvelope] : activeEnvelopes;

  const totalBudget = getWeekTotalBudget(data, weekStart);
  const totalSpent = activeEnvelopes
    .filter(e => !e.isPocketMoney)
    .reduce((s, e) => s + getEnvelopeSpentThisWeek(data.transactions, e.id, weekStart), 0);

  const recentTx = data.transactions.filter(t => t.weekStart === weekStart).slice(0, 6);

  const parsed = spendInput.trim()
    ? parseSpendText(spendInput, activeEnvelopes.filter(e => !e.isPocketMoney))
    : null;

  const effectiveEnvId = selectedEnvId ||
    (parsed?.suggestedEnvelopeName
      ? data.envelopes.find(e => e.name === parsed.suggestedEnvelopeName)?.id ?? '' : '');

  const handleAddSpend = () => {
    if (!parsed || parsed.amount <= 0 || !effectiveEnvId) return;
    addSpend(effectiveEnvId, parsed.amount, parsed.description || spendInput);
    setSpendInput(''); setSelectedEnvId('');
    setSpendSaved(true);
    setTimeout(() => setSpendSaved(false), 1500);
  };

  const envelopeSummary = activeEnvelopes
    .filter(e => !e.isPocketMoney && e.weeklyBudget > 0)
    .map(e => {
      const budget = getWeekBudget(data, e.id, weekStart);
      const spent = getEnvelopeSpentThisWeek(data.transactions, e.id, weekStart);
      return spent / budget;
    });
  const underCount = envelopeSummary.filter(r => r <= 1).length;
  const overCount = envelopeSummary.filter(r => r > 1.1).length;
  const onTarget = envelopeSummary.filter(r => r > 1 && r <= 1.1).length;

  const displayMembers = data.members.filter(m => m.name !== 'Everyone');

  if (showWeekSetup) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#F5E6C8' }}>
        <header className="app-header">
          <span style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.2rem', fontWeight: 700, color: '#F5E6C8' }}>Set up this week</span>
          <button onClick={() => setShowWeekSetup(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'Nunito, sans-serif', fontSize: '0.85rem', color: '#B09070', fontWeight: 700 }}>Cancel</button>
        </header>
        <WeekSetup weekStart={weekStart} onDone={() => setShowWeekSetup(false)} />
        <BottomNav />
      </div>
    );
  }

  return (
    <div style={{ background: '#2A1808', minHeight: '100vh', paddingBottom: 72 }}>

      {/* ── KITCHEN HERO ─────────────────────────────────────────────── */}
      <div style={{
        position: 'relative',
        backgroundImage: 'url(/images/kitchen-hero.avif), url(/images/kitchen-hero.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
        minHeight: 'clamp(220px, 28vw, 360px)',
        display: 'flex',
        alignItems: 'flex-end',
      }}>
        {/* Left: Title + amount box */}
        <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '42%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', padding: 'clamp(12px, 2vw, 24px)' }}>
          {/* Logo / title */}
          <Link href="/how-to-use" style={{ textDecoration: 'none' }}>
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(1.4rem, 3.5vw, 2.8rem)', fontWeight: 700, color: '#3D2B1F', lineHeight: 1.1, textShadow: '0 1px 3px rgba(245,230,200,0.8)' }}>
              The Family Pot
            </div>
            <div style={{ fontFamily: 'Playfair Display, serif', fontStyle: 'italic', fontSize: 'clamp(0.8rem, 1.6vw, 1.2rem)', color: '#6B7A36', marginTop: 2 }}>
              Family Money for the Week
            </div>
          </Link>

          {/* Weekly amount box */}
          <div style={{ marginTop: 'clamp(10px, 1.5vw, 20px)', background: 'rgba(249,240,220,0.94)', border: '2px solid #D4C4A0', borderRadius: 12, padding: 'clamp(10px,1.5vw,16px) clamp(12px,2vw,20px)', boxShadow: '0 4px 16px rgba(61,43,31,0.18)' }}>
            <div style={{ fontFamily: 'Nunito, sans-serif', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#8B6B55', marginBottom: 2 }}>
              This Week's Money
            </div>
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(1.5rem, 3vw, 2.4rem)', fontWeight: 700, color: '#3D2B1F', lineHeight: 1 }}>
              {formatCurrency(totalBudget)}
            </div>
            <div style={{ fontFamily: 'Nunito, sans-serif', fontSize: '0.72rem', color: '#8B6B55', marginTop: 3, marginBottom: 10 }}>
              {formatCurrency(totalBudget - totalSpent)} remaining · {formatWeekRange(weekStart)}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => setShowWeekSetup(true)} style={{ background: '#3D2B1F', color: '#F5E6C8', border: 'none', borderRadius: 8, padding: '7px 14px', fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: '0.78rem', cursor: 'pointer' }}>
                {totalBudget === 0 ? 'Set up week' : 'Edit week'}
              </button>
              <Link href="/sunday">
                <button style={{ background: 'transparent', color: '#5D4033', border: '1.5px solid #C4B490', borderRadius: 8, padding: '7px 12px', fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: '0.78rem', cursor: 'pointer' }}>
                  How Did We Do?
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Centre: Real pot image */}
        <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', bottom: 0, zIndex: 2 }}>
          <picture>
            <source srcSet="/images/pot.avif" type="image/avif" />
            <img src="/images/pot.png" alt="The Family Pot" style={{ height: 'clamp(120px, 18vw, 220px)', width: 'auto', display: 'block' }} />
          </picture>
        </div>

        {/* Family member names under the pot */}
        <div style={{ position: 'absolute', bottom: '6%', left: '50%', transform: 'translateX(-50%)', whiteSpace: 'nowrap', zIndex: 3 }}>
          <div style={{ fontFamily: 'Playfair Display, serif', fontStyle: 'italic', fontSize: 'clamp(0.7rem, 1.4vw, 1rem)', color: '#5D4033', textShadow: '0 1px 4px rgba(245,230,200,0.9)' }}>
            {displayMembers.map((m, i) => (
              <span key={m.id}>
                {i > 0 && <span style={{ color: '#C4B490', margin: '0 5px' }}>·</span>}
                <span style={{ color: m.color }}>{m.name}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Top right: Family photo + clock */}
        <div style={{ position: 'absolute', top: 'clamp(10px,1.5vw,20px)', right: 'clamp(10px,1.5vw,20px)', display: 'flex', alignItems: 'flex-start', gap: 12, zIndex: 4 }}>
          {/* Family photo */}
          <div onClick={() => photoInputRef.current?.click()} style={{ cursor: 'pointer' }}>
            {familyPhoto ? (
              <div style={{ background: '#fff', padding: 4, borderRadius: 3, boxShadow: '2px 3px 10px rgba(0,0,0,0.3)', transform: 'rotate(2deg)', overflow: 'hidden', width: 'clamp(60px,7vw,90px)', height: 'clamp(60px,7vw,90px)' }}>
                <img src={familyPhoto} alt="Family" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              </div>
            ) : (
              <div style={{ width: 'clamp(55px,6vw,80px)', height: 'clamp(55px,6vw,80px)', background: 'rgba(245,230,200,0.75)', border: '2px dashed #C4B490', borderRadius: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C4B490" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" /></svg>
                <span style={{ fontFamily: 'Nunito, sans-serif', fontSize: '0.55rem', fontWeight: 700, color: '#8B6B55', textAlign: 'center', lineHeight: 1.2 }}>Add photo</span>
              </div>
            )}
            <input ref={photoInputRef} type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: 'none' }} />
          </div>
          <StarburstClock />
        </div>

        {/* Week navigator pinned to bottom of hero */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 5 }}>
          <WeekNavigator onSetUpWeek={() => setShowWeekSetup(true)} compact />
        </div>
      </div>

      {/* ── ENVELOPE GRID on timber bench ─────────────────────────────── */}
      <div
        className="envelope-grid"
        style={{
          backgroundImage: 'url(/images/bench-texture.avif), url(/images/bench-texture.png)',
          backgroundSize: 'cover',
        }}
      >
        {allDisplayEnvelopes.map(envelope => {
          const spent = getEnvelopeSpentThisWeek(data.transactions, envelope.id, weekStart);
          const budget = envelope.isTravelFund
            ? (data.travelGoal?.currentAmount ?? 0)
            : getWeekBudget(data, envelope.id, weekStart);
          const href = envelope.isTravelFund ? '/travel' : `/envelope/${envelope.id}`;
          return (
            <EnvelopeCard key={envelope.id} envelope={envelope} spent={spent} budget={budget} href={href} />
          );
        })}
      </div>

      {/* ── FOUR BOTTOM PANELS ─────────────────────────────────────────── */}
      <div className="dashboard-bottom">

        {/* 1. Add Spending */}
        <div className="dash-panel" style={{ background: '#E06010' }}>
          <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(1rem,1.8vw,1.4rem)', fontWeight: 700, color: '#fff', marginBottom: 8 }}>
            Add Spending
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
            <input
              className="pot-input"
              style={{ fontSize: '0.95rem', background: 'rgba(255,255,255,0.15)', border: '1.5px solid rgba(255,255,255,0.35)', color: '#fff', flex: 1 }}
              value={spendInput}
              onChange={e => { setSpendInput(e.target.value); setSelectedEnvId(''); }}
              onKeyDown={e => e.key === 'Enter' && handleAddSpend()}
              placeholder="Type it... or say it..."
            />
            <VoiceInput onTranscript={t => { setSpendInput(t); setSelectedEnvId(''); }} />
          </div>
          <div style={{ fontFamily: 'Nunito, sans-serif', fontSize: '0.68rem', color: 'rgba(255,255,255,0.65)', marginBottom: 8 }}>
            e.g. $10 school disco lollies
          </div>
          <select
            value={effectiveEnvId}
            onChange={e => setSelectedEnvId(e.target.value)}
            style={{ width: '100%', padding: '8px 10px', borderRadius: 8, background: 'rgba(255,255,255,0.15)', border: '1.5px solid rgba(255,255,255,0.35)', color: '#fff', fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: '0.82rem', appearance: 'none', cursor: 'pointer', marginBottom: 10 }}
          >
            <option value="" style={{ background: '#3D2B1F' }}>
              {parsed?.suggestedEnvelopeName ? `Auto → ${parsed.suggestedEnvelopeName}` : 'Choose envelope...'}
            </option>
            {activeEnvelopes.filter(e => !e.isPocketMoney).map(e => (
              <option key={e.id} value={e.id} style={{ background: '#3D2B1F' }}>{e.name}</option>
            ))}
          </select>
          <button
            onClick={handleAddSpend}
            disabled={!spendInput.trim() || !effectiveEnvId || spendSaved}
            style={{ width: '100%', padding: '11px', background: '#3D2B1F', color: '#F5E6C8', border: 'none', borderRadius: 8, fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer', opacity: (!spendInput.trim() || !effectiveEnvId) ? 0.5 : 1 }}
          >
            {spendSaved ? 'Recorded' : 'Enter'}
          </button>
        </div>

        {/* 2. Recent Spending */}
        <div className="dash-panel" style={{ background: '#F9F0DC', borderLeft: '1px solid #D4C4A0' }}>
          <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(1rem,1.5vw,1.2rem)', fontWeight: 700, color: '#3D2B1F', marginBottom: 12 }}>
            Recent Spending
          </div>
          {recentTx.length === 0 ? (
            <div style={{ fontFamily: 'Nunito, sans-serif', fontSize: '0.85rem', color: '#8B6B55', fontStyle: 'italic' }}>Nothing recorded yet this week</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {recentTx.map(tx => {
                const env = data.envelopes.find(e => e.id === tx.envelopeId);
                const daysAgo = Math.floor((Date.now() - new Date(tx.date + 'T12:00:00').getTime()) / 86400000);
                const when = daysAgo === 0 ? 'Today' : daysAgo === 1 ? 'Yesterday' : `${daysAgo}d ago`;
                return (
                  <div key={tx.id} style={{ display: 'flex', alignItems: 'baseline', gap: 8, padding: '6px 0', borderBottom: '1px solid #E8D4A8' }}>
                    <div style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: '0.85rem', color: '#3D2B1F', minWidth: 52 }}>{formatCurrency(tx.amount)}</div>
                    <div style={{ flex: 1, fontFamily: 'Nunito, sans-serif', fontSize: '0.8rem', color: '#3D2B1F', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{tx.description}</div>
                    <div style={{ fontFamily: 'Nunito, sans-serif', fontSize: '0.7rem', fontWeight: 700, color: env?.color ?? '#8B6B55', flexShrink: 0 }}>{env?.name}</div>
                    <div style={{ fontFamily: 'Nunito, sans-serif', fontSize: '0.68rem', color: '#B09070', flexShrink: 0 }}>{when}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 3. How Did We Do — with real TV image */}
        <div className="dash-panel" style={{ background: '#F5EDE8', borderLeft: '1px solid #D4C4A0' }}>
          <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(1rem,1.5vw,1.2rem)', fontWeight: 700, color: '#3D2B1F', marginBottom: 4 }}>
            How Did We Do?
          </div>
          <div style={{ fontFamily: 'Nunito, sans-serif', fontSize: '0.72rem', color: '#8B6B55', marginBottom: 10 }}>
            Week {formatWeekRange(weekStart)}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <picture>
              <source srcSet="/images/vintage-tv.avif" type="image/avif" />
              <img src="/images/vintage-tv.png" alt="Vintage TV" style={{ width: 'clamp(70px,9vw,110px)', height: 'auto', flexShrink: 0 }} />
            </picture>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              {[
                { color: '#6B7A36', label: `Under budget in ${underCount}` },
                { color: '#B84C08', label: `Over by more than $10 in ${overCount}` },
                { color: '#C49A1E', label: `On target in ${onTarget}` },
              ].map(({ color, label }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: color, flexShrink: 0 }} />
                  <span style={{ fontFamily: 'Nunito, sans-serif', fontSize: '0.72rem', color: '#5D4033' }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
          <Link href="/sunday">
            <button style={{ marginTop: 12, background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'Nunito, sans-serif', fontSize: '0.82rem', fontWeight: 800, color: '#E06010', padding: 0 }}>
              See full review →
            </button>
          </Link>
        </div>

        {/* 4. Travel Kitty — with real suitcase image */}
        <div className="dash-panel" style={{ background: '#6B7A36' }}>
          <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(1rem,1.5vw,1.2rem)', fontWeight: 700, color: '#fff', marginBottom: 6 }}>
            Travel Kitty
          </div>
          {data.travelGoal ? (
            <>
              <div style={{ display: 'flex', justifyContent: 'center', margin: '6px 0' }}>
                <picture>
                  <source srcSet="/images/travel-suitcase.avif" type="image/avif" />
                  <img src="/images/travel-suitcase.png" alt="Travel suitcase" style={{ width: 'clamp(70px,9vw,110px)', height: 'auto' }} />
                </picture>
              </div>
              <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(1.3rem,2.5vw,1.8rem)', fontWeight: 700, color: '#fff', textAlign: 'center', lineHeight: 1 }}>
                {formatCurrency(data.travelGoal.currentAmount)}
              </div>
              <div style={{ fontFamily: 'Nunito, sans-serif', fontSize: '0.72rem', color: 'rgba(255,255,255,0.75)', textAlign: 'center', marginBottom: 10 }}>
                Saved for {data.travelGoal.name}
              </div>
              <div style={{ height: 8, background: 'rgba(0,0,0,0.2)', borderRadius: 9999, overflow: 'hidden', marginBottom: 10 }}>
                <div style={{ height: '100%', width: `${Math.min((data.travelGoal.currentAmount / data.travelGoal.targetAmount) * 100, 100)}%`, background: '#fff', borderRadius: 9999 }} />
              </div>
              <Link href="/travel" style={{ textDecoration: 'none', display: 'block' }}>
                <button style={{ width: '100%', padding: '8px', background: '#F9F0DC', color: '#4D5928', border: 'none', borderRadius: 8, fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: '0.82rem', cursor: 'pointer' }}>
                  Add to Travel Kitty
                </button>
              </Link>
            </>
          ) : (
            <Link href="/travel" style={{ textDecoration: 'none' }}>
              <button style={{ marginTop: 8, background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1.5px solid rgba(255,255,255,0.35)', borderRadius: 8, padding: '10px 16px', fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}>
                Set a travel goal
              </button>
            </Link>
          )}
        </div>
      </div>

      {/* Sunday prompt */}
      {isSunday() && (
        <div style={{ padding: '12px 16px 0' }}>
          <Link href="/sunday" style={{ textDecoration: 'none' }}>
            <div style={{ background: '#E06010', borderRadius: 12, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10, boxShadow: '0 3px 12px rgba(224,96,16,0.3)' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#F5E6C8', flexShrink: 0 }} />
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
