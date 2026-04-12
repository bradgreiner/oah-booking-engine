"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

interface Props {
  latitude: number | null;
  longitude: number | null;
  city: string | null;
}

export default function PropertyMap({ latitude, longitude, city }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token || !containerRef.current || latitude == null || longitude == null) return;

    mapboxgl.accessToken = token;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [longitude, latitude],
      zoom: 13,
      scrollZoom: false,
      attributionControl: false,
    });

    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "top-right");

    // Pulsing circle marker via DOM element
    const el = document.createElement("div");
    el.className = "property-map-pulse";
    new mapboxgl.Marker({ element: el, anchor: "center" })
      .setLngLat([longitude, latitude])
      .addTo(map);

    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [latitude, longitude]);

  if (latitude == null || longitude == null) return null;

  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  if (!token) return null;

  return (
    <div className="mt-4">
      <style>{`
        .property-map-pulse {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: rgba(76, 108, 78, 0.2);
          border: 2px solid #4C6C4E;
          animation: pulse-ring 2s ease-out infinite;
        }
        @keyframes pulse-ring {
          0% { box-shadow: 0 0 0 0 rgba(76, 108, 78, 0.3); }
          70% { box-shadow: 0 0 0 20px rgba(76, 108, 78, 0); }
          100% { box-shadow: 0 0 0 0 rgba(76, 108, 78, 0); }
        }
      `}</style>
      <div className="overflow-hidden rounded-xl">
        <div ref={containerRef} className="h-[280px] w-full" />
      </div>
      <p className="mt-2 text-xs text-gray-400">
        Exact address provided after booking confirmation.
      </p>
    </div>
  );
}
