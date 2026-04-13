import Link from "next/link";
import Image from "next/image";

// key = lowercase lookup in cityCounts, searchCity = value for the search URL
// slug = matches CITY_DATA keys in the city landing page — if set, links to /cities/[slug]
const NEIGHBORHOODS: { name: string; key: string; searchCity: string; image: string; slug?: string }[] = [
  { name: "Venice Beach", key: "venice beach", searchCity: "Los Angeles", image: "/images/homes/Washington_36.jpg", slug: "venice-beach" },
  { name: "West Hollywood", key: "west hollywood", searchCity: "West Hollywood", image: "https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=800&q=80", slug: "west-hollywood" },
  { name: "Santa Monica", key: "santa monica", searchCity: "Santa Monica", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80", slug: "santa-monica" },
  { name: "Palm Springs", key: "palm springs", searchCity: "Palm Springs", image: "https://images.unsplash.com/photo-1565768633709-76dbbab1c03d?w=800&q=80", slug: "palm-springs" },
  { name: "La Quinta", key: "la quinta", searchCity: "La Quinta", image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&q=80", slug: "la-quinta" },
  { name: "Palm Desert", key: "palm desert", searchCity: "Palm Desert", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80" },
  { name: "Manhattan Beach", key: "manhattan beach", searchCity: "Manhattan Beach", image: "https://images.unsplash.com/photo-1473116763249-2faaef81ccda?w=800&q=80", slug: "manhattan-beach" },
  { name: "Malibu", key: "malibu", searchCity: "Malibu", image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&q=80", slug: "malibu" },
  { name: "Topanga", key: "topanga", searchCity: "Topanga", image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80", slug: "topanga" },
  { name: "Los Angeles", key: "los angeles", searchCity: "Los Angeles", image: "https://images.unsplash.com/photo-1580655653885-65763b2597d0?w=800&q=80" },
];

interface NeighborhoodGridProps {
  cityCounts: Record<string, number>;
}

export default function NeighborhoodGrid({ cityCounts }: NeighborhoodGridProps) {
  const visible = NEIGHBORHOODS.filter((n) => (cityCounts[n.key] ?? 0) > 0);

  if (visible.length === 0) return null;

  return (
    <section className="bg-[#FAF7F2] py-16">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="font-serif text-2xl font-normal text-gray-900 md:text-3xl">
          Explore by neighborhood
        </h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((n) => {
            const count = cityCounts[n.key] ?? 0;
            return (
              <Link
                key={n.name}
                href={n.slug ? `/cities/${n.slug}` : `/search?city=${encodeURIComponent(n.searchCity)}`}
                className="group relative flex h-32 items-end overflow-hidden rounded-xl p-5 sm:h-40"
              >
                <Image
                  src={n.image}
                  alt={n.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40" />
                <div className="relative z-10">
                  <h3 className="text-lg font-semibold text-white transition group-hover:text-white/90">
                    {n.name}
                  </h3>
                  <p className="text-sm text-gray-300">
                    {count} {count === 1 ? "home" : "homes"} available
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
