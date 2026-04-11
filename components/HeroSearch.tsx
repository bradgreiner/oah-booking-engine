"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const CITIES = [
  "Los Angeles",
  "Santa Monica",
  "West Hollywood",
  "Palm Springs",
  "Palm Desert",
  "Malibu",
  "Manhattan Beach",
  "Venice",
  "Marina del Rey",
];

export default function HeroSearch() {
  const router = useRouter();
  const [city, setCity] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  function handleSearch() {
    const params = new URLSearchParams();
    if (city) params.set("city", city);
    if (checkIn) params.set("checkIn", checkIn);
    if (checkOut) params.set("checkOut", checkOut);
    router.push(`/search?${params.toString()}`);
  }

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="flex flex-col gap-3 rounded-xl bg-white p-4 shadow-lg md:flex-row md:items-end md:gap-2">
        {/* City select */}
        <div className="flex-1">
          <label className="mb-1 block text-xs font-medium text-gray-500">
            Where
          </label>
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-800 outline-none focus:border-[#4C6C4E] focus:ring-1 focus:ring-[#4C6C4E]"
          >
            <option value="">All locations</option>
            {CITIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Check-in */}
        <div className="flex-1">
          <label className="mb-1 block text-xs font-medium text-gray-500">
            Move In
          </label>
          <input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-800 outline-none focus:border-[#4C6C4E] focus:ring-1 focus:ring-[#4C6C4E]"
          />
        </div>

        {/* Check-out */}
        <div className="flex-1">
          <label className="mb-1 block text-xs font-medium text-gray-500">
            Move Out
          </label>
          <input
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-800 outline-none focus:border-[#4C6C4E] focus:ring-1 focus:ring-[#4C6C4E]"
          />
        </div>

        {/* Search button */}
        <button
          onClick={handleSearch}
          className="rounded-lg bg-[#4C6C4E] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#3d5a3f] md:whitespace-nowrap"
        >
          Search homes
        </button>
      </div>
    </div>
  );
}
