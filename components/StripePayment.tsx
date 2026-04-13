"use client";

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: "16px",
      color: "#1a1a1a",
      "::placeholder": { color: "#9ca3af" },
      fontFamily: "Inter, system-ui, sans-serif",
    },
    invalid: { color: "#dc2626" },
  },
};

interface CardFormProps {
  clientSecret: string;
  onSuccess: (paymentIntentId: string) => void;
  onError: (message: string) => void;
  submitting: boolean;
  setSubmitting: (v: boolean) => void;
  submitRef: React.MutableRefObject<(() => void) | null>;
}

function CardForm({
  clientSecret,
  onSuccess,
  onError,
  submitting,
  setSubmitting,
  submitRef,
}: CardFormProps) {
  const stripe = useStripe();
  const elements = useElements();

  submitRef.current = async () => {
    if (!stripe || !elements) return;
    setSubmitting(true);

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      onError("Card element not found");
      setSubmitting(false);
      return;
    }

    console.log("[StripePayment] Confirming card payment, clientSecret:", clientSecret.substring(0, 20) + "...");

    const { error, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret,
      { payment_method: { card: cardElement } }
    );

    if (error) {
      console.error("[StripePayment] Payment error:", error.message);
      onError(error.message || "Payment failed");
      setSubmitting(false);
    } else if (paymentIntent && paymentIntent.status === "requires_capture") {
      console.log("[StripePayment] Payment authorized successfully:", paymentIntent.id, "status:", paymentIntent.status);
      onSuccess(paymentIntent.id);
    } else if (paymentIntent) {
      console.log("[StripePayment] Unexpected status:", paymentIntent.status, "id:", paymentIntent.id);
      onSuccess(paymentIntent.id);
    } else {
      onError("Payment confirmation returned no result");
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white px-4 py-3">
      <CardElement options={CARD_ELEMENT_OPTIONS} />
    </div>
  );
}

interface StripePaymentProps {
  clientSecret: string;
  onSuccess: (paymentIntentId: string) => void;
  onError: (message: string) => void;
  submitting: boolean;
  setSubmitting: (v: boolean) => void;
  submitRef: React.MutableRefObject<(() => void) | null>;
}

export default function StripePayment(props: StripePaymentProps) {
  return (
    <Elements stripe={stripePromise} options={{ clientSecret: props.clientSecret }}>
      <CardForm {...props} />
    </Elements>
  );
}
