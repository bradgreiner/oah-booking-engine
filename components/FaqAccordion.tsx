"use client";

import { useState } from "react";

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqAccordionProps {
  items: FaqItem[];
}

export default function FaqAccordion({ items }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      {items.map((item, i) => (
        <div key={i} className="rounded-xl border border-gray-200 bg-white">
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="flex w-full items-center justify-between px-5 py-4 text-left"
          >
            <span className="pr-4 text-sm font-medium text-gray-900">{item.question}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className={`h-4 w-4 shrink-0 text-gray-400 transition-transform duration-200 ${
                openIndex === i ? "rotate-180" : ""
              }`}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </button>
          {openIndex === i && (
            <div className="border-t border-gray-100 px-5 pb-4 pt-3">
              <p className="text-sm leading-relaxed text-gray-600">{item.answer}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
