import Link from "next/link";
import Image from "next/image";

const NEIGHBORHOODS = [
  { name: "Venice Beach", city: "Venice", image: "https://images.unsplash.com/photo-1534190760961-74e8c1c5c3da?w=800" },
  { name: "West Hollywood", city: "West Hollywood", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800" },
  { name: "Santa Monica", city: "Santa Monica", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800" },
  { name: "Palm Springs", city: "Palm Springs", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800" },
  { name: "La Quinta", city: "La Quinta", image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800" },
  { name: "Palm Desert", city: "Palm Desert", image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800" },
  { name: "Manhattan Beach", city: "Manhattan Beach", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800" },
  { name: "Malibu", city: "Malibu", image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800" },
  { name: "Topanga", city: "Topanga", image: "https://images.unsplash.com/photo-1511884642898-4c92249e20b6?w=800" },
];

interface NeighborhoodGridProps {
  cityCounts: Record<string, number>;
}

export default function NeighborhoodGrid({ cityCounts }: NeighborhoodGridProps) {
  return (
    <section className="bg-[#FAF7F2] py-16">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="font-serif text-2xl font-bold text-[#1a1a1a] md:text-3xl">
          Explore by neighborhood
        </h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {NEIGHBORHOODS.map((n) => {
            const count = cityCounts[n.city.toLowerCase()] ?? 0;
            return (
              <Link
                key={n.name}
                href={`/search?city=${encodeURIComponent(n.city)}`}
                className="group relative flex h-40 items-end overflow-hidden rounded-xl p-5"
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
                  <h3 className="text-lg font-semibold text-white transition group-hover:text-[#C5A55A]">
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
