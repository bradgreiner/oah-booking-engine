{/* NOTE: These terms are a placeholder. They should be reviewed by legal counsel before going live. */}
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Terms of Service",
  description:
    "Terms of service for booking furnished rentals through Open Air Homes.",
};

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">
        <div className="mx-auto max-w-3xl px-4 py-12">
          <h1 className="font-serif text-3xl font-normal text-gray-900 md:text-4xl">
            Terms of Service
          </h1>
          <p className="mt-2 text-sm text-gray-500">Last updated: April 2026</p>

          <section className="mt-10">
            <h2 className="font-serif text-xl text-gray-900">
              Acceptance of Terms
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              By accessing or using the Open Air Homes booking platform
              (&quot;Service&quot;), you agree to be bound by these Terms of
              Service. If you do not agree to these terms, please do not use the
              Service.
            </p>
          </section>

          <section className="mt-10">
            <h2 className="font-serif text-xl text-gray-900">
              Booking Process
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              All bookings on Open Air Homes are request-to-book, not instant
              book. When you submit a booking request, a hold is placed on your
              payment method. Our team reviews each request and will approve or
              decline it, typically within 24 hours. Your payment is only
              captured upon approval. If your request is declined, the hold is
              released.
            </p>
          </section>

          <section className="mt-10">
            <h2 className="font-serif text-xl text-gray-900">Payment Terms</h2>
            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              Payments are processed through Stripe. When you submit a booking
              request, an authorization hold is placed on your card or bank
              account for the full amount. The charge is captured only when your
              booking is approved. All prices are displayed in US dollars.
            </p>
          </section>

          <section className="mt-10">
            <h2 className="font-serif text-xl text-gray-900">
              Cancellation Policy
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              Cancellations made more than 7 days before check-in are eligible
              for a 50% refund. Cancellations made within 7 days of check-in are
              not eligible for a refund. All cancellation requests must be sent
              to brad@openairhomes.com.
            </p>
          </section>

          <section className="mt-10">
            <h2 className="font-serif text-xl text-gray-900">
              Guest Responsibilities
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              Guests are responsible for leaving the property in the condition it
              was found. Guests must comply with all property-specific house
              rules, including quiet hours, parking guidelines, and occupancy
              limits. Only registered guests are permitted on the property.
            </p>
          </section>

          <section className="mt-10">
            <h2 className="font-serif text-xl text-gray-900">Property Rules</h2>
            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              Each property has specific rules provided at the time of booking.
              Common rules include no smoking, no unauthorized events or parties,
              and adherence to local noise ordinances. Violations may result in
              early termination of your stay without refund.
            </p>
          </section>

          <section className="mt-10">
            <h2 className="font-serif text-xl text-gray-900">
              Liability Limitations
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              Open Air Homes provides rental management services and acts as an
              intermediary between property owners and guests. We are not liable
              for injury, loss, or damage to personal property during your stay.
              Guests are encouraged to obtain travel insurance for stays of any
              length.
            </p>
          </section>

          <section className="mt-10">
            <h2 className="font-serif text-xl text-gray-900">Monthly Stays</h2>
            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              For stays of 30 nights or longer, guests are required to sign a
              California Association of Realtors (CAR) residential lease
              agreement. This agreement will be provided after your booking
              request is approved. Monthly tenants have additional rights under
              California law.
            </p>
          </section>

          <section className="mt-10">
            <h2 className="font-serif text-xl text-gray-900">Governing Law</h2>
            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              These terms are governed by the laws of the State of California.
              Any disputes arising from the use of this Service will be resolved
              in the courts of Los Angeles County, California.
            </p>
          </section>

          <section className="mt-10 border-t border-gray-200 pt-6">
            <p className="text-sm text-gray-500">
              For questions about these terms, contact{" "}
              <a
                href="mailto:brad@openairhomes.com"
                className="text-[#4C6C4E] hover:underline"
              >
                brad@openairhomes.com
              </a>
              .
            </p>
          </section>
        </div>
      </main>
      <Footer showBadges={false} />
    </>
  );
}
