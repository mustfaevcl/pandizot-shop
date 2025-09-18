'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/lib/stores/auth';
import { ordersAPI } from '@/lib/api';

interface Order {
  _id: string;
  email: string;
  status: 'preparing' | 'shipped' | 'delivered';
  total: number;
  createdAt: string;
  items: any[];
}

export default function AdminOrders() {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      window.location.href = '/orders';
      return;
    }

    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    try {
      const response = await ordersAPI.list();
      setOrders(response);
    } catch (err) {
      alert('Siparişler yüklenemedi.');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: Order['status']) => {
    setUpdating(id);
    try {
      await ordersAPI.updateStatus(id, newStatus);
      setOrders(orders.map(order => order._id === id ? { ...order, status: newStatus } : order));
      alert('Durum güncellendi.');
    } catch (err) {
      alert('Güncelleme hatası.');
    } finally {
      setUpdating(null);
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
          Sipariş Yönetimi
        </motion.h1>

        <div className="overflow-x-auto">
          <table className="w-full bg-white/10 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-white/20">
                <th className="p-3 text-left">Sipariş ID</th>
                <th className="p-3 text-left">Müşteri</th>
                <th className="p-3 text-left">Tarih</th>
                <th className="p-3 text-left">Toplam</th>
                <th className="p-3 text-left">Durum</th>
                <th className="p-3 text-left">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <motion.tr
                  key={order._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-b border-white/10 hover:bg-white/5"
                >
                  <td className="p-3 font-semibold">{order._id.slice(-6)}</td>
                  <td className="p-3">{order.email}</td>
                  <td className="p-3">{new Date(order.createdAt).toLocaleDateString('tr-TR')}</td>
                  <td className="p-3 font-semibold text-neon">{order.total} TL</td>
                  <td className="p-3">
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order._id, e.target.value as Order['status'])}
                      disabled={updating === order._id}
                      className="bg-transparent border border-white/20 rounded p-1 text-sm disabled:opacity-50"
                    >
                      <option value="preparing">Hazırlanıyor</option>
                      <option value="shipped">Kargoya Verildi</option>
                      <option value="delivered">Teslim Edildi</option>
                    </select>
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => window.open(`/admin/order-detail/${order._id}`, '_blank')}
                      className="text-primary-500 hover:text-primary-400"
                    >
                      Detay
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {orders.length === 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-metallic mt-8"
          >
            Henüz sipariş yok.
          </motion.p>
        )}
      </div>
    </div>
  );
}