import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ConfirmationTimeline from "@/components/ConfirmationTimeline";
import ShareButton from "@/components/ShareButton";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

interface Props {
  params: { requestId: string };
}

export default async function ConfirmationPage({ params }: Props) {
  const booking = await prisma.bookingRequest.findUnique({
    where: { id: params.requestId },
    include: { property: true },
  });

  if (!booking) notFound();

  const checkIn = booking.checkIn.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const checkOut = booking.checkOut.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const numNights = Math.ceil(
    (booking.checkOut.getTime() - booking.checkIn.getTime()) /
      (1000 * 60 * 60 * 24)
  );

  return (
    <>
      <Navbar />
      <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
        <div className="w-full max-w-lg text-center">
          {/* Green checkmark */}
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#4C6C4E]/10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-8 w-8 text-[#4C6C4E]"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12.75l6 6 9-13.5"
              />
            </svg>
          </div>

          <h1 className="mt-6 font-serif text-3xl text-gray-900">
            Request received!
          </h1>

          {/* Booking summary card */}
          <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 text-left shadow-sm">
            <h2 className="font-serif text-lg text-gray-900">
              {booking.property.headline || booking.property.name}
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              {checkIn} &rarr; {checkOut}
            </p>
            <p className="text-sm text-gray-500">
              {numNights} nights &middot; {booking.numGuests} guests
            </p>
            <div className="mt-3 border-t border-gray-100 pt-3">
              <p className="text-lg font-semibold text-[#1a1a1a]">
                ${booking.grandTotal.toLocaleString()} held
              </p>
              <p className="mt-1 text-xs text-gray-400">
                A hold has been placed but you have not been charged
              </p>
            </div>
            {numNights >= 30 && (
              <p className="mt-2 text-xs text-[#4C6C4E]">
                A CAR rental agreement will be sent for your signature after approval.
              </p>
            )}
          </div>

          {/* Timeline */}
          <div className="mt-8 text-left">
            <h3 className="text-sm font-semibold text-[#1a1a1a]">
              What happens next
            </h3>
            <ConfirmationTimeline numNights={numNights} />
          </div>

          <div className="mt-8 flex items-center justify-center gap-3">
            <Link
              href="/search"
              className="inline-block rounded-full border border-[#4C6C4E] px-6 py-2.5 text-sm font-semibold text-[#4C6C4E] transition hover:bg-[#4C6C4E] hover:text-white"
            >
              Back to browse
            </Link>
            <ShareButton title={`My stay at ${booking.property.headline || booking.property.name}`} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
