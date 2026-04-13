import { NextRequest, NextResponse } from "next/server";
import { fetchListings } from "@/lib/hostaway";
import { fetchPriceLabsBatch } from "@/lib/pricelabs";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  // Protect with admin secret
  const secret = request.headers.get("x-admin-secret");
  if (!secret || secret !== process.env.ADMIN_PASSWORD) {
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
          hostawayDummyPrice: (l as Record<string, unknown>).price ?? 0,
          priceLabsAvgNightly: plRate,
          monthlyDiscount: md,
          weeklyDiscount: wd,
          calculatedMonthly:
            hasPriceLabsData && md > 0 && md < 1
              ? Math.round(plRate * md * 30)
              : hasPriceLabsData
                ? Math.round(plRate * 30)
                : 0,
          calculatedWeekly:
            hasPriceLabsData && wd > 0 && wd < 1
              ? Math.round(plRate * wd * 7)
              : hasPriceLabsData
                ? Math.round(plRate * 7)
                : 0,
          calculatedNightly: hasPriceLabsData ? Math.round(plRate) : 0,
          hasPriceLabsData,
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name));

    const withPL = auditListings.filter((l) => l.hasPriceLabsData);
    const nightlyRates = withPL
      .map((l) => l.priceLabsAvgNightly)
      .sort((a, b) => a - b);
    const monthlyPrices = withPL
      .filter((l) => l.calculatedMonthly > 0)
      .map((l) => l.calculatedMonthly);

    const summary = {
      totalListings: auditListings.length,
      withPriceLabs: withPL.length,
      withoutPriceLabs: auditListings.length - withPL.length,
      withMonthlyDiscount: auditListings.filter(
        (l) => l.monthlyDiscount > 0 && l.monthlyDiscount < 1
      ).length,
      withWeeklyDiscount: auditListings.filter(
        (l) => l.weeklyDiscount > 0 && l.weeklyDiscount < 1
      ).length,
      avgMonthlyPrice:
        monthlyPrices.length > 0
          ? Math.round(
              monthlyPrices.reduce((a, b) => a + b, 0) / monthlyPrices.length
            )
          : 0,
      medianNightlyRate:
        nightlyRates.length > 0
          ? nightlyRates[Math.floor(nightlyRates.length / 2)]
          : 0,
    };

    return NextResponse.json({ summary, listings: auditListings });
  } catch (err) {
    console.error("Price audit error:", err);
    return NextResponse.json(
      { error: "Price audit failed" },
      { status: 500 }
    );
  }
}
