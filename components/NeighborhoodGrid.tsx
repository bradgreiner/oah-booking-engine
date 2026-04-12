import Link from "next/link";

const NEIGHBORHOODS = [
  { name: "Venice Beach", city: "Venice" },
  { name: "West Hollywood", city: "West Hollywood" },
  { name: "Santa Monica", city: "Santa Monica" },
  { name: "Palm Springs", city: "Palm Springs" },
  { name: "La Quinta", city: "La Quinta" },
  { name: "Palm Desert", city: "Palm Desert" },
  { name: "Manhattan Beach", city: "Manhattan Beach" },
  { name: "Malibu", city: "Malibu" },
  { name: "Topanga", city: "Topanga" },
];

interface NeighborhoodGridProps {
  cityCounts: Record<string, number>;
}

export default function NeighborhoodGrid({ cityCounts }: NeighborhoodGridProps) {
  return (
    <section className="bg-[#FAF7F2] py-16">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="font-[Georgia,serif] text-2xl font-bold text-[#1B2A4A] md:text-3xl">
          Explore by neighborhood
        </h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {NEIGHBORHOODS.map((n) => {
            const count = cityCounts[n.city.toLowerCase()] ?? 0;
            return (
              <Link
                key={n.name}
                href={`/search?city=${encodeURIComponent(n.city)}`}
                className="group relative flex h-40 items-end overflow-hidden rounded-xl bg-gradient-to-br from-[#1B2A4A] to-[#2a3d5c] p-5"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="relative z-10">
                  <h3 className="text-lg font-semibold text-white group-hover:text-[#C5A55A] transition">
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
