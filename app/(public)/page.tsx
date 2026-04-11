import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSearch from "@/components/HeroSearch";
import PropertyCard from "@/components/PropertyCard";
import { getFeaturedProperties } from "@/lib/property-adapter";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const properties = await getFeaturedProperties(6);

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-[#1B2A4A] px-4 py-20 md:py-28">
          <div className="absolute inset-0 bg-gradient-to-br from-[#1B2A4A] via-[#2a3d5c] to-[#1B2A4A]" />
          <div className="relative z-10 mx-auto max-w-4xl text-center">
            <h1 className="font-[Georgia,serif] text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
              Stay longer, live like a local.
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-300">
              Furnished homes for short stays and monthly rentals across Southern
              California. Lower prices than Airbnb &amp; VRBO. Book direct.
            </p>

            <div className="mt-10">
              <HeroSearch />
            </div>

            {/* Trust badges */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-300 md:gap-10">
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5 text-[#C5A55A]">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
                <span>Save 10-15% vs Airbnb &amp; VRBO</span>
              </div>
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5 text-[#C5A55A]">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                </svg>
                <span>Professionally managed</span>
              </div>
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5 text-[#C5A55A]">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                </svg>
                <span>Flexible stays: 1 week to 3 months</span>
              </div>
            </div>
          </div>
        </section>

        {/* Featured properties */}
        <section className="mx-auto max-w-7xl px-4 py-12">
          <h2 className="font-[Georgia,serif] text-2xl font-bold text-[#1B2A4A]">
            Featured Homes
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Hand-picked properties across Southern California
          </p>

          {properties.length > 0 ? (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
                className="inline-block rounded-lg border border-[#4C6C4E] px-6 py-2.5 text-sm font-semibold text-[#4C6C4E] transition hover:bg-[#4C6C4E] hover:text-white"
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
