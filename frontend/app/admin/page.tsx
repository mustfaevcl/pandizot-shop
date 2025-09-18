'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Bar } from 'react-chartjs-2';
import Link from 'next/link';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useAuthStore } from '@/lib/stores/auth';
import { ordersAPI, pricingAPI } from '@/lib/api';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface AdminStats {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  popularModels: { model: string; count: number }[];
}

export default function AdminDashboard() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      window.location.href = '/orders';
      return;
    }

    fetchStats();
  }, [user]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      // Mock stats - later from API
      setTimeout(() => {
        setStats({
          totalOrders: 45,
          totalRevenue: 12500,
          pendingOrders: 3,
          popularModels: [
            { model: 'Golf', count: 12 },
            { model: 'Corolla', count: 10 },
            { model: '3 Series', count: 8 },
            { model: 'C-Class', count: 7 },
          ],
        });
        setLoading(false);
      }, 1000);
    } catch (err: any) {
      setError(err.message);
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

  if (error) {
    return (
      <div className="min-h-screen bg-tech-dark flex items-center justify-center">
        <motion.div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button onClick={fetchStats} className="btn-primary">
            Yeniden Dene
          </button>
        </motion.div>
      </div>
    );
  }

  const chartData = {
    labels: stats?.popularModels.map(p => p.model) || [],
    datasets: [
      {
        label: 'Satış Sayısı',
        data: stats?.popularModels.map(p => p.count) || [],
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-tech-dark py-12">
      <div className="container mx-auto px-4">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-primary-500 to-neon bg-clip-text text-transparent"
        >
          Admin Paneli - {user?.name}
        </motion.h1>

        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <motion.div
            className="card-tech p-6 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="text-2xl font-semibold text-primary-500">Toplam Sipariş</h3>
            <p className="text-3xl font-bold text-neon">{stats?.totalOrders}</p>
          </motion.div>

          <motion.div
            className="card-tech p-6 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-2xl font-semibold text-primary-500">Bekleyen Sipariş</h3>
            <p className="text-3xl font-bold text-yellow-400">{stats?.pendingOrders}</p>
          </motion.div>

          <motion.div
            className="card-tech p-6 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-2xl font-semibold text-primary-500">Toplam Gelir</h3>
            <p className="text-3xl font-bold text-green-400">{stats?.totalRevenue} TL</p>
          </motion.div>

          <motion.div
            className="card-tech p-6 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-2xl font-semibold text-primary-500">Aktif Kurallar</h3>
            <p className="text-3xl font-bold text-blue-400">25</p> {/* From pricingAPI.rules later */}
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Recent Orders */}
          <motion.div
            className="card-tech p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="text-2xl font-bold mb-6 text-primary-500">Son Siparişler</h3>
            <div className="space-y-4">
              {/* Mock data - later from ordersAPI.list */}
              {[
                { id: '123', customer: 'Ali V.', total: 350, status: 'preparing' as const },
                { id: '124', customer: 'Ayşe K.', total: 280, status: 'shipped' as const },
                { id: '125', customer: 'Mehmet Y.', total: 450, status: 'delivered' as const },
              ].map((order, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-white/5 rounded">
                  <div>
                    <p className="font-semibold">{order.customer}</p>
                    <p className="text-sm text-metallic">#{order.id}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-neon">{order.total} TL</p>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      order.status === 'delivered' ? 'bg-green-500/20 text-green-400' :
                      order.status === 'shipped' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/admin/orders" className="block mt-4 text-primary-500 hover:text-primary-400 text-right">
              Tüm Siparişler →
            </Link>
          </motion.div>

          {/* Popular Models Chart */}
          <motion.div
            className="card-tech p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <h3 className="text-2xl font-bold mb-6 text-primary-500">Popüler Modeller</h3>
            <Bar
              data={chartData}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: 'top' as const },
                  title: { display: false },
                },
                scales: {
                  y: { beginAtZero: true },
                },
              }}
            />
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Link href="/admin/orders" className="block">
            <motion.button className="w-full btn-primary py-4 text-lg" whileHover={{ scale: 1.02 }}>
              Sipariş Yönetimi
            </motion.button>
          </Link>
          <Link href="/admin/pricing" className="block">
            <motion.button className="w-full btn-primary py-4 text-lg" whileHover={{ scale: 1.02 }}>
              Fiyat Kuralları
            </motion.button>
          </Link>
          <Link href="/admin/users" className="block">
            <motion.button className="w-full btn-primary py-4 text-lg" whileHover={{ scale: 1.02 }}>
              Kullanıcılar
            </motion.button>
          </Link>
          <Link href="/admin/stocks" className="block">
            <motion.button className="w-full btn-primary py-4 text-lg" whileHover={{ scale: 1.02 }}>
              Stok Yönetimi
            </motion.button>
          </Link>
        </div>
      </div>
    </div>
  );
}