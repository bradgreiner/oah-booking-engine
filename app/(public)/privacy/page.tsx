{/* NOTE: This privacy policy is a placeholder. It should be reviewed by legal counsel before going live. */}
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Privacy Policy",
  description:
    "Privacy policy for Open Air Homes. How we collect, use, and protect your personal information.",
};

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">
        <div className="mx-auto max-w-3xl px-4 py-12">
          <h1 className="font-serif text-3xl font-normal text-gray-900 md:text-4xl">
            Privacy Policy
          </h1>
          <p className="mt-2 text-sm text-gray-500">Last updated: April 2026</p>

          <section className="mt-10">
            <h2 className="font-serif text-xl text-gray-900">
              Information We Collect
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              When you use Open Air Homes, we may collect the following personal
              information: your name, email address, phone number, and payment
              information (processed securely through Stripe). We also collect
              booking details such as check-in and check-out dates, number of
              guests, and special requests.
            </p>
          </section>

          <section className="mt-10">
            <h2 className="font-serif text-xl text-gray-900">
              How We Use Your Information
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              We use your personal information to process booking requests,
              communicate about your stay (confirmations, check-in instructions,
              receipts), and send booking recovery emails if you start but do not
              complete a reservation. We may also use your email to notify you of
              relevant updates about your booking or our service.
            </p>
          </section>

          <section className="mt-10">
            <h2 className="font-serif text-xl text-gray-900">
              Third-Party Services
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              We use the following third-party services to operate our platform:
            </p>
            <ul className="mt-2 list-disc pl-5 text-sm leading-relaxed text-gray-600">
              <li>
                <strong>Stripe</strong> for payment processing. Stripe handles
                your payment data securely and is PCI-DSS compliant.
              </li>
              <li>
                <strong>Resend</strong> for transactional email delivery
                (booking confirmations, notifications).
              </li>
              <li>
                <strong>Google Analytics</strong> (via Google Tag Manager) for
                understanding how visitors use our site.
              </li>
            </ul>
          </section>

          <section className="mt-10">
            <h2 className="font-serif text-xl text-gray-900">
              Cookies and Tracking
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              We use Google Tag Manager for analytics purposes. We do not run
              advertising tracking pixels or sell your data to advertisers. GTM
              may set cookies to understand traffic patterns and improve user
              experience.
            </p>
          </section>

          <section className="mt-10">
            <h2 className="font-serif text-xl text-gray-900">
              Data Retention
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              We retain your booking data and contact information for the
              duration of your relationship with us and for a reasonable period
              afterward for record-keeping and legal compliance. Payment details
              are stored by Stripe, not on our servers.
            </p>
          </section>

          <section className="mt-10">
            <h2 className="font-serif text-xl text-gray-900">Your Rights</h2>
            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              You may request deletion of your personal data by contacting us at
              brad@openairhomes.com. You can unsubscribe from booking recovery
              emails at any time using the unsubscribe link in those emails. If
              you are a California resident, you have additional rights under the
              California Consumer Privacy Act (CCPA).
            </p>
          </section>

          <section className="mt-10 border-t border-gray-200 pt-6">
            <p className="text-sm text-gray-500">
              For privacy-related questions, contact{" "}
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
