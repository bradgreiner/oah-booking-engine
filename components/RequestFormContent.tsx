"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookingSummary from "@/components/BookingSummary";
import GuestInfoForm from "@/components/GuestInfoForm";
import StripePayment from "@/components/StripePayment";

interface Property {
  id: string;
  name: string;
  headline: string | null;
  baseRate: number;
  totRate: number;
  maxGuests: number;
  images: { url: string }[];
}

interface FeeBreakdown {
  nightlyTotal: number;
  cleaningFee: number;
  petFee: number;
  safelyFee: number;
  totAmount: number;
  oahFee: number;
  ccFee: number;
  grandTotal: number;
  numNights: number;
}

interface GuestFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  numGuests: number;
  tripDescription: string;
  hasPets: boolean;
  petInfo: string;
  houseRulesAck: boolean;
}

const INITIAL_FORM: GuestFormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  numGuests: 1,
  tripDescription: "",
  hasPets: false,
  petInfo: "",
  houseRulesAck: false,
};

export default function RequestFormContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const propertyId = params.propertyId as string;
  const checkIn = searchParams.get("checkIn") || "";
  const checkOut = searchParams.get("checkOut") || "";
  const initialGuests = parseInt(searchParams.get("guests") || "1");

  const [property, setProperty] = useState<Property | null>(null);
  const [fees, setFees] = useState<FeeBreakdown | null>(null);
  const [feesLoading, setFeesLoading] = useState(true);
  const [clientSecret, setClientSecret] = useState("");
  const [formData, setFormData] = useState<GuestFormData>({
    ...INITIAL_FORM,
    numGuests: initialGuests,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const stripeSubmitRef = useRef<(() => void) | null>(null);

  // Load property + pricing + payment intent
  useEffect(() => {
    if (!propertyId || !checkIn || !checkOut) return;

    async function load() {
      const [propRes, feeRes, piRes] = await Promise.all([
        fetch(`/api/properties/${propertyId}`),
        fetch(`/api/properties/${propertyId}/pricing?checkIn=${checkIn}&checkOut=${checkOut}`),
        fetch("/api/booking/create-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ propertyId, checkIn, checkOut }),
        }),
      ]);

      if (propRes.ok) setProperty(await propRes.json());
      if (feeRes.ok) setFees(await feeRes.json());
      if (piRes.ok) {
        const piData = await piRes.json();
        setClientSecret(piData.clientSecret);
      }
      setFeesLoading(false);
    }
    load();
  }, [propertyId, checkIn, checkOut]);

  const numNights = fees?.numNights || 0;
  const isLongStay = numNights >= 90;

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!formData.firstName.trim()) errs.firstName = "Required";
    if (!formData.lastName.trim()) errs.lastName = "Required";
    if (!formData.email.trim() || !formData.email.includes("@")) errs.email = "Valid email required";
    if (!formData.phone.trim()) errs.phone = "Required";
    if (formData.tripDescription.trim().length < 20)
      errs.tripDescription = "Please write at least 20 characters";
    if (!formData.houseRulesAck) errs.houseRulesAck = "You must acknowledge the house rules";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;
    setPaymentError("");

    if (isLongStay) {
      // ACH: submit directly without Stripe card
      setSubmitting(true);
      await submitRequest("");
    } else {
      // Trigger Stripe card confirmation
      if (stripeSubmitRef.current) {
        stripeSubmitRef.current();
      }
    }
  }

  async function submitRequest(paymentIntentId: string) {
    try {
      const res = await fetch("/api/booking/submit-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyId,
          checkIn,
          checkOut,
          numGuests: formData.numGuests,
          numPets: formData.hasPets ? 1 : 0,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          tripDescription: formData.tripDescription,
          petInfo: formData.hasPets ? formData.petInfo : undefined,
          houseRulesAck: formData.houseRulesAck,
          stripePaymentIntentId: paymentIntentId,
        }),
      });

      if (res.ok) {
        const booking = await res.json();
        router.push(`/confirmation/${booking.id}`);
      } else {
        const data = await res.json();
        setPaymentError(data.error || "Failed to submit request");
        setSubmitting(false);
      }
    } catch {
      setPaymentError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  if (!checkIn || !checkOut) {
    return (
      <>
        <Navbar />
        <main className="flex min-h-screen items-center justify-center">
          <p className="text-gray-500">Missing check-in or check-out dates.</p>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="mx-auto max-w-5xl px-4">
          <h1 className="font-[Georgia,serif] text-2xl font-bold text-[#1B2A4A]">
            Request to Book
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Complete the form below to submit your booking request
          </p>

          <div className="mt-8 flex flex-col gap-8 lg:flex-row">
            {/* Left: Summary */}
            <div className="w-full lg:w-[340px] lg:shrink-0">
              <div className="sticky top-6">
                <BookingSummary
                  propertyName={property?.headline || property?.name || "Loading..."}
                  propertyImage={property?.images?.[0]?.url}
                  checkIn={checkIn}
                  checkOut={checkOut}
                  baseRate={property?.baseRate || 0}
                  totRate={property?.totRate || 0.12}
                  fees={fees}
                  loading={feesLoading}
                />
              </div>
            </div>

            {/* Right: Form */}
            <div className="flex-1">
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-[#1B2A4A]">
                  Guest Information
                </h2>
                <div className="mt-4">
                  <GuestInfoForm
                    data={formData}
                    onChange={setFormData}
                    maxGuests={property?.maxGuests || 10}
                    errors={errors}
                  />
                </div>
              </div>

              {/* Payment section */}
              <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-[#1B2A4A]">
                  Payment
                </h2>

                {isLongStay ? (
                  <div className="mt-4 rounded-lg bg-blue-50 p-4 text-sm text-blue-800">
                    <p className="font-medium">ACH Bank Transfer Required</p>
                    <p className="mt-1 text-blue-600">
                      For stays of 90+ nights, we require ACH bank transfer.
                      We&apos;ll send you bank setup instructions after your request is approved.
                    </p>
                  </div>
                ) : clientSecret ? (
                  <div className="mt-4">
                    <StripePayment
                      clientSecret={clientSecret}
                      onSuccess={(piId) => submitRequest(piId)}
                      onError={(msg) => {
                        setPaymentError(msg);
                        setSubmitting(false);
                      }}
                      submitting={submitting}
                      setSubmitting={setSubmitting}
                      submitRef={stripeSubmitRef}
                    />
                    <p className="mt-2 text-xs text-gray-400">
                      Save with bank transfer? Contact us for stays 90+ nights.
                    </p>
                  </div>
                ) : (
                  <div className="mt-4 h-12 animate-pulse rounded-lg bg-gray-100" />
                )}

                {paymentError && (
                  <p className="mt-3 text-sm text-red-600">{paymentError}</p>
                )}
              </div>

              {/* Submit */}
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="mt-6 w-full rounded-lg bg-[#4C6C4E] py-3.5 text-sm font-semibold text-white transition hover:bg-[#3d5a3f] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? "Submitting..." : "Submit Request"}
              </button>

              <p className="mt-3 text-center text-xs text-gray-400">
                Your card won&apos;t be charged until we approve your request.
                We typically review within 24 hours.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
