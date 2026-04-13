"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { trackEvent } from "@/lib/analytics";

const CITIES = [
  "Venice",
  "Santa Monica",
  "West Hollywood",
  "Manhattan Beach",
  "Malibu",
  "Topanga",
  "Mar Vista",
  "Studio City",
  "Sherman Oaks",
  "Palm Springs",
  "Palm Desert",
  "La Quinta",
  "Rancho Mirage",
  "Cathedral City",
  "Yucca Valley",
];

const HEAR_ABOUT_OPTIONS = [
  "Airbnb search",
  "Google",
  "Referral",
  "Social media",
  "Other",
];

const STEPS = [
  {
    num: "01",
    title: "Tell us about your home",
    desc: "We evaluate your property for short-term, monthly, or hybrid rental potential.",
  },
  {
    num: "02",
    title: "We handle the setup",
    desc: "Professional photography, listing optimization, pricing strategy, permits and compliance.",
  },
  {
    num: "03",
    title: "Guests book, you earn",
    desc: "We manage bookings across Airbnb, VRBO, and our direct platform. You receive monthly disbursements.",
  },
  {
    num: "04",
    title: "Full-service management",
    desc: "Cleaning, maintenance, guest support, and 24/7 monitoring. Licensed CA brokerage.",
  },
];

const WHAT_WE_MANAGE = [
  { title: "Short-term rentals", desc: "1 to 29 nights" },
  { title: "Monthly furnished rentals", desc: "30+ days" },
  { title: "Hybrid strategies", desc: "Mix of both for maximum income" },
  { title: "Olympic and event rentals", desc: "LA 2028 and beyond" },
];

const VALUE_PROPS = [
  {
    title: "55+ properties managed",
    desc: "Growing portfolio across LA and Desert",
  },
  {
    title: "4.89 Airbnb rating",
    desc: "Superhost status, 3,000+ five-star reviews",
  },
  {
    title: "Licensed brokerage",
    desc: "CA DRE #02164159, fully compliant",
  },
  {
    title: "Local teams",
    desc: "Dedicated staff in LA and Palm Springs",
  },
  {
    title: "Transparent pricing",
    desc: "20% commission, no hidden fees",
  },
  {
    title: "Multi-channel distribution",
    desc: "Airbnb, VRBO, Booking.com, Google, and direct",
  },
];

export default function ListYourHomePage() {
  const [submitted, setSubmitted] = useState(false);
  const [submittedName, setSubmittedName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const form = e.currentTarget;
    const formData = new FormData(form);
    const body = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      propertyAddress: formData.get("propertyAddress") as string,
      city: formData.get("city") as string,
      message: formData.get("message") as string,
      source: formData.get("source") as string,
    };

    try {
      const res = await fetch("/api/leads/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        trackEvent("lead_submitted", { city: body.city, source: body.source });
        setSubmittedName(body.name.split(" ")[0] || body.name);
        setSubmitted(true);
      } else {
        const data = await res.json();
        setError(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">
        {/* Hero */}
        <section className="bg-[#FAFAF8] py-20">
          <div className="mx-auto max-w-3xl px-4 text-center">
            <h1 className="font-serif text-3xl font-normal text-[#1a1a1a] md:text-5xl">
              Partner with Open Air Homes
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-600 md:text-lg">
              Full-service rental management for furnished homes across Southern
              California. We handle everything, you earn income.
            </p>
          </div>
        </section>

        {/* How it works */}
        <section className="py-16">
          <div className="mx-auto max-w-5xl px-4">
            <h2 className="text-center font-serif text-2xl font-normal text-[#1a1a1a] md:text-3xl">
              How it works
            </h2>
            <div className="mt-12 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
              {STEPS.map((step) => (
                <div key={step.num}>
                  <span className="text-3xl font-bold text-[#4C6C4E]/30">
                    {step.num}
                  </span>
                  <h3 className="mt-2 font-serif text-lg font-normal text-[#1a1a1a]">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-500">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What we manage */}
        <section className="bg-[#FAFAF8] py-16">
          <div className="mx-auto max-w-5xl px-4">
            <h2 className="text-center font-serif text-2xl font-normal text-[#1a1a1a] md:text-3xl">
              What we manage
            </h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {WHAT_WE_MANAGE.map((item) => (
                <div
                  key={item.title}
                  className="rounded-xl border border-gray-100 bg-white p-6"
                >
                  <h3 className="font-serif text-base font-normal text-[#1a1a1a]">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Open Air Homes */}
        <section className="py-16">
          <div className="mx-auto max-w-5xl px-4">
            <h2 className="text-center font-serif text-2xl font-normal text-[#1a1a1a] md:text-3xl">
              Why Open Air Homes
            </h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {VALUE_PROPS.map((prop) => (
                <div key={prop.title} className="rounded-xl border border-gray-100 bg-white p-6">
                  <h3 className="font-sans text-sm font-semibold text-[#4C6C4E]">
                    {prop.title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">{prop.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Markets we serve */}
        <section className="bg-[#FAFAF8] py-16">
          <div className="mx-auto max-w-3xl px-4">
            <h2 className="text-center font-serif text-2xl font-normal text-[#1a1a1a] md:text-3xl">
              Markets we serve
            </h2>
            <div className="mt-10 grid gap-8 sm:grid-cols-2">
              <div>
                <h3 className="font-serif text-lg text-[#1a1a1a]">
                  Los Angeles
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">
                  Venice, Santa Monica, West Hollywood, Manhattan Beach, Malibu,
                  Topanga, Mar Vista, Studio City, Sherman Oaks
                </p>
              </div>
              <div>
                <h3 className="font-serif text-lg text-[#1a1a1a]">
                  Palm Springs Area
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">
                  Palm Springs, Palm Desert, La Quinta, Rancho Mirage, Cathedral
                  City, Yucca Valley
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Lead capture form */}
        <section className="py-16">
          <div className="mx-auto max-w-xl px-4">
            <h2 className="text-center font-serif text-2xl font-normal text-[#1a1a1a] md:text-3xl">
              Get a free evaluation
            </h2>
            <p className="mt-2 text-center text-sm text-gray-500">
              Tell us about your property and we will get back to you within 48
              hours.
            </p>

            {submitted ? (
              <div className="mt-10 rounded-xl border border-[#4C6C4E]/20 bg-[#4C6C4E]/5 p-8 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#4C6C4E]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="white"
                    className="h-6 w-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 12.75l6 6 9-13.5"
                    />
                  </svg>
                </div>
                <h3 className="mt-4 font-serif text-lg text-[#1a1a1a]">
                  Thanks, {submittedName}.
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  We will review your property and get back to you within 48
                  hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-10 space-y-4">
                <div>
                  <label
                    htmlFor="lead-name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="lead-name"
                    name="name"
                    type="text"
                    required
                    className="mt-1 w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#4C6C4E] focus:ring-1 focus:ring-[#4C6C4E]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="lead-email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="lead-email"
                    name="email"
                    type="email"
                    required
                    className="mt-1 w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#4C6C4E] focus:ring-1 focus:ring-[#4C6C4E]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="lead-phone"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="lead-phone"
                    name="phone"
                    type="tel"
                    required
                    className="mt-1 w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#4C6C4E] focus:ring-1 focus:ring-[#4C6C4E]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="lead-address"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Property address <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="lead-address"
                    name="propertyAddress"
                    type="text"
                    required
                    className="mt-1 w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#4C6C4E] focus:ring-1 focus:ring-[#4C6C4E]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="lead-city"
                    className="block text-sm font-medium text-gray-700"
                  >
                    City
                  </label>
                  <select
                    id="lead-city"
                    name="city"
                    className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#4C6C4E] focus:ring-1 focus:ring-[#4C6C4E]"
                  >
                    <option value="">Select a city</option>
                    {CITIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="lead-message"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Tell us about your property
                  </label>
                  <textarea
                    id="lead-message"
                    name="message"
                    rows={4}
                    className="mt-1 w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#4C6C4E] focus:ring-1 focus:ring-[#4C6C4E]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="lead-source"
                    className="block text-sm font-medium text-gray-700"
                  >
                    How did you hear about us?
                  </label>
                  <select
                    id="lead-source"
                    name="source"
                    className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#4C6C4E] focus:ring-1 focus:ring-[#4C6C4E]"
                  >
                    <option value="">Select an option</option>
                    {HEAR_ABOUT_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                {error && (
                  <p className="text-sm text-red-600">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-full bg-[#4C6C4E] py-3 text-sm font-medium text-white transition hover:bg-[#3d5a40] disabled:opacity-50"
                >
                  {submitting ? "Submitting..." : "Get a Free Evaluation"}
                </button>
              </form>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
