'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useFamilyData } from '@/lib/context';
import {
  getEnvelopeSpentThisWeek, getWeekBudget, getWeekTotalBudget,
  isSunday, formatWeekRange,
} from '@/lib/storage';
import { formatCurrency, parseSpendText } from '@/lib/categorizer';
import WeekSetup from '@/components/WeekSetup';
import VoiceInput from '@/components/VoiceInput';
import BottomNav from '@/components/BottomNav';

// Alternate flap images so no two adjacent envelopes share a pattern
const FLAP_IMAGES = [
  'flap-orange1',  // 0 Food       — orange botanical leaf
  'flap-green',    // 1 Petrol     — dark green flowers
  'flap-yellow1',  // 2 Entertain  — mustard sunflower
  'flap-green1',   // 3 School     — sage leaf
  'flap-yellow',   // 4 Household  — orange star geometric
  'flap-orange',   // 5 Personal   — golden diamond
  'flap-orange1',  // 6 Gifts      — (add brown when ready)
  'flap-green1',   // 7 Travel     — sage leaf
];

// PNG only — ensures transparency works (AVIF alpha support varies by source)
function flapImg(order: number) {
  return `/images/${FLAP_IMAGES[order % FLAP_IMAGES.length]}.png`;
}

// Starburst ornament used in panels
function Starburst({ size = 18, color = 'rgba(255,255,255,0.55)' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18">
      {[0, 45, 90, 135].map(a => {
        const r = a * Math.PI / 180;
        return <line key={a} x1={9 + Math.cos(r) * 7} y1={9 + Math.sin(r) * 7} x2={9 - Math.cos(r) * 7} y2={9 - Math.sin(r) * 7} stroke={color} strokeWidth="1.5" strokeLinecap="round" />;
      })}
    </svg>
  );
}

// ── Envelope card ─────────────────────────────────────────────────────────────
function EnvelopeCard({ envelope, spent, budget, href }: {
  envelope: { id: string; name: string; color: string; isTravelFund: boolean; isPocketMoney: boolean; order: number };
  spent: number; budget: number; href: string;
}) {
  const remaining = envelope.isTravelFund ? budget : budget - spent;
  const isOver = !envelope.isTravelFund && remaining < 0;
  const pct = budget > 0 ? Math.min((spent / budget) * 100, 100) : 0;

  return (
    <Link href={href} style={{ textDecoration: 'none', display: 'block' }}>
      {/*
        Warm cream card — blends naturally with the bench.
        Once envelopes are re-exported with real transparent backgrounds
        (PNG-24 with alpha), remove this wrapper and use drop-shadow only.
      */}
      <div
        style={{
          position: 'relative',
          cursor: 'pointer',
          transition: 'transform 0.12s',
        }}
        onPointerDown={e => (e.currentTarget as HTMLElement).style.transform = 'scale(0.97)'}
        onPointerUp={e => (e.currentTarget as HTMLElement).style.transform = 'scale(1)'}
        onPointerLeave={e => (e.currentTarget as HTMLElement).style.transform = 'scale(1)'}
      >
        {/* Full transparent envelope image — drop-shadow follows shape */}
        <picture>
          <source srcSet={`/images/${FLAP_IMAGES[envelope.order % FLAP_IMAGES.length]}.avif`} type="image/avif" />
          <img
            src={flapImg(envelope.order)}
            alt={envelope.name}
            style={{ width: '100%', display: 'block', filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.45))' }}
          />
        </picture>

        {/* Text centred in the cream body (lower ~55% of the full-envelope image) */}
        <div style={{
          position: 'absolute',
          top: '48%',
          bottom: '6%',
          left: '8%',
          right: '8%',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{
            fontFamily: 'Playfair Display, serif',
            fontWeight: 700,
            fontSize: 'clamp(0.88rem, 1.2vw, 0.95rem)',
            color: '#3D2B1F',
            marginBottom: 2,
          }}>
            {envelope.name}
            {envelope.isPocketMoney && (
              <span style={{ fontFamily: 'Nunito, sans-serif', fontSize: '0.68rem', color: '#8B6B55', fontWeight: 400, display: 'block' }}>Pocket Money</span>
            )}
          </div>
          <div style={{
            fontFamily: 'Nunito, sans-serif',
            fontWeight: 800,
            fontSize: 'clamp(1.2rem, 1.8vw, 1.4rem)',
            color: isOver ? '#B84C08' : '#3D2B1F',
            lineHeight: 1,
          }}>
            {formatCurrency(Math.abs(remaining))}
          </div>
          <div style={{ fontFamily: 'Nunito, sans-serif', fontSize: '0.72rem', color: '#5D4033', marginTop: 1 }}>
            {envelope.isTravelFund ? 'saved so far' : isOver ? 'over budget' : `left of ${formatCurrency(budget)}`}
          </div>
        </div>
      </div>
    </Link>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function HomePage() {
  const { data, isLoaded, selectedWeekStart, addSpend } = useFamilyData();
  const [showWeekSetup, setShowWeekSetup] = useState(false);
  const [spendInput, setSpendInput] = useState('');
  const [selectedEnvId, setSelectedEnvId] = useState('');
  const [spendSaved, setSpendSaved] = useState(false);

  if (!isLoaded) return null;

  const weekStart = selectedWeekStart;
  const activeEnvelopes = data.envelopes.filter(e => !e.isTravelFund).sort((a, b) => a.order - b.order);
  const travelEnvelope = data.envelopes.find(e => e.isTravelFund);
  const allDisplayEnvelopes = travelEnvelope ? [...activeEnvelopes, travelEnvelope] : activeEnvelopes;

  const totalBudget = getWeekTotalBudget(data, weekStart);
  const totalSpent = activeEnvelopes.filter(e => !e.isPocketMoney)
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

  // How did we do stats
  const envelopeSummary = activeEnvelopes.filter(e => !e.isPocketMoney && e.weeklyBudget > 0).map(e => {
    const b = getWeekBudget(data, e.id, weekStart);
    const s = getEnvelopeSpentThisWeek(data.transactions, e.id, weekStart);
    return b > 0 ? s / b : 0;
  });
  const underCount = envelopeSummary.filter(r => r <= 1).length;
  const overCount = envelopeSummary.filter(r => r > 1.1).length;
  const onTarget = envelopeSummary.filter(r => r > 1 && r <= 1.1).length;
  const tvMessage = overCount === 0 ? ['Great', 'week!'] : ['Good work', 'this week!'];

  // Week end date for "How Did We Do"
  const weekEndDate = new Date(weekStart + 'T12:00:00');
  weekEndDate.setDate(weekEndDate.getDate() + 6);
  const weekEndLabel = weekEndDate.toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' });

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
        minHeight: 'clamp(240px, 30vw, 380px)',
      }}>
        {/* Left: title + members only */}
        <div className="hero-week-col">
          <Link href="/how-to-use" style={{ textDecoration: 'none' }}>
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(1.6rem, 3.8vw, 3rem)', fontWeight: 700, color: '#3D2B1F', lineHeight: 1.05, textShadow: '0 1px 3px rgba(245,230,200,0.9)' }}>
              The Family Pot
            </div>
            <div style={{ fontFamily: 'Playfair Display, serif', fontStyle: 'italic', fontSize: 'clamp(0.85rem, 1.6vw, 1.25rem)', color: '#6B7A36', marginTop: 3 }}>
              Family Money for the Week
            </div>
          </Link>
          {displayMembers.length > 0 && (
            <div style={{ fontFamily: 'Playfair Display, serif', fontStyle: 'italic', fontSize: 'clamp(0.65rem, 1vw, 0.85rem)', color: '#5D4033', marginTop: 6, textShadow: '0 1px 3px rgba(245,230,200,0.9)' }}>
              {displayMembers.map((m, i) => (
                <span key={m.id}>
                  {i > 0 && <span style={{ color: '#C4B490', margin: '0 4px' }}>·</span>}
                  <span style={{ color: m.color }}>{m.name}</span>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Pot is baked into kitchen-hero.png */}
      </div>

      {/* ── ADD SPENDING — compact orange panel ──────────────────────── */}
      <div style={{
        backgroundImage: 'linear-gradient(rgba(0,0,0,0.38), rgba(0,0,0,0.38)), url(/images/panel-bg-spending.avif), url(/images/panel-bg-spending.png)',
        backgroundSize: 'cover',
        position: 'relative',
      }}>
        {/* Ornaments */}
        <div style={{ position: 'absolute', top: 12, left: 14 }}><Starburst /></div>
        <div style={{ position: 'absolute', top: 12, right: 14 }}><Starburst /></div>

        {/* Week summary row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, padding: '10px 40px 0', flexWrap: 'wrap' }}>
          <span style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(1rem, 2vw, 1.4rem)', fontWeight: 700, color: '#fff' }}>
            {formatCurrency(totalBudget)}
          </span>
          <span style={{ fontFamily: 'Nunito, sans-serif', fontSize: '0.75rem', color: 'rgba(255,255,255,0.75)' }}>
            {formatCurrency(totalBudget - totalSpent)} remaining · {formatWeekRange(weekStart)}
          </span>
          <button onClick={() => setShowWeekSetup(true)} style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.35)', borderRadius: 6, padding: '4px 10px', fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: '0.72rem', cursor: 'pointer' }}>
            {totalBudget === 0 ? 'Set up week' : 'Edit week'}
          </button>
        </div>

        {/* Input row */}
        <div style={{ maxWidth: 700, margin: '0 auto', padding: '8px 20px 12px' }}>
          <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(0.95rem, 1.5vw, 1.2rem)', fontWeight: 700, color: '#fff', marginBottom: 6, textAlign: 'center' }}>
            Add Spending
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
            <input
              style={{
                flex: 1, padding: '9px 14px', borderRadius: 9999,
                background: 'rgba(255,255,255,0.18)', border: '1.5px solid rgba(255,255,255,0.3)',
                color: '#fff', fontFamily: 'Playfair Display, serif', fontStyle: 'italic',
                fontSize: 'clamp(0.9rem, 1.2vw, 1.05rem)', outline: 'none',
              }}
              value={spendInput}
              onChange={e => { setSpendInput(e.target.value); setSelectedEnvId(''); }}
              onKeyDown={e => e.key === 'Enter' && handleAddSpend()}
              placeholder="Type it... or say it..."
            />
            <VoiceInput onTranscript={t => { setSpendInput(t); setSelectedEnvId(''); }} />
          </div>
          <div style={{ fontFamily: 'Nunito, sans-serif', fontSize: '0.65rem', color: 'rgba(255,255,255,0.55)', marginBottom: 6 }}>
            e.g. $10 lolly school disco
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <select
              value={effectiveEnvId}
              onChange={e => setSelectedEnvId(e.target.value)}
              style={{
                flex: 1, padding: '8px 12px', borderRadius: 8,
                background: 'rgba(255,255,255,0.15)', border: '1.5px solid rgba(255,255,255,0.3)',
                color: '#fff', fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: '0.82rem',
                appearance: 'none', cursor: 'pointer',
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='rgba(255,255,255,0.6)'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center',
              }}
            >
              <option value="" style={{ background: '#3D2B1F' }}>
                {parsed?.suggestedEnvelopeName ? `Auto → ${parsed.suggestedEnvelopeName}` : 'Let the Pot decide...'}
              </option>
              {activeEnvelopes.filter(e => !e.isPocketMoney).map(e => (
                <option key={e.id} value={e.id} style={{ background: '#3D2B1F' }}>{e.name}</option>
              ))}
            </select>
            <button
              onClick={handleAddSpend}
              disabled={!spendInput.trim() || !effectiveEnvId || spendSaved}
              style={{
                padding: '8px 22px', background: '#4D5928', color: '#F5E6C8',
                border: 'none', borderRadius: 8, fontFamily: 'Nunito, sans-serif',
                fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer', whiteSpace: 'nowrap',
                opacity: (!spendInput.trim() || !effectiveEnvId) ? 0.55 : 1,
                boxShadow: '0 3px 0 #3A4018',
              }}
            >
              {spendSaved ? 'Recorded ✓' : 'Enter'}
            </button>
          </div>
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
          return <EnvelopeCard key={envelope.id} envelope={envelope} spent={spent} budget={budget} href={href} />;
        })}
      </div>

      {/* ── THREE BOTTOM PANELS ────────────────────────────────────────── */}
      <div className="dashboard-bottom">

        {/* 1. RECENT SPENDING — parchment texture */}
        <div className="dash-panel" style={{
          backgroundImage: 'url(/images/panel-bg-parchment.avif), url(/images/panel-bg-parchment.png)',
          backgroundSize: 'cover',
          borderLeft: '1px solid #C4A878',
        }}>
          <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(1rem, 1.5vw, 1.25rem)', fontWeight: 700, color: '#3D2B1F', marginBottom: 4 }}>
            Recent Spending
          </div>
          <div style={{ height: 1, background: '#C4B490', marginBottom: 10 }} />
          {recentTx.length === 0 ? (
            <div style={{ fontFamily: 'Nunito, sans-serif', fontSize: '0.85rem', color: '#8B6B55', fontStyle: 'italic' }}>Nothing recorded yet this week</div>
          ) : (
            recentTx.map(tx => {
              const env = data.envelopes.find(e => e.id === tx.envelopeId);
              const daysAgo = Math.floor((Date.now() - new Date(tx.date + 'T12:00:00').getTime()) / 86400000);
              const when = daysAgo === 0 ? 'Today' : daysAgo === 1 ? 'Yesterday' : `${daysAgo}d ago`;
              return (
                <div key={tx.id} style={{ display: 'flex', alignItems: 'baseline', gap: 8, padding: '6px 0', borderBottom: '1px solid #E8D4A8' }}>
                  <div style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: '0.85rem', color: '#3D2B1F', minWidth: 54 }}>{formatCurrency(tx.amount)}</div>
                  <div style={{ flex: 1, fontFamily: 'Nunito, sans-serif', fontSize: '0.8rem', color: '#3D2B1F', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{tx.description}</div>
                  <div style={{ fontFamily: 'Nunito, sans-serif', fontSize: '0.7rem', fontWeight: 700, color: env?.color ?? '#8B6B55', flexShrink: 0 }}>{env?.name}</div>
                  <div style={{ fontFamily: 'Nunito, sans-serif', fontSize: '0.65rem', color: '#B09070', flexShrink: 0, minWidth: 44, textAlign: 'right' }}>{when}</div>
                </div>
              );
            })
          )}
        </div>

        {/* 3. HOW DID WE DO — parchment texture */}
        <div className="dash-panel" style={{
          backgroundImage: 'url(/images/panel-bg-parchment.avif), url(/images/panel-bg-parchment.png)',
          backgroundSize: 'cover',
          borderLeft: '1px solid #C4A878',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(1rem, 1.5vw, 1.25rem)', fontWeight: 700, color: '#3D2B1F' }}>
              How Did We Do?
            </div>
            <div style={{ flex: 1, height: 1, background: '#C4B490' }} />
          </div>
          <div style={{ fontFamily: 'Nunito, sans-serif', fontSize: '0.72rem', color: '#8B6B55', marginBottom: 12 }}>
            Week ending {weekEndLabel}
          </div>

          <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
            {/* TV with message on screen */}
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <picture>
                <source srcSet="/images/vintage-tv.avif" type="image/avif" />
                <img src="/images/vintage-tv.png" alt="Vintage TV" style={{ width: 'clamp(120px, 18vw, 190px)', height: 'auto', display: 'block', mixBlendMode: 'multiply' }} />
              </picture>
              {/* Text overlaid on TV screen */}
              <div style={{
                position: 'absolute',
                top: '18%', left: '8%', width: '57%',
                textAlign: 'center',
                fontFamily: 'Georgia, serif',
                fontStyle: 'italic',
                fontSize: 'clamp(0.5rem, 0.8vw, 0.68rem)',
                color: '#E8C050',
                lineHeight: 1.35,
                pointerEvents: 'none',
              }}>
                {tvMessage[0]}<br />{tvMessage[1]}
              </div>
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              {[
                { color: '#6B7A36', label: `Stayed under in ${underCount} envelopes` },
                { color: '#B84C08', label: `Over by more than $10 in ${overCount}` },
                { color: '#C49A1E', label: `On target in ${onTarget}` },
              ].map(({ color, label }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <div style={{ width: 11, height: 11, borderRadius: '50%', background: color, flexShrink: 0 }} />
                  <span style={{ fontFamily: 'Nunito, sans-serif', fontSize: 'clamp(0.68rem, 0.9vw, 0.78rem)', color: '#5D4033' }}>{label}</span>
                </div>
              ))}
            </div>
          </div>

          <Link href="/sunday">
            <button style={{ marginTop: 12, background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'Nunito, sans-serif', fontSize: '0.85rem', fontWeight: 800, color: '#E06010', padding: 0 }}>
              See full review →
            </button>
          </Link>
        </div>

        {/* 4. TRAVEL KITTY — suitcase left, amount right */}
        <div className="dash-panel" style={{ background: '#6B7A36' }}>
          <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(1rem, 1.5vw, 1.25rem)', fontWeight: 700, color: '#fff', marginBottom: 4 }}>
            Travel Kitty
          </div>
          <div style={{ height: 1, background: 'rgba(255,255,255,0.25)', marginBottom: 12 }} />

          {data.travelGoal ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                {/* Suitcase — no white box, drop-shadow follows shape */}
                <picture>
                  <source srcSet="/images/travel-suitcase.avif" type="image/avif" />
                  <img src="/images/travel-suitcase.png" alt="Travel suitcase" style={{ width: 'clamp(65px,9vw,100px)', height: 'auto', mixBlendMode: 'multiply' }} />
                </picture>
                <div>
                  <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(1.3rem, 2.5vw, 2rem)', fontWeight: 700, color: '#fff', lineHeight: 1 }}>
                    {formatCurrency(data.travelGoal.currentAmount)}
                  </div>
                  <div style={{ fontFamily: 'Nunito, sans-serif', fontSize: '0.75rem', color: 'rgba(255,255,255,0.75)', marginTop: 4 }}>
                    Saved for our<br />next adventure!
                  </div>
                </div>
              </div>
              <div style={{ height: 8, background: 'rgba(0,0,0,0.2)', borderRadius: 9999, overflow: 'hidden', marginBottom: 10 }}>
                <div style={{ height: '100%', width: `${Math.min((data.travelGoal.currentAmount / data.travelGoal.targetAmount) * 100, 100)}%`, background: '#fff', borderRadius: 9999 }} />
              </div>
              <Link href="/travel" style={{ textDecoration: 'none', display: 'block' }}>
                <button style={{ width: '100%', padding: '9px', background: '#F9F0DC', color: '#4D5928', border: 'none', borderRadius: 8, fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer' }}>
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
            <div style={{ background: '#E06010', borderRadius: 12, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
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
