const PRICELABS_BASE = "https://api.pricelabs.co/v1";
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes

// ---------- Single-listing cache (for detail page pricing) ----------

interface RatesCacheEntry {
  rates: Record<string, number>;
  expiry: number;
}

const ratesCache = new Map<string, RatesCacheEntry>();

// ---------- Batch cache (for browse/search page) ----------

interface BatchCacheEntry {
  data: Map<number, number>; // hostawayId → average nightly rate
  expiry: number;
}

let batchCache: BatchCacheEntry | null = null;

function isConfigured(): boolean {
  return !!process.env.PRICELABS_API_KEY;
}

// ---------- Single listing: date → price map ----------

export async function fetchDynamicRates(
  hostawayListingId: number,
  checkIn: string,
  checkOut: string
): Promise<Record<string, number> | null> {
  if (!isConfigured()) return null;

  const cacheKey = `pl:${hostawayListingId}:${checkIn}:${checkOut}`;
  const cached = ratesCache.get(cacheKey);
  if (cached && cached.expiry > Date.now()) return cached.rates;

  try {
    const res = await fetch(`${PRICELABS_BASE}/listing_prices`, {
      method: "POST",
      headers: {
        "X-API-Key": process.env.PRICELABS_API_KEY!,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        listings: [{
          id: String(hostawayListingId),
          pms: "hostaway",
          start_date: checkIn,
          end_date: checkOut,
        }],
      }),
    });

    if (!res.ok) {
      console.error(`PriceLabs API ${res.status}: ${await res.text().catch(() => "")}`);
      return null;
    }

    const data = await res.json();

    // Response is an array of listings: [{ id, pms, data: [{ date, price, user_price }] }]
    const listing = Array.isArray(data) ? data[0] : null;
    if (!listing?.data || !Array.isArray(listing.data)) return null;

    const rates: Record<string, number> = {};
    for (const day of listing.data) {
      const price = day.user_price ?? day.price;
      if (day.date && typeof price === "number" && price > 0) {
        rates[day.date] = price;
      }
    }

    ratesCache.set(cacheKey, { rates, expiry: Date.now() + CACHE_TTL });
    return Object.keys(rates).length > 0 ? rates : null;
  } catch (error) {
    console.error("PriceLabs fetchDynamicRates error:", error);
    return null;
  }
}

// ---------- Single listing: average nightly rate ----------

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

// ---------- Batch: all listings at once for browse/search ----------

export async function fetchPriceLabsBatch(
  hostawayIds: number[],
  startDate: string,
  endDate: string
): Promise<Map<number, number>> {
  if (!isConfigured() || hostawayIds.length === 0) return new Map();

  // Return cached batch if still valid
  if (batchCache && batchCache.expiry > Date.now()) return batchCache.data;

  try {
    const listings = hostawayIds.map((id) => ({
      id: String(id),
      pms: "hostaway",
      start_date: startDate,
      end_date: endDate,
    }));

    const res = await fetch(`${PRICELABS_BASE}/listing_prices`, {
      method: "POST",
      headers: {
        "X-API-Key": process.env.PRICELABS_API_KEY!,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ listings }),
    });

    if (!res.ok) {
      console.error(`PriceLabs batch API ${res.status}: ${await res.text().catch(() => "")}`);
      return new Map();
    }

    const data = await res.json();
    const result = new Map<number, number>();

    // Response: array of { id, pms, data: [{ date, user_price }] }
    if (!Array.isArray(data)) return result;

    for (const listing of data) {
      const hwId = parseInt(listing.id, 10);
      if (isNaN(hwId) || !Array.isArray(listing.data)) continue;

      const prices = listing.data
        .map((d: any) => d.user_price ?? d.price)
        .filter((p: any) => typeof p === "number" && p > 0);

      if (prices.length > 0) {
        const avg = Math.round(prices.reduce((a: number, b: number) => a + b, 0) / prices.length);
        result.set(hwId, avg);
      }
    }

    batchCache = { data: result, expiry: Date.now() + CACHE_TTL };
    return result;
  } catch (error) {
    console.error("PriceLabs fetchPriceLabsBatch error:", error);
    return new Map();
  }
}
