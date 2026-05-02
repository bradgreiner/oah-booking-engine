import { hostawayFetch } from "@/lib/hostaway";
import { getAllReviewsGlobal, getListingReviews } from "@/lib/hostaway-reviews";

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

  // Attempt 1: raw API call with listingMapId filter (known broken, kept for reference)
  try {
    const data = await hostawayFetch<unknown[]>(`/reviews?listingMapId=${listingId}&limit=200`);
    const arr = Array.isArray(data) ? data : [];
    attempts.push({
      label: "Raw API with listingMapId filter (broken)",
      url: `/reviews?listingMapId=${listingId}&limit=200`,
      count: arr.length,
      types: [...new Set(arr.map((x: any) => x.type))],
      statuses: [...new Set(arr.map((x: any) => x.status))],
    });
  } catch (e: any) {
    attempts.push({ label: "Raw API listingMapId", error: e?.message ?? String(e) });
  }

  // Attempt 2: raw API unfiltered first page
  try {
    const data = await hostawayFetch<unknown[]>(`/reviews?limit=200`);
    const arr = Array.isArray(data) ? data : [];
    attempts.push({
      label: "Raw API unfiltered (first page)",
      url: `/reviews?limit=200`,
      total: arr.length,
      allListingMapIds: [...new Set(arr.map((x: any) => x.listingMapId))].slice(0, 30),
      allTypes: [...new Set(arr.map((x: any) => x.type))],
      allStatuses: [...new Set(arr.map((x: any) => x.status))],
      allChannelIds: [...new Set(arr.map((x: any) => x.channelId))],
    });
  } catch (e: any) {
    attempts.push({ label: "Raw API unfiltered", error: e?.message ?? String(e) });
  }

  // Attempt 3: global paginated cache + in-memory filter (production path)
  try {
    const all = await getAllReviewsGlobal();
    const channelCounts: Record<number, number> = {};
    for (const r of all as any[]) {
      channelCounts[r.channelId] = (channelCounts[r.channelId] || 0) + 1;
    }

    const filtered = await getListingReviews(listingId);

    attempts.push({
      label: "Global cache + in-memory filter (production path)",
      globalTotal: all.length,
      allChannelIds: [...new Set((all as any[]).map((x) => x.channelId))],
      channelCounts,
      uniqueListingMapIds: new Set((all as any[]).map((x) => x.listingMapId)).size,
      filteredForListing: filtered.length,
      sampleFiltered: filtered[0] ?? null,
    });
  } catch (e: any) {
    attempts.push({ label: "Global cache", error: e?.message ?? String(e) });
  }

  return new Response(JSON.stringify(debug, null, 2), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
