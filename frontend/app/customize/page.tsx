'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useCartStore } from '@/lib/stores/cart';

// Mock data for brands and models (later from API)
const brands = [
  { id: 1, name: 'Volkswagen' },
  { id: 2, name: 'Toyota' },
  { id: 3, name: 'BMW' },
  { id: 4, name: 'Mercedes' },
  { id: 5, name: 'Audi' },
  { id: 6, name: 'Ford' },
  { id: 7, name: 'Honda' },
  { id: 8, name: 'Hyundai' },
  { id: 9, name: 'Nissan' },
  { id: 10, name: 'Peugeot' },
  { id: 11, name: 'Renault' },
  { id: 12, name: 'Volvo' },
  { id: 13, name: 'Kia' },
  { id: 14, name: 'Opel' },
  { id: 15, name: 'Tofaş' },
  { id: 16, name: 'Fiat' },
  { id: 17, name: 'Seat' },
  { id: 18, name: 'Skoda' },
  { id: 19, name: 'Mitsubishi' },
  { id: 20, name: 'Mazda' }
];

const modelsByBrand = {
  1: ['Golf', 'Passat', 'Polo', 'Tiguan', 'Jetta', 'Bora', 'Vento'],
  2: ['Corolla', 'Camry', 'Yaris', 'RAV4', 'Hilux', 'Avensis', 'Carina'],
  3: ['3 Series', '5 Series', '7 Series', 'X3', 'X5', 'E30', 'E36'],
  4: ['C-Class', 'E-Class', 'A-Class', 'GLA', 'S-Class', '190E', 'W124'],
  5: ['A3', 'A4', 'A6', 'Q5', 'Q7', '80', '100'],
  6: ['Focus', 'Fiesta', 'Mondeo', 'Escort', 'Sierra', 'Taunus'],
  7: ['Civic', 'Accord', 'CR-V', 'Jazz', 'HR-V', 'Prelude'],
  8: ['i10', 'i20', 'Elantra', 'Tucson', 'Santa Fe', 'Accent', 'Getz'],
  9: ['Micra', 'Qashqai', 'X-Trail', 'Altima', 'GTR', 'Primera', 'Sunny'],
  10: ['208', '308', '508', '3008', '5008', '405', '406', '205'],
  11: ['Clio', 'Megane', 'Talisman', 'Kadjar', 'Captur',
    'R12', 'R19', 'Broadway', 'Toros', 'Symbol',
    'R21', 'R9', 'Fluence', 'Laguna'
  ],
  12: ['S60', 'S90', 'XC40', 'XC60', 'XC90', '850', '940'],
  13: ['Picanto', 'Rio', 'Ceed', 'Sportage', 'Sorento', 'Sephia'],
  14: ['Corsa', 'Astra', 'Insignia', 'Mokka', 'Grandland', 'Vectra', 'Kadett'],
  15: ['Doğan', 'Şahin', 'Kartal', 'Serçe', 'Murat 124', 'Murat 131', 'SLX'],
  16: ['Egea', 'Linea', 'Albea', 'Palio', 'Tempra', 'Tipo', 'Uno', 'Regata'],
  17: ['Ibiza', 'Leon', 'Toledo', 'Cordoba'],
  18: ['Octavia', 'Superb', 'Fabia', 'Favorit', 'Felicia'],
  19: ['Lancer', 'Colt', 'Carisma', 'Galant', 'Pajero'],
  20: ['323', '626', 'MX-5', 'Mazda 3', 'Mazda 6']
};

// Speaker types
const speakerTypes = [
  { id: '4x20', label: '4x20 cm', image: '/speakers/$1.png' },
  { id: '4x16', label: '4x16 cm', image: '/speakers/$1.png' },
  { id: '2-20x2-216', label: '2x20cm + 2x16cm', image: '/speakers/$1.png' },
  { id: '4-oval', label: '4 Oval', image: '/speakers/$1.png' },
  
  
];

// Category-specific speaker options
const categorySpeakerOptions: Record<string, typeof speakerTypes> = {
  "bagaj kapağı pandizot": speakerTypes,
  ceplik: [
    { id: '20lik', label: '20 lik', image: '/speakers/20cm.png' },
    { id: '16lik', label: '16 lık', image: '/speakers/16cm.png' },
    { id: 'oval', label: 'Oval', image: '/speakers/oval.png' },
    { id: '2-16lik', label: '2 16 lık', image: '/speakers/16cm.png' },
  ],
  "dik pandizot": speakerTypes,
  direkler: [
    { id: '1-16', label: '1 16', image: '/speakers/16cm.png' },
    { id: '1-16-1-dom-tiz', label: '1 16 1 dom tiz', image: '/speakers/domtiz.png' },
    { id: '2-16', label: '2 16', image: '/speakers/16cm.png' },
  ],
  Kabinler: [
    { id: '1-38', label: '1 38', image: '/speakers/20cm.png' },
    { id: '2-38', label: '2 38', image: '/speakers/20cm.png' },
    { id: '1-30', label: '1 30luk', image: '/speakers/20cm.png' },
    { id: '2-30', label: '2 30 luk', image: '/speakers/20cm.png' },
    { id: '1-30-1-38', label: '1 30 luk 1 38 lik', image: '/speakers/20cm.png' },
  ],
  "yükseltme": [
    { id: '1-20', label: '1 20lik', image: '/speakers/20cm.png' },
    { id: '1-16', label: '1 16 lık', image: '/speakers/16cm.png' },
    { id: '1-20-1-16', label: '1 20 1,16 lık', image: '/speakers/20cm.png' },
    { id: '1-25', label: '1 25 lik', image: '/speakers/20cm.png' },
  ],
  
  pandizot: speakerTypes,
  "kapak resmi": speakerTypes,
  
  // Others default to speakerTypes
};

// Add-ons
const addOns = [
  { id: 'tweeters', label: '2 Tiz Ekle', price: 60 },
  { id: 'amplifier', label: 'Amplifikatör Ekle', price: 150 },
  { id: 'subwoofer', label: 'Subwoofer Ekle', price: 200 },
];

const productCategories: Record<string, { special: boolean; images: string[] }> = {
  "bagaj dizaynı": {
    special: true,
    images: ["hp1-1.jpg", "hp1.jpg", "hp2.jpg"]
  },
  "bagaj kapağı pandizot": {
    special: false,
    images: ["hp1.jpg", "hp2.jpg"]
  },
  ceplik: {
    special: false,
    images: ["hp1-1.jpg", "hp1.jpg"]
  },
  "dik pandizot": {
    special: false,
    images: ["hp1.jpg", "hp2.jpg", "hp3.jpg", "hp4.jpg", "hp5.jpg"]
  },
  direkler: {
    special: false,
    images: ["hp1.jpg", "hp2.jpg", "hp3.jpg", "hp4.jpg"]
  },
  Kabinler: {
    special: false,
    images: ["hp1.jpg", "hp2.jpg", "hp3.jpg", "hp4.jpg", "hp5.jpg", "hp6.jpg", "hp7.jpg"]
  },
  pandizot: {
    special: false,
    images: [...Array.from({ length: 66 }, (_, i) => `hp${i + 1}.jpg`), "hp5-1.jpg", "hp9-1.jpg"]
  },
  "toptan siparişler": {
    special: true,
    images: ["hp1.jpg", "hp2.jpg"]
  },
  yükseltme: {
    special: false,
    images: ["hp1.jpg", "hp2.jpg"]
  }
};

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
const ProductPreview = ({ config, positions, onPositionChange }: { config: { speakerType: string; image: string; category?: string }; positions: {id: string; x: number; y: number}[]; onPositionChange: (id: string, x: number, y: number) => void }) => {
  const categoryImages = productCategories[config.category || '']?.images || [];
  const previewImage = categoryImages[0] ? `/images/hakanpandizot/${encodeURIComponent(config.category || '')}/${categoryImages[0]}` : config.image;
  const previewSize = 300; // Fixed size for preview area

  const handleDragEnd = (id: string, info: {point: {x: number; y: number}}) => {
    const newX = Math.max(0, Math.min(previewSize - 50, info.point.x)); // Constrain to bounds, assume circle w=50
    const newY = Math.max(0, Math.min(previewSize - 50, info.point.y));
    onPositionChange(id, newX, newY);
  };

  return (
    <motion.div
      className="card-tech p-8 text-center relative"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative w-[300px] h-[200px] mx-auto bg-gray-800 rounded-lg border-2 border-dashed border-gray-400 mb-4 overflow-hidden">
        {/* Pandizot dashed outline - simple rectangle for base */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 300 200">
          <rect x="10" y="10" width="280" height="180" fill="none" stroke="#6b7280" strokeDasharray="5,5" strokeWidth="2"/>
          {/* Optional: Add more dashed lines for pandizot shape if needed */}
        </svg>
        {/* Background image overlay if available */}
        {previewImage && (
          <img src={previewImage} alt="Pandizot base" className="absolute inset-0 w-full h-full object-cover opacity-30" />
        )}
        {/* Draggable speaker circles */}
        <AnimatePresence>
          {positions.map(({id, x, y}) => (
            <motion.img
              key={id}
              src={config.image}
              alt="Hoparlör"
              className="absolute w-12 h-12 rounded-full border-2 border-white shadow-lg cursor-move object-cover"
              style={{ left: x, top: y }}
              drag
              dragConstraints={{ top: 0, left: 0, right: previewSize - 50, bottom: 200 - 50 }}
              dragElastic={0.2}
              onDragEnd={(event, info) => handleDragEnd(id, info)}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          ))}
        </AnimatePresence>
      </div>
      <h3 className="text-xl font-semibold text-primary-500">Önizleme: {config.category ? `${config.category} - ${config.speakerType}` : config.speakerType}</h3>
      <p className="text-metallic">Hoparlör çemberlerini sürükleyerek konumlandırın.</p>
    </motion.div>
  );
};

// Gallery Modal Component
const GalleryModal = ({ images, currentCategory, setCurrentImageIndex, setIsImageModalOpen, onClose }: { images: string[]; currentCategory: string; setCurrentImageIndex: (index: number) => void; setIsImageModalOpen: (open: boolean) => void; onClose: () => void }) => {
  if (images.length === 0) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="relative max-w-6xl max-h-full overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}
      >
        <div className="grid grid-cols-3 gap-4 p-4">
          {images.map((imgName, index) => (
            <motion.img
              key={index}
              src={`/images/hakanpandizot/${encodeURIComponent(currentCategory)}/${imgName}`}
              alt={`Galeri ${index + 1}`}
              className="w-full h-48 object-cover rounded cursor-pointer hover:opacity-80"
              onClick={() => {
                setCurrentImageIndex(index);
                setIsImageModalOpen(true);
              }}
              whileHover={{ scale: 1.05 }}
            />
          ))}
        </div>
        <button
          className="absolute top-4 right-4 text-white text-2xl"
          onClick={onClose}
        >
          ×
        </button>
      </motion.div>
    </motion.div>
  );
};

// Full Image Modal
const ImageModal = ({ imageUrl, index, total, onClose, onNext, onPrev }: { imageUrl: string; index: number; total: number; onClose: () => void; onNext: () => void; onPrev: () => void }) => (
  <motion.div
    className="fixed inset-0 bg-black z-50 flex items-center justify-center p-4"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    onClick={onClose}
  >
    <motion.img
      src={imageUrl}
      alt="Tam boyut"
      className="max-w-full max-h-full object-contain"
      onClick={(e) => e.stopPropagation()}
    />
    <button
      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-3xl bg-black/50 rounded-full w-12 h-12"
      onClick={(e) => { e.stopPropagation(); onPrev(); }}
    >
      ‹
    </button>
    <button
      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-3xl bg-black/50 rounded-full w-12 h-12"
      onClick={(e) => { e.stopPropagation(); onNext(); }}
    >
      ›
    </button>
    <button
      className="absolute top-4 right-4 text-white text-2xl"
      onClick={onClose}
    >
      ×
    </button>
    <p className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white">
      {index + 1} / {total}
    </p>
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
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentSpeaker, setCurrentSpeaker] = useState(speakerTypes[0]);
  const [speakerPositions, setSpeakerPositions] = useState<{id: string; x: number; y: number}[]>([]);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [currentCategoryImages, setCurrentCategoryImages] = useState<string[]>([]);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentCategory, setCurrentCategory] = useState('');
  const addItem = useCartStore((state) => state.addItem);

  const currentSpeakerTypes = useMemo(() => {
    return categorySpeakerOptions[selectedCategory] || speakerTypes;
  }, [selectedCategory]);

  useEffect(() => {
    if (step === 2) {
      setSelectedSpeakerType(currentSpeakerTypes[0]?.id || '');
      setCurrentSpeaker(currentSpeakerTypes[0] || speakerTypes[0]);
    }
  }, [step, currentSpeakerTypes]);

  useEffect(() => {
    if (selectedSpeakerType) {
      // Initialize positions based on speaker type, e.g., 4 speakers
      const numSpeakers = selectedSpeakerType.includes('4') ? 4 : selectedSpeakerType.includes('2') ? 2 : 1;
      const initialPositions = Array.from({ length: numSpeakers }, (_, i) => ({
        id: `speaker-${i}`,
        x: 100 + i * 80, // Horizontal spread
        y: 100 + (i % 2) * 60, // Vertical variation
      }));
      setSpeakerPositions(initialPositions);
    }
  }, [selectedSpeakerType]);

  const price = calculatePrice(selectedBrand || 1, selectedModel, selectedSpeakerType, selectedAddOns, selectedFabric, selectedEmbedded);

  const handleAddToCart = () => {
    if (!selectedBrand || !selectedModel || !selectedSpeakerType || !selectedCategory) {
      alert('Lütfen tüm gerekli alanları doldurun.');
      return;
    }
    const addOnLabels = selectedAddOns.map(id => addOns.find(a => a.id === id)?.label || id).join(', ');
    addItem({
      vehicleBrand: brands.find(b => b.id === selectedBrand)?.name || '',
      vehicleModel: selectedModel,
      category: selectedCategory,
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
    <>
      <div className="min-h-screen bg-tech-dark py-12">
        <div className="container mx-auto px-4">
      
          {/* Product Categories Gallery */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-center mb-8 text-white">Ürün Kategorileri</h2>
            <p className="text-center text-metallic mb-6 max-w-2xl mx-auto">Ürün çeşitliliğimizi kategorilere göre inceleyin ve özelleştirmelerinizi yapın.</p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(productCategories).map(([categoryName, { special, images }]) => (
                <motion.div
                  key={categoryName}
                  className="bg-white/10 rounded-lg p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h3 className="text-xl font-semibold text-white mb-4 text-center capitalize">{categoryName.replace(/([A-Z])/g, ' $1')}</h3>
                  <div 
                    className="relative mb-4 cursor-pointer group"
                    onClick={() => {
                      setCurrentCategory(categoryName);
                      setCurrentCategoryImages(images);
                      setIsGalleryOpen(true);
                    }}
                  >
                    {/* Collage-style: Main image + thumbnails */}
                    <img
                      src={`/images/hakanpandizot/${encodeURIComponent(categoryName)}/${images[0]}`}
                      alt={`${categoryName} ana`}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    {/* Thumbnails overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/50 rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex gap-1">
                        {images.slice(1, 5).map((imgName) => (
                          <img
                            key={imgName}
                            src={`/images/hakanpandizot/${encodeURIComponent(categoryName)}/${imgName}`}
                            alt={`${categoryName} küçük`}
                            className="w-12 h-12 object-cover rounded"
                          />
                        ))}
                        {images.length > 5 && (
                          <div className="w-12 h-12 bg-black/50 rounded flex items-center justify-center text-white text-xs">
                            +{images.length - 5}
                          </div>
                        )}
                      </div>
                    </div>
                    <p className="text-center text-sm text-metallic mt-2 hover:text-primary-500 transition-colors">
                      Galeriyi Görüntüle ({images.length} resim)
                    </p>
                  </div>
                  <div className="text-center">
                    {special ? (
                      <motion.button
                        className="w-full py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        whileHover={{ scale: 1.02 }}
                        onClick={() => window.location.href = "tel:05493389738"}
                      >
                        {categoryName === 'toptan siparişler' ? 'İletişime Geçin' : 'Dükkana Gelin (Özel)'}
                      </motion.button>
                    ) : (
                      <motion.button
                        className="w-full py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                        whileHover={{ scale: 1.02 }}
                        onClick={() => { setSelectedCategory(categoryName); setStep(1); }}
                      >
                        Sipariş Ver
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
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
                      {currentSpeakerTypes.map((type) => (
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
                      {selectedCategory !== 'Kabinler' && (
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
                      )}
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
              <ProductPreview 
                config={{ speakerType: currentSpeaker.id, image: currentSpeaker.image, category: selectedCategory }} 
                positions={speakerPositions}
                onPositionChange={(id, x, y) => {
                  setSpeakerPositions(prev => prev.map(p => p.id === id ? { ...p, x, y } : p));
                }}
              />
              <div className="card-tech p-6">
                <h3 className="text-2xl font-bold text-center mb-4 text-primary-500">Canlı Fiyat</h3>
                <div className="text-center space-y-2">
                  <p className="text-4xl font-bold text-neon">{price} TL</p>
                  {selectedModel && (
                    <p className="text-metallic">
                      {brands.find(b => b.id === selectedBrand)?.name} {selectedModel} - {selectedCategory} - {selectedSpeakerType}
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

          {/* Contact Section */}
          <div className="lg:col-span-2 mt-12 p-8 bg-white/10 rounded-lg">
            <h2 className="text-2xl font-bold text-center mb-6 text-white">Özel Tasarımlar İçin İletişim</h2>
            <p className="text-center text-metallic mb-6">Özel istekleriniz için doğrudan bizimle görüşün. Kargo seçeneği yoktur, ürünler dükkandan teslim alınır.</p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-6">
              <motion.a
                href="tel:05493389738"
                className="btn-primary py-3 px-6 text-lg"
                whileHover={{ scale: 1.05 }}
              >
                Ara: 0549 338 97 38
              </motion.a>
              <motion.a
                href="https://www.instagram.com/kayseri_hakanpandizot/"
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-6 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
                whileHover={{ scale: 1.05 }}
              >
                Instagram
              </motion.a>
            </div>
            <p className="text-center text-sm text-metallic">Not: Bagaj dizaynı gibi özel ürünler için online ödeme yoktur.</p>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {isGalleryOpen && (
          <GalleryModal 
            images={currentCategoryImages} 
            currentCategory={currentCategory}
            setCurrentImageIndex={setCurrentImageIndex}
            setIsImageModalOpen={setIsImageModalOpen}
            onClose={() => setIsGalleryOpen(false)} 
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isImageModalOpen && (
          <ImageModal
            imageUrl={`/images/hakanpandizot/${encodeURIComponent(currentCategory)}/${currentCategoryImages[currentImageIndex]}`}
            index={currentImageIndex}
            total={currentCategoryImages.length}
            onClose={() => setIsImageModalOpen(false)}
            onNext={() => setCurrentImageIndex((prev) => (prev + 1) % currentCategoryImages.length)}
            onPrev={() => setCurrentImageIndex((prev) => (prev - 1 + currentCategoryImages.length) % currentCategoryImages.length)}
          />
        )}
      </AnimatePresence>
    </>
  );
}