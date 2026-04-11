import { prisma } from "./prisma";
import { calculateFees } from "./fees";
import { createPaymentIntent, capturePaymentIntent, cancelPaymentIntent } from "./stripe-server";
import { sendGuestConfirmation, sendAdminNotification, sendApprovalEmail, sendDeclineEmail } from "./emails";

interface CreateBookingInput {
  propertyId: string;
  checkIn: string;
  checkOut: string;
  numGuests: number;
  numPets: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  tripDescription: string;
  petInfo?: string;
  houseRulesAck: boolean;
  stripePaymentIntentId: string;
}

export function calculateBookingFees(property: {
  baseRate: number;
  cleaningFee: number;
  petFee: number;
  totRate: number;
}, numNights: number, hasPets: boolean) {
  const fees = calculateFees({
    nightlyRate: property.baseRate,
    numNights,
    cleaningFee: property.cleaningFee,
    petFee: hasPets ? property.petFee : 0,
    totRate: numNights < 30 ? property.totRate : 0,
  });

  const ccFee = Math.round(fees.grandTotal * 0.03 * 100) / 100;
  const grandTotalWithCc = Math.round((fees.grandTotal + ccFee) * 100) / 100;

  return { ...fees, ccFee, grandTotal: grandTotalWithCc };
}

export function getNightCount(checkIn: string, checkOut: string): number {
  const diff = new Date(checkOut).getTime() - new Date(checkIn).getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export async function createBookingPaymentIntent(
  propertyId: string,
  checkIn: string,
  checkOut: string,
  hasPets: boolean
) {
  const property = await prisma.property.findUnique({
    where: { id: propertyId },
  });

  if (!property) throw new Error("Property not found");

  const numNights = getNightCount(checkIn, checkOut);
  if (numNights <= 0) throw new Error("Invalid dates");

  const fees = calculateBookingFees(property, numNights, hasPets);

  const paymentIntent = await createPaymentIntent(fees.grandTotal, {
    propertyId,
    checkIn,
    checkOut,
    propertyName: property.name,
  });

  return {
    clientSecret: paymentIntent.client_secret,
    paymentIntentId: paymentIntent.id,
    fees,
    numNights,
  };
}

export async function submitBookingRequest(input: CreateBookingInput) {
  const property = await prisma.property.findUnique({
    where: { id: input.propertyId },
  });

  if (!property) throw new Error("Property not found");

  const numNights = getNightCount(input.checkIn, input.checkOut);
  const hasPets = input.numPets > 0;
  const fees = calculateBookingFees(property, numNights, hasPets);

  // Upsert guest
  const guest = await prisma.guest.upsert({
    where: { email: input.email },
    update: {
      firstName: input.firstName,
      lastName: input.lastName,
      phone: input.phone,
    },
    create: {
      email: input.email,
      firstName: input.firstName,
      lastName: input.lastName,
      phone: input.phone,
    },
  });

  // Create booking request
  const booking = await prisma.bookingRequest.create({
    data: {
      propertyId: input.propertyId,
      guestId: guest.id,
      checkIn: new Date(input.checkIn),
      checkOut: new Date(input.checkOut),
      numGuests: input.numGuests,
      numPets: input.numPets,
      nightlyTotal: fees.nightlyTotal,
      cleaningFee: fees.cleaningFee,
      petFee: fees.petFee,
      safelyFee: fees.safelyFee,
      totAmount: fees.totAmount,
      oahFee: fees.oahFee,
      ccFee: fees.ccFee,
      grandTotal: fees.grandTotal,
      stripePaymentId: input.stripePaymentIntentId,
      paymentMethod: "card",
      tripDescription: input.tripDescription,
      petInfo: input.petInfo || null,
      houseRulesAck: input.houseRulesAck,
    },
  });

  // Send emails (fire-and-forget)
  const emailData = {
    guestName: `${input.firstName} ${input.lastName}`,
    guestEmail: input.email,
    guestPhone: input.phone,
    propertyName: property.headline || property.name,
    checkIn: input.checkIn,
    checkOut: input.checkOut,
    numNights,
    numGuests: input.numGuests,
    grandTotal: fees.grandTotal,
    tripDescription: input.tripDescription,
    petInfo: input.petInfo,
    paymentMethod: "card",
    nightlyTotal: fees.nightlyTotal,
    cleaningFee: fees.cleaningFee,
    oahFee: fees.oahFee,
    totAmount: fees.totAmount,
    safelyFee: fees.safelyFee,
    ccFee: fees.ccFee,
  };

  sendGuestConfirmation(emailData).catch(console.error);
  sendAdminNotification(emailData).catch(console.error);

  return booking;
}

export async function approveBooking(bookingId: string) {
  const booking = await prisma.bookingRequest.findUnique({
    where: { id: bookingId },
    include: { property: true, guest: true },
  });

  if (!booking) throw new Error("Booking not found");
  if (booking.status !== "pending") throw new Error("Booking is not pending");

  // Capture the Stripe payment
  if (booking.stripePaymentId) {
    await capturePaymentIntent(booking.stripePaymentId);
  }

  // Update status
  const updated = await prisma.bookingRequest.update({
    where: { id: bookingId },
    data: { status: "approved" },
  });

  // Send approval email
  sendApprovalEmail(
    booking.guest.email,
    booking.guest.firstName,
    booking.property.headline || booking.property.name,
    booking.checkIn.toISOString(),
    booking.checkOut.toISOString()
  ).catch(console.error);

  return updated;
}

export async function declineBooking(bookingId: string) {
  const booking = await prisma.bookingRequest.findUnique({
    where: { id: bookingId },
    include: { property: true, guest: true },
  });

  if (!booking) throw new Error("Booking not found");
  if (booking.status !== "pending") throw new Error("Booking is not pending");

  // Cancel/release the Stripe payment
  if (booking.stripePaymentId) {
    await cancelPaymentIntent(booking.stripePaymentId);
  }

  // Update status
  const updated = await prisma.bookingRequest.update({
    where: { id: bookingId },
    data: { status: "declined" },
  });

  // Send decline email
  sendDeclineEmail(
    booking.guest.email,
    booking.guest.firstName,
    booking.property.headline || booking.property.name
  ).catch(console.error);

  return updated;
}
