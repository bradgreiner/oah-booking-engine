import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookingWidget from "@/components/BookingWidget";
import MobileBookingBar from "@/components/MobileBookingBar";
import PropertyDetailContent from "@/components/PropertyDetailContent";
import { getPropertyBySlug } from "@/lib/property-adapter";
import { prisma } from "@/lib/prisma";
import { getListingReviews, getListingReviewSummary } from "@/lib/hostaway-reviews";
import { getMinimumNightlyRate } from "@/lib/hostaway-calendar";

export const dynamic = "force-dynamic";

interface Props {
  params: { slug: string };
  searchParams: { checkIn?: string; checkOut?: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const property = await getPropertyBySlug(params.slug);
  if (!property) return { title: "Home not found" };

  const city = property.city || "Southern California";
  const bedroomLabel = property.bedrooms === 1 ? "1 bedroom" : `${property.bedrooms} bedroom`;

  const title = `${property.name} | ${city} Furnished Rental | Open Air Homes`;

  const cleanDesc = (property.description || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const description = cleanDesc
    ? cleanDesc.slice(0, 155) + (cleanDesc.length > 155 ? "..." : "")
    : `Book ${property.name} in ${city}. ${bedroomLabel}, ${property.bathrooms} bath furnished rental for monthly and short-term stays. Professionally managed by Open Air Homes.`;

  const keywords = [
    `${city} monthly rental`,
    `${city} furnished rental`,
    `${city} vacation rental`,
    `${bedroomLabel} ${city}`,
    `${city} short term rental`,
    property.name,
  ];

  const image = property.images[0]?.url;
  const url = `https://oah-booking-engine.vercel.app/homes/${params.slug}`;

  return {
    title,
    description,
    keywords,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      siteName: "Open Air Homes",
      images: image ? [{ url: image, width: 1200, height: 630, alt: property.name }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : [],
    },
  };
}

export default async function PropertyPage({ params, searchParams }: Props) {
  const property = await getPropertyBySlug(params.slug);

  if (!property || property.status === "removed") {
    notFound();
  }

  let nearbyPlaces: { emoji: string; name: string; category: string; distance: string | null; note: string | null }[] = [];
  let reviewSummary: Awaited<ReturnType<typeof getListingReviewSummary>> | undefined;
  let reviews: Awaited<ReturnType<typeof getListingReviews>> = [];
  let fromNightlyRate: number | null = null;

  if (property.hostawayListingId) {
    const listingId = property.hostawayListingId;
    const results = await Promise.allSettled([
      prisma.nearbyPlace.findMany({ where: { listingId } }),
      getListingReviewSummary(listingId),
      getListingReviews(listingId),
      getMinimumNightlyRate(listingId),
    ]);
    if (results[0].status === "fulfilled") nearbyPlaces = results[0].value;
    if (results[1].status === "fulfilled") reviewSummary = results[1].value;
    if (results[2].status === "fulfilled") reviews = results[2].value;
    if (results[3].status === "fulfilled") fromNightlyRate = results[3].value;
  }

  const amenityList: string[] = property.amenities
    ? JSON.parse(property.amenities).slice(0, 10)
    : [];

  const cleanDesc = (property.description || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 200);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    name: property.name,
    description: cleanDesc,
    image: property.images.map((i) => i.url).slice(0, 5),
    address: {
      "@type": "PostalAddress",
      addressLocality: property.city,
      addressRegion: property.state || "CA",
      addressCountry: "US",
    },
    numberOfRooms: property.bedrooms,
    amenityFeature: amenityList.map((a) => ({
      "@type": "LocationFeatureSpecification",
      name: a,
    })),
    url: `https://oah-booking-engine.vercel.app/homes/${params.slug}`,
  };

  return (
    <>
      <Navbar />
      <main id="main-content" className="min-h-screen bg-white pb-20 lg:pb-0">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <PropertyDetailContent
          property={property}
          initialCheckIn={searchParams.checkIn}
          initialCheckOut={searchParams.checkOut}
          nearbyPlaces={nearbyPlaces}
          reviewSummary={reviewSummary}
          reviews={reviews}
          fromNightlyRate={fromNightlyRate}
        />

        <div className="mx-auto max-w-7xl px-4 pb-8 lg:hidden">
          <BookingWidget
            propertyId={property.id}
            baseRate={property.baseRate}
            cleaningFee={property.cleaningFee}
            petFee={property.petFee}
            totRate={property.totRate}
            maxGuests={property.maxGuests}
            minNights={property.minNights}
            maxNights={property.maxNights}
            weeklyDiscount={property.weeklyDiscount}
            monthlyDiscount={property.monthlyDiscount}
            initialCheckIn={searchParams.checkIn}
            initialCheckOut={searchParams.checkOut}
            fromNightlyRate={fromNightlyRate}
          />
        </div>

        <MobileBookingBar
          propertyId={property.id}
          propertyName={property.name}
          baseRate={fromNightlyRate ?? property.baseRate}
          minNights={property.minNights}
        />
      </main>
      <Footer />
    </>
  );
}
