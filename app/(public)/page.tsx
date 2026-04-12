import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSearch from "@/components/HeroSearch";
import HowItWorks from "@/components/HowItWorks";
import NeighborhoodGrid from "@/components/NeighborhoodGrid";
import PropertyCard from "@/components/PropertyCard";
import { getFeaturedProperties, getCityCounts } from "@/lib/property-adapter";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [properties, cityCounts] = await Promise.all([
    getFeaturedProperties(6),
    getCityCounts(),
  ]);

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative min-h-[500px] overflow-hidden md:min-h-[600px]">
          <Image
            src="https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?w=1600&q=80"
            alt="Beautiful furnished home in Southern California"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60" />
          <div className="relative z-10 flex min-h-[500px] flex-col items-center justify-center px-4 md:min-h-[600px]">
            <div className="mx-auto max-w-4xl text-center">
              <h1 className="font-serif text-5xl font-normal leading-tight text-white md:text-6xl">
                Stay longer, live like a local.
              </h1>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-white/80 md:text-xl">
                Furnished homes for short stays and monthly rentals across
                Southern California.
              </p>

              <div className="mt-8">
                <HeroSearch />
              </div>

              {/* Trust pills */}
              <div className="mt-8 flex flex-col items-center gap-3 md:flex-row md:justify-center md:gap-6">
                {[
                  "Save 10-15% vs Airbnb",
                  "Professionally managed",
                  "Flexible stays",
                ].map((text) => (
                  <div
                    key={text}
                    className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-sm"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="h-4 w-4 text-[#4C6C4E]"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.5 12.75l6 6 9-13.5"
                      />
                    </svg>
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <HowItWorks />

        <NeighborhoodGrid cityCounts={cityCounts} />

        {/* Featured properties */}
        <section className="mx-auto max-w-7xl px-4 py-16">
          <h2 className="font-serif text-2xl font-normal text-gray-900 md:text-3xl">
            Featured Homes
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Hand-picked properties across Southern California
          </p>

          {properties.length > 0 ? (
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-6">
              {properties.map((property) => (
                <PropertyCard
                  key={property.id}
                  id={property.id}
                  slug={property.slug}
                  name={property.name}
                  headline={property.headline}
                  neighborhood={property.neighborhood}
                  city={property.city}
                  bedrooms={property.bedrooms}
                  bathrooms={property.bathrooms}
                  maxGuests={property.maxGuests}
                  baseRate={property.baseRate}
                  weeklyDiscount={property.weeklyDiscount}
                  monthlyDiscount={property.monthlyDiscount}
                  minNights={property.minNights}
                  propertyType={property.propertyType}
                  isOlympic={property.isOlympic}
                  imageUrl={property.images[0]?.url}
                  createdAt={property.createdAt}
                />
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-xl border-2 border-dashed border-gray-200 p-12 text-center">
              <p className="text-gray-500">
                No properties listed yet. Add properties via the admin panel.
              </p>
            </div>
          )}

          {properties.length > 0 && (
            <div className="mt-8 text-center">
              <a
                href="/search"
                className="inline-block rounded-full border border-[#4C6C4E] px-8 py-3 text-sm font-medium text-[#4C6C4E] transition hover:bg-[#4C6C4E] hover:text-white"
              >
                View all homes
              </a>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
