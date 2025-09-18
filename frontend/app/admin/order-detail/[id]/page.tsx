'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/auth';
import { ordersAPI } from '@/lib/api';

interface OrderDetail {
  _id: string;
  email: string;
  status: 'preparing' | 'shipped' | 'delivered';
  items: any[];
  shippingAddress: any;
  notes?: string;
  createdAt: string;
}

export default function OrderDetail() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const { user } = useAuthStore();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/orders');
      return;
    }

    const fetchOrder = async () => {
      try {
        // Later: API call to /api/orders/{id}
        setTimeout(() => {
          // Mock order detail
          setOrder({
            _id: id,
            email: 'test@example.com',
            status: 'preparing' as const,
            items: [
              {
                vehicleBrand: 'Volkswagen',
                vehicleModel: 'Golf',
                speakerType: '4x20',
                quantity: 1,
                totalPrice: 120,
              },
            ],
            shippingAddress: {
              fullName: 'Test User',
              phone: '555-1234',
              addressLine1: 'Test Adres',
              city: 'İstanbul',
            },
            notes: 'Özel dikiş ekleyin.',
            createdAt: '2024-09-18',
          });
          setLoading(false);
        }, 500);
      } catch (err) {
        alert('Sipariş yüklenemedi.');
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, user, router]);

  const updateStatus = async (newStatus: OrderDetail['status']) => {
    if (!order) return;
    setUpdating(true);
    try {
      await ordersAPI.updateStatus(order._id, newStatus);
      setOrder({ ...order, status: newStatus });
      alert('Durum güncellendi.');
    } catch (err) {
      alert('Güncelleme hatası.');
    } finally {
      setUpdating(false);
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

  if (!order) {
    return (
      <div className="min-h-screen bg-tech-dark flex items-center justify-center">
        <motion.div className="text-center">
          <h2 className="text-red-400 mb-4">Sipariş Bulunamadı</h2>
          <button onClick={() => router.back()} className="btn-primary">
            Geri Dön
          </button>
        </motion.div>
      </div>
    );
  }

  const statusColors = {
    preparing: 'yellow-400',
    shipped: 'blue-400',
    delivered: 'green-400',
  };

  return (
    <div className="min-h-screen bg-tech-dark py-12">
      <div className="container mx-auto px-4">
        <motion.button
          onClick={() => router.back()}
          className="mb-4 text-primary-500 hover:text-primary-400"
          whileHover={{ scale: 1.05 }}
        >
          ← Geri
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-tech p-8"
        >
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h1 className="text-2xl font-bold mb-4 text-primary-500">Sipariş #{order._id}</h1>
              <p className="text-metallic mb-2">Müşteri: {order.email}</p>
              <p className="text-metallic mb-4">Tarih: {new Date(order.createdAt).toLocaleString('tr-TR')}</p>
              <p className="text-metallic">Notlar: {order.notes || 'Yok'}</p>
            </div>
            <div className="text-right">
              <select
                value={order.status}
                onChange={(e) => updateStatus(e.target.value as OrderDetail['status'])}
                disabled={updating}
                className="mb-4 bg-transparent border border-white/20 rounded p-2 text-sm disabled:opacity-50"
              >
                <option value="preparing">Hazırlanıyor</option>
                <option value="shipped">Kargoya Verildi</option>
                <option value="delivered">Teslim Edildi</option>
              </select>
            </div>
          </div>

          <h2 className="text-xl font-semibold mb-4 text-primary-500">Ürünler</h2>
          <div className="space-y-4 mb-8">
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between items-center p-4 bg-white/5 rounded">
                <div>
                  <p className="font-semibold">{item.vehicleBrand} {item.vehicleModel}</p>
                  <p className="text-sm text-metallic">Hoparlör: {item.speakerType}</p>
                  <p className="text-sm text-metallic">Adet: {item.quantity}</p>
                </div>
                <span className="text-neon">{item.totalPrice} TL</span>
              </div>
            ))}
          </div>

          <h2 className="text-xl font-semibold mb-4 text-primary-500">Adres</h2>
          <div className="p-4 bg-white/5 rounded">
            <p className="text-metallic">Ad: {order.shippingAddress.addressLine1}</p>
            <p className="text-metallic">Şehir: {order.shippingAddress.city}</p>
            <p className="text-metallic">Telefon: {order.shippingAddress.phone}</p>
            <p className="text-metallic">Ülke: {order.shippingAddress.country}</p>
          </div>

          <div className="text-center mt-8">
            <motion.button
              onClick={() => {
                alert('Sipariş için teşekkür maili gönderildi.');
              }}
              className="btn-primary px-6 py-3"
              whileHover={{ scale: 1.02 }}
            >
              Müşteriye Teşekkür Maili Gönder
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}