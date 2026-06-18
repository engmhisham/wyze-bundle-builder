# Wyze Bundle Builder

A multi-step bundle builder React prototype with a live review panel.

## Run instructions

```bash
npm install
npm run dev
```

Open (http://localhost:5173) in your browser.

To build for production:

```bash
npm run build
npm run preview
```

## Architecture

- **React 19 + TypeScript + Vite** — fast dev/build, strict typing
- **Context + useReducer** for state — single source of truth for all selections, shared between the builder cards and review panel
- **Data-driven rendering** — all products, steps, and initial state come from `src/data/products.json`. No per-product markup is hardcoded
- **Component structure:**
  - `BundleBuilder` — two-column layout (accordion + sidebar)
  - `AccordionStep` — collapsible step with header counts and product grid
  - `ProductCard` — clickable card with badge, variants, stepper, pricing
  - `QuantityStepper` — reused in cards and review panel, kept in sync via shared context
  - `ReviewPanel` — grouped line items, totals, savings, checkout

## Key decisions

- **Variant-level quantity tracking**: Each color variant is a separate line item. The card stepper binds to the active variant; switching colors changes the stepper without affecting other variants. The review panel shows every variant with qty > 0 as its own line.
- **Card click-to-select**: Clicking a product card selects it (sets qty to 1). Plans toggle on/off. Required items (Sense Hub, Fast Shipping) are always included and locked.
- **Persistence**: "Save my system for later" writes the full state to `localStorage`. On load, saved state is restored automatically (including which accordion step was open).
- **Typography**: Uses Gilroy font family matching the Figma design, with TT Norms Pro Bold for the Checkout button.
- **No external UI library**: All styles are plain CSS to keep the bundle small and the design control tight.
- **Responsive**: Desktop matches the Figma two-column layout (768px + 399px). Tablet collapses to single-column with a 2-up product grid. Mobile goes full single-column.

## What I'd improve with more time

- Smooth accordion open/close animations (height transition)
- Keyboard navigation and full ARIA accordion pattern
- Unit tests for the reducer and quantity sync logic
- A small Express/Fastify API serving the product JSON (bonus)
