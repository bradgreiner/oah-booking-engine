# OAH Booking Engine

## Overview
Direct booking platform for OAH (Our American Homes) vacation rental properties in Los Angeles. Includes a public-facing property catalog, a password-gated LA 2028 Olympic rentals section, and an admin dashboard for property/booking management.

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL via Prisma ORM
- **Payments**: Stripe
- **Email**: Resend
- **Image Storage**: Cloudflare R2 (S3-compatible)
- **Auth**: NextAuth.js (credentials provider for admin)
- **Styling**: Tailwind CSS
- **Hosting**: Vercel

## Directory Structure
```
app/
  (public)/page.tsx       # Homepage with hero + property grid
  olympics/page.tsx       # Password-gated Olympic rentals
  admin/page.tsx          # Admin dashboard
  api/
    properties/route.ts   # GET/POST properties
    olympics/verify-password/route.ts
  layout.tsx              # Root layout
components/
  PropertyCard.tsx         # Property listing card
  Navbar.tsx              # Top navigation
  Footer.tsx              # Site footer
  PasswordGate.tsx        # Password entry for Olympics section
  AdminLayout.tsx         # Admin sidebar layout
lib/
  prisma.ts               # Prisma singleton client
  fees.ts                 # Fee calculator
  constants.ts            # Brand colors, TOT rates, Safely tiers
  stripe.ts               # Stripe client
  r2.ts                   # R2 upload helper
  resend.ts               # Resend email client
  auth.ts                 # NextAuth config
prisma/
  schema.prisma           # Database schema
```

## Fee Logic
Every booking calculates fees as follows:
1. **Nightly total** = nightly rate × number of nights
2. **Cleaning fee** = flat per-property amount
3. **Pet fee** = flat per-property amount (if pets)
4. **Safely damage protection** = tiered by nightly rate:
   - ≤$200/night → $49
   - ≤$350/night → $69
   - ≤$500/night → $89
   - >$500/night → $119
5. **TOT (Transient Occupancy Tax)** = percentage of nightly total (default 12%, varies by jurisdiction)
6. **OAH platform fee** = 2% of nightly total
7. **Grand total** = sum of all above

## Brand Colors
- Green: `#4C6C4E` (primary)
- Green hover: `#3d5a40`
- Cream: `#FAFAF8`
- Charcoal: `#1a1a1a`
- Gold: `#C5A55A` (Olympic section only)

## Environment Variables
```
DATABASE_URL=
DIRECT_DATABASE_URL=
STRIPE_SECRET_KEY=
RESEND_API_KEY=
R2_ENDPOINT=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=
R2_PUBLIC_URL=
ADMIN_EMAIL=
ADMIN_PASSWORD=
NEXTAUTH_SECRET=
OLYMPICS_PASSWORD=
```

## Phase Roadmap
1. **Phase 1** (current): Scaffold — project structure, schema, components, basic routes
2. **Phase 2**: Property CRUD — admin property management, image uploads, pricing rules
3. **Phase 3**: Booking flow — date picker, fee calculator UI, Stripe checkout
4. **Phase 4**: Olympic rentals — venue map, gated section, special pricing
5. **Phase 5**: Notifications — email confirmations, admin alerts via Resend
6. **Phase 6**: Polish — SEO, analytics, performance optimization

## Rules
- Always use the App Router (not Pages Router)
- Use server components by default; add "use client" only when needed
- All monetary values stored as floats (USD dollars, not cents)
- Fee calculations must go through `lib/fees.ts` — never inline fee math
- Prisma schema changes require `npx prisma generate` after editing
- Brand colors are defined in `lib/constants.ts` — reference them, don't hardcode hex values in new components
- Tailwind classes use the brand palette via direct hex values in className (e.g., `text-[#1B2A4A]`)

## Git Rules
- ALWAYS commit directly to main. NEVER create feature branches.
- Run `git checkout main` before any changes.
- Build must pass (`npx next build`) before pushing.

## Pricing Rules
- PriceLabs is the ONLY source for the base nightly rate (`baseRate`). The Hostaway `price` field is a dummy and must NEVER be used as `baseRate`.
- If PriceLabs does not return data for a listing, set `baseRate` to 0 so the UI shows "Contact for pricing".
- The `monthlyDiscount` and `weeklyDiscount` fields in Hostaway are REAL — they are actively managed by the team and match what Airbnb/VRBO use. They must ALWAYS be preserved and applied.
- Monthly card price = PriceLabs avg nightly × monthlyDiscount × 30.
- Weekly rate = PriceLabs avg nightly × weeklyDiscount.
- STR nightly rate = PriceLabs avg nightly (no discount).
- Never zero out monthlyDiscount or weeklyDiscount. Only the Hostaway `price` field is dummy.

## What's Built (as of latest session)

### Guest-facing booking portal
- Homepage: hero with date search, featured properties, neighborhood grid, how-it-works
- Browse/search: filter by city/market, amenity pills (Pool, Pets, Monthly, STR), sort by price
- Property detail: photo grid with fullscreen gallery, booking widget with date picker, fee breakdown, amenities, house rules, cancellation, neighborhood map, nearby places
- Request-to-book: guest info form, payment method selection (card/ACH), Stripe integration, booking session tracking
- Confirmation page: green checkmark, booking summary, timeline of next steps
- Abandoned booking recovery: session tracking, hourly cron email, unsubscribe page
- City SEO landing pages: /cities/[slug] with property grid, FAQ, meta tags

### Admin dashboard
- Booking management: approve/decline with Stripe capture/cancel, stats bar, expanded row details
- Property management: CRUD via admin panel

### Infrastructure
- PriceLabs dynamic pricing (sole source, Hostaway prices are dummy)
- Hostaway calendar integration (blocked dates, min nights)
- Stripe payments (PaymentIntent with manual capture)
- Resend email (guest confirmation, admin notification, approval, decline, abandoned recovery)
- Vercel cron for abandoned emails
- GTM tracking
- SEO meta tags + Open Graph
- Mobile responsive across all pages
- Map privacy (deterministic offset, non-interactive detail map)

### Design system
- Fonts: Instrument Serif (headings), DM Sans (body)
- Colors: #4C6C4E (green), #3d5a40 (hover), #FAFAF8 (cream), #1a1a1a (charcoal)
- Cards: hover lift + green accent border
- Buttons: pill-shaped, full-width CTAs
