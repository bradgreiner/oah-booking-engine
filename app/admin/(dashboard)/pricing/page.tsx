"use client";

import { useEffect, useState } from "react";

interface ListingData {
  hostawayId: number;
  name: string;
  city: string | null;
  minNights: number;
  type: string;
  priceLabsAvgNightly: number;
  monthlyDiscount: number;
  weeklyDiscount: number;
  calculatedMonthly: number;
  calculatedNightly: number;
  hasPriceLabsData: boolean;
}

interface Summary {
  totalListings: number;
  withPriceLabs: number;
  withoutPriceLabs: number;
  avgMonthlyPrice: number;
}

type SortKey = "name" | "city" | "type" | "priceLabsAvgNightly" | "monthlyDiscount" | "calculatedMonthly" | "hasPriceLabsData";

export default function PricingDashboardPage() {
  const [listings, setListings] = useState<ListingData[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortAsc, setSortAsc] = useState(true);
  const [filterCity, setFilterCity] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterPL, setFilterPL] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/admin/pricing-dashboard");
        if (res.ok) {
          const data = await res.json();
          setListings(data.listings);
          setSummary(data.summary);
        } else {
          setError("Failed to load pricing data");
        }
      } catch {
        setError("Failed to load pricing data");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  }

  const cities = [...new Set(listings.map((l) => l.city).filter(Boolean))].sort();
  const types = [...new Set(listings.map((l) => l.type))].sort();

  const filtered = listings.filter((l) => {
    if (filterCity && l.city !== filterCity) return false;
    if (filterType && l.type !== filterType) return false;
    if (filterPL === "yes" && !l.hasPriceLabsData) return false;
    if (filterPL === "no" && l.hasPriceLabsData) return false;
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    let cmp = 0;
    switch (sortKey) {
      case "name":
        cmp = a.name.localeCompare(b.name);
        break;
      case "city":
        cmp = (a.city || "").localeCompare(b.city || "");
        break;
      case "type":
        cmp = a.type.localeCompare(b.type);
        break;
      case "priceLabsAvgNightly":
        cmp = a.priceLabsAvgNightly - b.priceLabsAvgNightly;
        break;
      case "monthlyDiscount":
        cmp = a.monthlyDiscount - b.monthlyDiscount;
        break;
      case "calculatedMonthly":
        cmp = a.calculatedMonthly - b.calculatedMonthly;
        break;
      case "hasPriceLabsData":
        cmp = (a.hasPriceLabsData ? 1 : 0) - (b.hasPriceLabsData ? 1 : 0);
        break;
    }
    return sortAsc ? cmp : -cmp;
  });

  function monthlyColor(price: number): string {
    if (price === 0) return "text-red-600";
    if (price < 3000 || price > 30000) return "text-amber-600";
    return "text-gray-900";
  }

  function sortIcon(key: SortKey) {
    if (sortKey !== key) return "";
    return sortAsc ? " ↑" : " ↓";
  }

  if (loading) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-gray-900">Pricing Dashboard</h1>
        <div className="mt-8 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 animate-pulse rounded bg-gray-100" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-gray-900">Pricing Dashboard</h1>
        <p className="mt-4 text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900">Pricing Dashboard</h1>
      <p className="mt-1 text-sm text-gray-500">
        PriceLabs rates and discount data for all listings
      </p>

      {/* Summary stats */}
      {summary && (
        <div className="mt-6 grid gap-4 sm:grid-cols-4">
          <div className="rounded-xl border border-gray-100 bg-white p-4">
            <p className="text-xs font-medium uppercase text-gray-500">Total Listings</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">{summary.totalListings}</p>
          </div>
          <div className="rounded-xl border border-gray-100 bg-white p-4">
            <p className="text-xs font-medium uppercase text-gray-500">With PriceLabs</p>
            <p className="mt-1 text-2xl font-bold text-[#4C6C4E]">{summary.withPriceLabs}</p>
          </div>
          <div className="rounded-xl border border-gray-100 bg-white p-4">
            <p className="text-xs font-medium uppercase text-gray-500">Without PriceLabs</p>
            <p className="mt-1 text-2xl font-bold text-red-600">{summary.withoutPriceLabs}</p>
          </div>
          <div className="rounded-xl border border-gray-100 bg-white p-4">
            <p className="text-xs font-medium uppercase text-gray-500">Avg Monthly</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">
              ${summary.avgMonthlyPrice.toLocaleString()}
            </p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <select
          value={filterCity}
          onChange={(e) => setFilterCity(e.target.value)}
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
        >
          <option value="">All Cities</option>
          {cities.map((c) => (
            <option key={c} value={c!}>{c}</option>
          ))}
        </select>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
        >
          <option value="">All Types</option>
          {types.map((t) => (
            <option key={t} value={t}>{t.toUpperCase()}</option>
          ))}
        </select>
        <select
          value={filterPL}
          onChange={(e) => setFilterPL(e.target.value)}
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
        >
          <option value="">PriceLabs: All</option>
          <option value="yes">Has PriceLabs</option>
          <option value="no">Missing PriceLabs</option>
        </select>
        <span className="text-sm text-gray-500">
          {sorted.length} of {listings.length} listings
        </span>
      </div>

      {/* Table */}
      <div className="mt-4 overflow-x-auto rounded-xl border border-gray-100">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-100 bg-gray-50">
            <tr>
              <th
                className="cursor-pointer px-4 py-3 font-medium text-gray-700 hover:text-gray-900"
                onClick={() => handleSort("name")}
              >
                Name{sortIcon("name")}
              </th>
              <th
                className="cursor-pointer px-4 py-3 font-medium text-gray-700 hover:text-gray-900"
                onClick={() => handleSort("city")}
              >
                City{sortIcon("city")}
              </th>
              <th
                className="cursor-pointer px-4 py-3 font-medium text-gray-700 hover:text-gray-900"
                onClick={() => handleSort("type")}
              >
                Type{sortIcon("type")}
              </th>
              <th
                className="cursor-pointer px-4 py-3 text-right font-medium text-gray-700 hover:text-gray-900"
                onClick={() => handleSort("priceLabsAvgNightly")}
              >
                PL Nightly{sortIcon("priceLabsAvgNightly")}
              </th>
              <th
                className="cursor-pointer px-4 py-3 text-right font-medium text-gray-700 hover:text-gray-900"
                onClick={() => handleSort("monthlyDiscount")}
              >
                Monthly Disc.{sortIcon("monthlyDiscount")}
              </th>
              <th
                className="cursor-pointer px-4 py-3 text-right font-medium text-gray-700 hover:text-gray-900"
                onClick={() => handleSort("calculatedMonthly")}
              >
                Calc Monthly{sortIcon("calculatedMonthly")}
              </th>
              <th
                className="cursor-pointer px-4 py-3 text-center font-medium text-gray-700 hover:text-gray-900"
                onClick={() => handleSort("hasPriceLabsData")}
              >
                PriceLabs{sortIcon("hasPriceLabsData")}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {sorted.map((l) => (
              <tr
                key={l.hostawayId}
                className={l.hasPriceLabsData ? "bg-white" : "bg-amber-50"}
              >
                <td className="max-w-[240px] truncate px-4 py-3 font-medium text-gray-900">
                  {l.name}
                </td>
                <td className="px-4 py-3 text-gray-600">{l.city || "—"}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                      l.type === "monthly"
                        ? "bg-blue-100 text-blue-700"
                        : l.type === "str"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {l.type.toUpperCase()}
                  </span>
                </td>
                <td className="px-4 py-3 text-right text-gray-900">
                  {l.priceLabsAvgNightly > 0 ? `$${l.priceLabsAvgNightly}` : "—"}
                </td>
                <td className="px-4 py-3 text-right text-gray-600">
                  {l.monthlyDiscount > 0 && l.monthlyDiscount < 1
                    ? `${Math.round((1 - l.monthlyDiscount) * 100)}%`
                    : "—"}
                </td>
                <td className={`px-4 py-3 text-right font-medium ${monthlyColor(l.calculatedMonthly)}`}>
                  {l.calculatedMonthly > 0 ? `$${l.calculatedMonthly.toLocaleString()}` : "—"}
                </td>
                <td className="px-4 py-3 text-center">
                  {l.hasPriceLabsData ? (
                    <span className="text-[#4C6C4E]">&#10003;</span>
                  ) : (
                    <span className="text-red-500">&#10007;</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
