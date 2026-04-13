// Brand colors
export const COLORS = {
  green: "#4C6C4E",
  greenDark: "#3d5a40",
  gold: "#C5A55A",
  cream: "#FAF7F2",
  white: "#FFFFFF",
  charcoal: "#1a1a1a",
} as const;

// Transient Occupancy Tax rates by city name (direct match from Hostaway listing.city)
// TOT only applies when numNights < 30. Monthly stays are exempt.
export const TOT_RATES: Record<string, number> = {
  "Los Angeles": 0.14,
  "Santa Monica": 0.14,
  "West Hollywood": 0.14,
  "Palm Springs": 0.135,
  "Palm Desert": 0.09,
  "La Quinta": 0.10,
  "Rancho Mirage": 0.10,
  "Malibu": 0.12,
  "Manhattan Beach": 0.12,
  "Marina del Rey": 0.14,
  "Topanga": 0.10,
  "Yucca Valley": 0.10,
  default: 0.12,
} as const;

export function getTotRate(city: string | null | undefined, numNights: number): number {
  if (numNights >= 30) return 0; // Monthly stays are TOT-exempt
  if (!city) return TOT_RATES.default;
  return TOT_RATES[city] ?? TOT_RATES.default;
}

// Safely guest protection — flat fee by stay length (not nightly rate)
// 90+ nights: $0 (security deposit used instead)
export const SAFELY_TIERS = [
  { maxNights: 29, fee: 180 },
  { maxNights: 59, fee: 650 },
  { maxNights: 89, fee: 950 },
  { maxNights: Infinity, fee: 0 }, // 90+ nights: security deposit instead
] as const;

export function getSafelyFee(numNights: number): number {
  const tier = SAFELY_TIERS.find((t) => numNights <= t.maxNights);
  return tier?.fee ?? 0;
}

// Security deposit for 90+ night stays: 1 month's rent
export function getSecurityDeposit(nightlyRate: number, numNights: number): number {
  if (numNights < 90) return 0;
  return Math.round(nightlyRate * 30);
}

// ---------- Market groupings ----------

export const MARKETS = {
  "Los Angeles": [
    "Los Angeles",
    "Santa Monica",
    "West Hollywood",
    "Manhattan Beach",
    "Malibu",
    "Topanga",
    "Marina del Rey",
    "Rancho Palos Verdes",
    "Venice",
  ],
  "Palm Springs": [
    "Palm Springs",
    "Palm Desert",
    "La Quinta",
    "Rancho Mirage",
    "Cathedral City",
    "Yucca Valley",
  ],
} as const;

export type MarketName = keyof typeof MARKETS;

/** Given a city filter value, return the array of cities it covers (or null for no filter). */
export function getMarketCities(cityFilter: string): string[] | null {
  const cities = MARKETS[cityFilter as MarketName];
  return cities ? [...cities] : null;
}

// OAH platform fee (2% of nightly total)
export const OAH_FEE_RATE = 0.02;

// CC processing fee (3% of grand total)
export const CC_FEE_RATE = 0.03;
