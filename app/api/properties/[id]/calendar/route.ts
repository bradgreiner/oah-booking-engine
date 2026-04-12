import { NextRequest, NextResponse } from "next/server";
import { fetchCalendar } from "@/lib/hostaway";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { searchParams } = new URL(request.url);
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  if (!startDate || !endDate) {
    return NextResponse.json(
      { error: "startDate and endDate are required" },
      { status: 400 }
    );
  }

  const propertyId = params.id;

  // Only Hostaway properties (hw_ prefix) have calendar data
  if (!propertyId.startsWith("hw_")) {
    return NextResponse.json([]);
  }

  const hostawayId = parseInt(propertyId.slice(3), 10);
  if (isNaN(hostawayId)) {
    return NextResponse.json({ error: "Invalid property ID" }, { status: 400 });
  }

  try {
    const calendar = await fetchCalendar(hostawayId, startDate, endDate);
    return NextResponse.json(calendar);
  } catch (error) {
    console.error("Calendar fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch calendar" },
      { status: 500 }
    );
  }
}
