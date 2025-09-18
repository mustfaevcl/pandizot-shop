'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/lib/stores/auth';

interface Message {
  id: string;
  from: string;
  message: string;
  date: string;
}

export default function AdminMessages() {
  const { user } = useAuthStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      window.location.href = '/orders';
      return;
    }

    loadMessages();
  }, [user]);

  const loadMessages = () => {
    // Mock messages - later from API or DB
    setMessages([
      { id: '1', from: 'user@example.com', message: 'Ürünüm ne zaman hazır olur?', date: '2024-09-18' },
      { id: '2', from: 'user2@example.com', message: 'Fiyat hakkında soru', date: '2024-09-17' },
      { id: '3', from: 'user3@example.com', message: 'Teslimat durumu?', date: '2024-09-16' },
    ]);
    setLoading(false);
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
          Mesaj ve Yorum Yönetimi
        </motion.h1>

        <div className="space-y-4">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              className="card-tech p-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-primary-500">{msg.from}</p>
                  <p className="text-sm text-metallic">{msg.date}</p>
                </div>
                <div className="text-right">
                  <button className="text-primary-500 hover:text-primary-400 mr-2">
                    Yanıtla
                  </button>
                  <button className="text-red-500 hover:text-red-400">
                    Sil
                  </button>
                </div>
              </div>
              <p className="text-metallic mt-2">{msg.message}</p>
            </motion.div>
          ))}
        </div>

        {messages.length === 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-metallic mt-8"
          >
            Henüz mesaj yok.
          </motion.p>
        )}
      </div>
    </div>
  );
}