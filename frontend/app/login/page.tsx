'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useAuthStore } from '@/lib/stores/auth';
import { useRouter } from 'next/navigation';
import { authAPI } from '@/lib/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((state) => state.login);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!email || !password) {
      setError('Lütfen email ve şifreyi girin.');
      setLoading(false);
      return;
    }

    try {
      const response = await authAPI.login({ email, password });
      login(response.user, response.token || ''); // Token from cookie, but store user
      router.push(response.user.role === 'admin' ? '/admin' : '/orders');
    } catch (err: any) {
      setError(err.message || 'Giriş hatası. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-tech-dark flex items-center justify-center py-12">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-tech p-8 max-w-md w-full"
      >
        <h1 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-primary-500 to-neon bg-clip-text text-transparent">
          Giriş Yap
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-500/20 border border-red-500/30 text-red-400 p-3 rounded-lg text-center"
            >
              {error}
            </motion.div>
          )}

          <div>
            <label className="block text-metallic mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-metallic focus:border-primary-500 focus:outline-none"
              placeholder="Email adresiniz"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-metallic mb-2">Şifre</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-metallic focus:border-primary-500 focus:outline-none"
              placeholder="Şifreniz"
              required
              disabled={loading}
            />
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-3 text-lg disabled:opacity-50"
            whileHover={{ scale: loading ? 1 : 1.02 }}
          >
            {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
          </motion.button>
        </form>

        <div className="text-center mt-6">
          <p className="text-metallic mb-4">Hesabınız yok mu?</p>
          <Link href="/register">
            <motion.button
              className="w-full py-3 bg-white/10 border border-white/20 rounded-lg text-metallic hover:bg-white/20 transition-colors"
              whileHover={{ scale: 1.02 }}
            >
              Kayıt Ol
            </motion.button>
          </Link>
        </div>

        <div className="text-center mt-4">
          <p className="text-sm text-metallic">
            Demo: user@example.com / password (Kullanıcı) | admin@example.com / admin (Admin)
          </p>
        </div>

        <Link href="/" className="block text-center mt-4 text-metallic hover:text-primary-500">
          Ana Sayfaya Dön
        </Link>
      </motion.div>
    </div>
  );
}