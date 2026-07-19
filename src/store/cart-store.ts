"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { CartItem } from "@/types";

type CartState = {
  items: CartItem[];
  couponCode: string | null;
  discountAmount: number;
  lastAddedAt: number;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, variantId: string | null) => void;
  updateQuantity: (productId: string, variantId: string | null, quantity: number) => void;
  clear: () => void;
  applyCoupon: (code: string, discountAmount: number) => void;
  removeCoupon: () => void;
  totalCount: () => number;
  subtotal: () => number;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      couponCode: null,
      discountAmount: 0,
      lastAddedAt: 0,
      addItem: (item) => {
        set((state) => {
          const existingIndex = state.items.findIndex(
            (i) => i.productId === item.productId && i.variantId === item.variantId,
          );
          if (existingIndex > -1) {
            const items = [...state.items];
            const nextQty = Math.min(
              items[existingIndex].quantity + item.quantity,
              item.stock || 999,
            );
            items[existingIndex] = { ...items[existingIndex], quantity: nextQty };
            return { items, lastAddedAt: Date.now() };
          }
          return { items: [...state.items, item], lastAddedAt: Date.now() };
        });
      },
      removeItem: (productId, variantId) => {
        set((state) => ({
          items: state.items.filter(
            (i) => !(i.productId === productId && i.variantId === variantId),
          ),
        }));
      },
      updateQuantity: (productId, variantId, quantity) => {
        set((state) => ({
          items: state.items
            .map((i) =>
              i.productId === productId && i.variantId === variantId
                ? { ...i, quantity: Math.max(1, Math.min(quantity, i.stock || 999)) }
                : i,
            )
            .filter((i) => i.quantity > 0),
        }));
      },
      clear: () => set({ items: [], couponCode: null, discountAmount: 0 }),
      applyCoupon: (code, discountAmount) => set({ couponCode: code, discountAmount }),
      removeCoupon: () => set({ couponCode: null, discountAmount: 0 }),
      totalCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      subtotal: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    {
      name: "cafe-macha-cart",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    },
  ),
);
