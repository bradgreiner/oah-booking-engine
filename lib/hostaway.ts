const HOSTAWAY_BASE = "https://api.hostaway.com/v1";
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const REQUEST_TIMEOUT = 10_000; // 10 seconds

interface CacheEntry<T> {
  data: T;
  expiry: number;
}

const cache = new Map<string, CacheEntry<unknown>>();

function getCached<T>(key: string): T | null {
  const entry = cache.get(key);
  if (entry && entry.expiry > Date.now()) return entry.data as T;
  if (entry) cache.delete(key);
  return null;
}

function setCache<T>(key: string, data: T): void {
  cache.set(key, { data, expiry: Date.now() + CACHE_TTL });
}

// ---------- OAuth2 token management ----------

let tokenCache: { token: string; expiry: number } | null = null;

function isConfigured(): boolean {
  return !!(process.env.HOSTAWAY_API_KEY && process.env.HOSTAWAY_ACCOUNT_ID);
}

async function getAccessToken(): Promise<string> {
  // Return cached token if still valid (with 60s buffer)
  if (tokenCache && tokenCache.expiry > Date.now() + 60_000) {
    return tokenCache.token;
  }

  const res = await fetch(`${HOSTAWAY_BASE}/accessTokens`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: process.env.HOSTAWAY_ACCOUNT_ID || "",
      client_secret: process.env.HOSTAWAY_API_KEY || "",
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Hostaway auth failed ${res.status}: ${text}`);
  }

  const data = await res.json();
  const token = data.access_token as string;
  const expiresIn = (data.expires_in as number) || 3600;

  tokenCache = { token, expiry: Date.now() + expiresIn * 1000 };
  return token;
}

async function hostawayFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

  try {
    const token = await getAccessToken();
    const headers: Record<string, string> = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "Cache-Control": "no-cache",
      ...(options?.headers as Record<string, string> || {}),
    };

    const res = await fetch(`${HOSTAWAY_BASE}${path}`, {
      ...options,
      headers,
      signal: controller.signal,
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`Hostaway API ${res.status}: ${text}`);
    }

    const json = await res.json();
    return json.result ?? json;
  } finally {
    clearTimeout(timeout);
  }
}

// ---------- Raw Hostaway types ----------

export interface HostawayListing {
  id: number;
  name: string;
  description: string;
  address: string;
  city: string;
  state: string;
  zipcode: string;
  countryCode: string;
  latitude: number;
  longitude: number;
  bedrooms: number;
  bathrooms: number;
  beds: number;
  personCapacity: number;
  squareFeet: number | null;
  propertyTypeId: number;
  roomTypeId: number;
  cleaningFee: number | null;
  price: number;
  weeklyDiscount: number | null;
  monthlyDiscount: number | null;
  minNights: number;
  maxNights: number | null;
  images: HostawayImage[];
  listingAmenities?: HostawayAmenity[];
  isActive: number;
  [key: string]: unknown;
}

interface HostawayImage {
  url: string;
  caption: string;
  sortOrder: number;
}

interface HostawayAmenity {
  name: string;
  [key: string]: unknown;
}

export interface HostawayCalendarDay {
  date: string;
  isAvailable: number;
  price: number | null;
  minimumStay: number | null;
}

// ---------- Public API ----------

export async function fetchListings(): Promise<HostawayListing[]> {
  if (!isConfigured()) return [];

  const cacheKey = "hostaway:listings";
  const cached = getCached<HostawayListing[]>(cacheKey);
  if (cached) return cached;

  try {
    const listings = await hostawayFetch<HostawayListing[]>(
      `/listings?limit=200&isActive=1`
    );
    const active = Array.isArray(listings)
      ? listings.filter((l) => !!l.isActive)
      : [];
    console.log(`Hostaway: fetched ${Array.isArray(listings) ? listings.length : 0} listings, ${active.length} active`);
    setCache(cacheKey, active);
    return active;
  } catch (error) {
    console.error("Hostaway fetchListings error:", error);
    return [];
  }
}

export async function fetchListing(id: number): Promise<HostawayListing | null> {
  if (!isConfigured()) return null;

  const cacheKey = `hostaway:listing:${id}`;
  const cached = getCached<HostawayListing>(cacheKey);
  if (cached) return cached;

  try {
    const listing = await hostawayFetch<HostawayListing>(`/listings/${id}`);
    setCache(cacheKey, listing);
    return listing;
  } catch (error) {
    console.error(`Hostaway fetchListing(${id}) error:`, error);
    return null;
  }
}

export async function fetchCalendar(
  listingId: number,
  startDate: string,
  endDate: string
): Promise<HostawayCalendarDay[]> {
  if (!isConfigured()) return [];

  // Calendar data is NOT cached — needs real-time availability
  try {
    const data = await hostawayFetch<HostawayCalendarDay[]>(
      `/listings/${listingId}/calendar?startDate=${startDate}&endDate=${endDate}`
    );
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error(`Hostaway fetchCalendar(${listingId}) error:`, error);
    return [];
  }
}

export async function createReservation(params: {
  listingId: number;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  arrivalDate: string;
  departureDate: string;
  totalPrice: number;
  cleaningFee: number;
  numberOfGuests: number;
}): Promise<{ id: number } | null> {
  if (!isConfigured()) return null;

  try {
    const result = await hostawayFetch<{ id: number }>("/reservations", {
      method: "POST",
      body: JSON.stringify({
        listingMapId: params.listingId,
        channelId: 2000, // direct booking channel
        guestName: params.guestName,
        guestEmail: params.guestEmail,
        guestPhone: params.guestPhone,
        arrivalDate: params.arrivalDate,
        departureDate: params.departureDate,
        totalPrice: params.totalPrice,
        cleaningFee: params.cleaningFee,
        numberOfGuests: params.numberOfGuests,
        source: "direct",
        status: "confirmed",
      }),
    });
    return result;
  } catch (error) {
    console.error("Hostaway createReservation error:", error);
    throw error; // Rethrow — approval should fail if reservation fails
  }
}

// ---------- Amenity mapping ----------

const AMENITY_MAP: Record<string, string> = {
  pool: "Pool",
  "hot tub": "Hot Tub",
  "hot_tub": "Hot Tub",
  parking: "Parking",
  "free parking": "Parking",
  "pets allowed": "Pet Friendly",
  "pet friendly": "Pet Friendly",
  wifi: "WiFi",
  "wireless internet": "WiFi",
  internet: "WiFi",
  "air conditioning": "AC",
  ac: "AC",
  kitchen: "Kitchen",
  washer: "Washer/Dryer",
  dryer: "Washer/Dryer",
  "washer/dryer": "Washer/Dryer",
  gym: "Gym",
  "ev charger": "EV Charger",
  bbq: "BBQ Grill",
  grill: "BBQ Grill",
  "fire pit": "Fire Pit",
  "beach access": "Beach Access",
  balcony: "Balcony",
  "outdoor space": "Outdoor Space",
  patio: "Outdoor Space",
  garden: "Outdoor Space",
};

export function mapHostawayAmenities(listing: HostawayListing): string[] {
  const amenities = new Set<string>();
  if (!listing.listingAmenities) return [];

  for (const a of listing.listingAmenities) {
    const name = (a.name || "").toLowerCase().trim();
    for (const [key, mapped] of Object.entries(AMENITY_MAP)) {
      if (name.includes(key)) {
        amenities.add(mapped);
        break;
      }
    }
  }
  return Array.from(amenities);
}
