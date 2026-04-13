import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json({ error: "Email required" }, { status: 400 });
  }

  // Verify the requesting user matches the email
  const session = await getServerSession(authOptions);
  if (!session?.user?.email || session.user.email !== email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const guest = await prisma.guest.findUnique({
      where: { email },
    });

    if (!guest) {
      return NextResponse.json([]);
    }

    const bookings = await prisma.bookingRequest.findMany({
      where: { guestId: guest.id },
      include: { property: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
    });

    const result = bookings.map((b) => ({
      id: b.id,
      propertyName: b.property.name,
      checkIn: b.checkIn.toISOString(),
      checkOut: b.checkOut.toISOString(),
      status: b.status,
      grandTotal: b.grandTotal,
      createdAt: b.createdAt.toISOString(),
    }));

    return NextResponse.json(result);
  } catch (err) {
    console.error("Failed to fetch guest bookings:", err);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}
