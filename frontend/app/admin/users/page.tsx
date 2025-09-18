'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/lib/stores/auth';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string;
}

export default function AdminUsers() {
  const { user } = useAuthStore();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      window.location.href = '/orders';
      return;
    }

    fetchUsers();
  }, [user]);

  const fetchUsers = async () => {
    try {
      // Later: API call to /api/users
      setTimeout(() => {
        setUsers([
          { _id: '1', name: 'Ali V.', email: 'ali@example.com', role: 'user', createdAt: '2024-09-01' },
          { _id: '2', name: 'Ayşe K.', email: 'ayse@example.com', role: 'user', createdAt: '2024-09-10' },
          { _id: '3', name: 'Mehmet Y.', email: 'mehmet@example.com', role: 'user', createdAt: '2024-09-15' },
          { _id: '4', name: 'Admin', email: 'admin@example.com', role: 'admin', createdAt: '2024-08-01' },
        ]);
        setLoading(false);
      }, 500);
    } catch (err) {
      alert('Kullanıcılar yüklenemedi.');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-tech-dark flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-tech-dark py-12">
      <div className="container mx-auto px-4">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-center mb-8 text-primary-500"
        >
          Kullanıcı Yönetimi
        </motion.h1>

        <div className="overflow-x-auto">
          <table className="w-full bg-white/10 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-white/20">
                <th className="p-3 text-left">Ad Soyad</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Rol</th>
                <th className="p-3 text-left">Kayıt Tarihi</th>
                <th className="p-3 text-left">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <motion.tr
                  key={u._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-b border-white/10 hover:bg-white/5"
                >
                  <td className="p-3">{u.name}</td>
                  <td className="p-3">{u.email}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      u.role === 'admin' ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'
                    }`}>
                      {u.role === 'admin' ? 'Admin' : 'Kullanıcı'}
                    </span>
                  </td>
                  <td className="p-3">{new Date(u.createdAt).toLocaleDateString('tr-TR')}</td>
                  <td className="p-3">
                    <button className="text-primary-500 hover:text-primary-400 mr-2">
                      Düzenle
                    </button>
                    <button className="text-red-500 hover:text-red-400">
                      Sil
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {users.length === 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-metallic mt-8"
          >
            Henüz kullanıcı yok.
          </motion.p>
        )}
      </div>
    </div>
  );
}