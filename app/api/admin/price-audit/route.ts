export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { fetchListings } from '@/lib/hostaway';

export async function GET(req: NextRequest) {
  const listings = await fetchListings();
  return NextResponse.json(
    listings.map((l: any) => ({
      id: l.id,
      name: l.name?.slice(0, 50),
      city: l.city,
      price: l.price,
      minNights: l.minNights,
      weeklyDiscount: l.weeklyDiscount,
      monthlyDiscount: l.monthlyDiscount,
      isMonthlyOnly: (l.minNights || 0) >= 30,
      cardDisplay: (l.minNights || 0) >= 30
        ? (l.monthlyDiscount && l.monthlyDiscount > 0 && l.monthlyDiscount < 1
          ? `$${Math.round(l.price * 30 * l.monthlyDiscount).toLocaleString()}/mo`
          : 'Contact for pricing')
        : `$${l.price}/night`,
      weeklyCalc: l.weeklyDiscount && l.weeklyDiscount < 1
        ? `$${Math.round(l.price * l.weeklyDiscount)}/night`
        : 'no weekly discount',
    }))
  );
}
