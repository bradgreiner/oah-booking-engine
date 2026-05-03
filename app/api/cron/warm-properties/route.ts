import { getProperties } from "@/lib/property-adapter";
import { getMinimumNightlyRate } from "@/lib/hostaway-calendar";
import { revalidateTag } from "next/cache";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

async function processInChunks<T>(
  items: T[],
  fn: (item: T) => Promise<unknown>,
  chunkSize: number
) {
  for (let i = 0; i < items.length; i += chunkSize) {
    const chunk = items.slice(i, i + chunkSize);
    await Promise.allSettled(chunk.map(fn));
  }
}

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const start = Date.now();

  try {
    const properties = await getProperties();

    // Warm calendar min-rate caches in chunks of 10
    const hostawayIds = properties
      .filter((p) => p.hostawayListingId)
      .map((p) => p.hostawayListingId!);
    await processInChunks(hostawayIds, (id) => getMinimumNightlyRate(id), 10);

    revalidateTag("properties");

    const durationMs = Date.now() - start;
    return new Response(
      JSON.stringify({ ok: true, count: properties.length, calendarWarmed: hostawayIds.length, durationMs }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ ok: false, error: message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
