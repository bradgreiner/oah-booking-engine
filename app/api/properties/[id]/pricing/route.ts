import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculateFees } from "@/lib/fees";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const checkIn = searchParams.get("checkIn");
    const checkOut = searchParams.get("checkOut");

    if (!checkIn || !checkOut) {
      return NextResponse.json(
        { error: "checkIn and checkOut are required" },
        { status: 400 }
      );
    }

    const property = await prisma.property.findUnique({
      where: { id: params.id },
    });

    if (!property) {
      return NextResponse.json(
        { error: "Property not found" },
        { status: 404 }
      );
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const diffTime = checkOutDate.getTime() - checkInDate.getTime();
    const numNights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (numNights <= 0) {
      return NextResponse.json(
        { error: "Check-out must be after check-in" },
        { status: 400 }
      );
    }

    const fees = calculateFees({
      nightlyRate: property.baseRate,
      numNights,
      cleaningFee: property.cleaningFee,
      petFee: 0,
      totRate: numNights < 30 ? property.totRate : 0,
    });

    // CC processing fee (3%)
    const ccFee = Math.round(fees.grandTotal * 0.03 * 100) / 100;
    const grandTotalWithCc = Math.round((fees.grandTotal + ccFee) * 100) / 100;

    return NextResponse.json({
      ...fees,
      ccFee,
      grandTotal: grandTotalWithCc,
      numNights,
      checkIn,
      checkOut,
    });
  } catch (error) {
    console.error("Error calculating pricing:", error);
    return NextResponse.json(
      { error: "Failed to calculate pricing" },
      { status: 500 }
    );
  }
}
