"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  latitude: number | null;
  longitude: number | null;
  city: string | null;
}

export default function PropertyMap({ latitude, longitude, city }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<unknown>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token || !containerRef.current || latitude == null || longitude == null) return;

    let cancelled = false;

    async function init() {
      const mapboxgl = (await import("mapbox-gl")).default;
      await import("mapbox-gl/dist/mapbox-gl.css");

      if (cancelled || !containerRef.current) return;

      mapboxgl.accessToken = token!;

      const map = new mapboxgl.Map({
        container: containerRef.current,
        style: "mapbox://styles/mapbox/light-v11",
        center: [longitude!, latitude!],
        zoom: 13,
        scrollZoom: false,
        attributionControl: false,
      });

      map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "top-right");

      // Pulsing circle marker
      const el = document.createElement("div");
      el.style.width = "80px";
      el.style.height = "80px";
      el.style.borderRadius = "50%";
      el.style.background = "rgba(76, 108, 78, 0.2)";
      el.style.border = "2px solid #4C6C4E";
      el.style.animation = "property-pulse 2s ease-out infinite";

      new mapboxgl.Marker({ element: el, anchor: "center" })
        .setLngLat([longitude!, latitude!])
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
  }, [latitude, longitude]);

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
