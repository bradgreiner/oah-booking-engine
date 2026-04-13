import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

export const metadata = {
  title: "About Open Air Homes",
  description:
    "Full-service rental management in Los Angeles and Palm Springs. Licensed CA brokerage, 55+ properties, Airbnb Superhost.",
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">
        <div className="mx-auto max-w-3xl px-4 py-12">
          <h1 className="font-serif text-3xl font-normal text-gray-900 md:text-4xl">
            About Open Air Homes
          </h1>

          <section className="mt-10">
            <h2 className="font-serif text-xl text-gray-900">Who we are</h2>
            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              Open Air Homes is a full-service property management company
              specializing in furnished short-term and monthly rentals across
              Southern California. Founded by Brad Greiner, we manage 55+
              properties in Los Angeles and the Palm Springs area. We are a
              licensed California brokerage (OpenAiRE Brokerage Inc, CA DRE
              #02164159).
            </p>
          </section>

          <section className="mt-10">
            <h2 className="font-serif text-xl text-gray-900">Our approach</h2>
            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              We believe in transparency, compliance, and long-term
              relationships. Every property in our portfolio is personally
              evaluated and managed by local teams. We do not cut corners on
              cleaning, maintenance, or guest communication.
            </p>
          </section>

          <section className="mt-10">
            <h2 className="font-serif text-xl text-gray-900">
              Where we operate
            </h2>
            <div className="mt-3 grid gap-6 sm:grid-cols-2">
              <div>
                <h3 className="text-sm font-semibold text-gray-900">
                  Los Angeles
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-gray-600">
                  Venice, Santa Monica, West Hollywood, Manhattan Beach, Malibu,
                  Topanga, Mar Vista, Studio City, Sherman Oaks
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900">
                  Palm Springs Area
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-gray-600">
                  Palm Springs, Palm Desert, La Quinta, Rancho Mirage, Cathedral
                  City, Yucca Valley
                </p>
              </div>
            </div>
          </section>

          <section className="mt-10">
            <h2 className="font-serif text-xl text-gray-900">Contact</h2>
            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              Email us at{" "}
              <a
                href="mailto:brad@openairhomes.com"
                className="text-[#4C6C4E] hover:underline"
              >
                brad@openairhomes.com
              </a>
              . Interested in having your property managed?{" "}
              <Link
                href="/list-your-home"
                className="text-[#4C6C4E] hover:underline"
              >
                List your home with us
              </Link>
              .
            </p>
          </section>
        </div>
      </main>
      <Footer showBadges={false} />
    </>
  );
}
