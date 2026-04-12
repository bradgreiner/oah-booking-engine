"use client";

import { useEffect, useRef } from "react";

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

const SPORT_EMOJI: Record<string, string> = {
  swimming: "\u{1F3CA}",
  diving: "\u{1F3CA}",
  "water polo": "\u{1F3CA}",
  athletics: "\u{1F3C3}",
  "track and field": "\u{1F3C3}",
  gymnastics: "\u{1F938}",
  basketball: "\u{1F3C0}",
  volleyball: "\u{1F3D0}",
  "beach volleyball": "\u{1F3D0}",
  tennis: "\u{1F3BE}",
  soccer: "\u26BD",
  football: "\u{1F3C8}",
  cycling: "\u{1F6B4}",
  rowing: "\u{1F6A3}",
  surfing: "\u{1F3C4}",
  skateboarding: "\u{1F6F9}",
  fencing: "\u2694\uFE0F",
  boxing: "\u{1F94A}",
  judo: "\u{1F94B}",
  wrestling: "\u{1F93C}",
  weightlifting: "\u{1F3CB}",
  archery: "\u{1F3F9}",
  shooting: "\u{1F3AF}",
  equestrian: "\u{1F3C7}",
  sailing: "\u26F5",
  golf: "\u26F3",
};

function getSportEmoji(sport: string): string {
  const lower = sport.toLowerCase();
  for (const [key, emoji] of Object.entries(SPORT_EMOJI)) {
    if (lower.includes(key)) return emoji;
  }
  return "\u{1F3C5}"; // medal fallback
}

export default function OlympicVenueMap({
  venues,
  properties = [],
  onVenueClick,
}: OlympicVenueMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<unknown>(null);

  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token || !mapContainer.current) return;

    let cancelled = false;

    async function init() {
      const mapboxgl = (await import("mapbox-gl")).default;
      await import("mapbox-gl/dist/mapbox-gl.css");

      if (cancelled || !mapContainer.current) return;

      mapboxgl.accessToken = token!;

      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/light-v11",
        center: [-118.2437, 34.0522],
        zoom: 10,
        scrollZoom: false,
        attributionControl: false,
      });

      map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "top-right");

      map.on("load", () => {
        if (cancelled) return;

        // Venue markers (gold circles with sport emoji)
        for (const venue of venues) {
          const emoji = getSportEmoji(venue.sport);

          const el = document.createElement("div");
          el.style.width = "32px";
          el.style.height = "32px";
          el.style.borderRadius = "50%";
          el.style.background = "#C5A55A";
          el.style.border = "2px solid #fff";
          el.style.display = "flex";
          el.style.alignItems = "center";
          el.style.justifyContent = "center";
          el.style.fontSize = "14px";
          el.style.cursor = "pointer";
          el.style.boxShadow = "0 2px 6px rgba(0,0,0,0.3)";
          el.textContent = emoji;

          const popup = new mapboxgl.Popup({ offset: 18, closeButton: false, maxWidth: "240px" })
            .setHTML(
              `<div style="font-family:Georgia,serif;padding:4px 0;">
                <strong style="color:#1a1a1a;font-size:14px;">${venue.name}</strong>
                <br/><span style="color:#666;font-size:12px;">${venue.sport}</span>
                ${venue.description ? `<br/><span style="color:#999;font-size:11px;">${venue.description}</span>` : ""}
              </div>`
            );

          const marker = new mapboxgl.Marker({ element: el })
            .setLngLat([venue.lng, venue.lat])
            .setPopup(popup)
            .addTo(map);

          if (onVenueClick) {
            el.addEventListener("click", () => onVenueClick(venue));
          }
        }

        // Property pins (green, smaller)
        for (const prop of properties) {
          const el = document.createElement("div");
          el.style.width = "10px";
          el.style.height = "10px";
          el.style.background = "#4C6C4E";
          el.style.border = "2px solid #fff";
          el.style.borderRadius = "50%";
          el.style.boxShadow = "0 1px 3px rgba(0,0,0,0.2)";

          new mapboxgl.Marker({ element: el })
            .setLngLat([prop.lng, prop.lat])
            .addTo(map);
        }
      });

      mapRef.current = map;
    }

    init();

    return () => {
      cancelled = true;
      if (mapRef.current) {
        (mapRef.current as any).remove();
        mapRef.current = null;
      }
    };
  }, [venues, properties, onVenueClick]);

  if (!process.env.NEXT_PUBLIC_MAPBOX_TOKEN) {
    return (
      <div className="flex h-[300px] items-center justify-center rounded-xl border border-[#C5A55A]/20 bg-[#C5A55A]/5 md:h-[500px]">
        <p className="text-sm text-gray-400">Map requires NEXT_PUBLIC_MAPBOX_TOKEN</p>
      </div>
    );
  }

  return (
    <div
      ref={mapContainer}
      className="h-[300px] w-full overflow-hidden rounded-xl border border-[#C5A55A]/20 md:h-[500px]"
    />
  );
}
