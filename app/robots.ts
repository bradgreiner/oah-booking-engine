import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api", "/olympics"],
    },
    sitemap: "https://oah-booking-engine.vercel.app/sitemap.xml",
  };
}
