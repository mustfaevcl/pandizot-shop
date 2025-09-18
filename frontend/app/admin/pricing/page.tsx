'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/lib/stores/auth';
import { pricingAPI } from '@/lib/api';

interface PricingRule {
  _id: string;
  vehicleBrand: string;
  vehicleModel: string;
  basePrice: number;
  multipliers: {
    speakerType: Record<string, number>;
    tweeterUnitPrice: number;
  };
  isActive: boolean;
}

export default function AdminPricing() {
  const { user } = useAuthStore();
  const [rules, setRules] = useState<PricingRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newRule, setNewRule] = useState({ vehicleBrand: '', vehicleModel: '', basePrice: 100, tweeterUnitPrice: 0 });
  const [editRule, setEditRule] = useState<PricingRule | null>(null);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      window.location.href = '/orders';
      return;
    }

    fetchRules();
  }, [user]);

  const fetchRules = async () => {
    try {
      const response = await pricingAPI.rules();
      setRules(response);
    } catch (err) {
      alert('Kurallar yüklenemedi.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await pricingAPI.createRule(newRule);
      setNewRule({ vehicleBrand: '', vehicleModel: '', basePrice: 100, tweeterUnitPrice: 0 });
      fetchRules();
      alert('Kural eklendi.');
    } catch (err) {
      alert('Kural eklenemedi.');
    }
  };

  const handleUpdate = async (id: string) => {
    if (!editRule) return;
    try {
      await pricingAPI.updateRule(id, editRule);
      setEditingId(null);
      setEditRule(null);
      fetchRules();
      alert('Kural güncellendi.');
    } catch (err) {
      alert('Güncelleme hatası.');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Bu kuralı devre dışı bırakmak istediğinizden emin misiniz?')) {
      try {
        await pricingAPI.deleteRule(id);
        fetchRules();
        alert('Kural devre dışı bırakıldı.');
      } catch (err) {
        alert('Silme hatası.');
      }
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
          Fiyat Kuralları Yönetimi
        </motion.h1>

        {/* Add New Rule Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-tech p-6 mb-8"
        >
          <h2 className="text-xl font-semibold mb-4 text-primary-500">Yeni Kural Ekle</h2>
          <form onSubmit={handleCreate} className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Araç Markası"
              value={newRule.vehicleBrand}
              onChange={(e) => setNewRule({ ...newRule, vehicleBrand: e.target.value })}
              className="p-3 bg-white/10 border border-white/20 rounded text-white"
              required
            />
            <input
              type="text"
              placeholder="Araç Modeli"
              value={newRule.vehicleModel}
              onChange={(e) => setNewRule({ ...newRule, vehicleModel: e.target.value })}
              className="p-3 bg-white/10 border border-white/20 rounded text-white"
              required
            />
            <input
              type="number"
              placeholder="Baz Fiyat (TL)"
              value={newRule.basePrice}
              onChange={(e) => setNewRule({ ...newRule, basePrice: parseInt(e.target.value) })}
              className="p-3 bg-white/10 border border-white/20 rounded text-white"
              min="0"
              required
            />
            <input
              type="number"
              placeholder="Tiz Birim Fiyatı (TL)"
              value={newRule.tweeterUnitPrice}
              onChange={(e) => setNewRule({ ...newRule, tweeterUnitPrice: parseInt(e.target.value) })}
              className="p-3 bg-white/10 border border-white/20 rounded text-white"
              min="0"
            />
            <button type="submit" className="md:col-span-2 btn-primary">
              Ekle
            </button>
          </form>
        </motion.div>

        {/* Rules List */}
        <div className="overflow-x-auto">
          <table className="w-full bg-white/10 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-white/20">
                <th className="p-3 text-left">Marka</th>
                <th className="p-3 text-left">Model</th>
                <th className="p-3 text-left">Baz Fiyat</th>
                <th className="p-3 text-left">Tiz Fiyat</th>
                <th className="p-3 text-left">Aktif</th>
                <th className="p-3 text-left">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {rules.map((rule) => (
                <motion.tr
                  key={rule._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-b border-white/10 hover:bg-white/5"
                >
                  <td className="p-3">{rule.vehicleBrand}</td>
                  <td className="p-3">{rule.vehicleModel}</td>
                  <td className="p-3">{rule.basePrice} TL</td>
                  <td className="p-3">{rule.multipliers.tweeterUnitPrice} TL</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      rule.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {rule.isActive ? 'Evet' : 'Hayır'}
                    </span>
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => {
                        setEditingId(rule._id);
                        setEditRule(rule);
                      }}
                      className="text-primary-500 hover:text-primary-400 mr-2"
                    >
                      Düzenle
                    </button>
                    {!rule.isActive ? (
                      <button
                        onClick={() => handleUpdate(rule._id)}
                        className="text-green-500 hover:text-green-400 mr-2"
                      >
                        Aktif Et
                      </button>
                    ) : (
                      <button
                        onClick={() => handleDelete(rule._id)}
                        className="text-red-500 hover:text-red-400"
                      >
                        Devre Dışı
                      </button>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Edit Form Modal */}
        {editingId && editRule && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setEditingId(null)}
          >
            <motion.div
              className="card-tech p-6 max-w-md w-full m-4"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-semibold mb-4 text-primary-500">Kural Düzenle</h3>
              <form onSubmit={(e) => { e.preventDefault(); handleUpdate(editRule._id); }} className="space-y-4">
                <input
                  type="text"
                  placeholder="Marka"
                  value={editRule.vehicleBrand}
                  onChange={(e) => setEditRule({ ...editRule, vehicleBrand: e.target.value })}
                  className="w-full p-3 bg-white/10 border border-white/20 rounded text-white"
                  required
                />
                <input
                  type="text"
                  placeholder="Model"
                  value={editRule.vehicleModel}
                  onChange={(e) => setEditRule({ ...editRule, vehicleModel: e.target.value })}
                  className="w-full p-3 bg-white/10 border border-white/20 rounded text-white"
                  required
                />
                <input
                  type="number"
                  placeholder="Baz Fiyat"
                  value={editRule.basePrice}
                  onChange={(e) => setEditRule({ ...editRule, basePrice: parseInt(e.target.value) })}
                  className="w-full p-3 bg-white/10 border border-white/20 rounded text-white"
                  required
                />
                <input
                  type="number"
                  placeholder="Tiz Fiyat"
                  value={editRule.multipliers.tweeterUnitPrice}
                  onChange={(e) => setEditRule({ ...editRule, multipliers: { ...editRule.multipliers, tweeterUnitPrice: parseInt(e.target.value) } })}
                  className="w-full p-3 bg-white/10 border border-white/20 rounded text-white"
                />
                <div className="flex gap-2">
                  <button type="submit" className="flex-1 btn-primary">
                    Güncelle
                  </button>
                  <button type="button" onClick={() => setEditingId(null)} className="flex-1 bg-white/10 border border-white/20 rounded text-metallic">
                    İptal
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}

        {rules.length === 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-metallic mt-8"
          >
            Henüz kural yok. Yukarıdan ekleyin.
          </motion.p>
        )}
      </div>
    </div>
  );
}