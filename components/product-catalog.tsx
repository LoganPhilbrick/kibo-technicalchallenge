"use client";

import Image from "next/image";

import { AddToCartButton } from "@/components/add-to-cart-button";
import {
  ProductGridCard,
  productCardShell,
} from "@/components/product-grid-card";
import { truncateText } from "@/lib/truncate-text";
import type { Product } from "@/lib/types/product";

type ProductCatalogProps = {
  products: Product[];
};

export function ProductCatalog({ products }: ProductCatalogProps) {
  const [featured, ...rest] = products;
  if (!featured) return null;

  return (
    <div className="flex flex-col gap-8">
      <section className={productCardShell}>
        <div className="flex flex-col md:flex-row md:items-stretch">
          <div className="relative aspect-[4/3] w-full shrink-0 bg-neutral-50 sm:aspect-[16/9] md:aspect-auto md:min-h-[220px] md:w-[42%] dark:bg-neutral-900">
            <Image
              src={featured.image}
              alt={featured.title}
              fill
              className="object-contain p-8 md:p-10"
              sizes="(max-width: 768px) 100vw, 42vw"
              priority
            />
          </div>
          <div className="flex flex-1 flex-col gap-3 border-t border-neutral-200 p-5 md:border-l md:border-t-0 md:p-6 dark:border-neutral-800">
            <h2 className="font-sans text-xl font-semibold leading-snug text-foreground sm:text-2xl">
              {featured.title}
            </h2>
            <p className="font-sans text-2xl font-semibold tabular-nums text-foreground">
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(featured.price)}
            </p>
            <p className="font-sans text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 sm:text-base line-clamp-5">
              {truncateText(featured.description, 130)}
            </p>
            <AddToCartButton product={featured} />
          </div>
        </div>
      </section>

      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {rest.map((product) => (
          <ProductGridCard key={product.id} product={product} />
        ))}
      </ul>
    </div>
  );
}
