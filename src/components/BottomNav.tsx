'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  {
    href: '/',
    label: 'Spend',
    svgPath: 'M12 5v14M5 12h14',
  },
  {
    href: '/envelopes',
    label: 'Envelopes',
    svgPath: 'M3 7h18M3 7c0-1.1.9-2 2-2h14a2 2 0 012 2M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7M8 12h8',
  },
  {
    href: '/sunday',
    label: 'Sunday',
    svgPath: 'M12 3v1M12 20v1M4.2 6.2l.7.7M19.1 19.1l.7.7M3 12h1M20 12h1M4.9 17.8l.7-.7M18.4 4.9l.7-.7M12 7a5 5 0 100 10A5 5 0 0012 7z',
  },
  {
    href: '/travel',
    label: 'Travel',
    svgPath: 'M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h11a2 2 0 012 2v3M14 21h7m-3.5-3.5L21 21l-3.5-3.5M9 17v1a3 3 0 006 0v-1',
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <nav className="bottom-nav">
      {navItems.map(item => (
        <Link
          key={item.href}
          href={item.href}
          className={`bottom-nav-item ${isActive(item.href) ? 'active' : ''}`}
          aria-label={item.label}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke={isActive(item.href) ? '#E87828' : '#8B6B55'}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d={item.svgPath} />
          </svg>
          <span className="bottom-nav-label">{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}
