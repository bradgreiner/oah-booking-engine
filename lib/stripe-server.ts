import { stripe } from "./stripe";

export async function createPaymentIntent(
  amountDollars: number,
  metadata: Record<string, string>
) {
  const amountCents = Math.round(amountDollars * 100);

  return stripe.paymentIntents.create({
    amount: amountCents,
    currency: "usd",
    capture_method: "manual",
    metadata,
  });
}

export async function capturePaymentIntent(paymentIntentId: string) {
  return stripe.paymentIntents.capture(paymentIntentId);
}

export async function cancelPaymentIntent(paymentIntentId: string) {
  return stripe.paymentIntents.cancel(paymentIntentId);
}
