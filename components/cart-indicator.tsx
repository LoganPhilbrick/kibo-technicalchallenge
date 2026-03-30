"use client";

import {
  selectCartItemCount,
  useCartStore,
} from "@/lib/cart-store";

export function CartIndicator() {
  const cartItemCount = useCartStore(selectCartItemCount);
  const openCart = useCartStore((s) => s.openCart);

  return (
    <button
      type="button"
      onClick={openCart}
      className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:bg-neutral-800"
      aria-live="polite"
      aria-label={`Open cart, ${cartItemCount} items`}
    >
      <span aria-hidden>Cart</span>
      <span className="tabular-nums text-neutral-600 dark:text-neutral-400">
        {cartItemCount === 0 ? "0 items" : `${cartItemCount} ${cartItemCount === 1 ? "item" : "items"}`}
      </span>
    </button>
  );
}
