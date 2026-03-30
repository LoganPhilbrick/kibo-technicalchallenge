import { CartIndicator } from "@/components/cart-indicator";
import { ProductCatalog } from "@/components/product-catalog";
import { ThemeToggle } from "@/components/theme-toggle";
import { fetchProducts } from "@/lib/fetch-products";

export const metadata = {
  title: "Products",
  description: "Browse products from the catalog.",
};

export default async function Home() {
  let products: Awaited<ReturnType<typeof fetchProducts>>;

  try {
    products = await fetchProducts({ next: { revalidate: 3600 } });
  } catch {
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

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-sans text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Products
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-neutral-600 dark:text-neutral-400">
            Fetched from the Fake Store API. Prices shown in USD.
          </p>
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
