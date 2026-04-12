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

function getNextMonths(count: number): { value: string; label: string }[] {
  const months: { value: string; label: string }[] = [];
  const now = new Date();
  for (let i = 0; i < count; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const label = d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
    months.push({ value, label });
  }
  return months;
}

const MONTHS = getNextMonths(18);

export default function HeroSearch() {
  const router = useRouter();
  const [city, setCity] = useState("");
  const [moveIn, setMoveIn] = useState("");
  const [moveOut, setMoveOut] = useState("");

  function handleSearch() {
    const params = new URLSearchParams();
    if (city) params.set("city", city);
    if (moveIn) params.set("moveIn", moveIn);
    if (moveOut) params.set("moveOut", moveOut);
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
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-2">
            <div className="flex-1">
              <label className="mb-0.5 block text-[10px] font-semibold uppercase tracking-wider text-gray-500 md:mb-1 md:text-xs">
                Move in
              </label>
              <select
                value={moveIn}
                onChange={(e) => setMoveIn(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 outline-none focus:border-[#4C6C4E] focus:ring-1 focus:ring-[#4C6C4E] md:py-2.5"
              >
                <option value="">Any month</option>
                {MONTHS.map((m) => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
            </div>

            <div className="flex-1">
              <label className="mb-0.5 block text-[10px] font-semibold uppercase tracking-wider text-gray-500 md:mb-1 md:text-xs">
                Move out
              </label>
              <select
                value={moveOut}
                onChange={(e) => setMoveOut(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 outline-none focus:border-[#4C6C4E] focus:ring-1 focus:ring-[#4C6C4E] md:py-2.5"
              >
                <option value="">Any month</option>
                {MONTHS.map((m) => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
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
