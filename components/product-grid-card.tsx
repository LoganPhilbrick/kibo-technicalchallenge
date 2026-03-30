"use client";

import Image from "next/image";

import { AddToCartButton } from "@/components/add-to-cart-button";
import { truncateText } from "@/lib/truncate-text";
import type { Product } from "@/lib/types/product";

export const productCardShell =
  "overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-neutral-800 dark:bg-neutral-950";

type ProductGridCardProps = {
  product: Product;
};

export function ProductGridCard({ product }: ProductGridCardProps) {
  return (
    <li className={`flex flex-col ${productCardShell}`}>
      <div className="relative aspect-square w-full bg-neutral-50 dark:bg-neutral-900">
        <Image
          src={product.image}
          alt={product.title}
          fill
          className="object-contain p-12"
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
          {truncateText(product.description, 140)}
        </p>
        <AddToCartButton product={product} />
      </div>
    </li>
  );
}
