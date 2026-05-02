"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { trackEvent } from "@/lib/analytics";

const MARKET_OPTIONS = [
  { value: "Los Angeles", label: "Los Angeles" },
  { value: "Palm Springs", label: "Palm Springs" },
];

export default function HeroSearch() {
  const router = useRouter();
  const [city, setCity] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  function handleSearch() {
    setIsSearching(true);
    trackEvent("search_executed", { city, checkIn, checkOut });
    const params = new URLSearchParams();
    if (city) params.set("city", city);
    if (checkIn) params.set("checkIn", checkIn);
    if (checkOut) params.set("checkOut", checkOut);
    router.push(`/search?${params.toString()}`);
  }

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="rounded-2xl bg-white p-2 shadow-2xl">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:gap-2">
          <div className="flex-1">
            <label className="mb-0.5 block px-3 pt-2 text-[10px] font-semibold uppercase tracking-wider text-gray-500 md:text-xs">
              Where
            </label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full rounded-xl border-0 bg-gray-50 px-3 py-2.5 text-sm text-gray-800 outline-none focus:bg-gray-100 focus:ring-0"
            >
              <option value="">All locations</option>
              {MARKET_OPTIONS.map((m) => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-2">
            <div className="flex-1">
              <label className="mb-0.5 block px-3 pt-2 text-[10px] font-semibold uppercase tracking-wider text-gray-500 md:text-xs">
                Check-in
              </label>
              <input
                type="date"
                value={checkIn}
                min={today}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full rounded-xl border-0 bg-gray-50 px-3 py-2.5 text-sm text-gray-800 outline-none focus:bg-gray-100 focus:ring-0"
              />
            </div>

            <div className="flex-1">
              <label className="mb-0.5 block px-3 pt-2 text-[10px] font-semibold uppercase tracking-wider text-gray-500 md:text-xs">
                Check-out
              </label>
              <input
                type="date"
                value={checkOut}
                min={checkIn || today}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full rounded-xl border-0 bg-gray-50 px-3 py-2.5 text-sm text-gray-800 outline-none focus:bg-gray-100 focus:ring-0"
              />
            </div>
          </div>

          <button
            onClick={handleSearch}
            disabled={isSearching}
            className="w-full rounded-xl bg-[#4C6C4E] px-8 py-2.5 text-sm font-medium text-white transition hover:bg-[#3d5a40] disabled:opacity-70 disabled:cursor-not-allowed md:w-auto md:py-3 md:whitespace-nowrap"
          >
            {isSearching ? (
              <span className="inline-flex items-center gap-2">
                <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Searching...
              </span>
            ) : (
              "Search"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
