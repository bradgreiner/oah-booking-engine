import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const isOlympic = searchParams.get("isOlympic");
    const search = searchParams.get("search");
    const city = searchParams.get("city");
    const propertyType = searchParams.get("propertyType");
    const sort = searchParams.get("sort");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const amenity = searchParams.get("amenity");

    const where: Prisma.PropertyWhereInput = {};

    if (status && status !== "all") {
      where.status = status;
    }

    if (isOlympic === "true") {
      where.isOlympic = true;
    }

    if (city) {
      where.city = { equals: city, mode: "insensitive" };
    }

    if (propertyType) {
      if (propertyType === "monthly") {
        where.propertyType = { in: ["monthly", "both"] };
      } else if (propertyType === "str") {
        where.propertyType = { in: ["str", "both"] };
      } else {
        where.propertyType = propertyType;
      }
    }

    if (minPrice || maxPrice) {
      where.baseRate = {};
      if (minPrice) where.baseRate.gte = parseFloat(minPrice);
      if (maxPrice) where.baseRate.lte = parseFloat(maxPrice);
    }

    if (amenity) {
      where.amenities = { contains: amenity, mode: "insensitive" };
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { headline: { contains: search, mode: "insensitive" } },
        { neighborhood: { contains: search, mode: "insensitive" } },
        { city: { contains: search, mode: "insensitive" } },
      ];
    }

    let orderBy: Prisma.PropertyOrderByWithRelationInput = {
      createdAt: "desc",
    };
    if (sort === "price_asc") {
      orderBy = { baseRate: "asc" };
    } else if (sort === "price_desc") {
      orderBy = { baseRate: "desc" };
    }

    const properties = await prisma.property.findMany({
      where,
      include: { images: { orderBy: { sortOrder: "asc" }, take: 1 } },
      orderBy,
    });

    return NextResponse.json(properties);
  } catch (error) {
    console.error("Error fetching properties:", error);
    return NextResponse.json(
      { error: "Failed to fetch properties" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const slug =
      body.slug ||
      body.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

    const isPublished = body.status === "active";

    const property = await prisma.property.create({
      data: {
        name: body.name,
        slug,
        headline: body.headline || null,
        description: body.description || null,
        neighborhood: body.neighborhood || null,
        address: body.address || null,
        city: body.city || null,
        state: body.state || null,
        zip: body.zip || null,
        bedrooms: body.bedrooms ? parseInt(body.bedrooms) : 0,
        bathrooms: body.bathrooms ? parseFloat(body.bathrooms) : 0,
        maxGuests: body.maxGuests ? parseInt(body.maxGuests) : 1,
        sqft: body.sqft ? parseInt(body.sqft) : null,
        propertyType: body.propertyType || "str",
        baseRate: body.baseRate ? parseFloat(body.baseRate) : 0,
        weeklyDiscount: body.weeklyDiscount
          ? parseFloat(body.weeklyDiscount)
          : 0,
        monthlyDiscount: body.monthlyDiscount
          ? parseFloat(body.monthlyDiscount)
          : 0,
        cleaningFee: body.cleaningFee ? parseFloat(body.cleaningFee) : 0,
        petFee: body.petFee ? parseFloat(body.petFee) : 0,
        minNights: body.minNights ? parseInt(body.minNights) : 1,
        maxNights: body.maxNights ? parseInt(body.maxNights) : null,
        totRate: body.totRate ? parseFloat(body.totRate) : 0.12,
        isOlympic: body.isOlympic || false,
        olympicOnly: body.olympicOnly || false,
        availableStart: body.availableStart
          ? new Date(body.availableStart)
          : null,
        availableEnd: body.availableEnd ? new Date(body.availableEnd) : null,
        ownerName: body.ownerName || null,
        ownerEmail: body.ownerEmail || null,
        ownerPhone: body.ownerPhone || null,
        amenities: body.amenities
          ? JSON.stringify(body.amenities)
          : null,
        status: body.status || "draft",
        isPublished,
      },
    });

    return NextResponse.json(property, { status: 201 });
  } catch (error) {
    console.error("Error creating property:", error);
    return NextResponse.json(
      { error: "Failed to create property" },
      { status: 500 }
    );
  }
}
