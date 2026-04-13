"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookingSummary from "@/components/BookingSummary";
import GuestInfoForm from "@/components/GuestInfoForm";
import GuestAuthPrompt from "@/components/GuestAuthPrompt";
import StripePayment from "@/components/StripePayment";

interface Property {
  id: string;
  name: string;
  headline: string | null;
  city: string | null;
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
  stayingMyself: boolean;
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
  stayingMyself: true,
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
  const [piError, setPiError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"card" | "ach">("card");
  const stripeSubmitRef = useRef<(() => void) | null>(null);
  const [bookingSessionId, setBookingSessionId] = useState(
    searchParams.get("sessionId") || ""
  );

  // Helper to update the booking session (fire-and-forget)
  function updateBookingSession(data: Record<string, string>) {
    const payload: Record<string, string> = { ...data };
    if (bookingSessionId) payload.sessionId = bookingSessionId;
    else payload.listingId = propertyId;

    fetch("/api/booking/update-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => res.ok ? res.json() : null)
      .then((json) => {
        if (json?.sessionId && !bookingSessionId) {
          setBookingSessionId(json.sessionId);
        }
      })
      .catch(() => {});
  }

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
        if (piData.clientSecret) {
          setClientSecret(piData.clientSecret);
        } else {
          setPiError(piData.error || "Unable to initialize payment");
        }
      } else {
        const errData = await piRes.json().catch(() => ({ error: "Payment service unavailable" }));
        setPiError(errData.error);
      }
      setFeesLoading(false);
    }
    load();

    // Track that user reached the request form
    updateBookingSession({ stepReached: "request_form", checkIn, checkOut });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propertyId, checkIn, checkOut]);

  const numNights = fees?.numNights || 0;
  const isLongStay = numNights >= 90;
  const ccSavings = fees?.ccFee ?? 0;

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!formData.firstName.trim()) errs.firstName = "Required";
    if (!formData.lastName.trim()) errs.lastName = "Required";
    if (!formData.email.trim() || !formData.email.includes("@")) errs.email = "Valid email required";
    if (formData.tripDescription.trim().length < 20)
      errs.tripDescription = "Please write at least 20 characters";
    if (!formData.houseRulesAck) errs.houseRulesAck = "You must acknowledge the house rules";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;
    setPaymentError("");
    if (isLongStay || paymentMethod === "ach") {
      setSubmitting(true);
      await submitRequest("");
    } else {
      if (stripeSubmitRef.current) stripeSubmitRef.current();
    }
  }

  async function submitRequest(paymentIntentId: string) {
    try {
      const res = await fetch("/api/booking/submit-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyId, checkIn, checkOut,
          numGuests: formData.numGuests,
          numPets: formData.hasPets ? 1 : 0,
          firstName: formData.firstName, lastName: formData.lastName,
          email: formData.email, phone: formData.phone,
          tripDescription: formData.tripDescription,
          petInfo: formData.hasPets ? formData.petInfo : undefined,
          houseRulesAck: formData.houseRulesAck,
          stripePaymentIntentId: paymentIntentId,
        }),
      });
      if (res.ok) {
        const booking = await res.json();
        updateBookingSession({ stepReached: "completed" });
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

  if (property && property.baseRate <= 0) {
    return (
      <>
        <Navbar />
        <main className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <h1 className="font-serif text-2xl text-gray-900">Pricing unavailable</h1>
            <p className="mt-2 text-sm text-gray-500">This property doesn&apos;t have pricing configured yet. Contact us directly.</p>
            <a href="mailto:brad@openairhomes.com" className="mt-4 inline-block text-[#4C6C4E] hover:underline">brad@openairhomes.com</a>
          </div>
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
          {/* Back link */}
          <Link href={`/${propertyId}`} className="mb-4 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
            Back to listing
          </Link>

          {/* Progress bar */}
          <div className="flex items-center gap-2 text-sm">
            <div className="flex flex-col items-center gap-1">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#4C6C4E] text-xs font-semibold text-white">1</span>
              <span className="text-xs font-medium text-[#4C6C4E]">Details</span>
            </div>
            <div className="mb-4 h-px w-8 bg-gray-300" />
            <div className="flex flex-col items-center gap-1">
              <span className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-gray-300 text-xs font-semibold text-gray-500">2</span>
              <span className="text-xs text-gray-500">Review</span>
            </div>
            <div className="mb-4 h-px w-8 bg-gray-300" />
            <div className="flex flex-col items-center gap-1">
              <span className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-gray-300 text-xs font-semibold text-gray-500">3</span>
              <span className="text-xs text-gray-500">Confirm</span>
            </div>
          </div>

          {/* Trust banner */}
          <div className="mt-4 rounded-lg border border-[#4C6C4E]/10 bg-[#4C6C4E]/5 px-4 py-3 text-xs text-gray-600">
            Professionally managed by Open Air Homes &middot; Dedicated support &middot; Seamless check-in &middot; Full maintenance coverage
          </div>

          <h1 className="mt-4 font-serif text-2xl font-bold text-[#1a1a1a]">
            Request to Book
          </h1>

          <div className="mt-6 flex flex-col gap-8 lg:flex-row">
            {/* Left: Form */}
            <div className="order-2 flex-1 lg:order-1">
              {/* Auth prompt */}
              <GuestAuthPrompt
                onAutoFill={({ firstName, lastName, email }) => {
                  setFormData((prev) => ({
                    ...prev,
                    firstName: prev.firstName || firstName,
                    lastName: prev.lastName || lastName,
                    email: prev.email || email,
                  }));
                }}
              />

              {/* Who's staying */}
              <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="text-sm font-semibold text-gray-700">Who&apos;s staying?</h2>
                <div className="mt-3 flex gap-3">
                  <button type="button" onClick={() => setFormData({ ...formData, stayingMyself: true })}
                    className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${formData.stayingMyself ? "border-[#4C6C4E] bg-[#4C6C4E]/10 text-[#4C6C4E]" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}>
                    I&apos;ll be staying
                  </button>
                  <button type="button" onClick={() => setFormData({ ...formData, stayingMyself: false })}
                    className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${!formData.stayingMyself ? "border-[#4C6C4E] bg-[#4C6C4E]/10 text-[#4C6C4E]" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}>
                    Booking for someone else
                  </button>
                </div>
              </div>

              {/* Guest info */}
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-[#1a1a1a]">Guest Information</h2>
                <div className="mt-4">
                  <GuestInfoForm
                    data={formData}
                    onChange={setFormData}
                    maxGuests={property?.maxGuests || 10}
                    errors={errors}
                    onEmailBlur={(email) => updateBookingSession({ guestEmail: email })}
                  />
                </div>
              </div>

              {/* Payment section */}
              <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="mb-3 text-base font-semibold text-[#1a1a1a]">Select payment method</h2>

                {isLongStay ? (
                  <div className="mt-4 rounded-lg bg-blue-50 p-4 text-sm text-blue-800">
                    <p className="font-medium">ACH Bank Transfer Required</p>
                    <p className="mt-1 text-blue-600">For stays of 90+ nights, we require ACH bank transfer. We&apos;ll send setup instructions after approval.</p>
                  </div>
                ) : (
                  <div className="mt-4 space-y-3">
                    {/* ACH option */}
                    <label className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${paymentMethod === "ach" ? "border-[#4C6C4E] bg-[#4C6C4E]/5" : "border-gray-200 hover:border-gray-300"}`}>
                      <input type="radio" name="payment" checked={paymentMethod === "ach"} onChange={() => setPaymentMethod("ach")} className="mt-0.5 h-4 w-4 text-[#4C6C4E] focus:ring-[#4C6C4E]" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">Instant bank transfer</p>
                        <p className="text-xs text-gray-500">No processing fee {ccSavings > 0 && <>&mdash; Save ${ccSavings.toLocaleString()} vs card</>}</p>
                        {fees && <p className="mt-1 text-sm font-semibold text-[#4C6C4E]">${(fees.grandTotal - fees.ccFee).toLocaleString()}</p>}
                      </div>
                    </label>

                    {/* Card option */}
                    <label className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${paymentMethod === "card" ? "border-[#4C6C4E] bg-[#4C6C4E]/5" : "border-gray-200 hover:border-gray-300"}`}>
                      <input type="radio" name="payment" checked={paymentMethod === "card"} onChange={() => setPaymentMethod("card")} className="mt-0.5 h-4 w-4 text-[#4C6C4E] focus:ring-[#4C6C4E]" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">Credit or debit card</p>
                        <p className="text-xs text-gray-500">Including 3% card processing fee &middot; Visa MC Disc Amex</p>
                        {fees && <p className="mt-1 text-sm font-semibold text-gray-800">${fees.grandTotal.toLocaleString()}</p>}
                      </div>
                    </label>

                    {paymentMethod === "card" && clientSecret && (
                      <div className="mt-3 rounded-lg border border-gray-100 bg-gray-50 p-4">
                        <StripePayment
                          clientSecret={clientSecret}
                          onSuccess={(piId) => submitRequest(piId)}
                          onError={(msg) => { setPaymentError(msg); setSubmitting(false); }}
                          submitting={submitting}
                          setSubmitting={setSubmitting}
                          submitRef={stripeSubmitRef}
                        />
                      </div>
                    )}
                  </div>
                )}

                {piError && (
                  <div className="mt-3 rounded-lg bg-red-50 p-4 text-sm text-red-700">
                    <p className="font-medium">Payment setup failed</p>
                    <p className="mt-1">{piError}</p>
                    <p className="mt-2 text-xs text-red-500">Please try refreshing the page. If the problem persists, contact us at brad@openairhomes.com</p>
                  </div>
                )}
                {paymentError && <p className="mt-3 text-sm text-red-600">{paymentError}</p>}
              </div>

              {/* Submit */}
              <button onClick={handleSubmit} disabled={submitting}
                className="mt-6 w-full rounded-full bg-[#4C6C4E] py-3.5 text-base font-semibold text-white transition-colors hover:bg-[#3d5a40] disabled:cursor-not-allowed disabled:opacity-50">
                {submitting ? "Submitting..." : "Request to Book"}
              </button>
              <p className="mt-3 text-center text-xs text-gray-500">
                Secure checkout powered by Stripe &middot; You won&apos;t be charged until we approve your request &middot; We typically review within 24 hours &middot; By submitting, you agree to our Rental Terms &amp; Conditions
              </p>
            </div>

            {/* Right: Sidebar — shown first on mobile so guest sees summary */}
            <div className="order-1 w-full lg:order-2 lg:w-[340px] lg:shrink-0">
              <div className="sticky top-6">
                <BookingSummary
                  propertyName={property?.headline || property?.name || "Loading..."}
                  propertyImage={property?.images?.[0]?.url}
                  propertyCity={property?.city}
                  checkIn={checkIn}
                  checkOut={checkOut}
                  baseRate={property?.baseRate || 0}
                  totRate={property?.totRate || 0.12}
                  guests={formData.numGuests}
                  fees={fees}
                  loading={feesLoading}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
