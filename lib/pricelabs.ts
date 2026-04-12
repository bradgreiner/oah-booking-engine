const PRICELABS_BASE = "https://api.pricelabs.co/v1";
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes

interface CacheEntry {
  rates: Record<string, number>;
  expiry: number;
}

const cache = new Map<string, CacheEntry>();

function isConfigured(): boolean {
  return !!process.env.PRICELABS_API_KEY;
}

// Returns a map of date -> nightly rate for the given listing and date range
export async function fetchDynamicRates(
  hostawayListingId: number,
  checkIn: string,
  checkOut: string
): Promise<Record<string, number> | null> {
  if (!isConfigured()) return null;

  const cacheKey = `pl:${hostawayListingId}:${checkIn}:${checkOut}`;
  const cached = cache.get(cacheKey);
  if (cached && cached.expiry > Date.now()) return cached.rates;

  try {
    const res = await fetch(`${PRICELABS_BASE}/listing_prices`, {
      method: "POST",
      headers: {
        "X-API-Key": process.env.PRICELABS_API_KEY!,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        listings: [
          {
            id: hostawayListingId.toString(),
            start_date: checkIn,
            end_date: checkOut,
          },
        ],
      }),
    });

    if (!res.ok) {
      console.error(`PriceLabs API ${res.status}: ${await res.text().catch(() => "")}`);
      return null;
    }

    const data = await res.json();
    const listing = Array.isArray(data) ? data[0] : data?.listings?.[0];
    if (!listing) return null;

    // Build date -> price map
    const rates: Record<string, number> = {};
    const prices: { date: string; price: number }[] = listing.prices || listing.data || [];
    for (const entry of prices) {
      if (entry.date && typeof entry.price === "number" && entry.price > 0) {
        rates[entry.date] = entry.price;
      }
    }

    cache.set(cacheKey, { rates, expiry: Date.now() + CACHE_TTL });
    return rates;
  } catch (error) {
    console.error("PriceLabs fetchDynamicRates error:", error);
    return null;
  }
}

// Returns the average nightly rate across the stay, or null if unavailable
export async function getAverageNightlyRate(
  hostawayListingId: number,
  checkIn: string,
  checkOut: string
): Promise<number | null> {
  const rates = await fetchDynamicRates(hostawayListingId, checkIn, checkOut);
  if (!rates) return null;

  const values = Object.values(rates).filter((r) => r > 0);
  if (values.length === 0) return null;

  return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
}
