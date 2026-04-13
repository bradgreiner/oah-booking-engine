"use client";

import Image from "next/image";

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

interface BookingSummaryProps {
  propertyName: string;
  propertyImage?: string;
  propertyCity?: string | null;
  checkIn: string;
  checkOut: string;
  baseRate: number;
  totRate: number;
  guests: number;
  fees: FeeBreakdown | null;
  loading: boolean;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr + "T12:00:00").toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export default function BookingSummary({
  propertyName,
  propertyImage,
  propertyCity,
  checkIn,
  checkOut,
  baseRate,
  totRate,
  guests,
  fees,
  loading,
}: BookingSummaryProps) {
  const numNights = fees?.numNights ?? 0;
  const months = numNights >= 30 ? Math.round(numNights / 30) : 0;

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      {/* Property header with thumbnail */}
      <div className="flex gap-4">
        <div className="relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-lg bg-gray-100">
          {propertyImage ? (
            <Image
              src={propertyImage}
              alt={propertyName}
              fill
              sizes="112px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-gray-300">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="h-8 w-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21z" />
              </svg>
            </div>
          )}
        </div>
        <div className="min-w-0">
          <h2 className="line-clamp-2 text-sm font-medium text-gray-900">
            {propertyName}
          </h2>
          {propertyCity && (
            <p className="text-xs text-gray-500">{propertyCity}</p>
          )}
        </div>
      </div>

      {/* Dates, nights, guests */}
      <div className="mt-3 space-y-1 border-t border-gray-100 pt-3 text-sm text-gray-600">
        <p>{formatDate(checkIn)} &rarr; {formatDate(checkOut)}</p>
        <p>
          {months > 0 ? `${months} ${months === 1 ? "month" : "months"}` : `${numNights} ${numNights === 1 ? "night" : "nights"}`}
          {" · "}{guests} {guests === 1 ? "guest" : "guests"}
        </p>
      </div>

      {/* Fee breakdown */}
      {loading ? (
        <div className="mt-4 space-y-2">
          <div className="h-4 animate-pulse rounded bg-gray-100" />
          <div className="h-4 animate-pulse rounded bg-gray-100" />
          <div className="h-4 animate-pulse rounded bg-gray-100" />
        </div>
      ) : fees && fees.grandTotal > 0 ? (
        <div className="mt-4 space-y-2 border-t border-gray-100 pt-4 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">${baseRate.toLocaleString()} x {fees.numNights} nights</span>
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
            <div className="flex justify-between">
              <span className="text-gray-600">Occupancy tax</span>
              <span className="text-[#4C6C4E]">$0 &#10003;</span>
            </div>
          ) : fees.totAmount > 0 ? (
            <div className="flex justify-between">
              <span className="text-gray-600">Occupancy tax ({(totRate * 100).toFixed(0)}%)</span>
              <span className="text-gray-800">${fees.totAmount.toLocaleString()}</span>
            </div>
          ) : null}
          <div className="mt-1 flex justify-between border-t border-gray-100 pt-3 text-base font-semibold">
            <span className="text-[#4C6C4E]">Total</span>
            <span className="text-[#4C6C4E]">${fees.grandTotal.toLocaleString()}</span>
          </div>
        </div>
      ) : fees ? (
        <div className="mt-4 text-center text-sm text-gray-500">
          <p>Pricing not available for the selected dates.</p>
          <p className="mt-1">Contact us at brad@openairhomes.com</p>
        </div>
      ) : null}

      {/* Shield messages */}
      <div className="mt-3 space-y-2">
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-3.5 w-3.5 shrink-0 text-[#4C6C4E]">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
          </svg>
          Your card won&apos;t be charged until approved
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-3.5 w-3.5 shrink-0 text-[#4C6C4E]">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          We typically review within 24 hours
        </div>
      </div>
    </div>
  );
}
