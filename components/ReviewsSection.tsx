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

const SUBCATEGORIES: { key: string; label: string }[] = [
  { key: "cleanliness", label: "Cleanliness" },
  { key: "accuracy", label: "Accuracy" },
  { key: "checkin", label: "Check-in" },
  { key: "communication", label: "Communication" },
  { key: "location", label: "Location" },
  { key: "value", label: "Value" },
];

const INITIAL_COUNT = 6;

function relevanceScore(review: Review): number {
  const dateMs = new Date(review.date).getTime();
  const daysAgo = isNaN(dateMs) ? 999 : (Date.now() - dateMs) / (1000 * 60 * 60 * 24);
  const recency = daysAgo < 90 ? 3 : daysAgo < 365 ? 2 : 1;
  const length = Math.min((review.text || "").length / 300, 1.0) * 0.5;
  const ratingScore = ((review.rating || 0) / 5) * 0.5;
  return recency * 1.0 + length + ratingScore;
}

function sortReviews(reviews: Review[], sortBy: SortOption): Review[] {
  const sorted = [...reviews];
  switch (sortBy) {
    case "relevant": {
      const long = sorted.filter((r) => (r.text || "").length >= 80);
      const short = sorted.filter((r) => (r.text || "").length < 80);
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

function LaurelLeft() {
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#4C6C4E]">
      <path d="M16 28c0-4-2-7.5-5-10 3-.5 5.5-3 6-6-.5 3-3 5.5-6 6 3-2.5 5-6 5-10-1.5 3.5-4.5 6-8 7 3.5-1 6-4 7-8-1 3-3.5 5.5-7 6.5 2.5-2 4-5 4-8.5-1.5 3-4 5.5-7 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function LaurelRight() {
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 scale-x-[-1] text-[#4C6C4E]">
      <path d="M16 28c0-4-2-7.5-5-10 3-.5 5.5-3 6-6-.5 3-3 5.5-6 6 3-2.5 5-6 5-10-1.5 3.5-4.5 6-8 7 3.5-1 6-4 7-8-1 3-3.5 5.5-7 6.5 2.5-2 4-5 4-8.5-1.5 3-4 5.5-7 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function SubcategoryIcon({ cat }: { cat: string }) {
  const cls = "h-5 w-5 text-[#4C6C4E]";
  switch (cat) {
    case "cleanliness":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={cls}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
        </svg>
      );
    case "accuracy":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={cls}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    case "checkin":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={cls}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
        </svg>
      );
    case "communication":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={cls}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
        </svg>
      );
    case "location":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={cls}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
        </svg>
      );
    case "value":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={cls}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
        </svg>
      );
    default:
      return null;
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

  const categoryEntries = SUBCATEGORIES
    .map((s) => ({ ...s, value: summary.categoryAverages[s.key] }))
    .filter((s) => s.value != null && s.value > 0);

  const isGuestFavorite = summary.totalReviews >= 10 && summary.averageRating >= 4.7;

  return (
    <div id="reviews" className="scroll-mt-24">
      <hr className="my-8 border-gray-100" />

      {/* Large rating header */}
      <div className="mb-12 flex flex-col items-center text-center">
        <div className="mb-2 flex items-center gap-4">
          <LaurelLeft />
          <span className="font-serif text-7xl font-light tracking-tight text-[#1a1a1a]">
            {summary.averageRating.toFixed(2)}
          </span>
          <LaurelRight />
        </div>
        <p className="mb-1 text-lg font-medium text-[#1a1a1a]">
          {isGuestFavorite ? "Guest favorite" : `${summary.totalReviews} reviews`}
        </p>
        <p className="max-w-md text-sm text-gray-500">
          {isGuestFavorite
            ? "Loved by guests across multiple stays"
            : "Verified guest reviews"}
        </p>
      </div>

      {/* Subcategory grid */}
      {categoryEntries.length > 0 && (
        <div className="mb-12 grid grid-cols-2 gap-6 border-b border-gray-200 pb-8 md:grid-cols-3 lg:grid-cols-6">
          {categoryEntries.map((cat) => (
            <div key={cat.key} className="flex flex-col items-center text-center">
              <span className="mb-2 text-xs text-gray-500">{cat.label}</span>
              <span className="mb-2 font-serif text-2xl text-[#1a1a1a]">{cat.value.toFixed(1)}</span>
              <SubcategoryIcon cat={cat.key} />
            </div>
          ))}
        </div>
      )}

      {/* Sort row */}
      <div className="mb-8 flex items-center justify-between">
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
      <div className="grid gap-6 md:grid-cols-2">
        {displayed.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>

      {/* Show all button */}
      {!showAll && sorted.length > INITIAL_COUNT && (
        <div className="mt-8 text-center">
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
