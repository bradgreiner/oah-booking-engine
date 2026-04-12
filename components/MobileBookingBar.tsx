"use client";

import { useRouter } from "next/navigation";

interface Props {
  propertyId: string;
  propertyName: string;
  baseRate: number;
  minNights: number;
}

export default function MobileBookingBar({ propertyId, propertyName, baseRate, minNights }: Props) {
  const router = useRouter();
  const isMonthly = minNights >= 30;
  const displayRate = isMonthly ? Math.round(baseRate * 30) : baseRate;
  const unit = isMonthly ? "/mo" : "/night";

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white px-4 py-3 lg:hidden">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-xs text-gray-500">{propertyName}</p>
          <div>
            <span className="text-lg font-bold text-[#1a1a1a]">
              ${displayRate.toLocaleString()}
            </span>
            <span className="text-sm text-gray-500"> {unit}</span>
          </div>
        </div>
        <button
          onClick={() => router.push(`/request/${propertyId}`)}
          className="shrink-0 rounded-full bg-[#4C6C4E] px-6 py-2.5 text-sm font-medium text-white transition hover:bg-[#3d5a40]"
        >
          Request to Book
        </button>
      </div>
    </div>
  );
}
