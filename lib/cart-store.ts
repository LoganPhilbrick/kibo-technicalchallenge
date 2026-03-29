import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { Product } from "@/lib/types/product";

export type CartLine = Pick<Product, "id" | "title" | "price" | "image"> & {
  quantity: number;
};

type CartProduct = Pick<Product, "id" | "title" | "price" | "image">;

type CartState = {
  isOpen: boolean;
  items: CartLine[];
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (product: CartProduct) => void;
  removeItem: (productId: number) => void;
  setQuantity: (productId: number, quantity: number) => void;
  clear: () => void;
};

const storage = createJSONStorage(() => {
  if (typeof window === "undefined") {
    return {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
    };
  }
  return localStorage;
});

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      isOpen: false,
      items: [],
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      addItem: (product) =>
        set((state) => {
          const index = state.items.findIndex((line) => line.id === product.id);
          if (index >= 0) {
            const next = [...state.items];
            const line = next[index];
            next[index] = { ...line, quantity: line.quantity + 1 };
            return { items: next, isOpen: true };
          }
          return {
            items: [...state.items, { ...product, quantity: 1 }],
            isOpen: true,
          };
        }),
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((line) => line.id !== productId),
        })),
      setQuantity: (productId, quantity) =>
        set((state) => {
          if (quantity <= 0) {
            return {
              items: state.items.filter((line) => line.id !== productId),
            };
          }
          return {
            items: state.items.map((line) =>
              line.id === productId ? { ...line, quantity } : line
            ),
          };
        }),
      clear: () => set({ items: [] }),
    }),
    {
      name: "kibo-cart",
      storage,
      partialize: (state) => ({ items: state.items }),
      skipHydration: true,
    }
  )
);

export function selectCartItemCount(state: CartState): number {
  return state.items.reduce((sum, line) => sum + line.quantity, 0);
}

export function selectCartTotal(state: CartState): number {
  return state.items.reduce(
    (sum, line) => sum + line.price * line.quantity,
    0
  );
}
