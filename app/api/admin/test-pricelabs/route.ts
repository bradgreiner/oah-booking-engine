export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.PRICELABS_API_KEY || '';

  // Test with id (string) + pms — the correct PriceLabs format
  const postRes = await fetch('https://api.pricelabs.co/v1/listing_prices', {
    method: 'POST',
    headers: {
      'X-API-Key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      listings: [{
        id: '498172',
        pms: 'hostaway',
        start_date: '2026-04-12',
        end_date: '2026-05-13',
      }],
    }),
  });
  const postText = await postRes.text();

  return NextResponse.json({
    status: postRes.status,
    response: postText.slice(0, 3000),
  });
}
