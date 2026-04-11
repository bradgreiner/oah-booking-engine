import { NextRequest, NextResponse } from "next/server";
import { createBookingPaymentIntent } from "@/lib/booking";

export async function POST(request: NextRequest) {
  try {
    const { propertyId, checkIn, checkOut, hasPets } = await request.json();

    if (!propertyId || !checkIn || !checkOut) {
      return NextResponse.json(
        { error: "propertyId, checkIn, and checkOut are required" },
        { status: 400 }
      );
    }

    const result = await createBookingPaymentIntent(
      propertyId,
      checkIn,
      checkOut,
      hasPets || false
    );

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create payment intent";
    console.error("Error creating payment intent:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
