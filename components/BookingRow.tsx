"use client";

import { useState } from "react";

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
  stripePaymentId?: string | null;
  source: string;
  createdAt: string;
  guest: { firstName: string; lastName: string; email: string; phone: string | null };
  property: { name: string; headline: string | null };
}

interface BookingRowProps {
  booking: Booking;
  onApprove: (id: string) => void;
  onDecline: (id: string) => void;
  actionLoading: string | null;
}

function statusBadge(status: string) {
  switch (status) {
    case "pending":
      return "bg-amber-50 text-amber-700 ring-1 ring-amber-600/20";
    case "approved":
      return "bg-green-50 text-green-700 ring-1 ring-green-600/20";
    case "declined":
      return "bg-red-50 text-red-700 ring-1 ring-red-600/10";
    default:
      return "bg-gray-50 text-gray-600 ring-1 ring-gray-500/10";
  }
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function nightCount(checkIn: string, checkOut: string) {
  return Math.ceil(
    (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)
  );
}

function relativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function BookingRow({ booking, onApprove, onDecline, actionLoading }: BookingRowProps) {
  const [expanded, setExpanded] = useState(false);
  const nights = nightCount(booking.checkIn, booking.checkOut);
  const isMonthly = nights >= 30;

  return (
    <>
      <tr
        onClick={() => setExpanded(!expanded)}
        className="cursor-pointer transition-colors hover:bg-gray-50"
      >
        <td className="px-4 py-3 text-sm text-gray-500">
          <div>{new Date(booking.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</div>
          <div className="text-xs text-gray-400">{relativeTime(booking.createdAt)}</div>
        </td>
        <td className="px-4 py-3 text-sm font-medium text-gray-900">
          {booking.guest.firstName} {booking.guest.lastName}
        </td>
        <td className="px-4 py-3 text-sm text-gray-500">
          <div className="flex items-center gap-1.5">
            <span>{booking.property.headline || booking.property.name}</span>
            {booking.source === "hostaway" && (
              <span className="inline-flex rounded-full bg-blue-50 px-1.5 py-0.5 text-[10px] font-medium text-blue-600 ring-1 ring-blue-500/20">
                HW
              </span>
            )}
          </div>
          <div className="mt-0.5 flex items-center gap-1.5">
            {isMonthly ? (
              <span className="inline-flex rounded-full bg-[#4C6C4E] px-1.5 py-0.5 text-[10px] font-medium text-white">
                Monthly
              </span>
            ) : (
              <span className="inline-flex rounded-full border border-[#4C6C4E] px-1.5 py-0.5 text-[10px] font-medium text-[#4C6C4E]">
                STR
              </span>
            )}
            <span className="text-xs text-gray-400">
              {booking.paymentMethod === "card" ? "Card" : "ACH"}
            </span>
          </div>
        </td>
        <td className="px-4 py-3 text-sm text-gray-500">
          {formatDate(booking.checkIn)} – {formatDate(booking.checkOut)}
        </td>
        <td className="px-4 py-3 text-center text-sm text-gray-500">{nights}</td>
        <td className="px-4 py-3 text-right text-sm font-medium text-gray-900">
          ${booking.grandTotal.toLocaleString()}
        </td>
        <td className="px-4 py-3">
          <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium capitalize ${statusBadge(booking.status)}`}>
            {booking.status}
          </span>
        </td>
        <td className="px-4 py-3 text-right">
          {booking.status === "pending" && (
            <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => onApprove(booking.id)}
                disabled={actionLoading === booking.id}
                className="rounded-md bg-[#4C6C4E] px-3 py-1 text-xs font-medium text-white hover:bg-[#3d5a3f] disabled:opacity-50"
              >
                Approve
              </button>
              <button
                onClick={() => onDecline(booking.id)}
                disabled={actionLoading === booking.id}
                className="rounded-md border border-red-200 px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
              >
                Decline
              </button>
            </div>
          )}
        </td>
      </tr>
      {expanded && (
        <tr>
          <td colSpan={8} className="border-b border-gray-100 bg-gray-50/50 px-4 py-4">
            <div className="grid gap-4 text-sm sm:grid-cols-3">
              <div>
                <p className="font-medium text-gray-700">Guest Details</p>
                <p className="mt-1 text-gray-500">Email: {booking.guest.email}</p>
                <p className="text-gray-500">Phone: {booking.guest.phone || "N/A"}</p>
                <p className="text-gray-500">Guests: {booking.numGuests} · Pets: {booking.numPets}</p>
                <p className="text-gray-500">Payment: {booking.paymentMethod === "card" ? "Credit Card" : "ACH"}</p>
                <p className="text-gray-500">Source: {booking.source === "hostaway" ? "Hostaway" : "Local"}</p>
                {booking.stripePaymentId && (
                  <p className="mt-1">
                    <a
                      href={`https://dashboard.stripe.com/payments/${booking.stripePaymentId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-xs text-blue-600 hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {booking.stripePaymentId.slice(0, 12)}...
                    </a>
                  </p>
                )}
              </div>
              <div>
                <p className="font-medium text-gray-700">Price Breakdown</p>
                <p className="mt-1 text-gray-500">Nightly: ${booking.nightlyTotal.toLocaleString()}</p>
                <p className="text-gray-500">Cleaning: ${booking.cleaningFee.toLocaleString()}</p>
                <p className="text-gray-500">OAH fee: ${booking.oahFee.toLocaleString()}</p>
                {isMonthly ? (
                  <p className="font-medium text-[#4C6C4E]">TOT: Exempt (30+ nights)</p>
                ) : (
                  <p className="text-gray-500">TOT: ${booking.totAmount.toLocaleString()}</p>
                )}
                <p className="text-gray-500">Safely: ${booking.safelyFee.toLocaleString()}</p>
                <p className="text-gray-500">CC fee: ${booking.ccFee.toLocaleString()}</p>
                <p className="mt-1 font-semibold text-gray-900">Total: ${booking.grandTotal.toLocaleString()}</p>
              </div>
              <div>
                {booking.tripDescription && (
                  <div>
                    <p className="font-medium text-gray-700">Trip Description</p>
                    <p className="mt-1 text-gray-500">{booking.tripDescription}</p>
                  </div>
                )}
                {booking.petInfo && (
                  <div className="mt-3">
                    <p className="font-medium text-gray-700">Pet Info</p>
                    <p className="mt-1 text-gray-500">{booking.petInfo}</p>
                  </div>
                )}
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
