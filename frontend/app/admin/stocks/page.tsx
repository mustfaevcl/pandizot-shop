'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/lib/stores/auth';

interface StockItem {
  id: string;
  name: string;
  quantity: number;
  minStock: number;
  lastUpdated: string;
}

export default function AdminStocks() {
  const { user } = useAuthStore();
  const [stocks, setStocks] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      window.location.href = '/orders';
      return;
    }

    loadStocks();
  }, [user]);

  const loadStocks = () => {
    // Mock stock data - later from API
    setStocks([
      { id: '1', name: 'Hoparlör 4x20', quantity: 15, minStock: 5, lastUpdated: '2024-09-18' },
      { id: '2', name: 'Hoparlör 4x16', quantity: 8, minStock: 10, lastUpdated: '2024-09-18' },
      { id: '3', name: 'Oval Hoparlör', quantity: 22, minStock: 3, lastUpdated: '2024-09-17' },
      { id: '4', name: 'Tiz Hoparlör', quantity: 30, minStock: 10, lastUpdated: '2024-09-18' },
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
          Stok Yönetimi
        </motion.h1>

        <div className="overflow-x-auto">
          <table className="w-full bg-white/10 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-white/20">
                <th className="p-3 text-left">Ürün</th>
                <th className="p-3 text-left">Stok Adedi</th>
                <th className="p-3 text-left">Minimum</th>
                <th className="p-3 text-left">Son Güncelleme</th>
                <th className="p-3 text-left">Durum</th>
              </tr>
            </thead>
            <tbody>
              {stocks.map((stock) => (
                <motion.tr
                  key={stock.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-b border-white/10 hover:bg-white/5"
                >
                  <td className="p-3">{stock.name}</td>
                  <td className={`p-3 font-semibold ${
                    stock.quantity < stock.minStock ? 'text-red-400' : 'text-neon'
                  }`}>
                    {stock.quantity}
                  </td>
                  <td className="p-3">{stock.minStock}</td>
                  <td className="p-3">{stock.lastUpdated}</td>
                  <td className={`p-3 text-sm ${
                    stock.quantity < stock.minStock ? 'text-red-400' : 'text-green-400'
                  }`}>
                    {stock.quantity < stock.minStock ? 'Düşük Stok' : 'Yeterli'}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {stocks.length === 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-metallic mt-8"
          >
            Henüz stok verisi yok.
          </motion.p>
        )}
      </div>
    </div>
  );
}