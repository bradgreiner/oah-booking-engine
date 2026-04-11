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
- Navy: `#1B2A4A`
- Gold: `#C9A84C`
- Cream: `#FAF7F2`

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
