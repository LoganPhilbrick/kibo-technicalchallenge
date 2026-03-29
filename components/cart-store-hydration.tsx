"use client";

import { useEffect } from "react";

import { useCartStore } from "@/lib/cart-store";

/** Calls persist rehydrate on the client (pairs with skipHydration on the store). */
export function CartStoreHydration() {
  useEffect(() => {
    void useCartStore.persist.rehydrate();
  }, []);

  return null;
}
