import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getResendClient } from "@/lib/resend";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);

    // Find sessions that:
    // - Were created more than 2 hours ago
    // - Did NOT complete the booking
    // - Have a guest email
    // - Haven't been emailed yet
    // - Haven't unsubscribed
    const sessions = await prisma.bookingSession.findMany({
      where: {
        createdAt: { lt: twoHoursAgo },
        stepReached: { not: "completed" },
        guestEmail: { not: null },
        emailSent: false,
        unsubscribed: false,
      },
      take: 50,
    });

    const resend = getResendClient();
    if (!resend) {
      console.log("RESEND_API_KEY not set, skipping abandoned emails");
      return NextResponse.json({ skipped: sessions.length, reason: "no_resend_key" });
    }

    let sent = 0;
    for (const session of sessions) {
      if (!session.guestEmail) continue;

      const baseUrl = process.env.NEXT_PUBLIC_BOOKING_URL || "https://oah-booking-engine.vercel.app";
      const resumeUrl = `${baseUrl}/${session.listingId}?checkIn=${session.checkIn || ""}&checkOut=${session.checkOut || ""}`;
      const unsubscribeUrl = `${baseUrl}/unsubscribe?email=${encodeURIComponent(session.guestEmail)}`;

      try {
        await resend.emails.send({
          from: "Open Air Homes <bookings@openairhomes.com>",
          to: session.guestEmail,
          subject: session.listingName
            ? `Still interested in ${session.listingName}?`
            : "Complete your booking with Open Air Homes",
          html: `
            <div style="font-family: 'DM Sans', system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px 24px;">
              <h1 style="font-family: Georgia, serif; color: #1a1a1a; font-size: 24px; font-weight: normal; margin: 0;">
                Your home is waiting
              </h1>
              <p style="color: #666; font-size: 15px; line-height: 1.6; margin-top: 16px;">
                You started a booking request${session.listingName ? ` for <strong>${session.listingName}</strong>` : ""} but didn't finish.
                ${session.checkIn && session.checkOut ? `Your dates (${session.checkIn} to ${session.checkOut}) may still be available.` : ""}
              </p>
              ${session.imageUrl ? `<img src="${session.imageUrl}" alt="${session.listingName || "Property"}" style="width: 100%; border-radius: 12px; margin: 24px 0;" />` : ""}
              <div style="text-align: center; margin: 32px 0;">
                <a href="${resumeUrl}" style="display: inline-block; background: #4C6C4E; color: white; padding: 14px 40px; border-radius: 50px; text-decoration: none; font-size: 15px; font-weight: 600;">
                  Complete my booking
                </a>
              </div>
              <p style="color: #999; font-size: 12px; margin-top: 32px;">
                Questions? Reply to this email or contact us at brad@openairhomes.com
              </p>
              <p style="color: #bbb; font-size: 11px; margin-top: 16px;">
                <a href="${unsubscribeUrl}" style="color: #bbb;">Unsubscribe from booking reminders</a>
              </p>
            </div>
          `,
        });
        sent++;
      } catch (emailErr) {
        console.error(`Failed to send abandoned email to ${session.guestEmail}:`, emailErr);
      }

      // Mark as sent regardless of success to prevent spam
      await prisma.bookingSession.update({
        where: { id: session.id },
        data: { emailSent: true },
      });
    }

    return NextResponse.json({ found: sessions.length, sent });
  } catch (error) {
    console.error("Abandoned email cron error:", error);
    return NextResponse.json({ error: "Cron failed" }, { status: 500 });
  }
}
