import { NextRequest, NextResponse } from "next/server";
import { declineBooking } from "@/lib/booking";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const booking = await declineBooking(params.id);
    return NextResponse.json(booking);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to decline booking";
    console.error("Error declining booking:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
