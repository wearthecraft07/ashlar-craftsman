"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@/types";

type CartState = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "id">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clear: () => void;
  totalItems: () => number;
  subtotal: () => number;
};

function sameCustom(a: CartItem, b: Omit<CartItem, "id">) {
  return (
    a.productId === b.productId &&
    a.size === b.size &&
    a.color.id === b.color.id &&
    JSON.stringify(a.avatarConfig) === JSON.stringify(b.avatarConfig)
  );
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const existing = get().items.find((i) => sameCustom(i, item));
        if (existing) {
          set({
            items: get().items.map((i) =>
              i.id === existing.id
                ? { ...i, quantity: i.quantity + item.quantity }
                : i,
            ),
          });
          return;
        }
        set({
          items: [
            ...get().items,
            { ...item, id: `${item.productId}-${Date.now()}` },
          ],
        });
      },
      removeItem: (id) =>
        set({ items: get().items.filter((item) => item.id !== id) }),
      updateQuantity: (id, quantity) =>
        set({
          items: get()
            .items.map((item) =>
              item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item,
            )
            .filter((item) => item.quantity > 0),
        }),
      clear: () => set({ items: [] }),
      totalItems: () =>
        get().items.reduce((sum, item) => sum + item.quantity, 0),
      subtotal: () =>
        get().items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0,
        ),
    }),
    { name: "ashlar-cart" },
  ),
);
