import type { Metadata, Viewport } from 'next';
import { Playfair_Display, Nunito } from 'next/font/google';
import './globals.css';
import { FamilyDataProvider } from '@/lib/context';

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
});

const nunito = Nunito({
  subsets: ['latin'],
  weight: ['300', '400', '600', '700', '800'],
  variable: '--font-nunito',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'The Family Pot',
  description: 'A weekly family ritual around money — saving, planning, and spending together.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    title: 'The Family Pot',
    statusBarStyle: 'black-translucent',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#3D2B1F',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-AU" className={`${playfair.variable} ${nunito.variable}`}>
      <body>
        <FamilyDataProvider>
          {children}
        </FamilyDataProvider>
      </body>
    </html>
  );
}
