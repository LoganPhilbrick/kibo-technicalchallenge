import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { fetchProducts } from "@/lib/fetch-products";
import type { Product } from "@/lib/types/product";

const TEST_PRODUCTS_URL = "https://test.com/products";

const sampleProducts: Product[] = [
  {
    id: 1,
    title: "Test item",
    price: 9.99,
    description: "A test product",
    image: "https://example.com/img.png",
  },
];

describe("fetchProducts", () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_PRODUCTS_URL = TEST_PRODUCTS_URL;
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    delete process.env.NEXT_PUBLIC_PRODUCTS_URL;
  });

  it("returns parsed products on successful response (happy path)", async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify(sampleProducts), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
    );

    const result = await fetchProducts();

    expect(fetch).toHaveBeenCalledWith(TEST_PRODUCTS_URL, undefined);
    expect(result).toEqual(sampleProducts);
  });

  it("forwards request init (e.g. cache options)", async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify([]), { status: 200 })
    );

    const init = { cache: "no-store" } as RequestInit;
    await fetchProducts(init);

    expect(fetch).toHaveBeenCalledWith(TEST_PRODUCTS_URL, init);
  });

  it("throws when response is not ok (negative path)", async () => {
    vi.mocked(fetch).mockResolvedValue(new Response(null, { status: 503 }));

    await expect(fetchProducts()).rejects.toThrow(
      "Products request failed: 503"
    );
  });

  it("throws when fetch rejects (negative path)", async () => {
    vi.mocked(fetch).mockRejectedValue(new Error("network down"));

    await expect(fetchProducts()).rejects.toThrow("network down");
  });

  it("propagates JSON parse errors for invalid body (negative path)", async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response("not json", { status: 200 })
    );

    await expect(fetchProducts()).rejects.toThrow();
  });
});
