"use client";

import { useCartStore } from "@/lib/cart-store";
import type { Product } from "@/lib/types/product";

const btnClass =
  "mt-auto rounded-lg bg-neutral-900 px-3 py-2 text-center text-sm font-medium text-background transition-colors hover:bg-neutral-100 dark:bg-neutral-50 dark:hover:bg-neutral-100 hover:opacity-90";

type AddToCartButtonProps = {
  product: Product;
};

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const addItem = useCartStore((s) => s.addItem);
  return (
    <button
      type="button"
      onClick={() =>
        addItem({
          id: product.id,
          title: product.title,
          price: product.price,
          image: product.image,
        })
      }
      className={btnClass}
    >
      Add to cart
    </button>
  );
}
