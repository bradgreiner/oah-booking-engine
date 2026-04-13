import { NextRequest, NextResponse } from "next/server";
import { approveBooking } from "@/lib/booking";

export const dynamic = "force-dynamic";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const booking = await approveBooking(params.id);
    return NextResponse.json(booking);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to approve booking";
    console.error("Error approving booking:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
