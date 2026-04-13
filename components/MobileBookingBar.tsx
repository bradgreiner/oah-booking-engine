"use client";

interface Props {
  propertyId: string;
  propertyName: string;
  baseRate: number;
  minNights: number;
}

export default function MobileBookingBar({ propertyId, propertyName, baseRate, minNights }: Props) {
  const isMonthly = minNights >= 30;
  const hasRate = baseRate > 0;
  const displayRate = isMonthly ? Math.round(baseRate * 30) : baseRate;
  const unit = isMonthly ? "/mo" : "/night";

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white px-4 py-3 lg:hidden">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-xs text-gray-500">{propertyName}</p>
          {hasRate ? (
            <div>
              <span className="text-lg font-bold text-[#1a1a1a]">
                ${displayRate.toLocaleString()}
              </span>
              <span className="text-sm text-gray-500"> {unit}</span>
            </div>
          ) : (
            <p className="text-sm italic text-gray-400">Contact for pricing</p>
          )}
        </div>
        {hasRate ? (
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="shrink-0 rounded-full bg-[#4C6C4E] px-6 py-2.5 text-sm font-medium text-white transition hover:bg-[#3d5a40]"
          >
            Request to Book
          </button>
        ) : (
          <a
            href="mailto:brad@openairhomes.com"
            className="shrink-0 rounded-full border border-[#4C6C4E] px-6 py-2.5 text-sm font-medium text-[#4C6C4E] transition hover:bg-[#4C6C4E] hover:text-white"
          >
            Contact Us
          </a>
        )}
      </div>
    </div>
  );
}
