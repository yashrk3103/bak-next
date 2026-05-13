# (Zirwa Qurbani Service)

Marketing + booking UI for **Zirwa Qurbani Service**, built with Next.js (App Router).

- Live site: https://www.zirwaqurbani.in/

## Branches

- `main`: UI-only marketing + booking flow (no backend/API routes).
- `master`: full version with Supabase + auth/OTP helpers + admin chat (`/chat/[orderId]`) and additional assets/components.

## Tech Stack

Common:
- Next.js `16.1.6` (App Router)
- React `19`
- TypeScript (strict)
- Tailwind CSS `v4` (via `@tailwindcss/postcss`)
- ESLint (`eslint-config-next`)

`master` also includes (non-exhaustive): Supabase (`@supabase/ssr`, `@supabase/supabase-js`), shadcn (`components.json`), and jsPDF.

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

Note: `npm run dev` differs by branch (`main`: `next dev`, `master`: `next dev --webpack`).

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

`master` also includes:

- `/chat/[orderId]` – Realtime chat UI (`app/chat/[orderId]/page.tsx`)
- `/api/auth/send-otp` – OTP helper route (`app/api/auth/send-otp/route.ts`)
- `/api/auth/verify-otp` – OTP verification route (`app/api/auth/verify-otp/route.ts`)

## Project Structure

```text
app/                 # Next.js App Router pages + globals.css
public/images/        # static images used by the UI
src/components/       # UI components grouped by domain (home, order, checkout, etc.)
src/lib/constants.ts  # shared constants (site name/url, WhatsApp number, nav links)
```

## Data & State

- `main`: primarily **UI**; the checkout flow reads customer details from `localStorage`.
- `master`: Supabase integration (auth/session + realtime chat) and in-memory OTP helpers under `app/api/auth/*`.

## Configuration / Customization

- Update site/links/constants in `src/lib/constants.ts` (notably `SITE_URL` and `WHATSAPP_NUMBER`).
- Global styling + font imports live in `app/globals.css`.

`master` requires these env vars for Supabase:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Notes

- `src/components/home/PackagesSection.tsx` is currently a placeholder (`TODO`).
- Current status on `main`: `npm run lint` and `npm run build` report existing issues unrelated to this README change.
