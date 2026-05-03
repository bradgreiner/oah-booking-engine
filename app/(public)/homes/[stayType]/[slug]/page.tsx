import { notFound, permanentRedirect } from "next/navigation";
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
import { FAQ_CONTENT } from "@/lib/listing-content";
import { slugify } from "@/lib/slug";

export const dynamic = "force-dynamic";

const VALID_STAY_TYPES = ["monthly-rental", "short-term-rental"] as const;
const BASE = "https://oah-booking-engine.vercel.app";

const LA_NEIGHBORHOODS = [
  "Manhattan Beach", "Santa Monica", "Venice", "Topanga", "Malibu",
  "West Hollywood", "Marina del Rey", "Mar Vista", "Studio City",
  "Hermosa Beach", "Redondo Beach", "Beverly Hills", "Culver City",
  "Pacific Palisades", "Brentwood", "Sherman Oaks", "Hollywood Hills",
  "Hollywood", "Silver Lake", "Echo Park",
];

interface Props {
  params: { stayType: string; slug: string };
  searchParams: { checkIn?: string; checkOut?: string };
}

function resolveMarket(city: string | null): string | null {
  if (!city) return null;
  if (LA_NEIGHBORHOODS.some((n) => n.toLowerCase() === city.toLowerCase())) return "Los Angeles";
  return null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  if (!VALID_STAY_TYPES.includes(params.stayType as typeof VALID_STAY_TYPES[number])) {
    return { title: "Not found" };
  }

  const property = await getPropertyBySlug(params.slug);
  if (!property) return { title: "Home not found" };

  const city = property.city || "Southern California";
  const bedroomLabel = property.bedrooms === 1 ? "1 bedroom" : `${property.bedrooms} bedroom`;
  const isMonthly = property.stayType === "monthly";

  const title = isMonthly
    ? `${property.name} | ${city} Monthly Furnished Rental | Open Air Homes`
    : `${property.name} | ${city} Vacation Rental | Open Air Homes`;

  const cleanDesc = (property.description || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const description = cleanDesc && cleanDesc.length > 40
    ? cleanDesc.slice(0, 155) + (cleanDesc.length > 155 ? "..." : "")
    : isMonthly
      ? `Book ${property.name} direct, a ${bedroomLabel} furnished monthly rental in ${city}. 30+ night stays, no STR permit required, CAR-compliant lease. Managed by Open Air Homes.`
      : `Book ${property.name} direct, a ${bedroomLabel} vacation rental in ${city}. Permitted, professionally managed, Superhost on Airbnb for 14+ years. Open Air Homes.`;

  const market = resolveMarket(city);
  const keywords = isMonthly
    ? [`${city} monthly rental`, `${city} furnished rental`, `${city} 30 day rental`, `${city} extended stay`, ...(market ? [`monthly rental ${market}`] : []), property.name]
    : [`${city} vacation rental`, `${city} short term rental`, `${city} Airbnb alternative`, ...(market ? [`vacation rental ${market}`] : []), property.name];

  const image = property.images[0]?.url;
  const url = `${BASE}/homes/${params.stayType}/${params.slug}`;

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
  if (!VALID_STAY_TYPES.includes(params.stayType as typeof VALID_STAY_TYPES[number])) {
    notFound();
  }

  const property = await getPropertyBySlug(params.slug);
  if (!property || property.status === "removed") notFound();

  if (property.stayTypePath !== params.stayType) {
    permanentRedirect(`/homes/${property.stayTypePath}/${property.slug}`);
  }

  const stayType = property.stayType;

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

  const city = property.city || "Southern California";
  const citySlug = slugify(city);
  const pageUrl = `${BASE}/homes/${params.stayType}/${params.slug}`;

  const avgRating = reviewSummary && reviewSummary.totalReviews > 0
    ? reviewSummary.averageRating
    : null;

  const lodgingJsonLd = {
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
    url: pageUrl,
    ...(avgRating ? {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: avgRating.toFixed(2),
        reviewCount: reviewSummary!.totalReviews,
        bestRating: 5,
        worstRating: 1,
      },
    } : {}),
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_CONTENT[stayType].map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: {
        "@type": "Answer",
        text: a,
      },
    })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Homes",
        item: `${BASE}/search`,
      },
      ...(property.city ? [{
        "@type": "ListItem",
        position: 2,
        name: city,
        item: `${BASE}/cities/${citySlug}`,
      }] : []),
      {
        "@type": "ListItem",
        position: property.city ? 3 : 2,
        name: property.name,
      },
    ],
  };

  return (
    <>
      <Navbar />
      <main id="main-content" className="min-h-screen bg-white pb-20 lg:pb-0">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(lodgingJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />
        <PropertyDetailContent
          property={property}
          initialCheckIn={searchParams.checkIn}
          initialCheckOut={searchParams.checkOut}
          nearbyPlaces={nearbyPlaces}
          reviewSummary={reviewSummary}
          reviews={reviews}
          fromNightlyRate={fromNightlyRate}
          stayType={stayType}
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
