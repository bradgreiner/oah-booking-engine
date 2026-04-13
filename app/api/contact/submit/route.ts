import { NextResponse } from "next/server";
import { getResendClient } from "@/lib/resend";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { name, email, subject, message } = await req.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    if (message.trim().length < 20) {
      return NextResponse.json({ error: "Message must be at least 20 characters" }, { status: 400 });
    }

    const resend = getResendClient();
    if (resend) {
      await resend.emails.send({
        from: "reservations@openairhomes.com",
        to: "brad@openairhomes.com",
        replyTo: email,
        subject: `Contact Form: ${subject} — ${name}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, "<br>")}</p>
        `,
      });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
