import { Resend } from "resend";

function getResend() {
  if (!process.env.RESEND_API_KEY) {
    return null;
  }
  return new Resend(process.env.RESEND_API_KEY);
}

const FROM_EMAIL = "Open Air Homes <bookings@openairhomes.com>";
const ADMIN_EMAIL = "brad@openairhomes.com";

interface BookingEmailData {
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  propertyName: string;
  checkIn: string;
  checkOut: string;
  numNights: number;
  numGuests: number;
  grandTotal: number;
  tripDescription?: string;
  petInfo?: string;
  paymentMethod: string;
  nightlyTotal: number;
  cleaningFee: number;
  oahFee: number;
  totAmount: number;
  safelyFee: number;
  ccFee: number;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatCurrency(amount: number): string {
  return `$${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export async function sendGuestConfirmation(data: BookingEmailData) {
  const resend = getResend();
  if (!resend) {
    console.log("RESEND_API_KEY not set, skipping guest confirmation email");
    return;
  }

  await resend.emails.send({
    from: FROM_EMAIL,
    to: data.guestEmail,
    subject: `Your booking request for ${data.propertyName} is under review`,
    html: `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #1B2A4A; font-size: 24px;">Request received!</h1>
        <p style="color: #555; font-size: 16px;">
          Hi ${data.guestName},<br><br>
          We've received your booking request and are reviewing it now.
          You'll hear back from us within 24 hours.
        </p>
        <div style="background: #F5F3EF; border-radius: 12px; padding: 24px; margin: 24px 0;">
          <h2 style="color: #1B2A4A; font-size: 18px; margin-top: 0;">${data.propertyName}</h2>
          <p style="color: #555; margin: 4px 0;">${formatDate(data.checkIn)} &rarr; ${formatDate(data.checkOut)}</p>
          <p style="color: #555; margin: 4px 0;">${data.numNights} nights &middot; ${data.numGuests} guests</p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 16px 0;" />
          <p style="color: #1B2A4A; font-size: 18px; font-weight: bold; margin: 0;">
            Total: ${formatCurrency(data.grandTotal)}
          </p>
        </div>
        <p style="color: #888; font-size: 14px;">
          A hold has been placed on your payment method but you have <strong>not been charged</strong>.
          The charge will only be processed if your request is approved.
        </p>
        <p style="color: #888; font-size: 14px;">
          &mdash; The Open Air Homes Team
        </p>
      </div>
    `,
  });
}

export async function sendAdminNotification(data: BookingEmailData) {
  const resend = getResend();
  if (!resend) {
    console.log("RESEND_API_KEY not set, skipping admin notification email");
    return;
  }

  await resend.emails.send({
    from: FROM_EMAIL,
    to: ADMIN_EMAIL,
    subject: `New booking request: ${data.propertyName} · ${formatDate(data.checkIn)}–${formatDate(data.checkOut)} · ${data.guestName}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #1B2A4A; font-size: 20px;">New Booking Request</h1>
        <h2 style="color: #4C6C4E; font-size: 16px;">${data.propertyName}</h2>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr><td style="padding: 6px 0; color: #888;">Guest</td><td style="padding: 6px 0;">${data.guestName}</td></tr>
          <tr><td style="padding: 6px 0; color: #888;">Email</td><td style="padding: 6px 0;">${data.guestEmail}</td></tr>
          <tr><td style="padding: 6px 0; color: #888;">Phone</td><td style="padding: 6px 0;">${data.guestPhone}</td></tr>
          <tr><td style="padding: 6px 0; color: #888;">Dates</td><td style="padding: 6px 0;">${formatDate(data.checkIn)} &rarr; ${formatDate(data.checkOut)}</td></tr>
          <tr><td style="padding: 6px 0; color: #888;">Nights</td><td style="padding: 6px 0;">${data.numNights}</td></tr>
          <tr><td style="padding: 6px 0; color: #888;">Guests</td><td style="padding: 6px 0;">${data.numGuests}</td></tr>
          <tr><td style="padding: 6px 0; color: #888;">Payment</td><td style="padding: 6px 0;">${data.paymentMethod === "card" ? "Credit Card" : "ACH Bank Transfer"}</td></tr>
        </table>
        <div style="background: #F5F3EF; border-radius: 8px; padding: 16px; margin: 16px 0; font-size: 14px;">
          <strong>Price Breakdown</strong><br/>
          Nightly total: ${formatCurrency(data.nightlyTotal)}<br/>
          Cleaning: ${formatCurrency(data.cleaningFee)}<br/>
          OAH fee: ${formatCurrency(data.oahFee)}<br/>
          TOT: ${formatCurrency(data.totAmount)}<br/>
          Safely: ${formatCurrency(data.safelyFee)}<br/>
          CC fee: ${formatCurrency(data.ccFee)}<br/>
          <strong>Total: ${formatCurrency(data.grandTotal)}</strong>
        </div>
        ${data.tripDescription ? `<p style="font-size: 14px;"><strong>Trip description:</strong> ${data.tripDescription}</p>` : ""}
        ${data.petInfo ? `<p style="font-size: 14px;"><strong>Pet info:</strong> ${data.petInfo}</p>` : ""}
        <p style="margin-top: 24px;">
          <a href="${process.env.NEXTAUTH_URL || ""}/admin/bookings" style="background: #4C6C4E; color: white; padding: 10px 20px; text-decoration: none; border-radius: 8px; font-size: 14px;">
            View in Dashboard
          </a>
        </p>
      </div>
    `,
  });
}

export async function sendApprovalEmail(guestEmail: string, guestName: string, propertyName: string, checkIn: string, checkOut: string) {
  const resend = getResend();
  if (!resend) return;

  await resend.emails.send({
    from: FROM_EMAIL,
    to: guestEmail,
    subject: `Your booking for ${propertyName} has been approved!`,
    html: `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #4C6C4E; font-size: 24px;">You're all set!</h1>
        <p style="color: #555; font-size: 16px;">
          Hi ${guestName},<br><br>
          Great news! Your booking request for <strong>${propertyName}</strong> has been approved.
          Your payment has been processed.
        </p>
        <div style="background: #F5F3EF; border-radius: 12px; padding: 24px; margin: 24px 0;">
          <p style="color: #555; margin: 4px 0;"><strong>Check-in:</strong> ${formatDate(checkIn)}</p>
          <p style="color: #555; margin: 4px 0;"><strong>Check-out:</strong> ${formatDate(checkOut)}</p>
        </div>
        <p style="color: #555; font-size: 16px;">
          You'll receive check-in instructions 7 days before your arrival.
        </p>
        <p style="color: #888; font-size: 14px;">&mdash; The Open Air Homes Team</p>
      </div>
    `,
  });
}

export async function sendDeclineEmail(guestEmail: string, guestName: string, propertyName: string) {
  const resend = getResend();
  if (!resend) return;

  await resend.emails.send({
    from: FROM_EMAIL,
    to: guestEmail,
    subject: `Update on your booking request for ${propertyName}`,
    html: `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #1B2A4A; font-size: 24px;">Booking update</h1>
        <p style="color: #555; font-size: 16px;">
          Hi ${guestName},<br><br>
          Unfortunately, we're unable to accommodate your booking request for
          <strong>${propertyName}</strong> at this time. The hold on your payment
          method has been released &mdash; you will not be charged.
        </p>
        <p style="color: #555; font-size: 16px;">
          We'd love to help you find another home. Browse our other available properties
          or reach out and we'll help you find the perfect fit.
        </p>
        <p style="color: #888; font-size: 14px;">&mdash; The Open Air Homes Team</p>
      </div>
    `,
  });
}
