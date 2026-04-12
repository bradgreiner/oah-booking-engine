"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import PropertyCard from "@/components/PropertyCard";
import SearchSkeleton from "@/components/SearchSkeleton";

interface Property {
  id: string;
  slug: string;
  name: string;
  headline: string | null;
  neighborhood: string | null;
  city: string | null;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  baseRate: number;
  weeklyDiscount: number;
  monthlyDiscount: number;
  minNights: number;
  propertyType: string;
  isOlympic: boolean;
  createdAt: string;
  images: { url: string }[];
}

const CITIES = [
  "Los Angeles",
  "West Hollywood",
  "Santa Monica",
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

const FILTERS = [
  { key: "monthly", label: "Monthly" },
  { key: "str", label: "Short-Term" },
  { key: "pool", label: "Pool" },
  { key: "pets", label: "Pets" },
  { key: "olympic", label: "Olympic" },
] as const;

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
] as const;

export default function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  const [city, setCity] = useState(searchParams.get("city") || "");
  const [sort, setSort] = useState(searchParams.get("sort") || "newest");
  const [activeFilters, setActiveFilters] = useState<Set<string>>(() => {
    const filters = new Set<string>();
    if (searchParams.get("type") === "monthly") filters.add("monthly");
    if (searchParams.get("type") === "str") filters.add("str");
    if (searchParams.get("olympic") === "true") filters.add("olympic");
    return filters;
  });

  const toggleFilter = (key: string) => {
    setActiveFilters((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    params.set("status", "active");
    if (city) params.set("city", city);
    if (sort) params.set("sort", sort);
    if (activeFilters.has("monthly") && !activeFilters.has("str")) {
      params.set("propertyType", "monthly");
    } else if (activeFilters.has("str") && !activeFilters.has("monthly")) {
      params.set("propertyType", "str");
    }
    if (activeFilters.has("olympic")) params.set("isOlympic", "true");
    if (activeFilters.has("pool")) params.set("amenity", "Pool");
    if (activeFilters.has("pets")) params.set("amenity", "Pet Friendly");

    try {
      const res = await fetch(`/api/properties?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setProperties(data);
      }
    } catch {
      // Silently handle fetch errors
    } finally {
      setLoading(false);
    }
  }, [city, sort, activeFilters]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (city) params.set("city", city);
    if (sort !== "newest") params.set("sort", sort);
    if (activeFilters.has("monthly")) params.set("type", "monthly");
    if (activeFilters.has("str")) params.set("type", "str");
    if (activeFilters.has("olympic")) params.set("olympic", "true");
    const qs = params.toString();
    router.replace(`/search${qs ? `?${qs}` : ""}`, { scroll: false });
  }, [city, sort, activeFilters, router]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      {/* Filters bar */}
      <div className="flex flex-wrap items-center gap-3">
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 outline-none focus:border-[#4C6C4E] focus:ring-1 focus:ring-[#4C6C4E]"
        >
          <option value="">All Cities</option>
          {CITIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => toggleFilter(f.key)}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
              activeFilters.has(f.key)
                ? f.key === "olympic"
                  ? "border-[#C5A55A] bg-[#C5A55A]/10 text-[#C5A55A]"
                  : "border-[#4C6C4E] bg-[#4C6C4E]/10 text-[#4C6C4E]"
                : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
            }`}
          >
            {f.label}
          </button>
        ))}

        <div className="ml-auto">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 outline-none focus:border-[#4C6C4E] focus:ring-1 focus:ring-[#4C6C4E]"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Content grid */}
      <div className="mt-6 flex gap-6">
        <div className="flex-1">
          {loading ? (
            <SearchSkeleton />
          ) : properties.length > 0 ? (
            <>
              <p className="mb-4 text-sm text-gray-500">
                {properties.length} {properties.length === 1 ? "home" : "homes"} available
              </p>
              <div className="grid gap-4 sm:grid-cols-2 md:gap-6">
                {properties.map((property) => (
                  <PropertyCard
                    key={property.id}
                    id={property.id}
                    slug={property.slug}
                    name={property.name}
                    headline={property.headline}
                    neighborhood={property.neighborhood}
                    city={property.city}
                    bedrooms={property.bedrooms}
                    bathrooms={property.bathrooms}
                    maxGuests={property.maxGuests}
                    baseRate={property.baseRate}
                    weeklyDiscount={property.weeklyDiscount}
                    monthlyDiscount={property.monthlyDiscount}
                    minNights={property.minNights}
                    propertyType={property.propertyType}
                    isOlympic={property.isOlympic}
                    imageUrl={property.images[0]?.url}
                    createdAt={property.createdAt}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="rounded-xl border-2 border-dashed border-gray-200 bg-white p-12 text-center">
              <p className="text-gray-500">
                No properties match your search. Try adjusting your filters.
              </p>
            </div>
          )}
        </div>

        {/* Map placeholder */}
        <div className="hidden w-[400px] shrink-0 lg:block">
          <div className="sticky top-6 flex h-[calc(100vh-200px)] items-center justify-center rounded-xl border border-gray-200 bg-gray-100">
            <div className="text-center text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="mx-auto h-12 w-12">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
              </svg>
              <p className="mt-2 text-sm">Map coming soon</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
