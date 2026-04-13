import { NextRequest, NextResponse } from "next/server";
import { createBookingPaymentIntent } from "@/lib/booking";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { propertyId, checkIn, checkOut, hasPets } = body;

    if (!propertyId || !checkIn || !checkOut) {
      return NextResponse.json(
        { error: "propertyId, checkIn, and checkOut are required" },
        { status: 400 }
      );
    }

    console.log("[create-payment-intent] Creating for property:", propertyId, "dates:", checkIn, "to", checkOut);

    const result = await createBookingPaymentIntent(
      propertyId,
      checkIn,
      checkOut,
      hasPets || false
    );

    console.log("[create-payment-intent] PaymentIntent created:", result.paymentIntentId, "amount cents:", Math.round(result.fees.grandTotal * 100));

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create payment intent";
    console.error("[create-payment-intent] Error:", message, error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
