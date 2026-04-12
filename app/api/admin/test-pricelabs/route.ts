export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.PRICELABS_API_KEY || '';

  // Test 1: GET endpoint — fetch all listing prices
  let getStatus = 0;
  let getResponse = '';
  try {
    const getRes = await fetch('https://api.pricelabs.co/v1/listing_prices?pms=hostaway', {
      headers: { 'X-API-Key': apiKey },
    });
    getStatus = getRes.status;
    getResponse = await getRes.text();
  } catch (e: any) {
    getResponse = `Error: ${e.message}`;
  }

  // Test 2: POST endpoint with listing_id + pms (PriceLabs docs format)
  let postStatus = 0;
  let postResponse = '';
  try {
    const postRes = await fetch('https://api.pricelabs.co/v1/listing_prices', {
      method: 'POST',
      headers: {
        'X-API-Key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        listings: [{
          listing_id: '498172',
          pms: 'hostaway',
          start_date: '2026-04-12',
          end_date: '2026-05-12',
        }],
      }),
    });
    postStatus = postRes.status;
    postResponse = await postRes.text();
  } catch (e: any) {
    postResponse = `Error: ${e.message}`;
  }

  // Test 3: POST with old format (id instead of listing_id) for comparison
  let post2Status = 0;
  let post2Response = '';
  try {
    const post2Res = await fetch('https://api.pricelabs.co/v1/listing_prices', {
      method: 'POST',
      headers: {
        'X-API-Key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        listings: [{
          id: '498172',
          start_date: '2026-04-12',
          end_date: '2026-05-12',
        }],
      }),
    });
    post2Status = post2Res.status;
    post2Response = await post2Res.text();
  } catch (e: any) {
    post2Response = `Error: ${e.message}`;
  }

  return NextResponse.json({
    apiKeyPresent: !!process.env.PRICELABS_API_KEY,
    apiKeyPrefix: apiKey.slice(0, 8) || 'none',
    test1_GET: {
      status: getStatus,
      response: getResponse.slice(0, 2000),
    },
    test2_POST_listing_id: {
      status: postStatus,
      response: postResponse.slice(0, 2000),
    },
    test3_POST_id_only: {
      status: post2Status,
      response: post2Response.slice(0, 2000),
    },
  });
}
