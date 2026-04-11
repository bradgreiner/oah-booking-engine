// Geo distance and venue cluster logic for Olympics section

export interface Venue {
  id: string;
  name: string;
  sport: string;
  lat: number;
  lng: number;
  description: string | null;
}

export interface VenueCluster {
  key: string;
  label: string;
  lat: number;
  lng: number;
  radiusMiles: number;
}

export const VENUE_CLUSTERS: VenueCluster[] = [
  { key: "coliseum", label: "Near Coliseum", lat: 34.0141, lng: -118.288, radiusMiles: 10 },
  { key: "sofi", label: "Near SoFi", lat: 33.9535, lng: -118.3392, radiusMiles: 10 },
  { key: "beach", label: "Near Beach Venues", lat: 34.0094, lng: -118.497, radiusMiles: 10 },
  { key: "downtown", label: "Near Downtown", lat: 34.043, lng: -118.2673, radiusMiles: 10 },
];

// Haversine distance in miles
export function distanceMiles(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 3958.8; // Earth radius in miles
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

export function nearbyVenues(
  lat: number,
  lng: number,
  venues: Venue[],
  maxMiles: number = 15
): Array<Venue & { distance: number }> {
  return venues
    .map((v) => ({ ...v, distance: distanceMiles(lat, lng, v.lat, v.lng) }))
    .filter((v) => v.distance <= maxMiles)
    .sort((a, b) => a.distance - b.distance);
}
