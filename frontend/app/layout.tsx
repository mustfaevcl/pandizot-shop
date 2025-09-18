import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import NavBar from '@/components/NavBar';
import './globals.css';

export const metadata: Metadata = {
  title: 'Pandizot Shop - Özel Araç Ses Sistemleri',
  description: 'Modern pandizotlar için özelleştirilmiş e-ticaret platformu. Aracınıza özel hoparlör ve tiz kombinasyonları ile mükemmel ses deneyimi.',
  keywords: 'pandizot, araç ses sistemi, hoparlör, tiz, özelleştirme, e-ticaret',
  openGraph: {
    title: 'Pandizot Shop',
    description: 'Özel pandizotlarınızı tasarlayın ve satın alın.',
    images: '/og-image.jpg',
    siteName: 'Pandizot Shop',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pandizot Shop',
    description: 'Özel pandizotlarınızı tasarlayın ve satın alın.',
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
      </body>
    </html>
  );
}