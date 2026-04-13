"use client";

import { useEffect, useState, useMemo } from "react";
import BookingRow from "@/components/BookingRow";

interface Booking {
  id: string;
  checkIn: string;
  checkOut: string;
  numGuests: number;
  numPets: number;
  nightlyTotal: number;
  cleaningFee: number;
  petFee: number;
  safelyFee: number;
  totAmount: number;
  oahFee: number;
  ccFee: number;
  grandTotal: number;
  status: string;
  tripDescription: string | null;
  petInfo: string | null;
  paymentMethod: string;
  source: string;
  stripePaymentId: string | null;
  createdAt: string;
  guest: { firstName: string; lastName: string; email: string; phone: string | null };
  property: { name: string; headline: string | null };
}

const tabs = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "approved", label: "Approved" },
  { key: "declined", label: "Declined" },
];

function nightCount(checkIn: string, checkOut: string) {
  return Math.ceil(
    (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)
  );
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchBookings();
  }, [activeTab]);

  // Fetch all bookings for stats on initial load
  useEffect(() => {
    fetch("/api/admin/bookings")
      .then((res) => res.ok ? res.json() : [])
      .then(setAllBookings)
      .catch(() => {});
  }, []);

  const stats = useMemo(() => {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const pending = allBookings.filter((b) => b.status === "pending").length;
    const approvedThisMonth = allBookings.filter(
      (b) => b.status === "approved" && new Date(b.createdAt) >= monthStart
    );
    const approvedCount = approvedThisMonth.length;
    const approvedRevenue = approvedThisMonth.reduce((sum, b) => sum + b.grandTotal, 0);
    return { pending, approvedCount, approvedRevenue };
  }, [allBookings]);

  async function fetchBookings() {
    setLoading(true);
    const params = new URLSearchParams();
    if (activeTab !== "all") params.set("status", activeTab);
    const res = await fetch(`/api/admin/bookings?${params}`);
    if (res.ok) {
      const data = await res.json();
      setBookings(data);
      if (activeTab === "all") setAllBookings(data);
    }
    setLoading(false);
  }

  async function handleApprove(id: string) {
    const booking = bookings.find((b) => b.id === id);
    if (!booking) return;
    const nights = nightCount(booking.checkIn, booking.checkOut);
    const guestName = `${booking.guest.firstName} ${booking.guest.lastName}`;
    let msg = `Approve booking for ${guestName}?\n\nThe guest's card will be charged $${booking.grandTotal.toLocaleString()}.`;
    if (booking.source === "hostaway") msg += "\nA confirmed reservation will be created in Hostaway.";
    if (nights >= 30) msg += "\nA CAR Rental Agreement will need to be sent separately.";
    if (booking.totAmount > 0 && nights < 30) msg += `\nTOT of $${booking.totAmount.toLocaleString()} was collected. Remember to remit to the city.`;
    if (!confirm(msg)) return;
    setActionLoading(id);
    const res = await fetch(`/api/admin/approve/${id}`, { method: "POST" });
    if (res.ok) await fetchBookings();
    else alert("Failed to approve booking");
    setActionLoading(null);
  }

  async function handleDecline(id: string) {
    if (!confirm("Decline this booking? The hold on the guest's card will be released.")) return;
    setActionLoading(id);
    const res = await fetch(`/api/admin/decline/${id}`, { method: "POST" });
    if (res.ok) await fetchBookings();
    else alert("Failed to decline booking");
    setActionLoading(null);
  }

  return (
    <div>
      <div>
        <h1 className="font-serif text-2xl font-bold text-gray-900">
          Bookings
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage guest booking requests
        </p>
      </div>

      {/* Stats bar */}
      <div className="mt-4 flex flex-wrap gap-4">
        <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5">
          <span className="h-2 w-2 rounded-full bg-amber-400" />
          <span className="text-sm text-gray-600">Pending:</span>
          <span className="text-sm font-semibold text-gray-900">{stats.pending}</span>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5">
          <span className="h-2 w-2 rounded-full bg-green-500" />
          <span className="text-sm text-gray-600">Approved this month:</span>
          <span className="text-sm font-semibold text-gray-900">{stats.approvedCount}</span>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5">
          <span className="h-2 w-2 rounded-full bg-green-500" />
          <span className="text-sm text-gray-600">Revenue this month:</span>
          <span className="text-sm font-semibold text-green-700">${stats.approvedRevenue.toLocaleString()}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-6 flex rounded-lg border border-gray-200 bg-white p-1 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`rounded-md px-3.5 py-1.5 text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? "bg-[#4C6C4E] text-white shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="mt-6 overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-sm text-gray-400">Loading bookings...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-sm font-medium text-gray-900">No bookings found</p>
            <p className="mt-1 text-sm text-gray-400">
              Booking requests will appear here when guests submit them.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/80">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Guest</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Property</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Dates</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">Nights</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">Total</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {bookings.map((booking) => (
                  <BookingRow
                    key={booking.id}
                    booking={booking}
                    onApprove={handleApprove}
                    onDecline={handleDecline}
                    actionLoading={actionLoading}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
