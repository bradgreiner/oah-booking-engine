"use client";

import { useState, useMemo } from "react";
import ReviewCard from "@/components/ReviewCard";
import type { Review, ReviewSummary } from "@/lib/hostaway-reviews";

type SortOption = "relevant" | "recent" | "highest" | "lowest";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "relevant", label: "Most relevant" },
  { value: "recent", label: "Most recent" },
  { value: "highest", label: "Highest rated" },
  { value: "lowest", label: "Lowest rated" },
];

const CATEGORY_LABELS: Record<string, string> = {
  cleanliness: "Cleanliness",
  accuracy: "Accuracy",
  checkin: "Check-in",
  communication: "Communication",
  location: "Location",
  value: "Value",
};

const INITIAL_COUNT = 6;

function relevanceScore(review: Review): number {
  const daysAgo = (Date.now() - new Date(review.date).getTime()) / (1000 * 60 * 60 * 24);
  const recency = daysAgo < 90 ? 3 : daysAgo < 365 ? 2 : 1;
  const length = Math.min(review.text.length / 300, 1.0) * 0.5;
  const ratingScore = (review.rating / 5) * 0.5;
  return recency * 1.0 + length + ratingScore;
}

function sortReviews(reviews: Review[], sortBy: SortOption): Review[] {
  const sorted = [...reviews];
  switch (sortBy) {
    case "relevant": {
      const long = sorted.filter((r) => r.text.length >= 80);
      const short = sorted.filter((r) => r.text.length < 80);
      long.sort((a, b) => relevanceScore(b) - relevanceScore(a));
      short.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      return [...long, ...short];
    }
    case "recent":
      return sorted.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    case "highest":
      return sorted.sort((a, b) => b.rating - a.rating || new Date(b.date).getTime() - new Date(a.date).getTime());
    case "lowest":
      return sorted.sort((a, b) => a.rating - b.rating || new Date(b.date).getTime() - new Date(a.date).getTime());
    default:
      return sorted;
  }
}

interface Props {
  summary: ReviewSummary;
  reviews: Review[];
}

export default function ReviewsSection({ summary, reviews }: Props) {
  const [sortBy, setSortBy] = useState<SortOption>("relevant");
  const [showAll, setShowAll] = useState(false);

  const sorted = useMemo(() => sortReviews(reviews, sortBy), [reviews, sortBy]);
  const displayed = showAll ? sorted : sorted.slice(0, INITIAL_COUNT);

  const categoryEntries = Object.entries(summary.categoryAverages).filter(
    ([key]) => CATEGORY_LABELS[key]
  );

  return (
    <div id="reviews" className="scroll-mt-24">
      <hr className="my-8 border-gray-100" />

      {/* Heading */}
      <div className="flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7 text-[#1a1a1a]">
          <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
        </svg>
        <h2 className="font-serif text-[22px] font-normal text-[#1a1a1a] md:text-[28px]">
          {summary.averageRating.toFixed(2)} · {summary.totalReviews} {summary.totalReviews === 1 ? "review" : "reviews"}
        </h2>
      </div>

      {/* Category rating bars */}
      {categoryEntries.length > 0 && (
        <div className="mt-6 grid grid-cols-2 gap-x-8 gap-y-3 md:grid-cols-3 lg:grid-cols-6">
          {categoryEntries.map(([key, value]) => (
            <div key={key}>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">{CATEGORY_LABELS[key]}</span>
                <span className="font-medium text-gray-900">{value.toFixed(1)}</span>
              </div>
              <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full rounded-full bg-[#4C6C4E]"
                  style={{ width: `${(value / 5) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Sort row */}
      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {summary.totalReviews} {summary.totalReviews === 1 ? "review" : "reviews"}
        </p>
        <select
          value={sortBy}
          onChange={(e) => { setSortBy(e.target.value as SortOption); setShowAll(false); }}
          className="h-10 rounded-full border border-gray-300 bg-white px-4 text-sm font-medium text-gray-700 outline-none focus:border-[#4C6C4E] focus:ring-1 focus:ring-[#4C6C4E]"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Reviews grid */}
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {displayed.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>

      {/* Show all button */}
      {!showAll && sorted.length > INITIAL_COUNT && (
        <div className="mt-6 text-center">
          <button
            onClick={() => setShowAll(true)}
            className="w-full rounded-full border border-[#4C6C4E] px-8 py-3 text-sm font-semibold text-[#4C6C4E] transition hover:bg-[#4C6C4E] hover:text-white md:w-auto"
          >
            Show all {sorted.length} reviews
          </button>
        </div>
      )}
    </div>
  );
}
