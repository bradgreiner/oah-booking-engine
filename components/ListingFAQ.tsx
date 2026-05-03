"use client";

import { useState } from "react";
import { FAQ_CONTENT } from "@/lib/listing-content";

interface Props {
  stayType: "monthly" | "str";
}

export default function ListingFAQ({ stayType }: Props) {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());
  const faqs = FAQ_CONTENT[stayType];

  function toggle(idx: number) {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  }

  return (
    <section id="faq">
      <h2 className="font-serif text-xl font-normal text-gray-900 md:text-2xl">
        Frequently asked questions
      </h2>
      <div className="mt-6">
        {faqs.map((faq, i) => (
          <div key={i} className="border-b border-gray-200">
            <button
              onClick={() => toggle(i)}
              className="flex w-full items-center justify-between py-4 text-left text-sm font-medium text-gray-900"
            >
              <span className="pr-4">{faq.q}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className={`h-4 w-4 shrink-0 text-[#4C6C4E] transition-transform duration-200 ${openItems.has(i) ? "rotate-90" : ""}`}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
            {openItems.has(i) && (
              <p className="pb-4 text-sm leading-relaxed text-gray-700">
                {faq.a}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
