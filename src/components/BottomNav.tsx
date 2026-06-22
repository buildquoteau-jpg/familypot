'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/',             label: 'This Week'    },
  { href: '/sunday',       label: 'History'      },
  { href: '/envelopes',    label: 'Envelopes'    },
  { href: '/travel',       label: 'Travel Kitty' },
  { href: '/setup',        label: 'Settings'     },
];

function Starburst() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" style={{ marginRight: 5 }}>
      {[0, 45, 90, 135].map(a => {
        const r = a * Math.PI / 180;
        return <line key={a} x1={6 + Math.cos(r) * 5} y1={6 + Math.sin(r) * 5} x2={6 - Math.cos(r) * 5} y2={6 - Math.sin(r) * 5} stroke="#F5E6C8" strokeWidth="1.2" strokeLinecap="round" />;
      })}
    </svg>
  );
}

export default function BottomNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <nav className="bottom-nav">
      {navItems.map((item, i) => {
        const active = isActive(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`bottom-nav-item ${active ? 'active' : ''}`}
            style={{
              borderLeft: i > 0 ? '1px solid rgba(255,255,255,0.08)' : 'none',
              flexDirection: 'row',
              gap: 0,
            }}
            aria-label={item.label}
          >
            {active && item.href === '/' && <Starburst />}
            <span style={{
              fontFamily: 'Nunito, sans-serif',
              fontWeight: active ? 800 : 600,
              fontSize: 'clamp(0.55rem, 1vw, 0.75rem)',
              color: active ? '#E87828' : '#8B6B55',
              letterSpacing: '0.03em',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
            }}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
