"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const CITIES = [
  "Los Angeles",
  "Santa Monica",
  "West Hollywood",
  "Palm Springs",
  "Palm Desert",
  "Rancho Mirage",
  "La Quinta",
  "Cathedral City",
  "Manhattan Beach",
  "Malibu",
  "Topanga",
  "Yucca Valley",
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
      <div className="rounded-xl bg-white/90 p-3 shadow-lg backdrop-blur-md md:p-4">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:gap-2">
          <div className="flex-1">
            <label className="mb-0.5 block text-[10px] font-semibold uppercase tracking-wider text-gray-500 md:mb-1 md:text-xs">
              Where
            </label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 outline-none focus:border-[#4C6C4E] focus:ring-1 focus:ring-[#4C6C4E] md:py-2.5"
            >
              <option value="">All locations</option>
              {CITIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-2">
            <div className="flex-1">
              <label className="mb-0.5 block text-[10px] font-semibold uppercase tracking-wider text-gray-500 md:mb-1 md:text-xs">
                Move in
              </label>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 outline-none focus:border-[#4C6C4E] focus:ring-1 focus:ring-[#4C6C4E] md:py-2.5"
              />
            </div>

            <div className="flex-1">
              <label className="mb-0.5 block text-[10px] font-semibold uppercase tracking-wider text-gray-500 md:mb-1 md:text-xs">
                Move out
              </label>
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 outline-none focus:border-[#4C6C4E] focus:ring-1 focus:ring-[#4C6C4E] md:py-2.5"
              />
            </div>
          </div>

          <button
            onClick={handleSearch}
            className="w-full rounded-full bg-[#4C6C4E] px-8 py-2.5 text-sm font-medium text-white transition hover:bg-[#3d5a40] md:w-auto md:py-3 md:whitespace-nowrap"
          >
            Search homes
          </button>
        </div>
      </div>
    </div>
  );
}
