'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useCartStore } from '@/lib/stores/cart';

// Mock data for brands and models (later from API)
const brands = [
  { id: 1, name: 'Volkswagen' },
  { id: 2, name: 'Toyota' },
  { id: 3, name: 'BMW' },
  { id: 4, name: 'Mercedes' },
];

const modelsByBrand = {
  1: ['Golf', 'Passat', 'Polo'],
  2: ['Corolla', 'Camry', 'Yaris'],
  3: ['3 Series', '5 Series', 'X5'],
  4: ['C-Class', 'E-Class', 'A-Class'],
};

// Speaker types
const speakerTypes = [
  { id: '4x20', label: '4x20 cm', image: '/speakers/4x20.jpg' },
  { id: '4x16', label: '4x16 cm', image: '/speakers/4x16.jpg' },
  { id: '4-oval', label: '4 Oval', image: '/speakers/oval.jpg' },
];

// Add-ons
const addOns = [
  { id: 'tweeters', label: '2 Tiz Ekle', price: 60 },
  { id: 'amplifier', label: 'Amplifikatör Ekle', price: 150 },
  { id: 'subwoofer', label: 'Subwoofer Ekle', price: 200 },
];

// Simple price calculation (mock, later connect to backend)
const calculatePrice = (brandId: number, model: string, speakerType: string, selectedAddOns: string[], selectedFabric?: string, selectedEmbedded?: boolean) => {
  // Base price by brand
  const basePrices: Record<number, number> = { 1: 120, 2: 110, 3: 150, 4: 140 };
  let base = basePrices[brandId] || 100;

  // Speaker multiplier
  const multipliers: Record<string, number> = { '4x20': 1.0, '4x16': 0.95, '4-oval': 1.15 };
  base *= multipliers[speakerType] || 1;

  // Add-ons
  const addOnPrices = addOns.filter(addOn => selectedAddOns.includes(addOn.id)).reduce((sum, addOn) => sum + addOn.price, 0);

  // Fabric +100 if selected
  const fabricPrice = selectedFabric ? 100 : 0;

  // Embedded +150 if selected
  const embeddedPrice = selectedEmbedded ? 150 : 0;

  return Math.round(base + addOnPrices + fabricPrice + embeddedPrice);
};

// Preview component
const ProductPreview = ({ config }: { config: { speakerType: string; image: string } }) => (
  <motion.div
    className="card-tech p-8 text-center"
    initial={{ scale: 0.8, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ duration: 0.5 }}
  >
    <img src={config.image} alt={config.speakerType} className="w-64 h-48 object-cover mx-auto rounded-lg mb-4" />
    <h3 className="text-xl font-semibold text-primary-500">Önizleme: {config.speakerType}</h3>
    <p className="text-metallic">Seçtiğiniz pandizot konfigürasyonu burada görünecek.</p>
  </motion.div>
);

// Configuration step
const ConfigStep = ({ title, children, isActive }: { title: string; children: React.ReactNode; isActive: boolean }) => (
  <motion.div
    className={`p-6 rounded-lg ${isActive ? 'bg-primary-900/30' : 'bg-white/10'}`}
    animate={{ opacity: isActive ? 1 : 0.5, scale: isActive ? 1 : 0.98 }}
    transition={{ duration: 0.3 }}
  >
    <h3 className="text-xl font-semibold mb-4 text-white">{title}</h3>
    {children}
  </motion.div>
);

export default function Customize() {
  const [step, setStep] = useState(1);
  const [selectedBrand, setSelectedBrand] = useState<number | null>(null);
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedSpeakerType, setSelectedSpeakerType] = useState('');
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
const [selectedFabric, setSelectedFabric] = useState('');
const [selectedEmbedded, setSelectedEmbedded] = useState(false);
const [selectedCircleColor, setSelectedCircleColor] = useState('');
  const [currentSpeaker, setCurrentSpeaker] = useState(speakerTypes[0]);
  const addItem = useCartStore((state) => state.addItem);

  const price = calculatePrice(selectedBrand || 1, selectedModel, selectedSpeakerType, selectedAddOns, selectedFabric, selectedEmbedded);

  const handleAddToCart = () => {
    if (!selectedBrand || !selectedModel || !selectedSpeakerType) {
      alert('Lütfen tüm gerekli alanları doldurun.');
      return;
    }
    const addOnLabels = selectedAddOns.map(id => addOns.find(a => a.id === id)?.label || id).join(', ');
    addItem({
      vehicleBrand: brands.find(b => b.id === selectedBrand)?.name || '',
      vehicleModel: selectedModel,
      speakerType: selectedSpeakerType,
      speakerCount: 4, // Default
      tweeterCount: selectedAddOns.includes('tweeters') ? 2 : 0,
      options: selectedAddOns.filter(id => id !== 'tweeters'),
      unitPrice: price,
      quantity: 1,
      totalPrice: price,
      previewImageUrl: currentSpeaker.image,
    });
    alert('Ürün sepete eklendi!');
    // Reset form or navigate to cart
    setStep(1);
    setSelectedBrand(null);
    setSelectedModel('');
    setSelectedSpeakerType('');
    setSelectedAddOns([]);
  };

  return (
    <div className="min-h-screen bg-tech-dark py-12">
      <div className="container mx-auto px-4">
        {/* Progress Steps */}
        <div className="flex justify-center mb-12">
          {[1, 2, 3].map((s) => (
            <motion.div
              key={s}
              className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold mx-2 ${
                step >= s ? 'bg-primary-500 text-white' : 'bg-white/20 text-metallic'
              }`}
              animate={{ scale: step === s ? 1.1 : 1 }}
            >
              {s}
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left: Configuration Steps */}
          <div className="space-y-8">
            {/* Step 1: Vehicle Selection */}
            <AnimatePresence mode="wait">
              {step === 1 && (
                <ConfigStep title="1. Araç Seçimi" isActive={true}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-metallic mb-2">Marka:</label>
                      <select
                        value={selectedBrand || ''}
                        onChange={(e) => {
                          setSelectedBrand(parseInt(e.target.value));
                          setSelectedModel('');
                        }}
                        className="w-full p-3 bg-white border border-gray-300 rounded-lg text-black"
                      >
                        <option value="">Marka Seçin</option>
                        {brands.map((brand) => (
                          <option key={brand.id} value={brand.id}>
                            {brand.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    {selectedBrand && (
                      <div>
                        <label className="block text-metallic mb-2">Model:</label>
                        <select
                          value={selectedModel}
                          onChange={(e) => setSelectedModel(e.target.value)}
                          className="w-full p-3 bg-white border border-gray-300 rounded-lg text-black"
                        >
                          <option value="">Model Seçin</option>
                          {(modelsByBrand as Record<number, string[]>) [selectedBrand]?.map((model: string) => (
                            <option key={model} value={model}>
                              {model}
                            </option>
                          )) || []}
                        </select>
                      </div>
                    )}
                    <motion.button
                      onClick={() => selectedModel && setStep(2)}
                      disabled={!selectedModel}
                      className="btn-primary w-full mt-4 disabled:opacity-50"
                      whileHover={{ scale: 1.02 }}
                    >
                      İleri
                    </motion.button>
                  </div>
                </ConfigStep>
              )}

              {/* Step 2: Speaker Configuration */}
              {step === 2 && (
                <ConfigStep title="2. Hoparlör Konfigürasyonu" isActive={true}>
                  <div className="grid md:grid-cols-3 gap-4">
                    {speakerTypes.map((type) => (
                      <motion.button
                        key={type.id}
                        onClick={() => {
                          setSelectedSpeakerType(type.id);
                          setCurrentSpeaker(type);
                        }}
                        className={`p-4 rounded-lg border-2 ${
                          selectedSpeakerType === type.id
                            ? 'border-primary-500 bg-primary-500/20'
                            : 'border-white/20 bg-white/10'
                        } text-left hover:bg-primary-500/30 transition-colors`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <img src={type.image} alt={type.label} className="w-full h-20 object-cover rounded mb-2" />
                        <h4 className="font-semibold">{type.label}</h4>
                        <p className="text-sm text-metallic">Standart 4 hoparlör</p>
                      </motion.button>
                    ))}
                  </div>
                  <motion.button
                    onClick={() => selectedSpeakerType && setStep(3)}
                    disabled={!selectedSpeakerType}
                    className="btn-primary w-full mt-6 disabled:opacity-50"
                    whileHover={{ scale: 1.02 }}
                  >
                    İleri
                  </motion.button>
                </ConfigStep>
              )}

              {/* Step 3: Add-ons */}
              {step === 3 && (
                <ConfigStep title="3. Ek Özellikler" isActive={true}>
                  <div className="space-y-3">
                    {addOns.map((addOn) => (
                      <motion.label
                        key={addOn.id}
                        className="flex items-center p-3 bg-white/10 rounded-lg cursor-pointer hover:bg-white/20 transition-colors"
                        whileHover={{ scale: 1.02 }}
                      >
                        <input
                          type="checkbox"
                          checked={selectedAddOns.includes(addOn.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedAddOns([...selectedAddOns, addOn.id]);
                            } else {
                              setSelectedAddOns(selectedAddOns.filter((id) => id !== addOn.id));
                            }
                          }}
                          className="mr-3 w-4 h-4 text-primary-500 rounded"
                        />
                        <span className="text-white">{addOn.label}</span>
                        <span className="ml-auto text-primary-500 font-semibold">+{addOn.price} TL</span>
                      </motion.label>
                    ))}
                    <div className="pt-4 border-t border-white/20">
                      <h4 className="text-lg font-semibold text-primary-500 mb-2">Kumaş Rengi Seçimi (+100 TL)</h4>
                      {['krem', 'mavi', 'kırmızı', 'sarı'].map((color) => (
                        <motion.label
                          key={color}
                          className="flex items-center p-3 bg-white/10 rounded-lg cursor-pointer hover:bg-white/20 transition-colors"
                          whileHover={{ scale: 1.02 }}
                        >
                          <input
                            type="radio"
                            name="fabric"
                            value={color}
                            checked={selectedFabric === color}
                            onChange={(e) => setSelectedFabric(e.target.value)}
                            className="mr-3 w-4 h-4 text-primary-500 rounded"
                          />
                          <span className="text-white capitalize">{color}</span>
                          <span className="ml-auto text-primary-500 font-semibold">+100 TL</span>
                        </motion.label>
                      ))}
                    </div>
                    <div className="pt-4 border-t border-white/20">
                      <motion.label
                        className="flex items-center p-3 bg-white/10 rounded-lg cursor-pointer hover:bg-white/20 transition-colors"
                        whileHover={{ scale: 1.02 }}
                      >
                        <input
                          type="checkbox"
                          checked={selectedEmbedded}
                          onChange={(e) => setSelectedEmbedded(e.target.checked)}
                          className="mr-3 w-4 h-4 text-primary-500 rounded"
                        />
                        <span className="text-white">Çemberler Gömmeli (+150 TL)</span>
                        <span className="ml-auto text-primary-500 font-semibold">+150 TL</span>
                      </motion.label>
                      <AnimatePresence>
                        {selectedEmbedded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="pt-2"
                          >
                            <h5 className="text-md font-semibold text-primary-500 mb-2">Çember Rengi Seçimi</h5>
                            {['beyaz', 'siyah', 'gümüş'].map((color) => (
                              <motion.label
                                key={color}
                                className="flex items-center p-2 bg-white/10 rounded cursor-pointer hover:bg-white/20 transition-colors ml-6"
                                whileHover={{ scale: 1.02 }}
                              >
                                <input
                                  type="radio"
                                  name="circleColor"
                                  value={color}
                                  checked={selectedCircleColor === color}
                                  onChange={(e) => setSelectedCircleColor(e.target.value)}
                                  className="mr-3 w-4 h-4 text-primary-500 rounded"
                                />
                                <span className="text-white capitalize">{color}</span>
                              </motion.label>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                  <div className="flex space-x-4 mt-6">
                    <motion.button
                      onClick={() => setStep(2)}
                      className="flex-1 py-3 px-6 border border-white/20 rounded-lg text-metallic hover:bg-white/10 transition-colors"
                      whileHover={{ scale: 1.02 }}
                    >
                      Geri
                    </motion.button>
                    <motion.button
                      onClick={handleAddToCart}
                      className="btn-primary flex-1"
                      whileHover={{ scale: 1.02 }}
                    >
                      Sepete Ekle ({price} TL)
                    </motion.button>
                  </div>
                </ConfigStep>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <AnimatePresence>
              {step > 1 && (
                <motion.button
                  onClick={() => setStep(step - 1)}
                  className="w-full py-3 bg-white/10 border border-white/20 rounded-lg text-metallic hover:bg-white/20"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  Önceki Adım
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* Right: Live Preview and Price */}
          <div className="space-y-8">
            <ProductPreview config={{ speakerType: currentSpeaker.id, image: currentSpeaker.image }} />
            <div className="card-tech p-6">
              <h3 className="text-2xl font-bold text-center mb-4 text-primary-500">Canlı Fiyat</h3>
              <div className="text-center space-y-2">
                <p className="text-4xl font-bold text-neon">{price} TL</p>
                {selectedModel && (
                  <p className="text-metallic">
                    {brands.find(b => b.id === selectedBrand)?.name} {selectedModel} - {selectedSpeakerType}
                    {selectedAddOns.length > 0 && (
                      <span className="block text-sm">+ {selectedAddOns.map(id => addOns.find(a => a.id === id)?.label).join(', ')}</span>
                    )}
                  </p>
                )}
              </div>
            </div>
            <Link href="/">
              <motion.button className="w-full btn-primary">
                Ana Sayfaya Dön
              </motion.button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}