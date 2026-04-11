import Stripe from "stripe";

let _stripe: Stripe | null = null;

function getStripe(): Stripe {
  if (!_stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY is not set");
    }
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  }
  return _stripe;
}

export const stripe: Stripe = new Proxy({} as Stripe, {
  get(_, prop) {
    const instance = getStripe();
    return (instance as unknown as Record<string, unknown>)[prop as string];
  },
});
