"use client";

import type { Product } from "@/lib/types/product";

function getProductsUrl(): string {
  const url = process.env.NEXT_PUBLIC_PRODUCTS_URL?.trim();
  if (!url) {
    throw new Error("NEXT_PUBLIC_PRODUCTS_URL is not defined");
  }
  return url;
}

export async function fetchProducts(
  init?: RequestInit
): Promise<Product[]> {
  const productsUrl = getProductsUrl();
  const res = await fetch(productsUrl, init);
  if (!res.ok) {
    throw new Error(`Products request failed: ${res.status}`);
  }
  return res.json() as Promise<Product[]>;
}
