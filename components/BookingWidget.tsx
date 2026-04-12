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

function discountPct(multiplier: number | undefined): number {
  if (!multiplier || multiplier <= 0 || multiplier >= 1) return 0;
  return Math.round((1 - multiplier) * 100);
}

function formatAvailableDate(): string {
  return new Date().toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

type Tab = "nightly" | "weekly" | "monthly" | "quarterly";

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

  const weeklyPct = discountPct(weeklyDiscount);
  const monthlyPct = discountPct(monthlyDiscount);
  const isMonthlyOnly = minNights >= 30;
  const isQuarterlyOnly = minNights >= 90;

  // Which tabs are available
  const showNightlyTab = !isMonthlyOnly;
  const showWeeklyTab = showNightlyTab && weeklyPct > 0;
  const show1MonthTab = !isQuarterlyOnly;
  const show3MonthTab = !isQuarterlyOnly && (maxNights === null || maxNights >= 90);

  // Determine default active tab
  function getDefaultTab(): Tab {
    if (isQuarterlyOnly) return "quarterly";
    if (isMonthlyOnly) return "monthly";
    return "nightly";
  }
  const [activeTab, setActiveTab] = useState<Tab>(getDefaultTab);

  // Compute display rate based on active tab
  const weeklyMultiplier = weeklyDiscount != null && weeklyDiscount > 0 && weeklyDiscount < 1 ? weeklyDiscount : 1;
  const monthlyMultiplier = monthlyDiscount != null && monthlyDiscount > 0 && monthlyDiscount < 1 ? monthlyDiscount : 1;

  let displayRate: number;
  let displayUnit: string;
  if (activeTab === "monthly" || activeTab === "quarterly") {
    displayRate = Math.round(baseRate * 30 * monthlyMultiplier);
    displayUnit = "/mo";
  } else if (activeTab === "weekly") {
    displayRate = Math.round(baseRate * weeklyMultiplier);
    displayUnit = "/night";
  } else {
    displayRate = baseRate;
    displayUnit = "/night";
  }

  useEffect(() => {
    if (!checkIn || !checkOut) {
      setFees(null);
      return;
    }
    const fetchPricing = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({ checkIn, checkOut });
        const res = await fetch(`/api/properties/${propertyId}/pricing?${params.toString()}`);
        if (res.ok) setFees(await res.json());
      } catch { /* silently handle */ } finally { setLoading(false); }
    };
    fetchPricing();
  }, [checkIn, checkOut, propertyId]);

  function handleRequestToBook() {
    if (!checkIn || !checkOut) return;
    const params = new URLSearchParams({ checkIn, checkOut, guests: String(guests) });
    router.push(`/request/${propertyId}?${params.toString()}`);
  }

  const selectedNights = fees?.numNights ?? 0;
  const showWeeklyUpsell = showWeeklyTab && checkIn && checkOut && selectedNights > 0 && selectedNights < 7;
  const showTabs = showNightlyTab || isMonthlyOnly || isQuarterlyOnly;

  function tabCls(tab: Tab): string {
    return activeTab === tab
      ? "flex-1 rounded-md bg-white px-2 py-1.5 text-center font-medium text-gray-800 shadow-sm cursor-pointer"
      : "flex-1 rounded-md px-2 py-1.5 text-center text-gray-500 cursor-pointer hover:text-gray-700";
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-[#FAFAF8] p-6 shadow-lg">
      {/* Rate display */}
      <div className="mb-1">
        <span className="text-3xl font-bold text-gray-900">
          ${displayRate.toLocaleString()}
        </span>
        <span className="text-base font-normal text-gray-500">{displayUnit}</span>
      </div>

      {/* Stay-length tabs */}
      {showTabs && (
        <div className="mb-4 flex gap-1 rounded-lg bg-gray-100 p-1 text-xs">
          {showNightlyTab && (
            <span className={tabCls("nightly")} onClick={() => setActiveTab("nightly")}>
              Nightly
            </span>
          )}
          {showWeeklyTab && (
            <span className={tabCls("weekly")} onClick={() => setActiveTab("weekly")}>
              7+ nights &mdash; Save {weeklyPct}%
            </span>
          )}
          {isMonthlyOnly && !isQuarterlyOnly && show1MonthTab && (
            <span className={tabCls("monthly")} onClick={() => setActiveTab("monthly")}>
              1 month
            </span>
          )}
          {!isMonthlyOnly && monthlyPct > 0 && (
            <span className={tabCls("monthly")} onClick={() => setActiveTab("monthly")}>
              30+ nights &mdash; Save {monthlyPct}%
            </span>
          )}
          {isQuarterlyOnly && (
            <span className={tabCls("quarterly")} onClick={() => setActiveTab("quarterly")}>
              3+ months
            </span>
          )}
          {show3MonthTab && !isQuarterlyOnly && isMonthlyOnly && (
            <span className={tabCls("quarterly")} onClick={() => setActiveTab("quarterly")}>
              3 months{monthlyPct > 0 ? ` \u2014 Save ${monthlyPct}%` : ""}
            </span>
          )}
        </div>
      )}

      {/* Available from date */}
      <p className="mb-2 text-xs text-gray-400">
        Available from {formatAvailableDate()}
      </p>

      <DatePicker
        propertyId={propertyId}
        checkIn={checkIn}
        checkOut={checkOut}
        onCheckInChange={setCheckIn}
        onCheckOutChange={setCheckOut}
        minNights={minNights}
      />

      {/* Weekly upsell */}
      {showWeeklyUpsell && (
        <p className="mb-3 text-xs text-[#4C6C4E]">
          Extend to 7+ nights and save {weeklyPct}%
        </p>
      )}

      {/* Guest stepper */}
      <div className="mb-4">
        <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-500">
          Guests
        </label>
        <div className="flex items-center gap-3 rounded-lg border border-gray-200 px-3 py-2">
          <button
            type="button"
            onClick={() => setGuests((g) => Math.max(1, g - 1))}
            disabled={guests <= 1}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-gray-600 transition hover:border-[#4C6C4E] hover:text-[#4C6C4E] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4"><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" /></svg>
          </button>
          <span className="min-w-[3rem] text-center text-sm font-medium text-gray-800">
            {guests} {guests === 1 ? "guest" : "guests"}
          </span>
          <button
            type="button"
            onClick={() => setGuests((g) => Math.min(maxGuests, g + 1))}
            disabled={guests >= maxGuests}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-gray-600 transition hover:border-[#4C6C4E] hover:text-[#4C6C4E] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
          </button>
        </div>
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
            <span className="text-gray-800">${fees.nightlyTotal.toLocaleString()}</span>
          </div>
          {fees.cleaningFee > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-600">Cleaning fee</span>
              <span className="text-gray-800">${fees.cleaningFee.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-gray-600">OAH guest fee (2%)</span>
            <span className="text-gray-800">${fees.oahFee.toLocaleString()}</span>
          </div>
          {fees.safelyFee > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-600">Safely protection</span>
              <span className="text-gray-800">${fees.safelyFee.toLocaleString()}</span>
            </div>
          )}
          {fees.numNights >= 30 ? (
            <div>
              <div className="flex justify-between">
                <span className="text-gray-600">Occupancy tax</span>
                <span className="text-[#4C6C4E]">$0 &#10003;</span>
              </div>
              <p className="mt-0.5 text-xs text-gray-400">
                Monthly rentals are exempt from transient occupancy tax
              </p>
            </div>
          ) : fees.totAmount > 0 ? (
            <div className="flex justify-between">
              <span className="text-gray-600">Occupancy tax ({(totRate * 100).toFixed(0)}%)</span>
              <span className="text-gray-800">${fees.totAmount.toLocaleString()}</span>
            </div>
          ) : null}
          <div className="flex justify-between border-t border-gray-100 pt-3 mt-3 font-semibold">
            <span className="text-[#4C6C4E]">Total</span>
            <span className="text-[#4C6C4E]">${fees.grandTotal.toLocaleString()}</span>
          </div>
          {fees.ccFee > 0 && (
            <p className="text-sm text-[#4C6C4E]">
              🏦 Save ${fees.ccFee.toLocaleString()} with bank transfer
            </p>
          )}
        </div>
      )}

      <button
        onClick={handleRequestToBook}
        disabled={!checkIn || !checkOut}
        className="w-full rounded-full bg-[#4C6C4E] py-3.5 text-sm font-semibold text-white transition hover:bg-[#3d5a40] disabled:cursor-not-allowed disabled:opacity-50"
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
