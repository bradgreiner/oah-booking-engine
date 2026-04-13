import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { fetchListings } from "@/lib/hostaway";
import { fetchPriceLabsBatch } from "@/lib/pricelabs";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const listings = await fetchListings();

    const hostawayIds = listings.map((l) => l.id);
    const today = new Date();
    const startDate = today.toISOString().split("T")[0];
    const endDate = new Date(today.getTime() + 30 * 86400000)
      .toISOString()
      .split("T")[0];

    const plRates = await fetchPriceLabsBatch(hostawayIds, startDate, endDate);

    const auditListings = listings
      .map((l) => {
        const plRate = plRates.get(l.id) || 0;
        const hasPriceLabsData = plRate > 0;
        const md = l.monthlyDiscount ?? 0;
        const wd = l.weeklyDiscount ?? 0;
        const minNights = l.minNights ?? 1;
        const isMonthly = minNights >= 28;

        return {
          hostawayId: l.id,
          name: l.name,
          city: l.city || null,
          minNights,
          type: isMonthly ? "monthly" : minNights < 7 ? "str" : "weekly",
          priceLabsAvgNightly: plRate,
          monthlyDiscount: md,
          weeklyDiscount: wd,
          calculatedMonthly:
            hasPriceLabsData && md > 0 && md < 1
              ? Math.round(plRate * md * 30)
              : hasPriceLabsData
                ? Math.round(plRate * 30)
                : 0,
          calculatedNightly: hasPriceLabsData ? Math.round(plRate) : 0,
          hasPriceLabsData,
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name));

    const withPL = auditListings.filter((l) => l.hasPriceLabsData);
    const monthlyPrices = withPL
      .filter((l) => l.calculatedMonthly > 0)
      .map((l) => l.calculatedMonthly);

    const summary = {
      totalListings: auditListings.length,
      withPriceLabs: withPL.length,
      withoutPriceLabs: auditListings.length - withPL.length,
      avgMonthlyPrice:
        monthlyPrices.length > 0
          ? Math.round(
              monthlyPrices.reduce((a, b) => a + b, 0) / monthlyPrices.length
            )
          : 0,
    };

    return NextResponse.json({ summary, listings: auditListings });
  } catch (err) {
    console.error("Pricing dashboard error:", err);
    return NextResponse.json(
      { error: "Failed to load pricing data" },
      { status: 500 }
    );
  }
}
