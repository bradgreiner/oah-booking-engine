import { NextRequest, NextResponse } from "next/server";
import { submitBookingRequest } from "@/lib/booking";
import { stripe } from "@/lib/stripe";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const required = ["propertyId", "checkIn", "checkOut", "firstName", "lastName", "email", "phone", "tripDescription"];
    for (const field of required) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    if (body.tripDescription.trim().length < 20) {
      return NextResponse.json(
        { error: "Trip description must be at least 20 characters" },
        { status: 400 }
      );
    }

    // Verify Stripe payment intent if provided
    if (body.stripePaymentIntentId) {
      try {
        const pi = await stripe.paymentIntents.retrieve(body.stripePaymentIntentId);
        if (pi.status !== "requires_capture") {
          return NextResponse.json({ error: "Invalid payment status" }, { status: 400 });
        }
      } catch {
        return NextResponse.json({ error: "Invalid payment reference" }, { status: 400 });
      }
    }

    const booking = await submitBookingRequest({
      propertyId: body.propertyId,
      checkIn: body.checkIn,
      checkOut: body.checkOut,
      numGuests: body.numGuests || 1,
      numPets: body.numPets || 0,
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      phone: body.phone,
      tripDescription: body.tripDescription,
      petInfo: body.petInfo,
      houseRulesAck: body.houseRulesAck || false,
      stripePaymentIntentId: body.stripePaymentIntentId || "",
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to submit booking request";
    console.error("Error submitting booking request:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
