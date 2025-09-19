'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Link from 'next/link'; // For navigation

// Parallax effect component
const ParallaxBg = ({ children, image }: { children: React.ReactNode; image: string }) => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat bg-black/50 z-0"
        style={{
          backgroundImage: `url(${image})`,
          filter: 'blur(2px)',
        }}
      />
      <div className="relative z-10">
        {children}
      </div>
    </div>
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
      Hakan Pandizot
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
    className="text-center mt-4"
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

// Button background component
const ButtonBg = ({ children }: { children: React.ReactNode }) => (
  <div className="relative min-h-[600px] overflow-hidden rounded-2xl w-full -mx-4">
    <div
      className="absolute inset-0 bg-cover bg-center bg-fixed bg-no-repeat bg-black/60 z-0"
      style={{
        backgroundImage: `url(/images/hakanpandizot/toptan%20sipari%C5%9Fler/hp1.jpg)`,
        filter: 'blur(3px)',
      }}
    />
    <div className="relative z-10 flex flex-col items-center justify-center py-8">
      {children}
    </div>
  </div>
);

export default function Home() {
  const memnuniyetImages = Array.from({ length: 9 }, (_, i) => `hp${i + 1}.jpg`);

  return (
    <ParallaxBg image="/images/hakanpandizot/kapak resmi/hp1.jpg">
      <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-screen text-center">
        <AnimatedLogo />
        <ButtonBg>
          <CTAButton href="/customize">Sisteminizi Özelleştirin</CTAButton>
          <CTAButton href="/cart">Alışverişe Başlayın</CTAButton>
        </ButtonBg>
      </div>

      {/* Memnuniyet Gallery Section */}
      <section className="py-16 bg-tech-dark/80">
        <div className="container mx-auto px-4">
          <motion.h2
            className="text-4xl font-bold text-center mb-12 text-white"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Müşteri Memnuniyetleri
          </motion.h2>
          <p className="text-center text-metallic mb-12 max-w-2xl mx-auto">
            Müşterilerimizin memnuniyetleri ve yaptığımız işlerin örnekleri.
          </p>
          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
            {memnuniyetImages.map((imgName, index) => (
              <motion.img
                key={imgName}
                src={`/images/hakanpandizot/memnuniyet/${imgName}`}
                alt="Müşteri memnuniyeti örneği"
                className="w-full aspect-square object-cover rounded-lg hover:opacity-80 transition-opacity cursor-pointer"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              />
            ))}
          </div>
        </div>
      </section>
    </ParallaxBg>
  );
}
