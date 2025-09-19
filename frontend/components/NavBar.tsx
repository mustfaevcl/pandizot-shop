'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useAuthStore } from '@/lib/stores/auth';
import { useCartStore } from '@/lib/stores/cart';

export default function NavBar() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { getTotalPrice } = useCartStore();

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-tech-dark/80 backdrop-blur-md border-b border-white/10 fixed w-full top-0 z-50"
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/" className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary-500 to-neon bg-clip-text text-transparent">
            Hakan Pandizot
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-metallic hover:text-primary-500 transition-colors">
              Ana Sayfa
            </Link>
            <Link href="/customize" className="text-metallic hover:text-primary-500 transition-colors">
              Özelleştir
            </Link>
            <Link href="/cart" className="text-metallic hover:text-primary-500 transition-colors relative">
              Sepet
              {getTotalPrice() > 0 && (
                <motion.span
                  className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                >
                  {Math.round(getTotalPrice())}
                </motion.span>
              )}
            </Link>

            {isAuthenticated ? (
              <>
                {user?.role === 'admin' && (
                  <Link href="/admin" className="text-metallic hover:text-primary-500 transition-colors">
                    Admin
                  </Link>
                )}
                <Link href="/orders" className="text-metallic hover:text-primary-500 transition-colors">
                  Siparişler
                </Link>
                <span className="text-metallic">Hoş geldin, {user?.name}</span>
                <button
                  onClick={logout}
                  className="text-metallic hover:text-primary-500 transition-colors px-4 py-2 rounded"
                >
                  Çıkış
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-metallic hover:text-primary-500 transition-colors">
                  Giriş
                </Link>
                <Link href="/register" className="btn-primary px-4 py-2 rounded">
                  Kayıt Ol
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button className="text-metallic">☰</button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}