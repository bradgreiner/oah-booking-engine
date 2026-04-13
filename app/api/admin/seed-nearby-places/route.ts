import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const secret = request.headers.get("x-admin-secret");
  if (!secret || secret !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { listingId, places } = body;

    if (!listingId || !Array.isArray(places)) {
      return NextResponse.json(
        { error: "listingId and places array are required" },
        { status: 400 }
      );
    }

    // Delete existing places for this listing
    await prisma.nearbyPlace.deleteMany({ where: { listingId } });

    // Create new places
    const created = await prisma.nearbyPlace.createMany({
      data: places.map((p: { emoji: string; name: string; category?: string; distance?: string; note?: string }) => ({
        listingId,
        emoji: p.emoji,
        name: p.name,
        category: p.category || "restaurant",
        distance: p.distance || null,
        note: p.note || null,
      })),
    });

    return NextResponse.json({ created: created.count });
  } catch (error) {
    console.error("Error seeding nearby places:", error);
    return NextResponse.json({ error: "Failed to seed nearby places" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const secret = request.headers.get("x-admin-secret");
  if (!secret || secret !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const listingId = searchParams.get("listingId");

  if (!listingId) {
    return NextResponse.json({ error: "listingId is required" }, { status: 400 });
  }

  const places = await prisma.nearbyPlace.findMany({
    where: { listingId: parseInt(listingId, 10) },
  });

  return NextResponse.json(places);
}
