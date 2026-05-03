"use client";

import { useEffect, useRef, useCallback, useState } from "react";

function deterministicOffset(id: string, coord: number): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = ((hash << 5) - hash + id.charCodeAt(i)) | 0;
  }
  const normalized = (hash % 1000) / 1000;
  return coord + normalized * 0.003;
}

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
  activeListingId?: string | null;
  onMarkerHover?: (id: string | null) => void;
}

export default function SearchMap({ properties, activeListingId, onMarkerHover }: SearchMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const markerElsRef = useRef<Map<string, HTMLDivElement>>(new Map());
  const mapboxRef = useRef<any>(null);
  const [ready, setReady] = useState(false);

  const clearMarkers = useCallback(() => {
    for (const m of markersRef.current) m.remove();
    markersRef.current = [];
    markerElsRef.current.clear();
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

      const privLat = deterministicOffset(p.id, p.latitude);
      const privLng = deterministicOffset(p.id + "_lng", p.longitude);

      hasCoords = true;
      bounds.extend([privLng, privLat]);

      const isMonthly = p.minNights >= 30;
      const hasValidMonthlyDiscount = p.monthlyDiscount != null && p.monthlyDiscount > 0 && p.monthlyDiscount < 1;
      let displayPrice: string;
      if (isMonthly) {
        if (hasValidMonthlyDiscount) {
          const mo = Math.round(p.baseRate * 30 * p.monthlyDiscount! / 1000);
          displayPrice = `$${mo}k/mo`;
        } else {
          displayPrice = "Contact";
        }
      } else {
        displayPrice = `$${p.baseRate}`;
      }

      const el = document.createElement("div");
      el.textContent = displayPrice;
      el.dataset.listingId = p.id;
      el.style.background = "white";
      el.style.border = "1.5px solid #e5e7eb";
      el.style.borderRadius = "20px";
      el.style.padding = "4px 10px";
      el.style.fontSize = "12px";
      el.style.fontWeight = "600";
      el.style.cursor = "pointer";
      el.style.boxShadow = "0 1px 4px rgba(0,0,0,0.15)";
      el.style.whiteSpace = "nowrap";
      el.style.transition = "all 150ms ease";

      el.addEventListener("click", () => {
        window.dispatchEvent(
          new CustomEvent("propertyHighlight", { detail: { id: p.id } })
        );
      });

      el.addEventListener("mouseenter", () => {
        onMarkerHover?.(p.id);
      });
      el.addEventListener("mouseleave", () => {
        onMarkerHover?.(null);
      });

      markerElsRef.current.set(p.id, el);

      const marker = new mapboxgl.Marker({ element: el, anchor: "center" })
        .setLngLat([privLng, privLat])
        .addTo(map);

      markersRef.current.push(marker);
    }

    if (hasCoords && properties.length > 0) {
      map.fitBounds(bounds, { padding: 60, maxZoom: 13, duration: 500 });
    }
  }, [properties, ready, clearMarkers, onMarkerHover]);

  // Toggle active class on marker when hoveredId changes (no marker recreation)
  useEffect(() => {
    for (const [id, el] of markerElsRef.current) {
      if (id === activeListingId) {
        el.style.background = "#4C6C4E";
        el.style.color = "white";
        el.style.borderColor = "white";
        el.style.transform = "scale(1.1)";
        el.style.zIndex = "10";
      } else {
        el.style.background = "white";
        el.style.color = "";
        el.style.borderColor = "#e5e7eb";
        el.style.transform = "scale(1)";
        el.style.zIndex = "";
      }
    }
  }, [activeListingId]);

  if (!process.env.NEXT_PUBLIC_MAPBOX_TOKEN) return null;

  return <div ref={containerRef} className="h-full w-full" />;
}
