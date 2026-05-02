"use client";

import { useState } from "react";
import type { Review } from "@/lib/hostaway-reviews";

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className={`h-3.5 w-3.5 ${i <= Math.round(rating) ? "text-[#4C6C4E]" : "text-gray-200"}`}
        >
          <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
        </svg>
      ))}
    </div>
  );
}

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

const TRUNCATE_LENGTH = 280;

export default function ReviewCard({ review }: { review: Review }) {
  const [expanded, setExpanded] = useState(false);
  const text = review.text || "";
  const needsTruncation = text.length > TRUNCATE_LENGTH;
  const displayText = needsTruncation && !expanded
    ? text.slice(0, TRUNCATE_LENGTH) + "..."
    : text;

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5">
      {/* Avatar + name + date */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F5F0E8] text-sm font-semibold text-[#4C6C4E]">
          {(review.reviewerName || "G").charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="text-[15px] font-semibold text-gray-900">{review.reviewerName}</p>
          <p className="text-[13px] text-gray-500">{formatDate(review.date)}</p>
        </div>
      </div>

      {/* Stars + channel */}
      <div className="mt-2.5 flex items-center gap-2">
        <StarRow rating={review.rating} />
        <span className="text-[11px] text-gray-400">via {review.channel}</span>
      </div>

      {/* Review text */}
      <p className="mt-3 text-[15px] leading-relaxed text-[#333]">
        {displayText}
      </p>
      {needsTruncation && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-1 text-sm font-medium text-[#4C6C4E] hover:underline"
        >
          {expanded ? "Show less" : "Show more"}
        </button>
      )}
    </div>
  );
}
