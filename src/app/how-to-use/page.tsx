'use client';

import Link from 'next/link';
import BottomNav from '@/components/BottomNav';

const steps = [
  {
    number: 1,
    title: 'Sunday at 5pm — gather around',
    body: [
      'The Family Pot week runs from Sunday at 5pm to the following Sunday at 5pm. That half-hour before dinner is your family\'s money moment.',
      'Gather everyone around the table. It only takes about 10 minutes. Put the kettle on.',
      'You can fill the envelopes any time before Sunday — but Sunday evening is when you review the week past and plan the week ahead together.',
    ],
    tip: 'Week runs: Sunday 5pm → Sunday 5pm',
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
          <img src="/images/pot.png" alt="The Family Pot" style={{ width: 120, height: 'auto', display: 'block', margin: '0 auto 20px' }} />

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
