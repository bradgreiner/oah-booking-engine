// Brand colors
export const COLORS = {
  navy: "#1B2A4A",
  gold: "#C9A84C",
  cream: "#FAF7F2",
  white: "#FFFFFF",
  charcoal: "#333333",
} as const;

// Transient Occupancy Tax rates by jurisdiction
export const TOT_RATES: Record<string, number> = {
  "los-angeles-city": 0.14,
  "los-angeles-county": 0.12,
  "santa-monica": 0.14,
  "long-beach": 0.12,
  default: 0.12,
} as const;

// Safely damage protection tiers (per reservation)
export const SAFELY_TIERS = [
  { maxNightlyRate: 200, fee: 49 },
  { maxNightlyRate: 350, fee: 69 },
  { maxNightlyRate: 500, fee: 89 },
  { maxNightlyRate: Infinity, fee: 119 },
] as const;

// OAH platform fee (percentage of nightly total)
export const OAH_FEE_RATE = 0.02;
