"use client";

import { useRouter } from "next/navigation";

interface Props {
  propertyId: string;
  baseRate: number;
}

export default function MobileBookingBar({ propertyId, baseRate }: Props) {
  const router = useRouter();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white px-4 py-3 lg:hidden">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-lg font-bold text-[#1a1a1a]">
            ${baseRate.toLocaleString()}
          </span>
          <span className="text-sm text-gray-500"> /night</span>
        </div>
        <button
          onClick={() => router.push(`/request/${propertyId}`)}
          className="rounded-full bg-[#4C6C4E] px-6 py-2.5 text-sm font-medium text-white transition hover:bg-[#3d5a40]"
        >
          Request to Book
        </button>
      </div>
    </div>
  );
}
