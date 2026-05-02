import { hostawayFetch } from "./hostaway";
import { unstable_cache } from "next/cache";

export type Review = {
  id: number;
  reviewerName: string;
  channel: "Airbnb" | "VRBO" | "Booking.com" | "Direct" | "Other";
  rating: number;
  text: string;
  date: string;
  categoryRatings?: {
    cleanliness?: number;
    accuracy?: number;
    checkin?: number;
    communication?: number;
    location?: number;
    value?: number;
  };
};

export type ReviewSummary = {
  averageRating: number;
  totalReviews: number;
  categoryAverages: Record<string, number>;
};

const CHANNEL_MAP: Record<number, Review["channel"]> = {
  2018: "Airbnb",
  2000: "Airbnb",
  2002: "VRBO",
  2005: "Booking.com",
  2007: "Direct",
};

function channelName(channelId: number): Review["channel"] {
  return CHANNEL_MAP[channelId] || "Other";
}

function firstName(name: string | null | undefined): string {
  if (!name || name.trim().length === 0) return "Guest";
  return name.trim().split(/\s+/)[0];
}

function normalizeDate(dateStr: string | null | undefined): string {
  if (!dateStr) return new Date().toISOString();
  // Hostaway returns SQL datetime "2026-04-17 11:00:00" which Safari can't parse.
  // Normalize to ISO format.
  const normalized = dateStr.includes("T") ? dateStr : dateStr.replace(" ", "T") + "Z";
  const parsed = new Date(normalized);
  if (isNaN(parsed.getTime())) return new Date().toISOString();
  return parsed.toISOString();
}

export interface RawReview {
  id: number;
  type: string;
  status?: string;
  listingMapId: number;
  listingId?: number;
  channelId: number;
  guestName?: string;
  reservationGuestName?: string;
  publicReview?: string;
  totalRating?: number;
  departureDate?: string;
  insertedOn?: string;
  isPublic?: number | boolean;
  bookingEngineVisibility?: number;
  cleanlinessRating?: number;
  accuracyRating?: number;
  checkinRating?: number;
  communicationRating?: number;
  locationRating?: number;
  valueRating?: number;
}

async function fetchAllReviewsRaw(): Promise<RawReview[]> {
  const all: RawReview[] = [];
  let offset = 0;
  const limit = 200;
  try {
    for (let i = 0; i < 100; i++) {
      const batch = await hostawayFetch<RawReview[]>(
        `/reviews?limit=${limit}&offset=${offset}`
      );
      if (!Array.isArray(batch) || batch.length === 0) break;
      all.push(...batch);
      if (batch.length < limit) break;
      offset += limit;
    }
  } catch (err) {
    console.error("Error fetching all reviews from Hostaway:", err);
  }
  console.log(`[reviews] Fetched ${all.length} total reviews across ${Math.ceil(offset / limit) + 1} pages`);
  return all;
}

export const getAllReviewsGlobal = unstable_cache(
  fetchAllReviewsRaw,
  ["all-reviews-global"],
  { revalidate: 86400, tags: ["reviews"] }
);

function mapReview(r: RawReview): Review {
  const rawRating = r.totalRating ?? 10;
  const categoryRatings: Review["categoryRatings"] = {};
  if (r.cleanlinessRating) categoryRatings.cleanliness = r.cleanlinessRating / 2;
  if (r.accuracyRating) categoryRatings.accuracy = r.accuracyRating / 2;
  if (r.checkinRating) categoryRatings.checkin = r.checkinRating / 2;
  if (r.communicationRating) categoryRatings.communication = r.communicationRating / 2;
  if (r.locationRating) categoryRatings.location = r.locationRating / 2;
  if (r.valueRating) categoryRatings.value = r.valueRating / 2;

  return {
    id: r.id,
    reviewerName: firstName(r.guestName || r.reservationGuestName),
    channel: channelName(r.channelId),
    rating: Math.round((rawRating / 2) * 10) / 10,
    text: (r.publicReview || "").trim(),
    date: normalizeDate(r.departureDate || r.insertedOn),
    ...(Object.keys(categoryRatings).length > 0 ? { categoryRatings } : {}),
  };
}

function filterForListing(reviews: RawReview[], listingId: number): RawReview[] {
  return reviews.filter((r) =>
    r.listingMapId === listingId &&
    r.type === "guest-to-host" &&
    r.publicReview &&
    r.publicReview.trim().length > 0 &&
    r.bookingEngineVisibility !== 0
  );
}

export async function getListingReviews(listingId: number): Promise<Review[]> {
  const all = await getAllReviewsGlobal();
  return filterForListing(all, listingId)
    .map(mapReview)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

function computeSummary(reviews: Review[]): ReviewSummary {
  if (reviews.length === 0) {
    return { averageRating: 0, totalReviews: 0, categoryAverages: {} };
  }

  const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  const categoryKeys = ["cleanliness", "accuracy", "checkin", "communication", "location", "value"] as const;
  const categoryAverages: Record<string, number> = {};

  for (const key of categoryKeys) {
    const vals = reviews
      .map((r) => r.categoryRatings?.[key])
      .filter((v): v is number => v != null && v > 0);
    if (vals.length > 0) {
      categoryAverages[key] = Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 100) / 100;
    }
  }

  return {
    averageRating: Math.round(avg * 100) / 100,
    totalReviews: reviews.length,
    categoryAverages,
  };
}

export async function getListingReviewSummary(listingId: number): Promise<ReviewSummary> {
  const reviews = await getListingReviews(listingId);
  return computeSummary(reviews);
}
