import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const property = await prisma.property.findUnique({
      where: { id: params.id },
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        pricingRules: { orderBy: { startDate: "asc" } },
      },
    });

    if (!property) {
      return NextResponse.json(
        { error: "Property not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(property);
  } catch (error) {
    console.error("Error fetching property:", error);
    return NextResponse.json(
      { error: "Failed to fetch property" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    const data: Record<string, unknown> = {};

    if (body.name !== undefined) data.name = body.name;
    if (body.headline !== undefined) data.headline = body.headline || null;
    if (body.description !== undefined)
      data.description = body.description || null;
    if (body.neighborhood !== undefined)
      data.neighborhood = body.neighborhood || null;
    if (body.address !== undefined) data.address = body.address || null;
    if (body.city !== undefined) data.city = body.city || null;
    if (body.state !== undefined) data.state = body.state || null;
    if (body.zip !== undefined) data.zip = body.zip || null;
    if (body.bedrooms !== undefined) data.bedrooms = parseInt(body.bedrooms);
    if (body.bathrooms !== undefined)
      data.bathrooms = parseFloat(body.bathrooms);
    if (body.maxGuests !== undefined)
      data.maxGuests = parseInt(body.maxGuests);
    if (body.sqft !== undefined)
      data.sqft = body.sqft ? parseInt(body.sqft) : null;
    if (body.propertyType !== undefined) data.propertyType = body.propertyType;
    if (body.baseRate !== undefined)
      data.baseRate = parseFloat(body.baseRate);
    if (body.weeklyDiscount !== undefined)
      data.weeklyDiscount = parseFloat(body.weeklyDiscount);
    if (body.monthlyDiscount !== undefined)
      data.monthlyDiscount = parseFloat(body.monthlyDiscount);
    if (body.cleaningFee !== undefined)
      data.cleaningFee = parseFloat(body.cleaningFee);
    if (body.petFee !== undefined) data.petFee = parseFloat(body.petFee);
    if (body.minNights !== undefined)
      data.minNights = parseInt(body.minNights);
    if (body.maxNights !== undefined)
      data.maxNights = body.maxNights ? parseInt(body.maxNights) : null;
    if (body.totRate !== undefined) data.totRate = parseFloat(body.totRate);
    if (body.isOlympic !== undefined) data.isOlympic = body.isOlympic;
    if (body.olympicOnly !== undefined) data.olympicOnly = body.olympicOnly;
    if (body.availableStart !== undefined)
      data.availableStart = body.availableStart
        ? new Date(body.availableStart)
        : null;
    if (body.availableEnd !== undefined)
      data.availableEnd = body.availableEnd
        ? new Date(body.availableEnd)
        : null;
    if (body.ownerName !== undefined) data.ownerName = body.ownerName || null;
    if (body.ownerEmail !== undefined)
      data.ownerEmail = body.ownerEmail || null;
    if (body.ownerPhone !== undefined)
      data.ownerPhone = body.ownerPhone || null;
    if (body.amenities !== undefined)
      data.amenities = body.amenities ? JSON.stringify(body.amenities) : null;
    if (body.status !== undefined) {
      data.status = body.status;
      data.isPublished = body.status === "active";
    }

    if (body.name && body.name !== undefined) {
      data.slug = body.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    }

    const property = await prisma.property.update({
      where: { id: params.id },
      data,
    });

    return NextResponse.json(property);
  } catch (error) {
    console.error("Error updating property:", error);
    return NextResponse.json(
      { error: "Failed to update property" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.property.update({
      where: { id: params.id },
      data: { status: "removed", isPublished: false },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting property:", error);
    return NextResponse.json(
      { error: "Failed to delete property" },
      { status: 500 }
    );
  }
}
