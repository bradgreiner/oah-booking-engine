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
  initialCheckIn?: string;
  initialCheckOut?: string;
}

interface FeeBreakdown {
  nightlyTotal: number;
  nightlyRate: number;
  cleaningFee: number;
  petFee: number;
  safelyFee: number;
  totAmount: number;
  oahFee: number;
  ccFee: number;
  grandTotal: number;
  numNights: number;
  securityDeposit?: number;
}

function discountPct(multiplier: number | undefined): number {
  if (!multiplier || multiplier <= 0 || multiplier >= 1) return 0;
  return Math.round((1 - multiplier) * 100);
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
  initialCheckIn,
  initialCheckOut,
}: BookingWidgetProps) {
  const router = useRouter();
  const [checkIn, setCheckIn] = useState(initialCheckIn || "");
  const [checkOut, setCheckOut] = useState(initialCheckOut || "");
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

  // Compute display rate: use API nightlyRate when fees loaded, otherwise prop-based estimate
  const hasValidMonthlyDiscount = monthlyDiscount != null && monthlyDiscount > 0 && monthlyDiscount < 1;
  const weeklyMultiplier = weeklyDiscount != null && weeklyDiscount > 0 && weeklyDiscount < 1 ? weeklyDiscount : 1;
  const hasDates = !!(fees && !loading);

  let displayRate: number | null;
  let displayUnit: string;
  let isEstimate = false;

  if (hasDates) {
    // Dates selected — show exact rate from pricing API
    const apiRate = fees.nightlyRate;
    if (activeTab === "monthly" || activeTab === "quarterly") {
      displayRate = Math.round(apiRate * 30);
      displayUnit = "/mo";
    } else {
      displayRate = Math.round(apiRate);
      displayUnit = "/night";
    }
  } else {
    // No dates — show prop-based estimate with "From" prefix.
    // When baseRate is 0 (no PriceLabs data), show "Contact for pricing".
    isEstimate = true;
    if (baseRate <= 0) {
      displayRate = null;
      displayUnit = "";
    } else if (activeTab === "monthly" || activeTab === "quarterly") {
      displayRate = hasValidMonthlyDiscount
        ? Math.round(baseRate * 30 * monthlyDiscount!)
        : Math.round(baseRate * 30);
      displayUnit = "/mo";
    } else if (activeTab === "weekly") {
      displayRate = Math.round(baseRate * weeklyMultiplier);
      displayUnit = "/night";
    } else {
      displayRate = Math.round(baseRate);
      displayUnit = "/night";
    }
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

  async function handleRequestToBook() {
    if (!checkIn || !checkOut) return;

    // Create a booking session for abandoned cart tracking
    let sessionId = "";
    try {
      const res = await fetch("/api/booking/update-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listingId: propertyId,
          checkIn,
          checkOut,
          stepReached: "widget",
        }),
      });
      if (res.ok) {
        const data = await res.json();
        sessionId = data.sessionId || "";
      }
    } catch {
      // Non-blocking — don't prevent booking flow
    }

    const params = new URLSearchParams({ checkIn, checkOut, guests: String(guests) });
    if (sessionId) params.set("sessionId", sessionId);
    router.push(`/request/${propertyId}?${params.toString()}`);
  }

  const selectedNights = fees?.numNights ?? 0;
  const showWeeklyUpsell = showWeeklyTab && checkIn && checkOut && selectedNights > 0 && selectedNights < 7;
  const showTabs = baseRate > 0 && (showNightlyTab || isMonthlyOnly || isQuarterlyOnly);

  function tabCls(tab: Tab): string {
    return activeTab === tab
      ? "flex-1 rounded-md bg-white px-2 py-1.5 text-center font-medium text-gray-800 shadow-sm cursor-pointer"
      : "flex-1 rounded-md px-2 py-1.5 text-center text-gray-500 cursor-pointer hover:text-gray-700";
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-[#FAFAF8] p-6 shadow-md">
      {/* Rate display */}
      <div className="mb-1">
        {displayRate !== null ? (
          <>
            {isEstimate && (
              <span className="text-sm font-normal text-gray-500">From </span>
            )}
            <span className="text-3xl font-bold text-gray-900">
              ${displayRate.toLocaleString()}
            </span>
            <span className="text-base font-normal text-gray-500">{displayUnit}</span>
          </>
        ) : (
          <span className="text-lg italic text-gray-500">Contact for monthly pricing</span>
        )}
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
              Monthly{monthlyPct > 0 ? ` \u2014 Save ${monthlyPct}%` : ""}
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

      {/* Stay type info */}
      <p className="mb-2 text-xs text-gray-500">
        {minNights >= 30 ? "Monthly rental" : minNights >= 7 ? "Weekly minimum" : "Nightly available"}
        {minNights > 1 && ` \u00b7 ${minNights} night minimum`}
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
              ${Math.round(fees.nightlyRate)}/night &times; {fees.numNights}{" "}
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
              <p className="mt-0.5 text-xs text-gray-500">
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
          {(fees.securityDeposit ?? 0) > 0 && (
            <div className="mt-3 rounded-lg bg-amber-50 p-3">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-amber-800">Refundable security deposit</span>
                <span className="font-medium text-amber-800">${fees.securityDeposit!.toLocaleString()}</span>
              </div>
              <p className="mt-1 text-xs text-amber-600">
                Returned within 14 days of checkout if no damages
              </p>
            </div>
          )}
        </div>
      )}

      <button
        onClick={handleRequestToBook}
        disabled={!checkIn || !checkOut || displayRate === null}
        className="w-full rounded-full bg-[#4C6C4E] py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-[#3d5a40] disabled:cursor-not-allowed disabled:opacity-50"
      >
        Request to Book
      </button>

      <div className="mt-2 space-y-1 text-center text-xs text-gray-500">
        <p>Your card won&apos;t be charged until we approve your request</p>
        <p>We typically review within 24 hours</p>
      </div>

      {(minNights > 1 || maxNights) && (
        <p className="mt-2 text-center text-xs text-gray-500">
          {minNights > 1 && `${minNights} night minimum`}
          {minNights > 1 && maxNights && " · "}
          {maxNights && `${maxNights} night maximum`}
        </p>
      )}
    </div>
  );
}
