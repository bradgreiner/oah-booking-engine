import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSearch from "@/components/HeroSearch";
import HowItWorks from "@/components/HowItWorks";
import NeighborhoodGrid from "@/components/NeighborhoodGrid";
import TrustBadge from "@/components/TrustBadge";
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
        <section className="relative overflow-hidden bg-[#4C6C4E] px-4 py-14 md:py-28">
          <div className="absolute inset-0 bg-gradient-to-br from-[#3d5a40] via-[#4C6C4E] to-[#3d5a40]" />
          <div className="absolute inset-0 bg-black/30" />
          <div className="relative z-10 mx-auto max-w-4xl text-center">
            <h1 className="font-[Georgia,serif] text-3xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
              Stay longer, live like a local.
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-base text-white/80 md:mt-4 md:text-lg">
              Furnished homes for short stays and monthly rentals across
              Southern California. Lower prices than Airbnb &amp; VRBO. Book
              direct.
            </p>

            <div className="mt-8 md:mt-10">
              <HeroSearch />
            </div>

            {/* Trust badges */}
            <div className="mt-8 flex flex-col items-center gap-3 text-xs text-white/80 md:mt-10 md:flex-row md:justify-center md:gap-10 md:text-sm">
              <TrustBadge
                icon="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                text="Save 10-15% vs Airbnb & VRBO"
              />
              <TrustBadge
                icon="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                text="Professionally managed"
              />
              <TrustBadge
                icon="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                text="Flexible stays: 1 week to 3 months"
              />
            </div>
          </div>
        </section>

        <HowItWorks />

        <NeighborhoodGrid cityCounts={cityCounts} />

        {/* Featured properties */}
        <section className="mx-auto max-w-7xl px-4 py-16">
          <h2 className="font-[Georgia,serif] text-2xl font-bold text-[#1a1a1a] md:text-3xl">
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
                  monthlyDiscount={property.monthlyDiscount}
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
