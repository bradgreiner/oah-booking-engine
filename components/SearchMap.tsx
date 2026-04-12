"use client";

import { useEffect, useRef, useCallback, useState } from "react";

interface MapProperty {
  id: string;
  name: string;
  latitude: number | null;
  longitude: number | null;
  baseRate: number;
  monthlyDiscount?: number | null;
  minNights: number;
}

interface SearchMapProps {
  properties: MapProperty[];
}

export default function SearchMap({ properties }: SearchMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const mapboxRef = useRef<any>(null);
  const [ready, setReady] = useState(false);

  const clearMarkers = useCallback(() => {
    for (const m of markersRef.current) m.remove();
    markersRef.current = [];
  }, []);

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
        center: [-118.2437, 34.0522],
        zoom: 9,
        scrollZoom: true,
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

      const isMonthly = p.minNights >= 30;
      let displayPrice: string;
      if (isMonthly) {
        const mo = Math.round(p.baseRate * 30 * (p.monthlyDiscount || 1) / 1000);
        displayPrice = `$${mo}k/mo`;
      } else {
        displayPrice = `$${p.baseRate}`;
      }

      const el = document.createElement("div");
      el.textContent = displayPrice;
      el.style.background = "white";
      el.style.border = "1.5px solid #e5e7eb";
      el.style.borderRadius = "20px";
      el.style.padding = "4px 10px";
      el.style.fontSize = "12px";
      el.style.fontWeight = "600";
      el.style.cursor = "pointer";
      el.style.boxShadow = "0 1px 4px rgba(0,0,0,0.15)";
      el.style.whiteSpace = "nowrap";
      el.addEventListener("click", () => {
        window.dispatchEvent(
          new CustomEvent("propertyHighlight", { detail: { id: p.id } })
        );
      });

      const marker = new mapboxgl.Marker({ element: el, anchor: "center" })
        .setLngLat([p.longitude, p.latitude])
        .addTo(map);

      markersRef.current.push(marker);
    }

    if (hasCoords && properties.length > 0) {
      map.fitBounds(bounds, { padding: 60, maxZoom: 13, duration: 500 });
    }
  }, [properties, ready, clearMarkers]);

  if (!process.env.NEXT_PUBLIC_MAPBOX_TOKEN) return null;

  return <div ref={containerRef} className="h-full w-full" />;
}
