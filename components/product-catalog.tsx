"use client";

import Image from "next/image";

import { useCartStore } from "@/lib/cart-store";
import type { Product } from "@/lib/types/product";

function truncate(text: string, maxLen: number) {
  if (text.length <= maxLen) return text;
  return `${text.slice(0, maxLen).trimEnd()}…`;
}

type ProductCatalogProps = {
  products: Product[];
};

export function ProductCatalog({ products }: ProductCatalogProps) {
  const addItem = useCartStore((s) => s.addItem);

  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <li
          key={product.id}
          className="flex flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-neutral-800 dark:bg-neutral-950"
        >
          <div className="relative aspect-square w-full bg-neutral-50 dark:bg-neutral-900">
            <Image
              src={product.image}
              alt={product.title}
              fill
              className="object-contain p-6"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </div>
          <div className="flex flex-1 flex-col gap-2 border-t border-neutral-200 p-4 dark:border-neutral-800">
            <h2 className="font-sans text-base font-medium leading-snug text-foreground line-clamp-2">
              {product.title}
            </h2>
            <p className="font-sans text-lg font-semibold tabular-nums text-foreground">
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(product.price)}
            </p>
            <p className="font-sans text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 line-clamp-3">
              {truncate(product.description, 140)}
            </p>
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
              className="mt-auto rounded-lg bg-foreground px-3 py-2 text-center text-sm font-medium text-background transition-opacity hover:opacity-90"
            >
              Add to cart
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
