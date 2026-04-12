"use client";

import { useEffect, useRef, useCallback, useState } from "react";

interface MapProperty {
  id: string;
  latitude: number | null;
  longitude: number | null;
  baseRate: number;
  propertyType: string;
  minNights: number;
  monthlyDiscount: number;
}

interface SearchMapProps {
  properties: MapProperty[];
  onMarkerClick: (id: string) => void;
}

export default function SearchMap({ properties, onMarkerClick }: SearchMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const mapboxRef = useRef<any>(null);
  const [ready, setReady] = useState(false);

  const clearMarkers = useCallback(() => {
    for (const m of markersRef.current) m.remove();
    markersRef.current = [];
  }, []);

  // Initialize map once
  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token || !containerRef.current || mapRef.current) return;

    let cancelled = false;

    async function init() {
      const mapboxgl = (await import("mapbox-gl")).default;
      await import("mapbox-gl/dist/mapbox-gl.css");

      if (cancelled || !containerRef.current) return;

      mapboxRef.current = mapboxgl;
      mapboxgl.accessToken = token!;

      const map = new mapboxgl.Map({
        container: containerRef.current,
        style: "mapbox://styles/mapbox/light-v11",
        center: [-118.35, 34.05],
        zoom: 9,
        attributionControl: false,
      });

      map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "top-right");

      map.on("load", () => {
        mapRef.current = map;
        setReady(true);
      });
    }

    init();

    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update markers when properties change or map is ready
  useEffect(() => {
    if (!ready || !mapRef.current || !mapboxRef.current) return;

    clearMarkers();

    const map = mapRef.current;
    const mapboxgl = mapboxRef.current;
    const bounds = new mapboxgl.LngLatBounds();
    let hasCoords = false;

    for (const p of properties) {
      if (p.latitude == null || p.longitude == null) continue;

      hasCoords = true;
      bounds.extend([p.longitude, p.latitude]);

      const isMonthly = p.propertyType === "monthly" || p.minNights >= 30;
      const hasMonthlyDiscount = p.monthlyDiscount > 0 && p.monthlyDiscount < 1;
      const displayPrice = isMonthly
        ? `$${Math.round(p.baseRate * 30 * (hasMonthlyDiscount ? p.monthlyDiscount : 1)).toLocaleString()}/mo`
        : `$${p.baseRate.toLocaleString()}`;

      const el = document.createElement("div");
      el.className = "search-map-marker";
      el.textContent = displayPrice;
      el.addEventListener("click", () => onMarkerClick(p.id));

      const marker = new mapboxgl.Marker({ element: el, anchor: "center" })
        .setLngLat([p.longitude, p.latitude])
        .addTo(map);

      markersRef.current.push(marker);
    }

    if (hasCoords && properties.length > 0) {
      map.fitBounds(bounds, { padding: 60, maxZoom: 13, duration: 500 });
    }
  }, [properties, ready, onMarkerClick, clearMarkers]);

  if (!process.env.NEXT_PUBLIC_MAPBOX_TOKEN) return null;

  return (
    <>
      <style>{`
        .search-map-marker {
          background: white;
          color: #1a1a1a;
          font-size: 12px;
          font-weight: 600;
          padding: 4px 8px;
          border-radius: 9999px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.15);
          cursor: pointer;
          white-space: nowrap;
          transition: transform 0.15s, box-shadow 0.15s;
        }
        .search-map-marker:hover {
          transform: scale(1.1);
          box-shadow: 0 2px 8px rgba(0,0,0,0.25);
        }
        .search-map-marker.active {
          background: #4C6C4E;
          color: white;
        }
      `}</style>
      <div ref={containerRef} className="h-full w-full" />
    </>
  );
}
