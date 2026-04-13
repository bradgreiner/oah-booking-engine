import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    // Strip "hw_" prefix to get Hostaway listing ID
    const hostawayId = id.startsWith("hw_") ? parseInt(id.slice(3), 10) : NaN;

    if (isNaN(hostawayId)) {
      return NextResponse.json([]);
    }

    const places = await prisma.nearbyPlace.findMany({
      where: { listingId: hostawayId },
    });

    return NextResponse.json(places);
  } catch {
    return NextResponse.json([]);
  }
}
