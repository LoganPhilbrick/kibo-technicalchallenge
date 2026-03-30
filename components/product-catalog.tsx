"use client";

import Image from "next/image";

import { useCartStore } from "@/lib/cart-store";
import type { Product } from "@/lib/types/product";

function truncate(text: string, maxLen: number) {
  if (text.length <= maxLen) return text;
  return `${text.slice(0, maxLen).trimEnd()}…`;
}

const cardShell =
  "overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-neutral-800 dark:bg-neutral-950";

const btnClass =
  "mt-auto rounded-lg bg-neutral-900 px-3 py-2 text-center text-sm font-medium text-background transition-colors hover:bg-neutral-100 dark:bg-neutral-50 dark:hover:bg-neutral-100 hover:opacity-90";

function AddToCartButton({ product }: { product: Product }) {
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

type ProductCatalogProps = {
  products: Product[];
};

export function ProductCatalog({ products }: ProductCatalogProps) {
  const [featured, ...rest] = products;
  if (!featured) return null;

  return (
    <div className="flex flex-col gap-8">
      <section className={cardShell}>
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
              {truncate(featured.description, 130)}
            </p>
            <AddToCartButton product={featured} />
          </div>
        </div>
      </section>

      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {rest.map((product) => (
          <li key={product.id} className={`flex flex-col ${cardShell}`}>
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
                {truncate(product.description, 140)}
              </p>
              <AddToCartButton product={product} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
