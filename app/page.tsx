"use client";

import { useEffect, useState } from "react";

import { CartIndicator } from "@/components/cart-indicator";
import { ProductCatalog } from "@/components/product-catalog";
import { ThemeToggle } from "@/components/theme-toggle";
import { fetchProducts } from "@/lib/fetch-products";
import type { Product } from "@/lib/types/product";

export default function Home() {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const data = await fetchProducts();
        if (!cancelled) setProducts(data);
      } catch {
        if (!cancelled) setError(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return (
      <main className="relative mx-auto flex min-h-[50vh] max-w-6xl flex-col items-center justify-center px-4 py-16">
        <div className="absolute right-4 top-4 sm:right-6">
          <ThemeToggle />
        </div>
        <h1 className="font-sans text-2xl font-semibold tracking-tight text-foreground">
          Something went wrong
        </h1>
        <p className="mt-2 max-w-md text-center text-sm text-neutral-500 dark:text-neutral-400">
          We could not load products right now. Please refresh the page or try
          again in a moment.
        </p>
      </main>
    );
  }

  if (products === null) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <header className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-3">
            <div className="h-9 w-40 animate-pulse rounded-md bg-neutral-200 dark:bg-neutral-800" />
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <ThemeToggle />
            <CartIndicator />
          </div>
        </header>
        <div className="space-y-4">
          <div className="h-64 animate-pulse rounded-xl bg-neutral-200 dark:bg-neutral-800" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[3/4] animate-pulse rounded-xl bg-neutral-200 dark:bg-neutral-800"
              />
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-sans text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Products
          </h1>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <ThemeToggle />
          <CartIndicator />
        </div>
      </header>

      <ProductCatalog products={products} />
    </main>
  );
}
