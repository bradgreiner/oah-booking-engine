import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const where: Record<string, unknown> = {};
    if (status === "abandoned") {
      where.stepReached = { not: "completed" };
    } else if (status === "completed") {
      where.stepReached = "completed";
    } else if (status === "not_emailed") {
      where.stepReached = { not: "completed" };
      where.emailSent = false;
    }

    const sessions = await prisma.bookingSession.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 200,
    });

    return NextResponse.json(sessions);
  } catch (err) {
    console.error("Failed to fetch sessions:", err);
    return NextResponse.json({ error: "Failed to fetch sessions" }, { status: 500 });
  }
}
