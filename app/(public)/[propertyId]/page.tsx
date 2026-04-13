import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookingWidget from "@/components/BookingWidget";
import MobileBookingBar from "@/components/MobileBookingBar";
import PropertyDetailContent from "@/components/PropertyDetailContent";
import { getProperty } from "@/lib/property-adapter";

export const dynamic = "force-dynamic";

interface Props {
  params: { propertyId: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const property = await getProperty(params.propertyId);
  if (!property) return { title: "Property Not Found" };

  const title = property.headline || property.name;
  const description = property.description
    ? property.description.slice(0, 155) + "..."
    : `Book ${title} in ${property.city || "Southern California"}. ${property.bedrooms} bed, ${property.bathrooms} bath. Professionally managed by Open Air Homes.`;
  const image = property.images[0]?.url;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: image ? [{ url: image }] : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: `https://oah-booking-engine.vercel.app/${params.propertyId}`,
    },
  };
}

export default async function PropertyDetailPage({ params }: Props) {
  const property = await getProperty(params.propertyId);

  if (!property || property.status === "removed") {
    notFound();
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white pb-20 lg:pb-0">
        <PropertyDetailContent property={property} />

        {/* Full booking widget on mobile (hidden on desktop since it's in the sidebar) */}
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
          />
        </div>

        {/* Sticky mobile bottom bar */}
        <MobileBookingBar
          propertyId={property.id}
          propertyName={property.name}
          baseRate={property.baseRate}
          minNights={property.minNights}
        />
      </main>
      <Footer />
    </>
  );
}
