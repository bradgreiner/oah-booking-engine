import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getResendClient } from "@/lib/resend";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, propertyAddress, city, message, source } = body;

    // Validate required fields
    if (!name || !email || !phone || !propertyAddress) {
      return NextResponse.json(
        { error: "Name, email, phone, and property address are required." },
        { status: 400 }
      );
    }

    // Save to database
    const lead = await prisma.homeownerLead.create({
      data: {
        name,
        email,
        phone,
        propertyAddress,
        city: city || null,
        message: message || null,
        source: source || null,
      },
    });

    // Send email notification
    const resend = getResendClient();
    if (resend) {
      try {
        await resend.emails.send({
          from: "Open Air Homes <reservations@openairhomes.com>",
          to: "brad@openairhomes.com",
          subject: `New homeowner lead: ${name}`,
          html: `
            <h2>New Homeowner Lead</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Property Address:</strong> ${propertyAddress}</p>
            ${city ? `<p><strong>City:</strong> ${city}</p>` : ""}
            ${message ? `<p><strong>Message:</strong> ${message}</p>` : ""}
            ${source ? `<p><strong>How they heard about us:</strong> ${source}</p>` : ""}
            <hr />
            <p style="color: #888; font-size: 12px;">Submitted via oah-booking-engine.vercel.app/list-your-home</p>
          `,
        });
      } catch (emailErr) {
        console.error("Failed to send lead notification email:", emailErr);
      }
    }

    return NextResponse.json({ success: true, id: lead.id });
  } catch (err) {
    console.error("Lead submission error:", err);
    return NextResponse.json(
      { error: "Failed to submit. Please try again." },
      { status: 500 }
    );
  }
}
