import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export async function GET() {
  const res = await fetch("https://api.hostaway.com/v1/accessTokens", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: process.env.HOSTAWAY_ACCOUNT_ID || "",
      client_secret: process.env.HOSTAWAY_API_KEY || "",
    }),
  });
  const { access_token } = await res.json();

  const listingRes = await fetch("https://api.hostaway.com/v1/listings/317655", {
    headers: { Authorization: `Bearer ${access_token}` },
  });
  const data = await listingRes.json();
  const listing = data.result ?? data;

  const bedroomKeys = Object.keys(listing).filter(k => k.toLowerCase().includes("bedroom") || k.toLowerCase().includes("bath") || k.toLowerCase().includes("room"));

  return NextResponse.json({
    id: listing.id,
    bedrooms: listing.bedrooms,
    bedroomsType: typeof listing.bedrooms,
    bathrooms: listing.bathrooms,
    bathroomsType: typeof listing.bathrooms,
    bedroomKeys,
    imageCount: listing.listingImages?.length ?? listing.images?.length ?? 0,
    firstImageUrl: listing.listingImages?.[0]?.url ?? listing.images?.[0]?.url ?? null,
    sampleFields: Object.keys(listing).slice(0, 30),
  });
}
