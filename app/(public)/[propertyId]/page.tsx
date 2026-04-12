import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookingWidget from "@/components/BookingWidget";
import PropertyDetailContent from "@/components/PropertyDetailContent";
import { getProperty } from "@/lib/property-adapter";

export const dynamic = "force-dynamic";

interface Props {
  params: { propertyId: string };
}

export default async function PropertyDetailPage({ params }: Props) {
  const property = await getProperty(params.propertyId);

  if (!property || property.status === "removed") {
    notFound();
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">
        <PropertyDetailContent property={property} />

        {/* Booking widget (mobile: after content) */}
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
      </main>
      <Footer />
    </>
  );
}
