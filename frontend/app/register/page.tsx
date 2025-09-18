'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/auth';
import { authAPI } from '@/lib/api';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((state) => state.login); // Reuse login after registration
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!name || !email || !password || !confirmPassword) {
      setError('Lütfen tüm alanları doldurun.');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Şifreler eşleşmiyor.');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Şifre en az 6 karakter olmalıdır.');
      setLoading(false);
      return;
    }

    try {
      const response = await authAPI.register({ name, email, password });
      login(response.user, ''); // Token in cookie
      alert('Kayıt başarılı! Hoş geldiniz.');
      router.push('/orders');
    } catch (err: any) {
      setError(err.message || 'Kayıt hatası. Lütfen tekrar deneyin.');
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
          Kayıt Ol
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
            <label className="block text-metallic mb-2">Ad Soyad</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-metallic focus:border-primary-500 focus:outline-none"
              placeholder="Adınız Soyadınız"
              required
              disabled={loading}
            />
          </div>

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
              placeholder="Şifreniz (en az 6 karakter)"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-metallic mb-2">Şifre Tekrar</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-metallic focus:border-primary-500 focus:outline-none"
              placeholder="Şifrenizi tekrar girin"
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
            {loading ? 'Kayıt Oluyor...' : 'Kayıt Ol'}
          </motion.button>
        </form>

        <div className="text-center mt-6">
          <p className="text-metallic mb-4">Zaten hesabınız var mı?</p>
          <Link href="/login">
            <motion.button
              className="w-full py-3 bg-white/10 border border-white/20 rounded-lg text-metallic hover:bg-white/20 transition-colors"
              whileHover={{ scale: 1.02 }}
            >
              Giriş Yap
            </motion.button>
          </Link>
        </div>

        <Link href="/" className="block text-center mt-4 text-metallic hover:text-primary-500">
          Ana Sayfaya Dön
        </Link>
      </motion.div>
    </div>
  );
}