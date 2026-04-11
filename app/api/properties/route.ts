import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const properties = await prisma.property.findMany({
    where: { isPublished: true },
    include: { images: { orderBy: { sortOrder: "asc" }, take: 1 } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(properties);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const property = await prisma.property.create({ data: body });
  return NextResponse.json(property, { status: 201 });
}
