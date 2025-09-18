'use client';

import { useAuthStore } from '@/lib/stores/auth';
import { ordersAPI } from '@/lib/api';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Order {
  _id: string;
  createdAt: string;
  status: 'preparing' | 'shipped' | 'delivered';
  items: { quantity: number; totalPrice: number }[];
}

export default function Orders() {
  const { isAuthenticated } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await ordersAPI.getUserOrders();
        setOrders(response);
      } catch (err: any) {
        setError(err.message || 'Siparişler yüklenemedi.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-tech-dark flex items-center justify-center py-12">
        <motion.div className="text-center">
          <h1 className="text-3xl font-bold text-primary-500 mb-4">Sipariş Geçmişi</h1>
          <p className="text-metallic mb-4">Siparişlerinizi görmek için giriş yapın.</p>
          <Link href="/login">
            <motion.button className="btn-primary px-6 py-3" whileHover={{ scale: 1.05 }}>
              Giriş Yap
            </motion.button>
          </Link>
        </motion.div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-tech-dark flex items-center justify-center py-12">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-tech-dark flex items-center justify-center py-12">
        <motion.div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button onClick={() => window.location.reload()} className="btn-primary">
            Yeniden Dene
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-tech-dark py-12">
      <div className="container mx-auto px-4">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-primary-500 to-neon bg-clip-text text-transparent"
        >
          Sipariş Geçmişi
        </motion.h1>

        {orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <p className="text-metallic mb-4">Henüz siparişiniz yok.</p>
            <Link href="/customize">
              <motion.button className="btn-primary px-6 py-3" whileHover={{ scale: 1.05 }}>
                İlk Pandizotunuzu Özelleştirin
              </motion.button>
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const itemsCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
              const total = order.items.reduce((sum, item) => sum + item.totalPrice, 0);
              const date = new Date(order.createdAt).toLocaleDateString('tr-TR');
              return (
                <motion.div
                  key={order._id}
                  className="card-tech p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-primary-500">Sipariş #{order._id}</h3>
                    <span className="text-metallic">{date}</span>
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-metallic">Ürün Adedi: {itemsCount}</span>
                    <span className="text-neon font-semibold">{total} TL</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      order.status === 'delivered' ? 'bg-green-500/20 text-green-400' :
                      order.status === 'shipped' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {order.status === 'preparing' ? 'Hazırlanıyor' :
                       order.status === 'shipped' ? 'Kargoya Verildi' :
                       'Teslim Edildi'}
                    </span>
                    <Link href={`/orders/${order._id}`}>
                      <motion.button
                        className="text-primary-500 hover:text-primary-400 text-sm"
                        whileHover={{ scale: 1.05 }}
                      >
                        Detaylar
                      </motion.button>
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}