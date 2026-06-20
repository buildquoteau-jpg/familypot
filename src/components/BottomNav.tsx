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
    svgPath: 'M3 12l9-9 9 9M5 10v9a1 1 0 001 1h4v-5h4v5h4a1 1 0 001-1v-9',
  },
  {
    href: '/pocket-money',
    label: 'Pocket',
    svgPath: 'M12 8c-2.2 0-4 1.3-4 3s1.8 3 4 3 4-1.3 4-3-1.8-3-4-3zM6 12H3M21 12h-3M12 3v2M12 19v2',
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
            width="20"
            height="20"
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
