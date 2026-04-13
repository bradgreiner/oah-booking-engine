import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, listingId, listingName, checkIn, checkOut, guestEmail, stepReached, imageUrl } = body;

    if (sessionId) {
      // Update existing session
      const updated = await prisma.bookingSession.update({
        where: { id: sessionId },
        data: {
          ...(listingName && { listingName }),
          ...(checkIn && { checkIn }),
          ...(checkOut && { checkOut }),
          ...(guestEmail && { guestEmail }),
          ...(stepReached && { stepReached }),
          ...(imageUrl && { imageUrl }),
        },
      });
      return NextResponse.json({ sessionId: updated.id });
    }

    // Create new session
    const session = await prisma.bookingSession.create({
      data: {
        listingId: listingId || "unknown",
        listingName,
        checkIn,
        checkOut,
        guestEmail,
        stepReached: stepReached || "widget",
        imageUrl,
      },
    });
    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error("Error updating booking session:", error);
    return NextResponse.json({ error: "Failed to update session" }, { status: 500 });
  }
}
