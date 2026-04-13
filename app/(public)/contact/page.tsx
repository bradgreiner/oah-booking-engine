"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const SUBJECTS = [
  "General inquiry",
  "Booking question",
  "Property listing",
  "Maintenance request",
  "Other",
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const form = e.currentTarget;
    const fd = new FormData(form);
    const body = {
      name: fd.get("name") as string,
      email: fd.get("email") as string,
      subject: fd.get("subject") as string,
      message: fd.get("message") as string,
    };

    if ((body.message || "").trim().length < 20) {
      setError("Please write at least 20 characters in your message.");
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/contact/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
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
        <section className="bg-[#FAFAF8] py-16">
          <div className="mx-auto max-w-3xl px-4 text-center">
            <h1 className="font-serif text-3xl font-normal text-[#1a1a1a] md:text-5xl">
              Get in touch
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-600 md:text-lg">
              Have a question about a property, your booking, or listing your home? We&apos;re here to help.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="mx-auto max-w-5xl px-4">
            <div className="grid gap-12 md:grid-cols-2">
              {/* Left: Form */}
              <div>
                {submitted ? (
                  <div className="rounded-xl border border-[#4C6C4E]/20 bg-[#4C6C4E]/5 p-8 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#4C6C4E]">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="white" className="h-6 w-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </div>
                    <h3 className="mt-4 font-serif text-lg text-[#1a1a1a]">
                      Message sent!
                    </h3>
                    <p className="mt-2 text-sm text-gray-500">
                      We&apos;ll get back to you within 24 hours.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="contact-name" className="block text-sm font-medium text-gray-700">
                        Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="contact-name"
                        name="name"
                        type="text"
                        required
                        className="mt-1 w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#4C6C4E] focus:ring-1 focus:ring-[#4C6C4E]"
                      />
                    </div>

                    <div>
                      <label htmlFor="contact-email" className="block text-sm font-medium text-gray-700">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="contact-email"
                        name="email"
                        type="email"
                        required
                        className="mt-1 w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#4C6C4E] focus:ring-1 focus:ring-[#4C6C4E]"
                      />
                    </div>

                    <div>
                      <label htmlFor="contact-subject" className="block text-sm font-medium text-gray-700">
                        Subject <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="contact-subject"
                        name="subject"
                        required
                        className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#4C6C4E] focus:ring-1 focus:ring-[#4C6C4E]"
                      >
                        <option value="">Select a topic</option>
                        {SUBJECTS.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="contact-message" className="block text-sm font-medium text-gray-700">
                        Message <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="contact-message"
                        name="message"
                        rows={5}
                        required
                        minLength={20}
                        className="mt-1 w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#4C6C4E] focus:ring-1 focus:ring-[#4C6C4E]"
                        placeholder="Tell us how we can help..."
                      />
                    </div>

                    {error && <p className="text-sm text-red-600">{error}</p>}

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full rounded-full bg-[#4C6C4E] py-3 text-sm font-medium text-white transition hover:bg-[#3d5a40] disabled:opacity-50"
                    >
                      {submitting ? "Sending..." : "Send Message"}
                    </button>
                  </form>
                )}
              </div>

              {/* Right: Contact info */}
              <div className="space-y-6">
                <div>
                  <h3 className="font-serif text-lg text-[#1a1a1a]">Email</h3>
                  <a
                    href="mailto:reservations@openairhomes.com"
                    className="mt-1 block text-sm text-[#4C6C4E] hover:underline"
                  >
                    reservations@openairhomes.com
                  </a>
                </div>

                <div>
                  <h3 className="font-serif text-lg text-[#1a1a1a]">Office hours</h3>
                  <p className="mt-1 text-sm text-gray-600">
                    Mon–Fri 9am–6pm PT, weekends by appointment
                  </p>
                </div>

                <div className="rounded-xl border border-gray-100 bg-[#FAFAF8] p-5 space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold text-[#1a1a1a]">For property owners</h4>
                    <p className="mt-1 text-sm text-gray-500">
                      Interested in listing your home?
                    </p>
                    <Link
                      href="/list-your-home"
                      className="mt-2 inline-block text-sm font-medium text-[#4C6C4E] hover:underline"
                    >
                      Get a free evaluation →
                    </Link>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-[#1a1a1a]">For existing bookings</h4>
                    <p className="mt-1 text-sm text-gray-500">
                      Check your booking status and details.
                    </p>
                    <Link
                      href="/account"
                      className="mt-2 inline-block text-sm font-medium text-[#4C6C4E] hover:underline"
                    >
                      View my bookings →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
