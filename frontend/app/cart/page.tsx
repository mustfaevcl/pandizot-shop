'use client';

import { useCartStore } from '@/lib/stores/cart';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useAuthStore } from '@/lib/stores/auth';
import { useState } from 'react';

export default function Cart() {
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const [isGuestCheckout, setIsGuestCheckout] = useState(true);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-tech-dark flex flex-col items-center justify-center py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold text-primary-500 mb-4">Sepetiniz Boş</h1>
          <p className="text-metallic mb-8">Özelleştirmeye devam edin ve pandizotunuzu sepete ekleyin.</p>
          <Link href="/customize">
            <motion.button className="btn-primary px-8 py-3" whileHover={{ scale: 1.05 }}>
              Özelleştirmeye Devam Et
            </motion.button>
          </Link>
        </motion.div>
      </div>
    );
  }

  const total = getTotalPrice();

  const handleCheckout = () => {
    if (!isAuthenticated && !isGuestCheckout) {
      alert('Lütfen giriş yapın veya misafir olarak devam edin.');
      return;
    }
    // Later: Navigate to checkout or API call
    alert(`Ödeme sayfasına yönlendiriliyorsunuz. Toplam: ${total} TL`);
  };

  return (
    <div className="min-h-screen bg-tech-dark py-12">
      <div className="container mx-auto px-4">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-primary-500 to-neon bg-clip-text text-transparent"
        >
          Alışveriş Sepeti
        </motion.h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <motion.div
                key={item.id}
                className="card-tech flex flex-col md:flex-row items-center md:items-start gap-4 p-6"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <img
                  src={item.previewImageUrl || '/default-pandizot.jpg'}
                  alt={`${item.vehicleBrand} ${item.vehicleModel}`}
                  className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                />
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-primary-500 mb-1">
                    {item.vehicleBrand} {item.vehicleModel}
                  </h3>
                  <p className="text-metallic mb-2">Hoparlör: {item.speakerType} ({item.speakerCount} adet)</p>
                  {item.tweeterCount > 0 && (
                    <p className="text-metallic mb-2">Tiz: {item.tweeterCount} adet</p>
                  )}
                  {item.options.length > 0 && (
                    <p className="text-sm text-metallic">Seçenekler: {item.options.join(', ')}</p>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20"
                    >
                      -
                    </button>
                    <span className="text-lg font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-primary-500 font-semibold">{item.totalPrice} TL</span>
                  <motion.button
                    onClick={() => removeItem(item.id)}
                    className="text-red-400 hover:text-red-300 ml-2"
                    whileHover={{ scale: 1.2 }}
                  >
                    ×
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Cart Summary */}
          <motion.div
            className="card-tech p-6 space-y-4"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-2xl font-bold text-primary-500">Sepet Özeti</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-metallic">
                <span>Toplam Ürün Adedi:</span>
                <span>{items.reduce((sum, item) => sum + item.quantity, 0)}</span>
              </div>
              <div className="flex justify-between text-lg font-semibold text-white pt-2 border-t border-white/20">
                <span>Genel Toplam:</span>
                <span className="text-neon">{total} TL</span>
              </div>
            </div>

            {/* Auth/Guest Toggle */}
            {!isAuthenticated && (
              <motion.div
                className="space-y-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={isGuestCheckout}
                    onChange={(e) => setIsGuestCheckout(e.target.checked)}
                    className="mr-2 w-4 h-4 text-primary-500 rounded"
                  />
                  <span className="text-metallic">Misafir olarak devam et</span>
                </label>
                {!isGuestCheckout && (
                  <Link href="/login">
                    <motion.button className="w-full py-2 bg-white/10 border border-white/20 rounded-lg text-metallic hover:bg-white/20">
                      Giriş Yap
                    </motion.button>
                  </Link>
                )}
              </motion.div>
            )}

            <motion.button
              onClick={handleCheckout}
              className="w-full btn-primary py-3 text-lg"
              whileHover={{ scale: 1.02 }}
            >
              Ödeme Yap
            </motion.button>

            <motion.button
              onClick={clearCart}
              className="w-full py-2 bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
              whileHover={{ scale: 1.02 }}
            >
              Sepeti Temizle
            </motion.button>

            <Link href="/customize">
              <motion.button className="w-full py-2 bg-white/10 border border-white/20 rounded-lg text-metallic hover:bg-white/20">
                Daha Fazla Ürün Ekle
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}