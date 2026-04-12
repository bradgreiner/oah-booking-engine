import { NextResponse } from "next/server";
import { fetchListings } from "@/lib/hostaway";
export const dynamic = "force-dynamic";

export async function GET() {
  const listings = await fetchListings();
  return NextResponse.json(
    listings.slice(0, 5).map((l: any) => ({
      id: l.id,
      name: l.name,
      city: l.city,
      baseRate: l.baseRate,
      bookingEngineMarkup: l.bookingEngineMarkup,
      weeklyDiscount: l.weeklyDiscount,
      monthlyDiscount: l.monthlyDiscount,
      cleaningFee: l.cleaningFee,
      minNights: l.minNights,
      priceFields: Object.keys(l).filter(k =>
        k.toLowerCase().includes('price') ||
        k.toLowerCase().includes('rate') ||
        k.toLowerCase().includes('discount') ||
        k.toLowerCase().includes('fee')
      ),
    }))
  );
}
