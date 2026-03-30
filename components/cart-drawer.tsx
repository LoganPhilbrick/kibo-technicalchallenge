"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

import {
  selectCartTotal,
  useCartStore,
} from "@/lib/cart-store";

const formatMoney = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);

export function CartDrawer() {
  const isOpen = useCartStore((s) => s.isOpen);
  const items = useCartStore((s) => s.items);
  const closeCart = useCartStore((s) => s.closeCart);
  const removeItem = useCartStore((s) => s.removeItem);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const total = useCartStore(selectCartTotal);

  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousBodyOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, closeCart]);

  useEffect(() => {
    if (isOpen) closeRef.current?.focus();
  }, [isOpen]);

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ease-out ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!isOpen}
        onClick={closeCart}
      />

      <div
        className={`fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-neutral-200 bg-background shadow-2xl transition-transform duration-300 ease-out dark:border-neutral-800 ${
          isOpen ? "translate-x-0" : "pointer-events-none translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-hidden={!isOpen}
        aria-labelledby="cart-drawer-title"
      >
        <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-4 dark:border-neutral-800">
          <h2
            id="cart-drawer-title"
            className="font-sans text-lg font-semibold text-foreground"
          >
            Your cart
          </h2>
          <button
            ref={closeRef}
            type="button"
            onClick={closeCart}
            className="rounded-lg p-2 text-sm text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-foreground dark:text-neutral-400 dark:hover:bg-neutral-800"
            aria-label="Close cart"
          >
            Close
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
          {items.length === 0 ? (
            <p className="text-center text-sm text-neutral-600 dark:text-neutral-400">
              Your cart is empty. Add products from the catalog.
            </p>
          ) : (
            <ul className="flex flex-col gap-4">
              {items.map((line) => (
                <li
                  key={line.id}
                  className="flex gap-3 border-b border-neutral-100 pb-4 last:border-b-0 dark:border-neutral-800"
                >
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-neutral-50 dark:bg-neutral-900">
                    <Image
                      src={line.image}
                      alt={line.title}
                      fill
                      className="object-contain p-2"
                      sizes="80px"
                    />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col gap-2">
                    <p className="font-sans text-sm font-medium leading-snug text-foreground line-clamp-2">
                      {line.title}
                    </p>
                    <p className="text-sm tabular-nums text-neutral-600 dark:text-neutral-400">
                      {formatMoney(line.price)} each
                    </p>
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="inline-flex items-center rounded-lg border border-neutral-200 dark:border-neutral-700">
                        <button
                          type="button"
                          className="px-2.5 py-1 text-sm tabular-nums text-foreground hover:bg-neutral-100 dark:hover:bg-neutral-800"
                          aria-label={`Decrease quantity of ${line.title}`}
                          onClick={() =>
                            setQuantity(line.id, line.quantity - 1)
                          }
                        >
                          −
                        </button>
                        <span
                          className="min-w-[2ch] px-1 text-center text-sm tabular-nums"
                          aria-live="polite"
                        >
                          {line.quantity}
                        </span>
                        <button
                          type="button"
                          className="px-2.5 py-1 text-sm tabular-nums text-foreground hover:bg-neutral-100 dark:hover:bg-neutral-800"
                          aria-label={`Increase quantity of ${line.title}`}
                          onClick={() =>
                            setQuantity(line.id, line.quantity + 1)
                          }
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        className="text-sm text-red-600 hover:underline dark:text-red-400"
                        onClick={() => removeItem(line.id)}
                      >
                        Remove
                      </button>
                    </div>
                    <p className="text-sm font-medium tabular-nums text-foreground">
                      {formatMoney(line.price * line.quantity)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-neutral-200 px-4 py-4 dark:border-neutral-800">
            <div className="flex items-center justify-between font-sans text-base font-semibold">
              <span className="text-foreground">Subtotal</span>
              <span className="tabular-nums text-foreground">
                {formatMoney(total)}
              </span>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
