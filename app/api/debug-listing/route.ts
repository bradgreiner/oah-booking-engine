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

  const [listingRes, imagesRes] = await Promise.all([
    fetch("https://api.hostaway.com/v1/listings/317655", {
      headers: { Authorization: `Bearer ${access_token}` },
    }),
    fetch("https://api.hostaway.com/v1/listings/317655/images", {
      headers: { Authorization: `Bearer ${access_token}` },
    }),
  ]);

  const listingData = await listingRes.json();
  const imagesData = await imagesRes.json();
  const listing = listingData.result ?? listingData;
  const images = imagesData.result ?? imagesData;

  return NextResponse.json({
    bedroomsNumber: listing.bedroomsNumber,
    bathroomsNumber: listing.bathroomsNumber,
    guestBathroomsNumber: listing.guestBathroomsNumber,
    thumbnailUrl: listing.thumbnailUrl,
    imagesEndpointStatus: imagesRes.status,
    imagesResult: Array.isArray(images) ? images.slice(0, 2) : images,
  });
}
