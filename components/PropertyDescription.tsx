"use client";

import { useState } from "react";

interface Props {
  description: string;
}

const CHAR_LIMIT = 300;

export default function PropertyDescription({ description }: Props) {
  const [expanded, setExpanded] = useState(false);
  const needsTruncation = description.length > CHAR_LIMIT;
  const displayText =
    needsTruncation && !expanded
      ? description.slice(0, CHAR_LIMIT) + "..."
      : description;

  return (
    <div className="mb-8">
      <h2 className="font-[Georgia,serif] text-xl font-semibold text-[#1B2A4A]">
        About this home
      </h2>
      <div className="mt-4 whitespace-pre-line leading-relaxed text-gray-600">
        {displayText}
      </div>
      {needsTruncation && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-2 text-sm font-medium text-[#4C6C4E] hover:underline"
        >
          {expanded ? "Show less" : "Read more"}
        </button>
      )}
    </div>
  );
}
