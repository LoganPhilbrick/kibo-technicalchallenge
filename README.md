# Kibo Technical Challenge

A Next.js storefront-style app that lists products from a remote API (fetched in the **browser** after the page loads—see [why](#why-fetch-from-the-browser-instead-of-the-server)), supports a persistent cart (Zustand), light/dark theming, and a responsive product catalog with a featured hero row.

---

## Framework and library versions

Versions below match `package.json` at the time of writing. Patch/minor updates may occur if dependencies are reinstalled; check `package-lock.json` for exact resolved versions.

| Category | Package | Version |
|----------|---------|---------|
| **Framework** | [Next.js](https://nextjs.org/) | `16.2.1` |
| **UI** | [React](https://react.dev/) | `19.2.4` |
| | [React DOM](https://react.dev/) | `19.2.4` |
| **State** | [Zustand](https://zustand-demo.pmnd.rs/) | `^5.0.12` |
| **Theming** | [next-themes](https://github.com/pacocoursey/next-themes) | `^0.4.6` |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) | `^4` |
| | [@tailwindcss/postcss](https://tailwindcss.com/docs/installation) | `^4` |
| **Language** | [TypeScript](https://www.typescriptlang.org/) | `^5` |
| **Linting** | [ESLint](https://eslint.org/) | `^9` |
| | [eslint-config-next](https://nextjs.org/docs/app/building-your-application/configuring/eslint) | `16.2.1` |
| **Testing** | [Vitest](https://vitest.dev/) | `^4.1.2` |

**Runtime:** Use a current [Node.js](https://nodejs.org/) LTS release (e.g. **20.x** or **22.x**). Next.js 16 generally expects a modern Node; if install or build fails, upgrade Node first.

---

## Setup and run instructions

### Prerequisites

- **Node.js** (LTS recommended)
- **npm** (comes with Node; this project uses `package-lock.json`)

### 1. Install dependencies

From the project root:

```bash
npm install
```

### 2. Environment variables

Product data is loaded from a URL configured via **`NEXT_PUBLIC_PRODUCTS_URL`**. The home page is a **client component**; it calls `fetchProducts()` in the browser, which issues `fetch` from the user’s device to the configured URL.

#### Why fetch from the browser instead of the server?

Requests that originate on the server (for example from a Next.js route handler or from `fetch` during SSR on **Vercel** or other hosts) leave through **datacenter / serverless IPs**. Some public product APIs treat those like bots or untrusted clients and respond with **403 Forbidden**, empty bodies, or strict rate limits. A **browser** request uses the visitor’s normal client IP and headers, which those APIs usually accept—similar to opening the JSON URL directly or calling the API from another front end. The trade-off is that the product URL must be **public** in the client bundle (see below).

Because the name starts with `NEXT_PUBLIC_`, the value is **embedded in the client JavaScript bundle**. Do not put secrets there—only URLs that are safe to expose (for example, a public product JSON endpoint).

1. Copy the example env file to `.env` (e.g. `cp .env.example .env` on macOS/Linux, or `copy .env.example .env` in Windows Command Prompt).

2. Edit `.env` and set `NEXT_PUBLIC_PRODUCTS_URL` to your products API URL (must return a JSON array of products). For the default Fake Store API:

   ```env
   NEXT_PUBLIC_PRODUCTS_URL=https://fakestoreapi.com/products
   ```

If `NEXT_PUBLIC_PRODUCTS_URL` is missing or empty, `fetchProducts` throws at runtime and the home page shows an error state.

**Vercel / production:** Add `NEXT_PUBLIC_PRODUCTS_URL` under Project → Settings → Environment Variables for each environment you deploy (Production, Preview, etc.).

### 3. Development server

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in the browser.

### 4. Production build and start

```bash
npm run build
npm run start
```

`next start` serves the optimized production build (default port **3000** unless `PORT` is set).

### 5. Lint (optional)

```bash
npm run lint
```

---

## Testing instructions

The project uses **Vitest** for unit tests. Test files live under `testing/` and match `**/*.test.ts` (see `vitest.config.ts`).

### Commands

| Command | Description |
|---------|-------------|
| `npm run test` | Run the full suite once (CI-friendly). |
| `npm run test:watch` | Run Vitest in watch mode while developing. |

Example:

```bash
npm run test
```

### What is covered

- **`testing/fetch-products.test.ts`** — Product fetching: successful JSON responses, request options, HTTP errors, network failures, invalid JSON bodies.
- **`testing/cart-store.test.ts`** — Cart store: add to cart, duplicate SKUs, quantity updates, removals, totals, and selectors.
- **`testing/truncate-text.test.ts`** — Text truncation helper behavior.

Tests run in the **Node** environment (no browser). Ensure `fetchProducts` tests set `process.env.NEXT_PUBLIC_PRODUCTS_URL` as expected (handled in the test file’s `beforeEach` / `afterEach`).

### Adding tests

1. Add `your-feature.test.ts` under `testing/`.
2. Use `import { describe, it, expect, vi, beforeEach } from "vitest"` (or the subset you need).
3. Run `npm run test` to verify.

---

## Project structure (high level)

| Path | Purpose |
|------|---------|
| `app/` | Next.js App Router routes, layouts, global styles, route `loading.tsx` |
| `components/` | React components (catalog, cart, theme) |
| `lib/` | Shared logic (cart store, fetch helpers, utilities) |
| `testing/` | Vitest unit tests |

For more on Next.js conventions used here (e.g. `loading.tsx`), see the [Next.js documentation](https://nextjs.org/docs).
