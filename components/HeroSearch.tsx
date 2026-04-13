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

  const today = new Date().toISOString().split("T")[0];

  function handleSearch() {
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
            className="w-full rounded-xl bg-[#4C6C4E] px-8 py-2.5 text-sm font-medium text-white transition hover:bg-[#3d5a40] md:w-auto md:py-3 md:whitespace-nowrap"
          >
            Search
          </button>
        </div>
      </div>
    </div>
  );
}
