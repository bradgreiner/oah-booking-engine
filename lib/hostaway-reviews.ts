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
  2002: "VRBO",
  2005: "Booking.com",
  2007: "Direct",
};

function channelName(channelId: number): Review["channel"] {
  return CHANNEL_MAP[channelId] || "Other";
}

function firstName(name: string | null | undefined): string {
  if (!name) return "Guest";
  return name.trim().split(/\s+/)[0];
}

interface HostawayReview {
  id: number;
  type: string;
  listingMapId: number;
  channelId: number;
  guestName?: string;
  reservationGuestName?: string;
  publicReview?: string;
  totalRating?: number;
  departureDate?: string;
  insertedOn?: string;
  status?: string;
  isPublic?: number | boolean;
  cleanlinessRating?: number;
  accuracyRating?: number;
  checkinRating?: number;
  communicationRating?: number;
  locationRating?: number;
  valueRating?: number;
}

async function fetchReviewsRaw(listingId: number): Promise<Review[]> {
  try {
    const data = await hostawayFetch<HostawayReview[]>(
      `/reviews?listingMapId=${listingId}&limit=200`
    );
    const reviews = Array.isArray(data) ? data : [];

    return reviews
      .filter((r) => {
        if (r.type !== "guest-to-host") return false;
        if (r.listingMapId !== listingId) return false;
        if (!r.publicReview || r.publicReview.trim().length === 0) return false;
        return true;
      })
      .map((r) => {
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
          text: r.publicReview!.trim(),
          date: r.departureDate || r.insertedOn || new Date().toISOString(),
          ...(Object.keys(categoryRatings).length > 0 ? { categoryRatings } : {}),
        };
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (err) {
    console.error(`Error fetching reviews for listing ${listingId}:`, err);
    return [];
  }
}

export const getListingReviews = (listingId: number): Promise<Review[]> => {
  return unstable_cache(
    () => fetchReviewsRaw(listingId),
    ["reviews", String(listingId)],
    { revalidate: 86400, tags: ["reviews"] }
  )();
};

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

export const getListingReviewSummary = (listingId: number): Promise<ReviewSummary> => {
  return unstable_cache(
    async () => {
      const reviews = await fetchReviewsRaw(listingId);
      return computeSummary(reviews);
    },
    ["review-summary", String(listingId)],
    { revalidate: 86400, tags: ["reviews"] }
  )();
};
