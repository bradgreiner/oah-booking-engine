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

export default function BookingRow({ booking, onApprove, onDecline, actionLoading }: BookingRowProps) {
  const [expanded, setExpanded] = useState(false);
  const nights = nightCount(booking.checkIn, booking.checkOut);

  return (
    <>
      <tr
        onClick={() => setExpanded(!expanded)}
        className="cursor-pointer transition-colors hover:bg-gray-50"
      >
        <td className="px-4 py-3 text-sm text-gray-500">
          {new Date(booking.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
        </td>
        <td className="px-4 py-3 text-sm font-medium text-gray-900">
          {booking.guest.firstName} {booking.guest.lastName}
        </td>
        <td className="px-4 py-3 text-sm text-gray-500">
          <span>{booking.property.headline || booking.property.name}</span>
          {booking.source === "hostaway" && (
            <span className="ml-1.5 inline-flex rounded-full bg-blue-50 px-1.5 py-0.5 text-[10px] font-medium text-blue-600 ring-1 ring-blue-500/20">
              HW
            </span>
          )}
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
            <div className="grid gap-4 text-sm sm:grid-cols-2">
              <div>
                <p className="font-medium text-gray-700">Guest Details</p>
                <p className="mt-1 text-gray-500">Email: {booking.guest.email}</p>
                <p className="text-gray-500">Phone: {booking.guest.phone || "N/A"}</p>
                <p className="text-gray-500">Guests: {booking.numGuests} · Pets: {booking.numPets}</p>
                <p className="text-gray-500">Payment: {booking.paymentMethod === "card" ? "Credit Card" : "ACH"}</p>
                <p className="text-gray-500">Source: {booking.source === "hostaway" ? "Hostaway" : "Local"}</p>
              </div>
              <div>
                <p className="font-medium text-gray-700">Price Breakdown</p>
                <p className="mt-1 text-gray-500">Nightly: ${booking.nightlyTotal.toLocaleString()}</p>
                <p className="text-gray-500">Cleaning: ${booking.cleaningFee.toLocaleString()}</p>
                <p className="text-gray-500">OAH fee: ${booking.oahFee.toLocaleString()}</p>
                <p className="text-gray-500">TOT: ${booking.totAmount.toLocaleString()}</p>
                <p className="text-gray-500">Safely: ${booking.safelyFee.toLocaleString()}</p>
                <p className="text-gray-500">CC fee: ${booking.ccFee.toLocaleString()}</p>
              </div>
              {booking.tripDescription && (
                <div className="sm:col-span-2">
                  <p className="font-medium text-gray-700">Trip Description</p>
                  <p className="mt-1 text-gray-500">{booking.tripDescription}</p>
                </div>
              )}
              {booking.petInfo && (
                <div className="sm:col-span-2">
                  <p className="font-medium text-gray-700">Pet Info</p>
                  <p className="mt-1 text-gray-500">{booking.petInfo}</p>
                </div>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
