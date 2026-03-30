import { beforeEach, describe, expect, it } from "vitest";

import {
  selectCartItemCount,
  selectCartTotal,
  useCartStore,
} from "@/lib/cart-store";

const productA = {
  id: 1,
  title: "Alpha",
  price: 10,
  image: "https://example.com/a.png",
};

const productB = {
  id: 2,
  title: "Beta",
  price: 25.5,
  image: "https://example.com/b.png",
};

describe("useCartStore — add to cart", () => {
  beforeEach(() => {
    useCartStore.setState({ items: [], isOpen: false });
  });

  it("adds a new line with quantity 1 and opens cart (happy path)", () => {
    useCartStore.getState().addItem(productA);

    const state = useCartStore.getState();
    expect(state.items).toEqual([{ ...productA, quantity: 1 }]);
    expect(state.isOpen).toBe(true);
  });

  it("increments quantity when adding the same product again (happy path)", () => {
    useCartStore.getState().addItem(productA);
    useCartStore.getState().addItem(productA);

    expect(useCartStore.getState().items).toEqual([
      { ...productA, quantity: 2 },
    ]);
  });

  it("keeps separate lines for different products (happy path)", () => {
    useCartStore.getState().addItem(productA);
    useCartStore.getState().addItem(productB);

    expect(useCartStore.getState().items).toHaveLength(2);
    expect(useCartStore.getState().items[0].quantity).toBe(1);
    expect(useCartStore.getState().items[1].quantity).toBe(1);
  });
});

describe("useCartStore — cart updates", () => {
  beforeEach(() => {
    useCartStore.setState({ items: [], isOpen: false });
  });

  it("setQuantity updates line quantity (happy path)", () => {
    useCartStore.getState().addItem(productA);
    useCartStore.getState().setQuantity(1, 5);

    expect(useCartStore.getState().items[0].quantity).toBe(5);
  });

  it("setQuantity of 0 removes the line (edge / negative path)", () => {
    useCartStore.getState().addItem(productA);
    useCartStore.getState().setQuantity(1, 0);

    expect(useCartStore.getState().items).toEqual([]);
  });

  it("setQuantity for unknown id leaves items unchanged (negative path)", () => {
    useCartStore.getState().addItem(productA);
    useCartStore.getState().setQuantity(999, 3);

    expect(useCartStore.getState().items).toEqual([
      { ...productA, quantity: 1 },
    ]);
  });

  it("removeItem drops a line (happy path)", () => {
    useCartStore.getState().addItem(productA);
    useCartStore.getState().addItem(productB);
    useCartStore.getState().removeItem(1);

    expect(useCartStore.getState().items).toEqual([
      { ...productB, quantity: 1 },
    ]);
  });

  it("removeItem for unknown id is a no-op (negative path)", () => {
    useCartStore.getState().addItem(productA);
    useCartStore.getState().removeItem(404);

    expect(useCartStore.getState().items).toEqual([
      { ...productA, quantity: 1 },
    ]);
  });

  it("clear removes all items (happy path)", () => {
    useCartStore.getState().addItem(productA);
    useCartStore.getState().addItem(productB);
    useCartStore.getState().clear();

    expect(useCartStore.getState().items).toEqual([]);
  });
});

describe("selectCartItemCount & selectCartTotal", () => {
  beforeEach(() => {
    useCartStore.setState({ items: [], isOpen: false });
  });

  it("counts total units across lines (happy path)", () => {
    useCartStore.setState({
      items: [
        { ...productA, quantity: 2 },
        { ...productB, quantity: 3 },
      ],
    });

    expect(selectCartItemCount(useCartStore.getState())).toBe(5);
  });

  it("total is sum of price × quantity (happy path)", () => {
    useCartStore.setState({
      items: [
        { ...productA, quantity: 2 },
        { ...productB, quantity: 2 },
      ],
    });

    // 2*10 + 2*25.5 = 71
    expect(selectCartTotal(useCartStore.getState())).toBe(71);
  });

  it("empty cart yields zero count and total (negative / empty path)", () => {
    const state = useCartStore.getState();
    expect(selectCartItemCount(state)).toBe(0);
    expect(selectCartTotal(state)).toBe(0);
  });
});
