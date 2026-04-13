import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PropertyCard from "@/components/PropertyCard";
import FaqAccordion from "@/components/FaqAccordion";
import { getProperties } from "@/lib/property-adapter";

export const dynamic = "force-dynamic";

interface CityInfo {
  name: string;
  market: string;
  filterCity?: string;
  filterByName?: string;
  description: string;
  heroImage: string;
  faqs: { question: string; answer: string }[];
}

const CITY_DATA: Record<string, CityInfo> = {
  "venice-beach": {
    name: "Venice Beach",
    market: "Los Angeles",
    filterCity: "Los Angeles",
    filterByName: "venice",
    description:
      "Live like a local in Venice Beach with walkable canals, Abbot Kinney boutiques, and golden sunsets. Our furnished homes put you steps from the boardwalk.",
    heroImage: "/images/homes/Washington_36.jpg",
    faqs: [
      { question: "What\u2019s included in an Open Air Homes furnished rental?", answer: "Every OAH home comes fully furnished with high-speed Wi-Fi, linens, kitchen essentials, and a dedicated support team. Utilities are included in your monthly rate." },
      { question: "How does monthly pricing work in Venice Beach?", answer: "Monthly rentals in Venice Beach are priced at a flat rate per month, which is significantly less than nightly rates. Stays of 30+ days are exempt from LA\u2019s transient occupancy tax, saving you an additional 12%." },
      { question: "Do I need a lease for stays over 30 days?", answer: "Yes, stays over 30 days include a simple month-to-month rental agreement. This protects both you and the property owner while keeping things flexible." },
      { question: "What\u2019s the cancellation policy?", answer: "We offer a 50% refund up to 1 week before check-in. No refund within 7 days of check-in. We recommend booking with flexibility in mind." },
      { question: "How is this different from Airbnb?", answer: "Open Air Homes is a direct booking platform, so you save 10-15% compared to Airbnb by avoiding their service fees. You also get direct communication with our management team and a more personalized experience." },
    ],
  },
  "palm-springs": {
    name: "Palm Springs",
    market: "Palm Springs",
    filterCity: "Palm Springs",
    description:
      "Escape to the desert in a mid-century modern retreat. Palm Springs offers stunning mountain views, world-class golf, and year-round sunshine.",
    heroImage: "https://images.unsplash.com/photo-1565768633709-76dbbab1c03d?w=1200&q=80",
    faqs: [
      { question: "What\u2019s included in an Open Air Homes furnished rental?", answer: "Every OAH home comes fully furnished with high-speed Wi-Fi, linens, kitchen essentials, a private pool (most homes), and a dedicated support team." },
      { question: "How does monthly pricing work in Palm Springs?", answer: "Monthly stays are priced at a discounted flat rate. Desert season (Oct\u2013Apr) rates are higher due to demand, while summer rates offer significant savings." },
      { question: "Do I need a lease for stays over 30 days?", answer: "Yes, stays over 30 days include a simple month-to-month rental agreement for your protection and flexibility." },
      { question: "What\u2019s the cancellation policy?", answer: "We offer a 50% refund up to 1 week before check-in. No refund within 7 days of check-in." },
      { question: "Are pools heated in winter?", answer: "Most of our Palm Springs homes have heated pools and spas available year-round. Check individual listings for details." },
    ],
  },
  "santa-monica": {
    name: "Santa Monica",
    market: "Los Angeles",
    filterCity: "Santa Monica",
    description:
      "Beachfront living meets urban convenience in Santa Monica. Walk to the pier, Third Street Promenade, and some of LA\u2019s best dining.",
    heroImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80",
    faqs: [
      { question: "What\u2019s included in an Open Air Homes furnished rental?", answer: "Every OAH home comes fully furnished with high-speed Wi-Fi, linens, kitchen essentials, and a dedicated support team. Utilities are included." },
      { question: "How does monthly pricing work in Santa Monica?", answer: "Monthly rentals are priced per month with stays of 30+ days exempt from transient occupancy tax, saving you 14% in Santa Monica." },
      { question: "Do I need a lease for stays over 30 days?", answer: "Yes, a simple month-to-month rental agreement is included for stays over 30 days." },
      { question: "What\u2019s the cancellation policy?", answer: "50% refund up to 1 week before check-in. No refund within 7 days." },
      { question: "How is this different from Airbnb?", answer: "Book direct and save 10-15% on service fees. Plus, you get direct access to our local management team." },
    ],
  },
  "manhattan-beach": {
    name: "Manhattan Beach",
    market: "Los Angeles",
    filterCity: "Manhattan Beach",
    description:
      "Upscale beach living in Manhattan Beach. Enjoy the Strand, world-class surf, and a vibrant downtown scene just steps from your door.",
    heroImage: "https://images.unsplash.com/photo-1473116763249-2faaef81ccda?w=1200&q=80",
    faqs: [
      { question: "What\u2019s included in an Open Air Homes furnished rental?", answer: "Fully furnished homes with Wi-Fi, linens, kitchen essentials, and dedicated support. Most Manhattan Beach homes include beach gear." },
      { question: "How does monthly pricing work in Manhattan Beach?", answer: "Monthly stays offer a flat rate significantly below nightly pricing. Stays of 30+ days are exempt from LA County\u2019s transient occupancy tax." },
      { question: "Do I need a lease for stays over 30 days?", answer: "Yes, a simple month-to-month agreement is included for extended stays." },
      { question: "What\u2019s the cancellation policy?", answer: "50% refund up to 1 week before check-in. No refund within 7 days." },
      { question: "How is this different from Airbnb?", answer: "Save 10-15% by booking direct. No middleman fees and direct communication with our team." },
    ],
  },
  "west-hollywood": {
    name: "West Hollywood",
    market: "Los Angeles",
    filterCity: "West Hollywood",
    description:
      "The heart of LA\u2019s entertainment scene. West Hollywood offers vibrant nightlife, iconic restaurants, and easy access to the best of the city.",
    heroImage: "https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=1200&q=80",
    faqs: [
      { question: "What\u2019s included in an Open Air Homes furnished rental?", answer: "Fully furnished homes with Wi-Fi, linens, kitchen essentials, and a dedicated local support team." },
      { question: "How does monthly pricing work in West Hollywood?", answer: "Monthly stays are offered at a flat rate with 30+ day stays exempt from transient occupancy tax." },
      { question: "Do I need a lease for stays over 30 days?", answer: "Yes, a simple month-to-month agreement is provided for extended stays." },
      { question: "What\u2019s the cancellation policy?", answer: "50% refund up to 1 week before check-in. No refund within 7 days." },
      { question: "How is this different from Airbnb?", answer: "Direct booking saves you 10-15%. No service fees and a personalized experience with our local team." },
    ],
  },
  "malibu": {
    name: "Malibu",
    market: "Los Angeles",
    filterCity: "Malibu",
    description:
      "Coastal luxury in Malibu. Wake up to ocean views, world-famous surf breaks, and the tranquility of the Pacific Coast Highway.",
    heroImage: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&q=80",
    faqs: [
      { question: "What\u2019s included in an Open Air Homes furnished rental?", answer: "Fully furnished homes with Wi-Fi, linens, kitchen essentials, and dedicated support. Many Malibu homes include ocean views and private beach access." },
      { question: "How does monthly pricing work in Malibu?", answer: "Monthly stays offer significant savings over nightly rates. Stays of 30+ days are exempt from transient occupancy tax." },
      { question: "Do I need a lease for stays over 30 days?", answer: "Yes, a simple month-to-month agreement is included." },
      { question: "What\u2019s the cancellation policy?", answer: "50% refund up to 1 week before check-in. No refund within 7 days." },
      { question: "How is this different from Airbnb?", answer: "Book direct and save 10-15% on fees with personalized local management." },
    ],
  },
  "la-quinta": {
    name: "La Quinta",
    market: "Palm Springs",
    filterCity: "La Quinta",
    description:
      "A desert gem nestled against the Santa Rosa Mountains. La Quinta offers championship golf, stunning sunsets, and a relaxed resort lifestyle.",
    heroImage: "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1200&q=80",
    faqs: [
      { question: "What\u2019s included in an Open Air Homes furnished rental?", answer: "Fully furnished homes with Wi-Fi, linens, kitchen essentials, private pool access, and dedicated support." },
      { question: "How does monthly pricing work in La Quinta?", answer: "Monthly stays are offered at reduced rates with seasonal pricing adjustments. High season runs October through April." },
      { question: "Do I need a lease for stays over 30 days?", answer: "Yes, a simple month-to-month rental agreement is included." },
      { question: "What\u2019s the cancellation policy?", answer: "50% refund up to 1 week before check-in. No refund within 7 days." },
      { question: "Are pools heated?", answer: "Most of our La Quinta homes have heated pools and spas available year-round." },
    ],
  },
  "topanga": {
    name: "Topanga",
    market: "Los Angeles",
    filterCity: "Topanga",
    description:
      "Escape to Topanga Canyon for a nature retreat minutes from the city. Surrounded by hiking trails, creek-side paths, and a bohemian village vibe.",
    heroImage: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&q=80",
    faqs: [
      { question: "What\u2019s included in an Open Air Homes furnished rental?", answer: "Fully furnished homes with Wi-Fi, linens, kitchen essentials, and dedicated support in a serene canyon setting." },
      { question: "How does monthly pricing work in Topanga?", answer: "Monthly stays are priced at a flat rate. Stays of 30+ days are exempt from transient occupancy tax." },
      { question: "Do I need a lease for stays over 30 days?", answer: "Yes, a simple month-to-month agreement is included." },
      { question: "What\u2019s the cancellation policy?", answer: "50% refund up to 1 week before check-in. No refund within 7 days." },
      { question: "How is this different from Airbnb?", answer: "Book direct and save 10-15% with local management support." },
    ],
  },
  "rancho-mirage": {
    name: "Rancho Mirage",
    market: "Palm Springs",
    filterCity: "Rancho Mirage",
    description:
      "Upscale desert living in Rancho Mirage. Known for luxury resorts, championship golf courses, and stunning mountain panoramas.",
    heroImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80",
    faqs: [
      { question: "What\u2019s included in an Open Air Homes furnished rental?", answer: "Fully furnished homes with Wi-Fi, linens, kitchen essentials, pool access, and dedicated support." },
      { question: "How does monthly pricing work in Rancho Mirage?", answer: "Monthly rates vary by season. High season (Oct\u2013Apr) commands premium rates, while summer offers great value." },
      { question: "Do I need a lease for stays over 30 days?", answer: "Yes, a simple month-to-month rental agreement is included." },
      { question: "What\u2019s the cancellation policy?", answer: "50% refund up to 1 week before check-in. No refund within 7 days." },
      { question: "Are pools heated?", answer: "Most homes include heated pools and spas available year-round." },
    ],
  },
  "mar-vista": {
    name: "Mar Vista",
    market: "Los Angeles",
    filterCity: "Los Angeles",
    filterByName: "mar vista",
    description:
      "A laid-back neighborhood between Venice and Culver City. Mar Vista offers great restaurants, farmers markets, and easy access to the Westside.",
    heroImage: "https://images.unsplash.com/photo-1580655653885-65763b2597d0?w=1200&q=80",
    faqs: [
      { question: "What\u2019s included in an Open Air Homes furnished rental?", answer: "Fully furnished homes with Wi-Fi, linens, kitchen essentials, and dedicated support." },
      { question: "How does monthly pricing work in Mar Vista?", answer: "Monthly stays are priced at a flat rate with 30+ day stays exempt from LA\u2019s transient occupancy tax." },
      { question: "Do I need a lease for stays over 30 days?", answer: "Yes, a simple month-to-month agreement is provided." },
      { question: "What\u2019s the cancellation policy?", answer: "50% refund up to 1 week before check-in. No refund within 7 days." },
      { question: "How is this different from Airbnb?", answer: "Save 10-15% by booking direct with our local team." },
    ],
  },
  "studio-city": {
    name: "Studio City",
    market: "Los Angeles",
    filterCity: "Los Angeles",
    filterByName: "studio city",
    description:
      "In the heart of the San Fernando Valley, Studio City offers a walkable village, iconic restaurants, and easy access to entertainment industry hubs.",
    heroImage: "https://images.unsplash.com/photo-1580655653885-65763b2597d0?w=1200&q=80",
    faqs: [
      { question: "What\u2019s included in an Open Air Homes furnished rental?", answer: "Fully furnished homes with Wi-Fi, linens, kitchen essentials, and dedicated support." },
      { question: "How does monthly pricing work in Studio City?", answer: "Monthly stays offer a flat rate well below nightly pricing. Stays of 30+ days are exempt from transient occupancy tax." },
      { question: "Do I need a lease for stays over 30 days?", answer: "Yes, a simple month-to-month rental agreement is included." },
      { question: "What\u2019s the cancellation policy?", answer: "50% refund up to 1 week before check-in. No refund within 7 days." },
      { question: "How is this different from Airbnb?", answer: "Book direct and save 10-15% on service fees with personalized local support." },
    ],
  },
};

export async function generateMetadata({ params }: { params: { city: string } }): Promise<Metadata> {
  const cityData = CITY_DATA[params.city];
  if (!cityData) return { title: "City Not Found" };

  const title = `Furnished Rentals in ${cityData.name}`;
  const description = cityData.description;

  return {
    title,
    description,
    openGraph: {
      title: `${title} | Open Air Homes`,
      description,
      type: "website",
      images: cityData.heroImage.startsWith("/")
        ? [{ url: cityData.heroImage }]
        : [{ url: cityData.heroImage }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: `https://oah-booking-engine.vercel.app/cities/${params.city}`,
    },
  };
}

export default async function CityPage({ params }: { params: { city: string } }) {
  const cityData = CITY_DATA[params.city];
  if (!cityData) notFound();

  const allProperties = await getProperties({ city: cityData.market });

  let properties = allProperties;
  if (cityData.filterByName) {
    properties = allProperties.filter(
      (p) =>
        p.name.toLowerCase().includes(cityData.filterByName!) ||
        (p.city || "").toLowerCase() === (cityData.filterCity || "").toLowerCase()
    );
  } else if (cityData.filterCity) {
    properties = allProperties.filter(
      (p) => (p.city || "").toLowerCase() === cityData.filterCity!.toLowerCase()
    );
  }

  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="relative h-[300px] md:h-[400px]">
        <Image
          src={cityData.heroImage}
          alt={cityData.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
          <h1 className="font-serif text-3xl text-white md:text-5xl">{cityData.name}</h1>
          <p className="mt-3 max-w-xl text-center text-white/80">{cityData.description}</p>
        </div>
      </section>

      {/* Properties */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <h2 className="font-serif text-2xl text-gray-900">
          {properties.length} {properties.length === 1 ? "home" : "homes"} in {cityData.name}
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((p) => (
            <PropertyCard
              key={p.id}
              id={p.id}
              slug={p.slug}
              name={p.name}
              headline={p.headline}
              neighborhood={p.neighborhood}
              city={p.city}
              bedrooms={p.bedrooms}
              bathrooms={p.bathrooms}
              maxGuests={p.maxGuests}
              baseRate={p.baseRate}
              weeklyDiscount={p.weeklyDiscount}
              monthlyDiscount={p.monthlyDiscount}
              minNights={p.minNights}
              propertyType={p.propertyType}
              isOlympic={p.isOlympic}
              imageUrl={p.images[0]?.url}
              createdAt={p.createdAt}
            />
          ))}
        </div>
        {properties.length === 0 && (
          <p className="mt-8 text-center text-gray-500">
            No homes currently listed in {cityData.name}. Check back soon.
          </p>
        )}
      </section>

      {/* FAQ */}
      <section className="bg-gray-50 py-12">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="font-serif text-2xl text-gray-900">
            Common questions about renting in {cityData.name}
          </h2>
          <div className="mt-8">
            <FaqAccordion items={cityData.faqs} />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 text-center">
        <h2 className="font-serif text-2xl text-gray-900">
          Ready to find your {cityData.name} home?
        </h2>
        <Link
          href={`/search?city=${encodeURIComponent(cityData.market)}`}
          className="mt-4 inline-block rounded-full bg-[#4C6C4E] px-8 py-3 text-sm font-semibold text-white hover:bg-[#3d5a40]"
        >
          Browse all homes
        </Link>
      </section>

      <Footer />
    </>
  );
}
