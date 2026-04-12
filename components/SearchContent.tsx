"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import PropertyCard from "@/components/PropertyCard";
import SearchSkeleton from "@/components/SearchSkeleton";
import SearchMap from "@/components/SearchMap";

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
  latitude: number | null;
  longitude: number | null;
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

  // Listen for map marker clicks via CustomEvent
  useEffect(() => {
    function handleHighlight(e: Event) {
      const id = (e as CustomEvent).detail?.id;
      if (!id) return;
      const el = document.getElementById(`card-${id}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.classList.add("ring-2", "ring-[#4C6C4E]", "ring-offset-2");
        setTimeout(() => {
          el.classList.remove("ring-2", "ring-[#4C6C4E]", "ring-offset-2");
        }, 2000);
      }
    }
    window.addEventListener("propertyHighlight", handleHighlight);
    return () => window.removeEventListener("propertyHighlight", handleHighlight);
  }, []);

  const hasMapToken = !!process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      {/* Filters bar */}
      <div className="flex flex-wrap items-center gap-3">
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 outline-none focus:border-[#4C6C4E] focus:ring-1 focus:ring-[#4C6C4E]"
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
                ? "border-[#4C6C4E] bg-[#4C6C4E] text-white"
                : "border-gray-200 bg-white text-gray-700 hover:border-gray-400"
            }`}
          >
            {f.label}
          </button>
        ))}

        <div className="ml-auto">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 outline-none focus:border-[#4C6C4E] focus:ring-1 focus:ring-[#4C6C4E]"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Divider */}
      <hr className="mt-4 border-gray-200" />

      {/* Content: split layout with map */}
      <div className="mt-6">
        {loading ? (
          <SearchSkeleton />
        ) : properties.length > 0 ? (
          <div className="flex gap-0">
            {/* Left: property grid */}
            <div className={`min-w-0 flex-1 ${hasMapToken ? "pr-4" : ""}`}>
              <p className="mb-4 text-sm text-gray-500">
                {properties.length} {properties.length === 1 ? "home" : "homes"} available
              </p>
              <div className="grid gap-4 sm:grid-cols-2 md:gap-6">
                {properties.map((property) => (
                  <div
                    key={property.id}
                    id={`card-${property.id}`}
                    className="rounded-2xl transition-all duration-300"
                  >
                    <PropertyCard
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
                  </div>
                ))}
              </div>
            </div>

            {/* Right: sticky map (desktop only) */}
            {hasMapToken && (
              <div className="hidden w-[420px] shrink-0 lg:block">
                <div className="sticky top-[80px] h-[calc(100vh-80px)] overflow-hidden rounded-xl">
                  <SearchMap properties={properties} />
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-xl border-2 border-dashed border-gray-200 bg-white p-12 text-center">
            <p className="text-gray-500">
              No homes match your filters. Try adjusting your search.
            </p>
            <button
              onClick={() => {
                setCity("");
                setActiveFilters(new Set());
                setSort("newest");
              }}
              className="mt-4 rounded-full border border-[#4C6C4E] px-6 py-2 text-sm font-medium text-[#4C6C4E] transition hover:bg-[#4C6C4E] hover:text-white"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
