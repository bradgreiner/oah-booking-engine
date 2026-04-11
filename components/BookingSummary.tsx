"use client";

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
  checkIn: string;
  checkOut: string;
  baseRate: number;
  totRate: number;
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
  checkIn,
  checkOut,
  baseRate,
  totRate,
  fees,
  loading,
}: BookingSummaryProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      {/* Property header */}
      <div className="flex gap-4">
        <div className="h-20 w-28 shrink-0 overflow-hidden rounded-lg bg-gray-100">
          {propertyImage ? (
            <img
              src={propertyImage}
              alt={propertyName}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-gray-300">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="h-8 w-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21z" />
              </svg>
            </div>
          )}
        </div>
        <div>
          <h2 className="font-[Georgia,serif] text-lg font-semibold text-[#1B2A4A]">
            {propertyName}
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            {formatDate(checkIn)} &rarr; {formatDate(checkOut)}
          </p>
        </div>
      </div>

      {/* Price breakdown */}
      {loading ? (
        <div className="mt-6 space-y-2">
          <div className="h-4 animate-pulse rounded bg-gray-100" />
          <div className="h-4 animate-pulse rounded bg-gray-100" />
          <div className="h-4 animate-pulse rounded bg-gray-100" />
        </div>
      ) : fees ? (
        <div className="mt-6 space-y-2 border-t border-gray-100 pt-4 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">
              ${baseRate.toLocaleString()} x {fees.numNights} nights
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
          {fees.numNights < 30 && fees.totAmount > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-600">TOT ({(totRate * 100).toFixed(0)}%)</span>
              <span className="text-gray-800">${fees.totAmount.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-gray-600">Safely protection</span>
            <span className="text-gray-800">${fees.safelyFee.toLocaleString()}</span>
          </div>
          {fees.ccFee > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-600">CC processing (3%)</span>
              <span className="text-gray-800">${fees.ccFee.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between border-t border-gray-100 pt-2 font-semibold">
            <span className="text-[#1B2A4A]">Total</span>
            <span className="text-[#1B2A4A]">${fees.grandTotal.toLocaleString()}</span>
          </div>
        </div>
      ) : null}
    </div>
  );
}
