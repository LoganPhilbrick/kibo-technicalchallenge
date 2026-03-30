# Developer log — AI collaboration

This document records how AI tooling was used on this project, where human review changed direction, and how tests were validated for non-obvious behavior.

---

## AI strategy: providing context

**Workspace and agent rules**

- **Cursor rules** were used so the assistant follows user preferences: run commands in a real environment (not “here’s what you should run”), prefer minimal diffs, match existing code style, and avoid unnecessary refactors or unsolicited documentation.

**Schemas and types**

- **`lib/types/product.ts`** defines the `Product` shape used by fetch helpers, the catalog UI, and cart line items. Pointing the AI at this file (or `@/lib/types/product`) kept API and UI aligned when generating components or tests.

**Explicit constraints**

- Requests were scoped (e.g. “only change `product-catalog.tsx`”, “don’t change anything unnecessary”) so generated edits stayed reviewable.
- For risky areas, questions were asked in chat to explain tradeoffs (e.g. React hydration vs Zustand `persist.rehydrate`) before large changes.

---

## Human audit: corrections and refinements

At least three places where human judgment overrode or refined AI output for **correctness, security, or maintainability**:

1. **Global CSS “light mode” fix for the Add to cart button**  
   An attempted fix added a `:root:not(.dark)` rule to force `--foreground` in light mode so `bg-foreground` / `text-background` resolved predictably. That change was **reverted** after it **broke dark mode for some elements**. Follow-up was handled with **explicit component-level styling** instead of a global override that competed with Tailwind’s emitted theme.

2. **Product grid layout experiment**  
   tested shrinking cards by ~85% width and increased gaps to increase gap without altering layout. That was **reverted** on request since the layout felt worse and did not give the desired result. **Human preference and visual review** won over the automated layout tweak.

3. **Environment-based product URL and tests**  
   Product fetching moved to **`process.env.PRODUCTS_URL`**. Initial test failures happened because the URL was read **once at module load** (undefined in Vitest). The fix was to read **`process.env.PRODUCTS_URL` inside `fetchProducts`** so tests can set `process.env.PRODUCTS_URL` per test. This is a **security and ops** win: **no hardcoded API URLs in source**, and **tests don’t depend on import order** for env.

*(Additional small refinements: clearer names like `previousBodyOverflow` and `cartItemCount`, and choosing not to extract a separate “hero” component when it would only be used once—scope kept minimal.)*

---

## Verification: AI-assisted tests and edge cases

**Tests that were created/generated**

- **`testing/fetch-products.test.ts`** — mocks `fetch` to cover:
  - **Happy path:** 200 + valid JSON array; `RequestInit` passed through (e.g. Next cache options).
  - **Negative paths:** non-OK status (throws with status in message), **`fetch` rejection** (network failure), **invalid JSON body** (parse error propagates).

- **`testing/cart-store.test.ts`** — exercises the Zustand cart **without the UI**:
  - Duplicate `addItem` increments quantity; **unknown `productId`** for `setQuantity` / `removeItem` leaves state sensible.
  - **`setQuantity(..., 0)`** removes the line (matches store behavior).
  - **`selectCartItemCount`** and **`selectCartTotal`** on multi-line carts and **empty cart**.

- **`testing/truncate-text.test.ts`** — guards string truncation behavior used in product copy.

**How this was verified**

- Run **`npm run test`** (Vitest **`vitest run`**) after refactors; failures drove fixes (notably **env timing** for `fetchProducts`).
- Edge cases (bad HTTP, thrown `fetch`, garbage body, empty cart totals) are **cheap to re-run** in CI and catch regressions that UI-only manual testing often misses.

---

## Summary

AI was steered with **repo rules, shared types, and tight task scope**. **Human audit** caught global-CSS and layout changes that looked plausible in code but failed in the full app or against product intent. **Tests** encoded **fetch and cart edge cases** so later edits stay safe to merge.
