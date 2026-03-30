import type { Product } from "@/lib/types/product";

export async function fetchProducts(
  init?: RequestInit
): Promise<Product[]> {
  const productsUrl = process.env.PRODUCTS_URL;
  if (!productsUrl) {
    throw new Error("productsUrl is not defined");
  }
  const res = await fetch(productsUrl, init);
  if (!res.ok) {
    throw new Error(`Products request failed: ${res.status}`);
  }
  return res.json() as Promise<Product[]>;
}
