import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  id: string;
  vehicleBrand: string;
  vehicleModel: string;
  speakerType: string;
  speakerCount: number;
  tweeterCount: number;
  options: string[];
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  previewImageUrl?: string;
}

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'id'>) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (newItem) => {
        const itemId = Date.now().toString(); // Simple ID, later UUID
        const item: CartItem = { ...newItem, id: itemId };
        set((state) => ({ items: [...state.items, item] }));
      },
      updateQuantity: (id, quantity) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity, totalPrice: item.unitPrice * quantity } : item
          ),
        }));
      },
      removeItem: (id) => {
        set((state) => ({ items: state.items.filter((item) => item.id !== id) }));
      },
      clearCart: () => set({ items: [] }),
      getTotalPrice: () => {
        const { items } = get();
        return items.reduce((sum, item) => sum + item.totalPrice, 0);
      },
    }),
    {
      name: 'cart-storage', // Persist in localStorage
    }
  )
);