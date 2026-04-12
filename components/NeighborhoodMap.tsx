"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

interface Props {
  latitude: number;
  longitude: number;
  city?: string | null;
}

export default function NeighborhoodMap({ latitude, longitude, city }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token || !containerRef.current) return;

    mapboxgl.accessToken = token;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [longitude, latitude],
      zoom: 13,
      interactive: true,
      attributionControl: false,
    });

    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "top-right");

    map.on("load", () => {
      // Add a blurred circle to show approximate neighborhood, not exact pin
      map.addSource("neighborhood", {
        type: "geojson",
        data: {
          type: "Feature",
          geometry: { type: "Point", coordinates: [longitude, latitude] },
          properties: {},
        },
      });

      map.addLayer({
        id: "neighborhood-blur",
        type: "circle",
        source: "neighborhood",
        paint: {
          "circle-radius": 80,
          "circle-color": "#4C6C4E",
          "circle-opacity": 0.15,
          "circle-blur": 1,
        },
      });

      map.addLayer({
        id: "neighborhood-core",
        type: "circle",
        source: "neighborhood",
        paint: {
          "circle-radius": 40,
          "circle-color": "#4C6C4E",
          "circle-opacity": 0.25,
          "circle-blur": 0.5,
        },
      });
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [latitude, longitude]);

  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  if (!token) {
    return (
      <div className="mt-4 flex h-48 items-center justify-center rounded-xl border border-gray-200 bg-gray-100 text-sm text-gray-400">
        Map unavailable
      </div>
    );
  }

  return (
    <div className="mt-4 overflow-hidden rounded-xl border border-gray-200">
      <div ref={containerRef} className="h-48 w-full sm:h-64" />
      {city && (
        <div className="border-t border-gray-100 bg-gray-50 px-4 py-2 text-xs text-gray-500">
          Approximate location in {city}. Exact address provided after booking.
        </div>
      )}
    </div>
  );
}
