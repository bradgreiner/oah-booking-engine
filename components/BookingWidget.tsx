"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DatePicker from "@/components/DatePicker";

interface BookingWidgetProps {
  propertyId: string;
  baseRate: number;
  cleaningFee: number;
  petFee: number;
  totRate: number;
  maxGuests: number;
  minNights: number;
  maxNights: number | null;
  weeklyDiscount?: number;
  monthlyDiscount?: number;
}

interface FeeBreakdown {
  nightlyTotal: number;
  cleaningFee: number;
  petFee: number;
  safelyFee: number;
  totAmount: number;
  oahFee: number;
  ccFee: number;
  grandTotal: number;
  numNights: number;
}

export default function BookingWidget({
  propertyId,
  baseRate,
  cleaningFee,
  petFee,
  totRate,
  maxGuests,
  minNights,
  maxNights,
  weeklyDiscount,
  monthlyDiscount,
}: BookingWidgetProps) {
  const router = useRouter();
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [fees, setFees] = useState<FeeBreakdown | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!checkIn || !checkOut) {
      setFees(null);
      return;
    }

    const fetchPricing = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({ checkIn, checkOut });
        const res = await fetch(
          `/api/properties/${propertyId}/pricing?${params.toString()}`
        );
        if (res.ok) {
          const data = await res.json();
          setFees(data);
        }
      } catch {
        // Silently handle errors
      } finally {
        setLoading(false);
      }
    };

    fetchPricing();
  }, [checkIn, checkOut, propertyId]);

  function handleRequestToBook() {
    if (!checkIn || !checkOut) return;
    const params = new URLSearchParams({
      checkIn,
      checkOut,
      guests: String(guests),
    });
    router.push(`/request/${propertyId}?${params.toString()}`);
  }

  // Hostaway sends multipliers (0.8 = 20% off). Convert to display %.
  function discountPct(multiplier: number | undefined): number {
    if (!multiplier || multiplier <= 0 || multiplier >= 1) return 0;
    return Math.round((1 - multiplier) * 100);
  }
  const weeklyPct = discountPct(weeklyDiscount);
  const monthlyPct = discountPct(monthlyDiscount);
  const hasWeekly = weeklyPct > 0;
  const hasMonthly = monthlyPct > 0;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
      <div className="mb-4">
        <span className="text-2xl font-bold text-[#1a1a1a]">
          ${baseRate.toLocaleString()}
        </span>
        <span className="text-sm text-gray-500"> /night</span>
      </div>

      {/* Stay-length tabs */}
      {(hasWeekly || hasMonthly) && (
        <div className="mb-4 flex gap-1 rounded-lg bg-gray-100 p-1 text-xs">
          <span className="flex-1 rounded-md bg-white px-2 py-1.5 text-center font-medium text-gray-800 shadow-sm">
            Nightly
          </span>
          {hasWeekly && (
            <span className="flex-1 rounded-md px-2 py-1.5 text-center text-gray-500">
              7+ nights &mdash; Save {weeklyPct}%
            </span>
          )}
          {hasMonthly && (
            <span className="flex-1 rounded-md px-2 py-1.5 text-center text-gray-500">
              30+ nights &mdash; Save {monthlyPct}%
            </span>
          )}
        </div>
      )}

      <DatePicker
        propertyId={propertyId}
        checkIn={checkIn}
        checkOut={checkOut}
        onCheckInChange={setCheckIn}
        onCheckOutChange={setCheckOut}
        minNights={minNights}
      />

      <div className="mb-4">
        <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-500">
          Guests
        </label>
        <select
          value={guests}
          onChange={(e) => setGuests(Number(e.target.value))}
          className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#4C6C4E] focus:ring-1 focus:ring-[#4C6C4E]"
        >
          {Array.from({ length: maxGuests }, (_, i) => i + 1).map((n) => (
            <option key={n} value={n}>
              {n} {n === 1 ? "guest" : "guests"}
            </option>
          ))}
        </select>
      </div>

      {loading && (
        <div className="mb-4 space-y-2">
          <div className="h-4 animate-pulse rounded bg-gray-100" />
          <div className="h-4 animate-pulse rounded bg-gray-100" />
          <div className="h-4 animate-pulse rounded bg-gray-100" />
        </div>
      )}

      {fees && !loading && (
        <div className="mb-4 space-y-2 border-t border-gray-100 pt-4 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">
              ${baseRate.toLocaleString()} x {fees.numNights}{" "}
              {fees.numNights === 1 ? "night" : "nights"}
            </span>
            <span className="text-gray-800">
              ${fees.nightlyTotal.toLocaleString()}
            </span>
          </div>
          {fees.cleaningFee > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-600">Cleaning fee</span>
              <span className="text-gray-800">
                ${fees.cleaningFee.toLocaleString()}
              </span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-gray-600">OAH guest fee (2%)</span>
            <span className="text-gray-800">
              ${fees.oahFee.toLocaleString()}
            </span>
          </div>
          {fees.numNights < 30 && fees.totAmount > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-600">
                TOT ({(totRate * 100).toFixed(0)}%)
              </span>
              <span className="text-gray-800">
                ${fees.totAmount.toLocaleString()}
              </span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-gray-600">Safely protection</span>
            <span className="text-gray-800">
              ${fees.safelyFee.toLocaleString()}
            </span>
          </div>
          {fees.ccFee > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-600">CC processing (3%)</span>
              <span className="text-gray-800">
                ${fees.ccFee.toLocaleString()}
              </span>
            </div>
          )}
          <div className="flex justify-between border-t border-gray-100 pt-2 font-semibold">
            <span className="text-[#1a1a1a]">Total</span>
            <span className="text-[#1a1a1a]">
              ${fees.grandTotal.toLocaleString()}
            </span>
          </div>
        </div>
      )}

      <button
        onClick={handleRequestToBook}
        disabled={!checkIn || !checkOut}
        className="w-full rounded-full bg-[#4C6C4E] py-3 text-sm font-medium text-white transition hover:bg-[#3d5a40] disabled:cursor-not-allowed disabled:opacity-50"
      >
        Request to Book
      </button>

      <p className="mt-3 text-center text-xs text-gray-400">
        Your card won&apos;t be charged until we approve your request
      </p>
      <p className="mt-1 text-center text-xs text-gray-400">
        We typically review within 24 hours
      </p>

      {(minNights > 1 || maxNights) && (
        <p className="mt-2 text-center text-xs text-gray-400">
          {minNights > 1 && `${minNights} night minimum`}
          {minNights > 1 && maxNights && " · "}
          {maxNights && `${maxNights} night maximum`}
        </p>
      )}
    </div>
  );
}
