"use client";

import { useEffect, useRef, useState } from "react";

// Deterministic privacy offset (~200-400m) based on property ID hash
function deterministicOffset(id: string, coord: number): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = ((hash << 5) - hash + id.charCodeAt(i)) | 0;
  }
  const normalized = (hash % 1000) / 1000; // roughly -1 to 1
  return coord + normalized * 0.003;
}

interface Props {
  latitude: number | null;
  longitude: number | null;
  city: string | null;
  propertyId: string;
}

export default function PropertyMap({ latitude, longitude, city, propertyId }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<unknown>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token || !containerRef.current || latitude == null || longitude == null) return;

    // Deterministic privacy offset so the marker doesn't jump on reload
    const offsetLat = deterministicOffset(propertyId, latitude);
    const offsetLng = deterministicOffset(propertyId + "_lng", longitude);

    let cancelled = false;

    async function init() {
      const mapboxgl = (await import("mapbox-gl")).default;
      await import("mapbox-gl/dist/mapbox-gl.css");

      if (cancelled || !containerRef.current) return;

      mapboxgl.accessToken = token!;

      const map = new mapboxgl.Map({
        container: containerRef.current,
        style: "mapbox://styles/mapbox/light-v11",
        center: [offsetLng, offsetLat],
        zoom: 13,
        interactive: false,
        attributionControl: false,
      });

      // No navigation controls — map is non-interactive to prevent address discovery

      // Privacy circle marker — placed on offset coordinates
      const el = document.createElement("div");
      el.style.width = "120px";
      el.style.height = "120px";
      el.style.borderRadius = "50%";
      el.style.background = "rgba(76, 108, 78, 0.15)";
      el.style.border = "2px solid rgba(76, 108, 78, 0.6)";
      el.style.animation = "property-pulse 2s ease-out infinite";

      new mapboxgl.Marker({ element: el, anchor: "center" })
        .setLngLat([offsetLng, offsetLat])
        .addTo(map);

      mapRef.current = map;
      setLoaded(true);
    }

    init();

    return () => {
      cancelled = true;
      if (mapRef.current) {
        (mapRef.current as any).remove();
        mapRef.current = null;
      }
    };
  }, [latitude, longitude, propertyId]);

  if (latitude == null || longitude == null) return null;
  if (!process.env.NEXT_PUBLIC_MAPBOX_TOKEN) return null;

  return (
    <div className="mt-4">
      <style>{`
        @keyframes property-pulse {
          0% { box-shadow: 0 0 0 0 rgba(76, 108, 78, 0.3); }
          70% { box-shadow: 0 0 0 20px rgba(76, 108, 78, 0); }
          100% { box-shadow: 0 0 0 0 rgba(76, 108, 78, 0); }
        }
      `}</style>
      <div className="overflow-hidden rounded-xl">
        <div ref={containerRef} className="h-[280px] w-full" />
      </div>
      <p className="mt-2 text-xs text-gray-400">
        Approximate location
        {city ? ` in ${city}` : ""}
        {" · "}Exact address provided after booking confirmation.
      </p>
    </div>
  );
}
