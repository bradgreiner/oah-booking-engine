import { hostawayFetch } from "@/lib/hostaway";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: { listingId: string } }
) {
  const listingId = parseInt(params.listingId, 10);
  if (isNaN(listingId)) {
    return new Response(JSON.stringify({ error: "bad listingId" }), { status: 400 });
  }

  const debug: Record<string, unknown> = { listingId, attempts: [] };
  const attempts = debug.attempts as Record<string, unknown>[];

  // Attempt 1: filter by listingMapId (what our reviews code uses)
  try {
    const data = await hostawayFetch<unknown[]>(`/reviews?listingMapId=${listingId}&limit=200`);
    const arr = Array.isArray(data) ? data : [];
    attempts.push({
      url: `/reviews?listingMapId=${listingId}&limit=200`,
      count: arr.length,
      sample: arr[0] ?? null,
      types: [...new Set(arr.map((x: any) => x.type))],
      statuses: [...new Set(arr.map((x: any) => x.status))],
    });
  } catch (e: any) {
    attempts.push({ url: `listingMapId=${listingId}`, error: e?.message ?? String(e) });
  }

  // Attempt 2: all reviews, no filter, to see what fields exist
  try {
    const data = await hostawayFetch<unknown[]>(`/reviews?limit=200`);
    const arr = Array.isArray(data) ? data : [];
    attempts.push({
      url: `/reviews?limit=200`,
      total: arr.length,
      sample_5: arr.slice(0, 5).map((x: any) => ({
        id: x.id,
        type: x.type,
        status: x.status,
        listingMapId: x.listingMapId,
        listingId: x.listingId,
        rating: x.rating,
        totalRating: x.totalRating,
        publicReview: x.publicReview ? x.publicReview.slice(0, 60) + "..." : null,
        channelId: x.channelId,
        channel: x.channel,
        guestName: x.guestName,
        reservationGuestName: x.reservationGuestName,
        date: x.departureDate ?? x.date ?? x.insertedOn,
      })),
      allListingMapIds: [...new Set(arr.map((x: any) => x.listingMapId))].slice(0, 20),
      allListingIds: [...new Set(arr.map((x: any) => x.listingId))].slice(0, 20),
      allTypes: [...new Set(arr.map((x: any) => x.type))],
      allStatuses: [...new Set(arr.map((x: any) => x.status))],
      allChannelIds: [...new Set(arr.map((x: any) => x.channelId))],
    });
  } catch (e: any) {
    attempts.push({ url: "all reviews", error: e?.message ?? String(e) });
  }

  return new Response(JSON.stringify(debug, null, 2), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
