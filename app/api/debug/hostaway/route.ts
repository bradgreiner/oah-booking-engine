import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const accountId = process.env.HOSTAWAY_ACCOUNT_ID || "";
  const apiKey = process.env.HOSTAWAY_API_KEY || "";
  const log: Record<string, unknown> = {
    HOSTAWAY_ACCOUNT_ID: accountId || "(not set)",
    HOSTAWAY_API_KEY_exists: !!apiKey,
    HOSTAWAY_API_KEY_length: apiKey.length,
  };

  // Step 1: Get OAuth2 token
  let token = "";
  try {
    const tokenRes = await fetch("https://api.hostaway.com/v1/accessTokens", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: accountId,
        client_secret: apiKey,
      }),
    });

    const tokenBody = await tokenRes.text();
    log.token_status = tokenRes.status;
    log.token_ok = tokenRes.ok;

    try {
      log.token_response = JSON.parse(tokenBody);
    } catch {
      log.token_response_raw = tokenBody.slice(0, 500);
    }

    if (tokenRes.ok) {
      const parsed = JSON.parse(tokenBody);
      token = parsed.access_token || "";
      log.token_received = !!token;
    }
  } catch (error) {
    log.token_error = error instanceof Error ? error.message : String(error);
  }

  // Step 2: Fetch listings with token
  if (token) {
    try {
      const listingsRes = await fetch(
        "https://api.hostaway.com/v1/listings?limit=2&isActive=1",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const listingsBody = await listingsRes.text();
      log.listings_status = listingsRes.status;
      log.listings_ok = listingsRes.ok;

      try {
        const parsed = JSON.parse(listingsBody);
        const result = parsed.result ?? parsed;
        log.listings_count = Array.isArray(result) ? result.length : "not array";
        log.listings_sample = Array.isArray(result)
          ? result.slice(0, 2).map((l: Record<string, unknown>) => ({
              id: l.id,
              name: l.name,
              city: l.city,
              isActive: l.isActive,
              price: l.price,
            }))
          : result;
      } catch {
        log.listings_response_raw = listingsBody.slice(0, 500);
      }
    } catch (error) {
      log.listings_error = error instanceof Error ? error.message : String(error);
    }
  } else {
    log.listings_skipped = "No token available";
  }

  console.log("Hostaway debug:", JSON.stringify(log, null, 2));
  return NextResponse.json(log);
}
