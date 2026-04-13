import type { Venue } from "@/lib/olympics";

// Approximate city center coords for distance calculation
const CITY_CENTERS: Record<string, { lat: number; lng: number }> = {
  "los angeles": { lat: 34.0522, lng: -118.2437 },
  "santa monica": { lat: 34.0195, lng: -118.4912 },
  "west hollywood": { lat: 34.0900, lng: -118.3617 },
  "malibu": { lat: 34.0259, lng: -118.7798 },
  "manhattan beach": { lat: 33.8847, lng: -118.4109 },
  "venice": { lat: 33.9850, lng: -118.4695 },
  "marina del rey": { lat: 33.9802, lng: -118.4517 },
  "pasadena": { lat: 34.1478, lng: -118.1445 },
  "long beach": { lat: 33.7701, lng: -118.1937 },
};

interface NearbyVenuesProps {
  propertyCity: string | null;
  venues: Venue[];
}

function distanceMiles(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 3958.8;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function NearbyVenues({ propertyCity, venues }: NearbyVenuesProps) {
  const cityKey = (propertyCity || "los angeles").toLowerCase();
  const center = CITY_CENTERS[cityKey] || CITY_CENTERS["los angeles"];

  const nearby = venues
    .map((v) => ({
      ...v,
      distance: distanceMiles(center.lat, center.lng, v.lat, v.lng),
    }))
    .filter((v) => v.distance <= 15)
    .sort((a, b) => a.distance - b.distance);

  if (nearby.length === 0) return null;

  return (
    <div className="mt-8 rounded-xl border border-[#C5A55A]/20 bg-[#C5A55A]/5 p-6">
      <h3 className="font-serif text-lg font-semibold text-[#1a1a1a]">
        Nearby Olympic Venues
      </h3>
      <div className="mt-3 flex flex-wrap gap-2">
        {nearby.slice(0, 6).map((v) => (
          <span
            key={v.id}
            className="inline-flex items-center gap-1.5 rounded-full border border-[#C5A55A]/20 bg-white px-3 py-1.5 text-xs text-gray-600"
          >
            <span className="inline-block h-2 w-2 rounded-full bg-[#C5A55A]" />
            {v.name} ({v.distance.toFixed(1)} mi) &middot;{" "}
            <span className="text-gray-500">{v.sport}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
