import { notFound } from "next/navigation";
import OlympicHeader from "@/components/OlympicHeader";
import OlympicFooter from "@/components/OlympicFooter";
import PropertyDetailContent from "@/components/PropertyDetailContent";
import BookingWidget from "@/components/BookingWidget";
import NearbyVenues from "@/components/NearbyVenues";
import { getProperty } from "@/lib/property-adapter";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

interface Props {
  params: { propertyId: string };
}

export default async function OlympicPropertyPage({ params }: Props) {
  const [property, venues] = await Promise.all([
    getProperty(params.propertyId),
    prisma.olympicVenue.findMany().catch(() => []),
  ]);

  if (!property || property.status === "removed") {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#F5F3EF]">
      <OlympicHeader />

      {/* Gold accent bar */}
      <div className="border-b border-[#4C6C4E]/20 bg-[#4C6C4E]/5 px-4 py-2 text-center text-xs font-medium text-[#4C6C4E]">
        LA 2028 Olympics Collection
      </div>

      <main className="flex-1 bg-white">
        <PropertyDetailContent property={property} />

        {/* Nearby venues */}
        <div className="mx-auto max-w-7xl px-4 pb-8">
          <NearbyVenues
            propertyCity={property.city}
            venues={venues.map((v) => ({
              id: v.id,
              name: v.name,
              sport: v.sport,
              lat: v.lat,
              lng: v.lng,
              description: v.description,
            }))}
          />
        </div>

        {/* Mobile booking widget */}
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
          />
        </div>
      </main>

      <OlympicFooter />
    </div>
  );
}
