'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type CartItem = {
  productId: number;
  slug: string;
  title: string;
  priceCents: number;
  imageUrl?: string;
  quantity: number;
};

type CartState = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: number) => void;
  setQuantity: (productId: number, quantity: number) => void;
  clear: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const existing = get().items.find((it) => it.productId === item.productId);
        if (existing) {
          set({
            items: get().items.map((it) =>
              it.productId === item.productId ? { ...it, quantity: it.quantity + item.quantity } : it
            ),
          });
        } else {
          set({ items: [...get().items, item] });
        }
      },
      removeItem: (productId) => set({ items: get().items.filter((it) => it.productId !== productId) }),
      setQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          set({ items: get().items.filter((it) => it.productId !== productId) });
        } else {
          set({ items: get().items.map((it) => (it.productId === productId ? { ...it, quantity } : it)) });
        }
      },
      clear: () => set({ items: [] }),
    }),
    {
      name: 'cart',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    }
  )
);