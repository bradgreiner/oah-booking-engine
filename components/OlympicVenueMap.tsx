"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

interface Venue {
  id: string;
  name: string;
  sport: string;
  lat: number;
  lng: number;
  description: string | null;
}

interface PropertyPin {
  id: string;
  name: string;
  lat: number;
  lng: number;
}

interface OlympicVenueMapProps {
  venues: Venue[];
  properties?: PropertyPin[];
  onVenueClick?: (venue: Venue) => void;
}

export default function OlympicVenueMap({
  venues,
  properties = [],
  onVenueClick,
}: OlympicVenueMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token || !mapContainer.current) return;

    mapboxgl.accessToken = token;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [-118.25, 34.05],
      zoom: 9.5,
    });

    map.addControl(new mapboxgl.NavigationControl(), "top-right");

    map.on("load", () => {
      // Venue pins (gold)
      for (const venue of venues) {
        const el = document.createElement("div");
        el.className = "olympic-venue-pin";
        el.style.cssText =
          "width:14px;height:14px;background:#C5A55A;border:2px solid #fff;border-radius:50%;cursor:pointer;box-shadow:0 1px 4px rgba(0,0,0,0.3);";

        const popup = new mapboxgl.Popup({ offset: 12, closeButton: false })
          .setHTML(
            `<div style="font-family:Georgia,serif;padding:4px 0;">
              <strong style="color:#1a1a1a;">${venue.name}</strong>
              <br/><span style="color:#666;font-size:12px;">${venue.sport}</span>
              ${onVenueClick ? `<br/><a href="#" class="venue-nearby-link" data-id="${venue.id}" style="color:#4C6C4E;font-size:12px;font-weight:600;">See nearby homes &rarr;</a>` : ""}
            </div>`
          );

        new mapboxgl.Marker({ element: el })
          .setLngLat([venue.lng, venue.lat])
          .setPopup(popup)
          .addTo(map);

        if (onVenueClick) {
          popup.on("open", () => {
            setTimeout(() => {
              const link = document.querySelector(`a[data-id="${venue.id}"]`);
              if (link) {
                link.addEventListener("click", (e) => {
                  e.preventDefault();
                  onVenueClick(venue);
                  popup.remove();
                });
              }
            }, 0);
          });
        }
      }

      // Property pins (green)
      for (const prop of properties) {
        const el = document.createElement("div");
        el.style.cssText =
          "width:10px;height:10px;background:#4C6C4E;border:2px solid #fff;border-radius:50%;box-shadow:0 1px 3px rgba(0,0,0,0.2);";

        new mapboxgl.Marker({ element: el })
          .setLngLat([prop.lng, prop.lat])
          .addTo(map);
      }
    });

    mapRef.current = map;
    return () => map.remove();
  }, [venues, properties, onVenueClick]);

  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  if (!token) {
    return (
      <div className="flex h-[400px] items-center justify-center rounded-xl border border-[#C5A55A]/20 bg-[#C5A55A]/5">
        <div className="text-center text-gray-400">
          <p className="text-sm">Map requires NEXT_PUBLIC_MAPBOX_TOKEN</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={mapContainer}
      className="h-[400px] w-full overflow-hidden rounded-xl border border-[#C5A55A]/20"
    />
  );
}
