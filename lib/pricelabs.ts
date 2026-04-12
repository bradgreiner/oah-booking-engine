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
    // PriceLabs expects: id (string), pms, start_date, end_date
    const res = await fetch(`${PRICELABS_BASE}/listing_prices`, {
      method: "POST",
      headers: {
        "X-API-Key": process.env.PRICELABS_API_KEY!,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        listings: [
          {
            id: String(hostawayListingId),
            pms: "hostaway",
            start_date: checkIn,
            end_date: checkOut,
          },
        ],
      }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error(`PriceLabs API ${res.status}: ${text}`);
      return null;
    }

    const data = await res.json();
    console.log('[pricelabs response]', JSON.stringify(data).slice(0, 500));

    // Parse response — try multiple known response shapes
    const listing = Array.isArray(data) ? data[0] : data?.listings?.[0] ?? data;
    if (!listing) return null;

    // Build date -> price map from whichever field contains prices
    const rates: Record<string, number> = {};
    const prices: any[] = listing.prices || listing.data || listing.calendar || [];
    for (const entry of prices) {
      const date = entry.date || entry.dt;
      const price = entry.price ?? entry.rate ?? entry.basePrice;
      if (date && typeof price === "number" && price > 0) {
        rates[date] = price;
      }
    }

    cache.set(cacheKey, { rates, expiry: Date.now() + CACHE_TTL });
    return Object.keys(rates).length > 0 ? rates : null;
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
