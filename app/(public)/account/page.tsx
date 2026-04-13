"use client";

import { useSession, signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Booking {
  id: string;
  propertyName: string;
  checkIn: string;
  checkOut: string;
  status: string;
  grandTotal: number;
  createdAt: string;
}

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-yellow-50 text-yellow-700",
  approved: "bg-green-50 text-green-700",
  declined: "bg-red-50 text-red-700",
};

export default function AccountPage() {
  const { data: session, status: authStatus } = useSession();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!session?.user?.email) return;

    async function fetchBookings() {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/guest/bookings?email=${encodeURIComponent(session!.user!.email!)}`
        );
        if (res.ok) {
          const data = await res.json();
          setBookings(data);
        }
      } catch {
        // Silently handle
      } finally {
        setLoading(false);
      }
    }

    fetchBookings();
  }, [session]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#FAFAF8]">
        <div className="mx-auto max-w-3xl px-4 py-12">
          <h1 className="font-serif text-2xl font-normal text-gray-900 md:text-3xl">
            My Bookings
          </h1>

          {authStatus === "loading" ? (
            <div className="mt-8">
              <div className="h-6 w-48 animate-pulse rounded bg-gray-200" />
              <div className="mt-4 h-32 animate-pulse rounded-xl bg-gray-200" />
            </div>
          ) : !session ? (
            <div className="mt-8 rounded-xl border border-gray-200 bg-white p-10 text-center">
              <h2 className="font-serif text-lg text-gray-900">
                Sign in to view your bookings
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                Use Google sign-in to access your booking history.
              </p>
              <button
                onClick={() => signIn("google")}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#4C6C4E] px-6 py-2.5 text-sm font-medium text-white transition hover:bg-[#3d5a40]"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Sign in with Google
              </button>
            </div>
          ) : (
            <>
              <p className="mt-2 text-sm text-gray-500">
                Signed in as {session.user?.email}
              </p>

              {loading ? (
                <div className="mt-6 space-y-4">
                  {[1, 2].map((i) => (
                    <div
                      key={i}
                      className="h-24 animate-pulse rounded-xl bg-gray-200"
                    />
                  ))}
                </div>
              ) : bookings.length > 0 ? (
                <div className="mt-6 space-y-4">
                  {bookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="rounded-xl border border-gray-200 bg-white p-5"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-serif text-base text-gray-900">
                            {booking.propertyName}
                          </h3>
                          <p className="mt-1 text-sm text-gray-500">
                            {new Date(booking.checkIn).toLocaleDateString(
                              "en-US",
                              { month: "short", day: "numeric", year: "numeric" }
                            )}{" "}
                            to{" "}
                            {new Date(booking.checkOut).toLocaleDateString(
                              "en-US",
                              { month: "short", day: "numeric", year: "numeric" }
                            )}
                          </p>
                          <p className="mt-1 text-xs text-gray-500">
                            Submitted{" "}
                            {new Date(booking.createdAt).toLocaleDateString(
                              "en-US",
                              { month: "short", day: "numeric", year: "numeric" }
                            )}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span
                            className={`rounded-full px-3 py-0.5 text-xs font-medium capitalize ${
                              STATUS_STYLES[booking.status] ||
                              "bg-gray-50 text-gray-700"
                            }`}
                          >
                            {booking.status}
                          </span>
                          <span className="text-sm font-semibold text-gray-900">
                            ${booking.grandTotal.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-8 rounded-xl border border-gray-200 bg-white p-10 text-center">
                  <p className="text-sm text-gray-500">No bookings yet.</p>
                  <Link
                    href="/search"
                    className="mt-4 inline-block rounded-full bg-[#4C6C4E] px-6 py-2.5 text-sm font-medium text-white transition hover:bg-[#3d5a40]"
                  >
                    Browse homes
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer showBadges={false} />
    </>
  );
}
