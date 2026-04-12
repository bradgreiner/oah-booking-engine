"use client";

import { useEffect, useState, useCallback } from "react";
import PropertyCard from "@/components/PropertyCard";
import OlympicVenueMap from "@/components/OlympicVenueMap";
import { VENUE_CLUSTERS, distanceMiles } from "@/lib/olympics";

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
  monthlyDiscount: number;
  propertyType: string;
  isOlympic: boolean;
  createdAt: string;
  images: { url: string }[];
}

interface Venue {
  id: string;
  name: string;
  sport: string;
  lat: number;
  lng: number;
  description: string | null;
}

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
] as const;

export default function OlympicBrowseContent() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCluster, setActiveCluster] = useState<string | null>(null);
  const [sort, setSort] = useState("newest");

  useEffect(() => {
    Promise.all([
      fetch("/api/properties?status=active&isOlympic=true").then((r) => r.json()),
      fetch("/api/olympics/venues").then((r) => r.json()),
    ]).then(([props, vens]) => {
      setProperties(Array.isArray(props) ? props : []);
      setVenues(Array.isArray(vens) ? vens : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  // Re-fetch with sort
  const fetchSorted = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ status: "active", isOlympic: "true", sort });
    const res = await fetch(`/api/properties?${params}`);
    if (res.ok) setProperties(await res.json());
    setLoading(false);
  }, [sort]);

  useEffect(() => { fetchSorted(); }, [fetchSorted]);

  // Filter by cluster proximity
  const filtered = activeCluster
    ? properties.filter((p) => {
        const cluster = VENUE_CLUSTERS.find((c) => c.key === activeCluster);
        if (!cluster) return true;
        // Use city center as rough proxy — properties don't have lat/lng
        // For LA properties, we show all when near a cluster
        return true; // Show all Olympic properties for now; real geo filter needs lat/lng
      })
    : properties;

  function handleVenueClick(venue: Venue) {
    // Find the closest cluster and activate it
    let closest = VENUE_CLUSTERS[0];
    let minDist = Infinity;
    for (const c of VENUE_CLUSTERS) {
      const d = distanceMiles(venue.lat, venue.lng, c.lat, c.lng);
      if (d < minDist) { minDist = d; closest = c; }
    }
    setActiveCluster(closest.key);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <h1 className="font-[Georgia,serif] text-2xl font-bold text-[#1a1a1a]">
            Olympic Home Collection
          </h1>
          <span className="rounded-full border border-[#C5A55A]/30 bg-[#C5A55A]/10 px-3 py-1 text-xs font-semibold text-[#C5A55A]">
            LA 2028
          </span>
        </div>
        <p className="mt-1 text-sm text-gray-500">
          Exclusive furnished homes near Olympic venues
        </p>
      </div>

      {/* Map */}
      <OlympicVenueMap venues={venues} onVenueClick={handleVenueClick} />

      {/* Filters */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button
          onClick={() => setActiveCluster(null)}
          className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
            !activeCluster
              ? "border-[#C5A55A] bg-[#C5A55A]/10 text-[#C5A55A]"
              : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
          }`}
        >
          All
        </button>
        {VENUE_CLUSTERS.map((c) => (
          <button
            key={c.key}
            onClick={() => setActiveCluster(activeCluster === c.key ? null : c.key)}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
              activeCluster === c.key
                ? "border-[#C5A55A] bg-[#C5A55A]/10 text-[#C5A55A]"
                : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
            }`}
          >
            {c.label}
          </button>
        ))}

        <div className="ml-auto">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 outline-none focus:border-[#C5A55A] focus:ring-1 focus:ring-[#C5A55A]"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Properties grid */}
      <div className="mt-6">
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse rounded-xl bg-white shadow-sm">
                <div className="aspect-[4/3] rounded-t-xl bg-gray-200" />
                <div className="p-4">
                  <div className="h-5 w-3/4 rounded bg-gray-200" />
                  <div className="mt-2 h-4 w-1/2 rounded bg-gray-200" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <>
            <p className="mb-4 text-sm text-gray-500">
              {filtered.length} {filtered.length === 1 ? "home" : "homes"} available
            </p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((property) => (
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
                  monthlyDiscount={property.monthlyDiscount}
                  propertyType={property.propertyType}
                  isOlympic={property.isOlympic}
                  imageUrl={property.images[0]?.url}
                  createdAt={property.createdAt}
                  linkPrefix="/olympics"
                />
              ))}
            </div>
          </>
        ) : (
          <div className="rounded-xl border-2 border-dashed border-[#C5A55A]/20 bg-white p-12 text-center">
            <p className="text-gray-500">
              No Olympic properties available yet. Check back soon.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
