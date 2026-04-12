import { NextResponse } from "next/server";
import { fetchListings } from "@/lib/hostaway";
export const dynamic = "force-dynamic";

export async function GET() {
  const listings = await fetchListings();
  return NextResponse.json(
    listings.slice(0, 10).map((l: any) => ({
      id: l.id,
      name: l.name?.slice(0, 40),
      city: l.city,
      baseRate: l.baseRate,
      bookingEngineMarkup: l.bookingEngineMarkup,
      price: l.price,
      weeklyDiscount: l.weeklyDiscount,
      monthlyDiscount: l.monthlyDiscount,
      minNights: l.minNights,
      computedMonthly: l.bookingEngineMarkup && l.monthlyDiscount && l.monthlyDiscount < 1
        ? Math.round(l.bookingEngineMarkup * 30 * l.monthlyDiscount)
        : null,
    }))
  );
}
