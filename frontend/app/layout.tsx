import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/react'
import { Inter } from 'next/font/google';
import NavBar from '@/components/NavBar';
import './globals.css';

export const metadata: Metadata = {
  title: 'Hakan Pandizot - Yüksek Teknoloji Araç Ses Sistemleri',
  description: 'Modern araç ses sistemleri için özelleştirilmiş e-ticaret platformu. Aracınıza özel hoparlör ve tiz kombinasyonları ile mükemmel ses deneyimi.',
  keywords: 'hakan pandizot, araç ses sistemi, hoparlör, tiz, özelleştirme, e-ticaret',
  openGraph: {
    title: 'Hakan Pandizot',
    description: 'Özel araç ses sistemlerinizi tasarlayın ve satın alın.',
    images: '/og-image.jpg',
    siteName: 'Hakan Pandizot',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hakan Pandizot',
    description: 'Özel araç ses sistemlerinizi tasarlayın ve satın alın.',
    images: '/twitter-image.jpg',
  },
};

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className={inter.className}>
        <NavBar />
        <main className="min-h-screen pt-16"> {/* Offset for fixed nav */}
          {children}
        </main>
      <Analytics />
    </body>
  </html>
  );
}