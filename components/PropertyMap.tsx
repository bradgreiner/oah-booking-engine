"use client";

import { useEffect, useRef, useState } from "react";

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

    // Deterministic offset based on listing ID for privacy
    const offset = (propertyId.charCodeAt(0) % 6) * 0.001 + 0.003;
    const offsetLat = latitude + offset;
    const offsetLng = longitude + offset;

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
        scrollZoom: false,
        attributionControl: false,
      });

      map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "top-right");

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
