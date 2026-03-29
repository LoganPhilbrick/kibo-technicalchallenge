import Image from "next/image";

const PRODUCTS_URL = "https://fakestoreapi.com/products";

type Product = {
  id: number;
  title: string;
  price: number;
  description: string;
  image: string;
};

function truncate(text: string, maxLen: number) {
  if (text.length <= maxLen) return text;
  return `${text.slice(0, maxLen).trimEnd()}…`;
}

async function getProducts(): Promise<Product[]> {
  const res = await fetch(PRODUCTS_URL, { next: { revalidate: 3600 } });
  if (!res.ok) {
    throw new Error(`Products request failed: ${res.status}`);
  }
  return res.json() as Promise<Product[]>;
}

export const metadata = {
  title: "Products",
  description: "Browse products from the catalog.",
};

export default async function Home() {
  let products: Product[];

  try {
    products = await getProducts();
  } catch {
    return (
      <main className="mx-auto flex min-h-[50vh] max-w-6xl flex-col items-center justify-center px-4 py-16">
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
      <header className="mb-10">
        <h1 className="font-sans text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Products
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-neutral-600 dark:text-neutral-400">
          Fetched from the Fake Store API. Prices shown in USD.
        </p>
      </header>

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
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
