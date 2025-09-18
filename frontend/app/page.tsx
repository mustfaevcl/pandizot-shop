'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Link from 'next/link'; // For navigation

// Parallax effect component
const ParallaxBg = ({ children, image }: { children: React.ReactNode; image: string }) => {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setOffset(window.pageYOffset);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section
      className="parallax-bg relative min-h-screen"
      style={{
        backgroundImage: `url(${image})`,
        transform: `translateY(${offset * 0.5}px)`,
      }}
    >
      {children}
    </section>
  );
};

// Logo animation component
const AnimatedLogo = () => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 1, ease: 'easeOut' }}
    className="text-center mb-8"
  >
    <motion.h1
      className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-neon via-primary-500 to-neon bg-clip-text text-transparent"
      initial={{ scale: 0.8, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 10 }}
    >
      PANDIZOT
    </motion.h1>
    <motion.p
      className="text-xl md:text-2xl text-metallic mt-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.5 }}
    >
      Yüksek Teknoloji Ses Sistemleri
    </motion.p>
  </motion.div>
);

// CTA button with animation
const CTAButton = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <motion.div
    whileHover={{ scale: 1.05, y: -5 }}
    whileTap={{ scale: 0.95 }}
    className="text-center mt-8"
  >
    <Link href={href}>
      <motion.button
        className="btn-primary text-white px-8 py-4 text-lg font-semibold rounded-xl tech-glow"
        whileHover={{ boxShadow: '0 0 30px rgba(0, 212, 255, 0.5)' }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.button>
    </Link>
  </motion.div>
);

export default function Home() {
  return (
    <ParallaxBg image="https://images.unsplash.com/photo-1613339789212-e4a62f37d3eb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80">
      <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-screen text-center">
        <AnimatedLogo />
        <CTAButton href="/customize">Sisteminizi Özelleştirin</CTAButton>
        <CTAButton href="/cart">Alışverişe Başlayın</CTAButton>
      </div>
    </ParallaxBg>
  );
}