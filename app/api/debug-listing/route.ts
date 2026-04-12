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

  const listingsRes = await fetch("https://api.hostaway.com/v1/listings?limit=1&isActive=1", {
    headers: { Authorization: `Bearer ${access_token}` },
  });
  const data = await listingsRes.json();
  const listing = data.result?.[0] ?? data[0];

  return NextResponse.json({
    id: listing?.id,
    bedrooms: listing?.bedrooms,
    bedroomsType: typeof listing?.bedrooms,
    bathrooms: listing?.bathrooms,
    bathroomsType: typeof listing?.bathrooms,
    imageKeys: listing ? Object.keys(listing).filter(k => k.toLowerCase().includes("image") || k.toLowerCase().includes("photo")) : [],
    firstImageSample: listing?.images?.[0] ?? listing?.listingImages?.[0] ?? null,
    imageCount: listing?.images?.length ?? listing?.listingImages?.length ?? 0,
    imageUrl: listing?.images?.[0]?.url ?? listing?.listingImages?.[0]?.url ?? null,
  });
}
