import { NextRequest, NextResponse } from "next/server";
import { getPropertyPricing } from "@/lib/property-adapter";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const checkIn = searchParams.get("checkIn");
    const checkOut = searchParams.get("checkOut");

    if (!checkIn || !checkOut) {
      return NextResponse.json(
        { error: "checkIn and checkOut are required" },
        { status: 400 }
      );
    }

    const pricing = await getPropertyPricing(params.id, checkIn, checkOut);

    if (!pricing) {
      return NextResponse.json(
        { error: "Property not found or invalid dates" },
        { status: 404 }
      );
    }

    return NextResponse.json(pricing);
  } catch (error) {
    console.error("Error calculating pricing:", error);
    return NextResponse.json(
      { error: "Failed to calculate pricing" },
      { status: 500 }
    );
  }
}
