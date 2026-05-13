# (Zirwa Qurbani Service)

Marketing + booking UI for **Zirwa Qurbani Service**, built with Next.js (App Router).

- Live site: https://www.zirwaqurbani.in/

## Tech Stack

- Next.js `16.1.6` (App Router)
- React `19`
- TypeScript (strict)
- Tailwind CSS `v4` (via `@tailwindcss/postcss`)
- ESLint (`eslint-config-next`)

## Getting Started

Prereqs: Node.js (recommended: v20) + npm

```bash
npm ci
npm run dev
```

Open http://localhost:3000

## Scripts

```bash
npm run dev    # start dev server
npm run build  # production build
npm run start  # start production server (after build)
npm run lint   # eslint
```

## Routes (App Router)

The main UI routes live under `app/`:

- `/` – Home/landing page (`app/page.tsx`) with sections + `OrderPanel` modal
- `/order` – Full-screen order flow (`app/order/page.tsx`)
- `/checkout` – Checkout UI (`app/checkout/page.tsx`)
- `/my-orders` – Order list UI (`app/my-orders/page.tsx`)
- `/orders` – Sample “My Orders” grid (`app/orders/page.tsx`)
- `/orders/[id]` – Order details page (`app/orders/[id]/page.tsx`)
- `/profile` – Profile form (`app/profile/page.tsx`)
- `/invoice` – Invoice template (`app/invoice/page.tsx`)
- `/faq` – FAQ page (`app/faq/page.tsx`)
- `/terms` – Terms & conditions (`app/terms/page.tsx`)
- `/privacy-policy` – Privacy policy (`app/privacy-policy/page.tsx`)

## Project Structure

```text
app/                 # Next.js App Router pages + globals.css
public/images/        # static images used by the UI
src/components/       # UI components grouped by domain (home, order, checkout, etc.)
src/lib/constants.ts  # shared constants (site name/url, WhatsApp number, nav links)
```

## Data & State

- This repo is primarily **UI** (no API routes or backend integration present).
- The checkout flow reads customer details from `localStorage` (set by the order/customer-details panel).

## Configuration / Customization

- Update site/links/constants in `src/lib/constants.ts` (notably `SITE_URL` and `WHATSAPP_NUMBER`).
- Global styling + font imports live in `app/globals.css`.

## Notes

- `src/components/home/PackagesSection.tsx` is currently a placeholder (`TODO`).
- Current repo status (as of this branch): `npm run lint` and `npm run build` report existing issues unrelated to this README change.

