import { prisma } from "./prisma";
import { Prisma } from "@prisma/client";
import {
  fetchListings,
  fetchListing,
  mapHostawayAmenities,
  type HostawayListing,
} from "./hostaway";
import { calculateBookingFees, getNightCount } from "./booking";
import { fetchPriceLabsBatch } from "./pricelabs";
import { getMarketCities } from "./constants";

// ---------- Unified property shape ----------

export interface UnifiedProperty {
  id: string;
  slug: string;
  name: string;
  headline: string | null;
  description: string | null;
  neighborhood: string | null;
  city: string | null;
  state: string | null;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  sqft: number | null;
  propertyType: string;
  baseRate: number;
  weeklyDiscount: number;
  monthlyDiscount: number;
  cleaningFee: number;
  petFee: number;
  minNights: number;
  maxNights: number | null;
  totRate: number;
  isOlympic: boolean;
  amenities: string | null;
  status: string;
  isPublished: boolean;
  createdAt: string;
  images: { url: string; alt?: string | null; sortOrder?: number }[];
  source: "local" | "hostaway";
  hostawayListingId: number | null;
  latitude: number | null;
  longitude: number | null;
}

export interface PropertyFilters {
  status?: string;
  city?: string;
  propertyType?: string;
  isOlympic?: string;
  search?: string;
  sort?: string;
  minPrice?: string;
  maxPrice?: string;
  amenity?: string;
}

// ---------- Hostaway → UnifiedProperty mapping ----------

function derivePropertyType(listing: HostawayListing): string {
  const min = listing.minNights || 1;
  const hasMonthlyDiscount = (listing.monthlyDiscount ?? 0) > 0;
  if (min >= 28) return "monthly";
  if (min < 7 && hasMonthlyDiscount) return "both";
  return "str";
}

function firstPositive(...vals: unknown[]): number {
  for (const v of vals) {
    if (typeof v === "number" && v > 0) return v;
  }
  return 0;
}

function extractImages(listing: HostawayListing): { url: string; alt: string | null; sortOrder?: number }[] {
  // Try every known field name for images
  const raw: unknown[] =
    (listing as any).listingImages ??
    listing.images ??
    (listing as any).photos ??
    (listing as any).imageList ??
    [];

  if (!Array.isArray(raw) || raw.length === 0) {
    // Check for a single thumbnail URL
    const thumb = (listing as any).thumbnailUrl ?? (listing as any).imageUrl ?? (listing as any).thumbnail;
    if (typeof thumb === "string" && thumb.startsWith("http")) {
      return [{ url: thumb, alt: null, sortOrder: 0 }];
    }
    return [];
  }

  return raw
    .filter((img: any) => img && typeof img.url === "string" && img.url.startsWith("http"))
    .sort((a: any, b: any) => ((a.sortOrder ?? a.order ?? 0) - (b.sortOrder ?? b.order ?? 0)))
    .map((img: any) => ({
      url: img.url,
      alt: img.caption ?? img.title ?? null,
      sortOrder: img.sortOrder ?? img.order,
    }));
}

function mapHostawayToUnified(listing: HostawayListing): UnifiedProperty {
  const amenities = mapHostawayAmenities(listing);

  // Fallback: detect amenities from listing name and description
  // (bulk listings endpoint doesn't include listingAmenities)
  const nameLC = (listing.name || "").toLowerCase();
  const descLC = (listing.description || "").toLowerCase();
  const detected: string[] = [];
  if (nameLC.includes("pool") || descLC.includes("pool")) detected.push("Pool");
  if (nameLC.includes("pet") || descLC.includes("pet friendly") || descLC.includes("pets welcome")) detected.push("Pet Friendly");
  if (nameLC.includes("hot tub") || nameLC.includes("spa") || descLC.includes("hot tub") || descLC.includes("jacuzzi")) detected.push("Hot Tub");
  if (nameLC.includes("firepit") || nameLC.includes("fire pit") || descLC.includes("fire pit") || descLC.includes("firepit")) detected.push("Fire Pit");
  if (nameLC.includes("sauna") || descLC.includes("sauna")) detected.push("Sauna");
  if (nameLC.includes("ocean") || nameLC.includes("beach") || descLC.includes("beach access") || descLC.includes("steps to the sand")) detected.push("Beach Access");

  const combined = Array.from(new Set([...amenities, ...detected]));

  const images = extractImages(listing);
  const l = listing as Record<string, unknown>;

  // Use ?? (null-coalescing) not || — 0 is valid for bedrooms/bathrooms
  const bedrooms = firstPositive(
    l.bedroomsNumber, listing.bedrooms, l.bedroomsCount, l.numberOfBedrooms
  );
  const bathrooms = firstPositive(
    l.bathroomsNumber, listing.bathrooms, l.bathroomsCount, l.numberOfBathrooms
  );

  // Lat/Lng — use ?? to preserve 0 (unlikely but correct)
  const latitude = (listing.latitude ?? (l.lat as number)) || null;
  const longitude = (listing.longitude ?? (l.lng as number)) || null;

  // Square footage
  const sqft = firstPositive(listing.squareFeet, l.propertySize, l.squareFootage) || null;

  // Base rate: use price (the nightly rate from Hostaway), NOT bookingEngineMarkup (which is a multiplier ~0.99)
  const baseRate = firstPositive(
    (l as any).price,
    listing.baseRate,
    (l as any).basePrice,
  ) || 0;

  return {
    id: `hw_${listing.id}`,
    slug: `hw-${listing.id}`,
    name: listing.name,
    headline: listing.name,
    description: listing.description || null,
    neighborhood: null,
    city: listing.city || null,
    state: listing.state || null,
    bedrooms,
    bathrooms,
    maxGuests: listing.personCapacity ?? 1,
    sqft,
    propertyType: derivePropertyType(listing),
    baseRate,
    weeklyDiscount: listing.weeklyDiscount ?? 0,
    monthlyDiscount: listing.monthlyDiscount ?? 0,
    cleaningFee: listing.cleaningFee ?? 0,
    petFee: 0,
    minNights: listing.minNights ?? 1,
    maxNights: listing.maxNights ?? null,
    totRate: 0.12,
    isOlympic: false,
    amenities: combined.length > 0 ? JSON.stringify(combined) : null,
    status: "active",
    isPublished: true,
    createdAt: new Date().toISOString(),
    images,
    source: "hostaway",
    hostawayListingId: listing.id,
    latitude,
    longitude,
  };
}

// ---------- Local Prisma → UnifiedProperty ----------

function mapLocalToUnified(
  property: Prisma.PropertyGetPayload<{ include: { images: true } }>
): UnifiedProperty {
  return {
    id: property.id,
    slug: property.slug,
    name: property.name,
    headline: property.headline,
    description: property.description,
    neighborhood: property.neighborhood,
    city: property.city,
    state: property.state,
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    maxGuests: property.maxGuests,
    sqft: property.sqft,
    propertyType: property.propertyType,
    baseRate: property.baseRate,
    weeklyDiscount: property.weeklyDiscount,
    monthlyDiscount: property.monthlyDiscount,
    cleaningFee: property.cleaningFee,
    petFee: property.petFee,
    minNights: property.minNights,
    maxNights: property.maxNights,
    totRate: property.totRate,
    isOlympic: property.isOlympic,
    amenities: property.amenities,
    status: property.status,
    isPublished: property.isPublished,
    createdAt: property.createdAt.toISOString(),
    images: property.images.map((img) => ({
      url: img.url,
      alt: img.alt,
      sortOrder: img.sortOrder,
    })),
    source: "local",
    hostawayListingId: null,
    latitude: null,
    longitude: null,
  };
}

// ---------- Filtering helpers ----------

function applyFilters(
  properties: UnifiedProperty[],
  filters: PropertyFilters
): UnifiedProperty[] {
  let result = properties;

  if (filters.city) {
    const marketCities = getMarketCities(filters.city);
    if (marketCities) {
      const marketLower = marketCities.map((c) => c.toLowerCase());
      result = result.filter((p) => p.city && marketLower.includes(p.city.toLowerCase()));
    } else {
      const cityLower = filters.city.toLowerCase();
      result = result.filter((p) => p.city?.toLowerCase() === cityLower);
    }
  }

  if (filters.propertyType) {
    const ft = filters.propertyType;
    if (ft === "monthly") {
      result = result.filter((p) => p.propertyType === "monthly" || p.propertyType === "both");
    } else if (ft === "str") {
      result = result.filter((p) => p.propertyType === "str" || p.propertyType === "both");
    } else {
      result = result.filter((p) => p.propertyType === ft);
    }
  }

  if (filters.isOlympic === "true") {
    result = result.filter((p) => p.isOlympic);
  }

  if (filters.minPrice) {
    const min = parseFloat(filters.minPrice);
    result = result.filter((p) => p.baseRate >= min);
  }

  if (filters.maxPrice) {
    const max = parseFloat(filters.maxPrice);
    result = result.filter((p) => p.baseRate <= max);
  }

  if (filters.amenity) {
    const amenityLower = filters.amenity.toLowerCase();
    result = result.filter((p) => {
      if (!p.amenities) return false;
      return p.amenities.toLowerCase().includes(amenityLower);
    });
  }

  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(searchLower) ||
        (p.headline && p.headline.toLowerCase().includes(searchLower)) ||
        (p.neighborhood && p.neighborhood.toLowerCase().includes(searchLower)) ||
        (p.city && p.city.toLowerCase().includes(searchLower))
    );
  }

  return result;
}

function getSortPrice(p: UnifiedProperty): number {
  const isMonthly = p.propertyType === "monthly" || (p.minNights ?? 0) >= 28;
  return isMonthly ? p.baseRate * 30 : p.baseRate;
}

function applySort(properties: UnifiedProperty[], sort?: string): UnifiedProperty[] {
  if (sort === "price_asc") {
    return [...properties].sort((a, b) => getSortPrice(a) - getSortPrice(b));
  }
  if (sort === "price_desc") {
    return [...properties].sort((a, b) => getSortPrice(b) - getSortPrice(a));
  }
  // Default: newest first
  return [...properties].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

// ---------- PriceLabs overlay ----------

// RULE: PriceLabs is the ONLY pricing source. Hostaway prices are dummy
// values and must never be shown to guests. When PriceLabs has data, use it.
// When PriceLabs has no data for a listing, set baseRate to 0 so the UI
// shows "Contact for pricing" instead of the dummy Hostaway price.
async function overlayPriceLabsRates(properties: UnifiedProperty[]): Promise<UnifiedProperty[]> {
  const hostawayProps = properties.filter((p) => p.hostawayListingId);
  if (hostawayProps.length === 0) return properties;

  const hostawayIds = hostawayProps.map((p) => p.hostawayListingId!);
  const today = new Date();
  const startDate = today.toISOString().split("T")[0];
  const endDate = new Date(today.getTime() + 30 * 86400000).toISOString().split("T")[0];

  const plRates = await fetchPriceLabsBatch(hostawayIds, startDate, endDate);
  console.log('[pricelabs batch]', { sent: hostawayIds.length, received: plRates.size });

  return properties.map((p) => {
    if (!p.hostawayListingId) return p;
    const dynamicRate = plRates.get(p.hostawayListingId);
    if (dynamicRate && dynamicRate > 0) {
      return { ...p, baseRate: dynamicRate, weeklyDiscount: 0, monthlyDiscount: 0 };
    }
    // No PriceLabs data — zero out the dummy Hostaway price
    return { ...p, baseRate: 0, weeklyDiscount: 0, monthlyDiscount: 0 };
  });
}

// ---------- Public API ----------

export async function getProperties(
  filters: PropertyFilters = {}
): Promise<UnifiedProperty[]> {
  // Fetch both sources in parallel
  const [localProperties, hostawayListings] = await Promise.all([
    fetchLocalProperties(filters),
    fetchListings(),
  ]);

  const localUnified = localProperties.map(mapLocalToUnified);
  const hostawayUnified = hostawayListings.map(mapHostawayToUnified);
  const hostawayFiltered = applyFilters(hostawayUnified, filters);

  // Merge, filter Hostaway side, sort
  let merged = [...localUnified, ...hostawayFiltered];

  // Olympic filter already applied to local via Prisma, but re-filter for consistency
  if (filters.isOlympic === "true") {
    merged = merged.filter((p) => p.isOlympic);
  }

  // Overlay PriceLabs dynamic rates (replaces Hostaway baseRate with PriceLabs avg)
  merged = await overlayPriceLabsRates(merged);

  return applySort(merged, filters.sort);
}

export async function getProperty(id: string): Promise<UnifiedProperty | null> {
  let property: UnifiedProperty | null = null;

  // Hostaway IDs are prefixed with "hw_"
  if (id.startsWith("hw_")) {
    const hostawayId = parseInt(id.slice(3), 10);
    if (isNaN(hostawayId)) return null;
    const allListings = await fetchListings();
    const bulkMatch = allListings.find((l) => l.id === hostawayId);
    if (bulkMatch) {
      property = mapHostawayToUnified(bulkMatch);
    } else {
      const listing = await fetchListing(hostawayId);
      if (!listing) return null;
      property = mapHostawayToUnified(listing);
    }
  } else {
    // Local property (CUID)
    try {
      const dbProp = await prisma.property.findUnique({
        where: { id },
        include: {
          images: { orderBy: { sortOrder: "asc" } },
        },
      });
      if (!dbProp) return null;
      property = mapLocalToUnified(dbProp);
    } catch {
      return null;
    }
  }

  // RULE: PriceLabs is the ONLY pricing source. Hostaway prices are dummy values.
  // Overlay PriceLabs 30-day average so the detail page header matches browse cards.
  // If PriceLabs has no data, zero out baseRate so UI shows "Contact for pricing".
  if (property && property.hostawayListingId) {
    const today = new Date();
    const startDate = today.toISOString().split("T")[0];
    const endDate = new Date(today.getTime() + 30 * 86400000).toISOString().split("T")[0];
    const plRates = await fetchPriceLabsBatch([property.hostawayListingId], startDate, endDate);
    const dynamicRate = plRates.get(property.hostawayListingId);
    if (dynamicRate && dynamicRate > 0) {
      property = { ...property, baseRate: dynamicRate, weeklyDiscount: 0, monthlyDiscount: 0 };
    } else {
      property = { ...property, baseRate: 0, weeklyDiscount: 0, monthlyDiscount: 0 };
    }
  }

  return property;
}

export async function getPropertyPricing(
  id: string,
  checkIn: string,
  checkOut: string
) {
  const property = await getProperty(id);
  if (!property) return null;

  const numNights = getNightCount(checkIn, checkOut);
  if (numNights <= 0) return null;

  // RULE: PriceLabs is the ONLY pricing source. No Hostaway discount multipliers.
  // getProperty already overlays PriceLabs 30-day avg onto baseRate (or zeros it).
  // For the exact check-in/checkout range, fetch date-specific PriceLabs rates.
  let nightlyRate = property.baseRate;
  let rateSource = nightlyRate > 0 ? 'pricelabs' : 'none';
  if (property.hostawayListingId) {
    const hostawayId = parseInt(property.id.replace('hw_', ''), 10);
    const { getAverageNightlyRate } = await import('./pricelabs');
    const dynamicRate = await getAverageNightlyRate(hostawayId, checkIn, checkOut);
    console.log('[pricing debug]', {
      propertyId: property.id,
      hostawayId,
      numNights,
      priceLabsRate: dynamicRate,
      baseRate: property.baseRate,
      source: dynamicRate && dynamicRate > 0 ? 'pricelabs' : 'none',
    });
    if (dynamicRate && dynamicRate > 0) {
      nightlyRate = dynamicRate;
      rateSource = 'pricelabs';
    }
  }

  const { getTotRate } = await import('./constants');
  const totRate = getTotRate(property.city, numNights);
  const fees = calculateBookingFees({ baseRate: nightlyRate, cleaningFee: property.cleaningFee, petFee: 0, totRate }, numNights, false);
  return { ...fees, nightlyRate: Math.round(nightlyRate), numNights, checkIn, checkOut, source: property.source, rateSource };
}

// Homepage featured: only local active + Hostaway merged
export async function getFeaturedProperties(limit: number = 6): Promise<UnifiedProperty[]> {
  const [localProperties, hostawayListings] = await Promise.all([
    prisma.property.findMany({
      where: { status: "active", isPublished: true },
      include: { images: { orderBy: { sortOrder: "asc" }, take: 1 } },
      orderBy: { createdAt: "desc" },
      take: limit,
    }),
    fetchListings(),
  ]);

  const localUnified = localProperties.map(mapLocalToUnified);
  const hostawayUnified = hostawayListings
    .slice(0, limit)
    .map(mapHostawayToUnified);

  // Interleave: local first, then fill with Hostaway
  let merged = [...localUnified, ...hostawayUnified];
  merged = await overlayPriceLabsRates(merged);
  return merged.slice(0, limit);
}

// City counts for neighborhood grid
// Special logic: LA listings with "Venice" in the name count under "venice beach",
// remaining LA listings count under "los angeles"
export async function getCityCounts(): Promise<Record<string, number>> {
  const all = await getProperties();
  const counts: Record<string, number> = {};
  for (const p of all) {
    const city = (p.city || "").toLowerCase();
    if (!city) continue;

    if (city === "los angeles") {
      const nameLC = (p.name || "").toLowerCase();
      if (nameLC.includes("venice")) {
        counts["venice beach"] = (counts["venice beach"] || 0) + 1;
      } else {
        counts["los angeles"] = (counts["los angeles"] || 0) + 1;
      }
    } else {
      counts[city] = (counts[city] || 0) + 1;
    }
  }
  return counts;
}

// ---------- Internal: local Prisma fetch with filters ----------

async function fetchLocalProperties(filters: PropertyFilters) {
  const where: Prisma.PropertyWhereInput = {};

  const status = filters.status;
  if (status && status !== "all") {
    where.status = status;
  }

  if (filters.isOlympic === "true") {
    where.isOlympic = true;
  }

  if (filters.city) {
    const marketCities = getMarketCities(filters.city);
    if (marketCities) {
      where.city = { in: marketCities, mode: "insensitive" };
    } else {
      where.city = { equals: filters.city, mode: "insensitive" };
    }
  }

  if (filters.propertyType) {
    const pt = filters.propertyType;
    if (pt === "monthly") {
      where.propertyType = { in: ["monthly", "both"] };
    } else if (pt === "str") {
      where.propertyType = { in: ["str", "both"] };
    } else {
      where.propertyType = pt;
    }
  }

  if (filters.minPrice || filters.maxPrice) {
    where.baseRate = {};
    if (filters.minPrice) where.baseRate.gte = parseFloat(filters.minPrice);
    if (filters.maxPrice) where.baseRate.lte = parseFloat(filters.maxPrice);
  }

  if (filters.amenity) {
    where.amenities = { contains: filters.amenity, mode: "insensitive" };
  }

  if (filters.search) {
    where.OR = [
      { name: { contains: filters.search, mode: "insensitive" } },
      { headline: { contains: filters.search, mode: "insensitive" } },
      { neighborhood: { contains: filters.search, mode: "insensitive" } },
      { city: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  let orderBy: Prisma.PropertyOrderByWithRelationInput = { createdAt: "desc" };
  if (filters.sort === "price_asc") orderBy = { baseRate: "asc" };
  else if (filters.sort === "price_desc") orderBy = { baseRate: "desc" };

  return prisma.property.findMany({
    where,
    include: { images: { orderBy: { sortOrder: "asc" }, take: 1 } },
    orderBy,
  });
}
