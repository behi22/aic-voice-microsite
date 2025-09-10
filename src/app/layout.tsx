import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
});
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
  ),
  title: 'AIC – AI Voice Agent Microsite',
  description:
    'Multi-level telephony design (L1 AI prompts → L2 AI agent → L3 human) with clear system design, built in React/Next.js, styled using alexic.ca theme variables.',
  applicationName: 'AIC Voice Agent',
  authors: [{ name: 'Behbod Babai' }],
  keywords: [
    'AI Voice',
    'IVR',
    'ASR',
    'TTS',
    'RAG',
    'Next.js',
    'React',
    'TypeScript',
    'AWS',
  ],
  openGraph: {
    title: 'AIC – AI Voice Agent Microsite',
    description:
      'Production-grade voice agent for restaurants with multi-level call flow and JD-aligned stack.',
    url: '/',
    siteName: 'AIC Voice Agent',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'AIC Voice Agent Architecture',
      },
    ],
    locale: 'en_CA',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AIC – AI Voice Agent Microsite',
    description:
      'Multi-level telephony design (L1→L2→L3), live code previews, alexic.ca brand theme.',
    images: ['/og.png'],
  },
  icons: { icon: '/favicon.ico' },
};

export const viewport: Viewport = {
  themeColor: '#0a0e27',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
