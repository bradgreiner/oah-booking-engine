import { MetadataRoute } from "next";
import { getProperties } from "@/lib/property-adapter";

export const dynamic = "force-dynamic";

const BASE_URL = "https://oah-booking-engine.vercel.app";

const CITY_SLUGS = [
  "venice-beach",
  "palm-springs",
  "santa-monica",
  "manhattan-beach",
  "west-hollywood",
  "malibu",
  "la-quinta",
  "topanga",
  "rancho-mirage",
  "mar-vista",
  "studio-city",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const properties = await getProperties();

  const staticPages = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 1,
    },
    {
      url: `${BASE_URL}/search`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/list-your-home`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.3,
    },
  ];

  const cityPages = CITY_SLUGS.map((slug) => ({
    url: `${BASE_URL}/cities/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const propertyPages = properties
    .filter((p) => p.baseRate > 0)
    .map((p) => ({
      url: `${BASE_URL}/${p.id}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.8,
    }));

  return [...staticPages, ...cityPages, ...propertyPages];
}
