'use client';

import Link from 'next/link';
import BottomNav from '@/components/BottomNav';

const steps = [
  {
    number: 1,
    title: 'Pick your Sunday',
    body: [
      'Every family needs a starting point. Pick a Sunday — this one, or the next one — and gather everyone around the table.',
      'It only takes about 10 minutes. Put the kettle on.',
      'If today is not Sunday, you can still fill the envelopes now and be ready when Sunday comes.',
    ],
    tip: null,
  },
  {
    number: 2,
    title: 'How much is in the pot?',
    body: [
      'Before filling the envelopes, decide together how much money is available this week.',
      'It might be a weekly wage, a fortnightly transfer, or just what feels right for your family. There is no correct answer. It changes week to week. That is the point.',
    ],
    tip: 'Example: $850 available this week',
  },
  {
    number: 3,
    title: 'Fill the envelopes',
    body: [
      'Divide the pot across your envelopes. Every dollar should have a home before the week begins.',
      'Start with the necessities — food, petrol, household. Then the things that matter to your family: school, entertainment, personal spending.',
      'Whatever is left can go straight into the Travel Fund.',
    ],
    tip: 'You do not have to fill every envelope. Only create the ones that make sense for your family.',
  },
  {
    number: 4,
    title: 'Have a great week',
    body: [
      'The envelopes are set. Go and live your week.',
      'When anyone in the family spends money — anything at all, even a $2 milk from the servo — record it in The Family Pot. No matter how small.',
      'The more honestly you record, the more useful next Sunday becomes.',
    ],
    tip: null,
  },
];

export default function HowToUsePage() {
  return (
    <div className="page">
      {/* Header */}
      <header className="app-header">
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#B09070" strokeWidth="2.5" strokeLinecap="round">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          <span style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.1rem', fontWeight: 700, color: '#F5E6C8' }}>
            The Family Pot
          </span>
        </Link>
      </header>

      <div style={{ maxWidth: 480, margin: '0 auto' }}>

        {/* Hero */}
        <div style={{
          padding: '36px 24px 32px',
          background: 'linear-gradient(180deg, #EDD9B0 0%, #F5E6C8 100%)',
          borderBottom: '1px solid #D4C4A0',
          textAlign: 'center',
        }}>
          {/* Pot illustration */}
          <svg width="72" height="72" viewBox="0 0 140 138" fill="none" style={{ display: 'block', margin: '0 auto 20px' }}>
            <defs>
              <linearGradient id="hw-lid" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#E8E8E8" />
                <stop offset="100%" stopColor="#A0A0A0" />
              </linearGradient>
              <linearGradient id="hw-body" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#F07820" />
                <stop offset="100%" stopColor="#B84C08" />
              </linearGradient>
            </defs>
            <ellipse cx="70" cy="112" rx="48" ry="10" fill="#3D2B1F" opacity="0.12" />
            <path d="M22 52 Q18 100 70 108 Q122 108 118 52 Z" fill="url(#hw-body)" />
            <path d="M30 60 Q40 54 60 52" stroke="rgba(255,255,255,0.28)" strokeWidth="3" strokeLinecap="round" />
            <g transform="translate(26,74)">
              <rect x="0" y="0" width="18" height="18" rx="2" fill="#CC2020" stroke="#7A1820" strokeWidth="1.5" />
              <path d="M9 3 L12 9 L9 15 L6 9 Z" fill="#7A1820" />
              <circle cx="9" cy="9" r="2" fill="#CC2020" />
            </g>
            <g transform="translate(50,74)">
              <rect x="0" y="0" width="18" height="18" rx="2" fill="#CC2020" stroke="#7A1820" strokeWidth="1.5" />
              <path d="M9 2 Q13 9 9 16 Q5 9 9 2 Z" fill="#7A1820" />
              <circle cx="9" cy="9" r="2.5" fill="#E06010" />
            </g>
            <g transform="translate(74,74)">
              <rect x="0" y="0" width="18" height="18" rx="2" fill="#CC2020" stroke="#7A1820" strokeWidth="1.5" />
              <path d="M9 3 L12 9 L9 15 L6 9 Z" fill="#7A1820" />
              <circle cx="9" cy="9" r="2" fill="#CC2020" />
            </g>
            <path d="M22 68 Q10 68 10 76 Q10 84 22 82" stroke="#B84C08" strokeWidth="7" strokeLinecap="round" fill="none" />
            <path d="M118 68 Q130 68 130 76 Q130 84 118 82" stroke="#B84C08" strokeWidth="7" strokeLinecap="round" fill="none" />
            <path d="M22 68 Q10 68 10 76 Q10 84 22 82" stroke="#E06010" strokeWidth="4" strokeLinecap="round" fill="none" />
            <path d="M118 68 Q130 68 130 76 Q130 84 118 82" stroke="#E06010" strokeWidth="4" strokeLinecap="round" fill="none" />
            <ellipse cx="70" cy="48" rx="46" ry="11" fill="#A0A0A0" />
            <ellipse cx="70" cy="46" rx="46" ry="11" fill="url(#hw-lid)" />
            <path d="M36 42 Q55 39 84 41" stroke="rgba(255,255,255,0.45)" strokeWidth="2" strokeLinecap="round" />
            <ellipse cx="70" cy="27" rx="10" ry="5" fill="#333" />
          </svg>

          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.9rem', fontWeight: 700, color: '#3D2B1F', marginBottom: 12, lineHeight: 1.2 }}>
            How The Family Pot works
          </h1>
          <p style={{ fontFamily: 'Nunito, sans-serif', fontSize: '1rem', color: '#5D4033', lineHeight: 1.65, margin: 0 }}>
            A weekly ritual. Ten minutes on Sunday. A whole week of knowing exactly where your family stands.
          </p>
        </div>

        {/* Steps */}
        <div style={{ padding: '32px 20px' }}>
          {steps.map((step, idx) => (
            <div key={step.number} style={{ marginBottom: idx < steps.length - 1 ? 40 : 0 }}>

              {/* Step header */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 14 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: '50%',
                  background: '#E06010', color: '#fff', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'Playfair Display, serif', fontSize: '1.2rem', fontWeight: 700,
                  boxShadow: '0 3px 0 #904008',
                }}>
                  {step.number}
                </div>
                <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.4rem', fontWeight: 700, color: '#3D2B1F', margin: '8px 0 0', lineHeight: 1.2 }}>
                  {step.title}
                </h2>
              </div>

              {/* Body */}
              <div style={{ paddingLeft: 60 }}>
                {step.body.map((para, i) => (
                  <p key={i} style={{ fontFamily: 'Nunito, sans-serif', fontSize: '0.97rem', color: '#5D4033', lineHeight: 1.7, margin: i > 0 ? '12px 0 0' : 0 }}>
                    {para}
                  </p>
                ))}

                {/* Tip card */}
                {step.tip && (
                  <div style={{
                    marginTop: 14,
                    background: '#F9F0DC',
                    border: '1.5px solid #D4C4A0',
                    borderLeft: '4px solid #E06010',
                    borderRadius: '0 10px 10px 0',
                    padding: '10px 14px',
                    fontFamily: 'Playfair Display, serif',
                    fontStyle: 'italic',
                    fontSize: '0.95rem',
                    color: '#3D2B1F',
                  }}>
                    {step.tip}
                  </div>
                )}
              </div>

              {/* Connector line */}
              {idx < steps.length - 1 && (
                <div style={{ paddingLeft: 21, paddingTop: 16 }}>
                  <div style={{ width: 2, height: 24, background: 'linear-gradient(180deg, #E06010, #D4C4A0)', borderRadius: 1 }} />
                </div>
              )}
            </div>
          ))}

          {/* See you next Sunday */}
          <div style={{
            marginTop: 44,
            background: '#3D2B1F',
            borderRadius: 16,
            padding: '28px 24px',
            textAlign: 'center',
          }}>
            <div style={{ fontFamily: 'Playfair Display, serif', fontStyle: 'italic', fontSize: '1.5rem', fontWeight: 700, color: '#F5E6C8', marginBottom: 12 }}>
              See you next Sunday.
            </div>
            <p style={{ fontFamily: 'Nunito, sans-serif', fontSize: '0.92rem', color: '#B09070', lineHeight: 1.65, margin: 0 }}>
              When Sunday comes around again, your family will see how each envelope tracked, where you spent more than expected, where you saved, and how much can go into the Travel Fund.
            </p>
            <p style={{ fontFamily: 'Nunito, sans-serif', fontSize: '0.92rem', color: '#B09070', lineHeight: 1.65, margin: '12px 0 0' }}>
              Then you do it again.
            </p>
            <div style={{ marginTop: 20, fontFamily: 'Playfair Display, serif', fontStyle: 'italic', fontSize: '0.9rem', color: '#8B6B55' }}>
              Every Sunday. Same time. Same pot.
            </div>
          </div>

          {/* CTA */}
          <div style={{ marginTop: 28 }}>
            <Link href="/" style={{ textDecoration: 'none', display: 'block' }}>
              <button className="btn-primary">
                Start here — go to The Family Pot
              </button>
            </Link>
            <Link href="/setup" style={{ textDecoration: 'none', display: 'block', marginTop: 10 }}>
              <button className="btn-ghost" style={{ width: '100%' }}>
                Set up your family first
              </button>
            </Link>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, #D4C4A0, transparent)', margin: '0 20px' }} />

        {/* Legal & Privacy footnotes */}
        <div style={{ padding: '28px 20px 16px' }}>
          <div style={{ fontFamily: 'Nunito, sans-serif', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#B09070', marginBottom: 16 }}>
            Privacy &amp; Legal
          </div>

          {[
            {
              heading: 'Your data stays on your device',
              body: 'The Family Pot stores everything locally in your browser or device. Nothing is sent to any server. There are no accounts, no cloud backup, and no third parties with access to your family\'s financial information. Your data is yours.',
            },
            {
              heading: 'Not a financial product',
              body: 'The Family Pot is a family planning tool, not a financial product. It is not a bank, a credit provider, a fund manager, or a financial adviser. Nothing in this application constitutes financial advice. Your family\'s financial decisions are entirely your own.',
            },
            {
              heading: 'No warranty',
              body: 'The Family Pot is provided as-is, without warranty of any kind, express or implied. The creators accept no liability for any decisions made based on information displayed in the app.',
            },
            {
              heading: 'Clearing your data',
              body: 'You can clear all family data at any time from Settings. Clearing your browser\'s local storage or uninstalling the app will also permanently remove all data. There is no recovery option as data is not backed up to any server.',
            },
            {
              heading: 'Children\'s privacy',
              body: 'This app may be used by children under parental supervision. No personal information is collected, transmitted, or stored outside of the device. The pocket money feature is intended for use by parents with their children.',
            },
          ].map(({ heading, body }) => (
            <div key={heading} style={{ marginBottom: 16 }}>
              <div style={{ fontFamily: 'Nunito, sans-serif', fontSize: '0.75rem', fontWeight: 700, color: '#5D4033', marginBottom: 4 }}>
                {heading}
              </div>
              <p style={{ fontFamily: 'Nunito, sans-serif', fontSize: '0.72rem', color: '#8B6B55', lineHeight: 1.6, margin: 0 }}>
                {body}
              </p>
            </div>
          ))}

          <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid #E8D4A8', fontFamily: 'Nunito, sans-serif', fontSize: '0.68rem', color: '#B09070', textAlign: 'center', lineHeight: 1.6 }}>
            The Family Pot is an independent family tool. It is not affiliated with any bank, government agency, or financial institution. All Australian school term dates are approximate and sourced from state education department websites — verify current dates with your state&apos;s education department.
          </div>
        </div>

      </div>
      <BottomNav />
    </div>
  );
}
