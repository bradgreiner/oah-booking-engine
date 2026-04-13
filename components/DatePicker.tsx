"use client";

import { useState, useEffect, useCallback } from "react";

interface DatePickerProps {
  propertyId: string;
  checkIn: string;
  checkOut: string;
  onCheckInChange: (date: string) => void;
  onCheckOutChange: (date: string) => void;
  minNights: number;
}

interface CalendarDay {
  date: string;
  isAvailable: number;
}

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function toDateStr(d: Date): string {
  return d.toISOString().split("T")[0];
}

function addMonths(d: Date, n: number): Date {
  return new Date(d.getFullYear(), d.getMonth() + n, 1);
}

function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

export default function DatePicker({
  propertyId,
  checkIn,
  checkOut,
  onCheckInChange,
  onCheckOutChange,
  minNights,
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const [selecting, setSelecting] = useState<"checkin" | "checkout">("checkin");
  const [baseMonth, setBaseMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [blocked, setBlocked] = useState<Set<string>>(new Set());
  const [hoverDate, setHoverDate] = useState<string | null>(null);

  const today = toDateStr(new Date());

  const fetchBlockedDates = useCallback(async () => {
    const start = toDateStr(baseMonth);
    const end = toDateStr(addMonths(baseMonth, 3));
    try {
      const res = await fetch(
        `/api/properties/${propertyId}/calendar?startDate=${start}&endDate=${end}`
      );
      if (res.ok) {
        const data: CalendarDay[] = await res.json();
        const blockedSet = new Set<string>();
        for (const day of data) {
          if (day.isAvailable === 0) blockedSet.add(day.date);
        }
        setBlocked(blockedSet);
      }
    } catch {
      // Silently fail — all dates remain available
    }
  }, [propertyId, baseMonth]);

  useEffect(() => {
    if (open) fetchBlockedDates();
  }, [open, fetchBlockedDates]);

  function handleDayClick(dateStr: string) {
    if (selecting === "checkin") {
      onCheckInChange(dateStr);
      onCheckOutChange("");
      setSelecting("checkout");
    } else {
      if (dateStr <= checkIn) {
        onCheckInChange(dateStr);
        onCheckOutChange("");
        setSelecting("checkout");
      } else {
        onCheckOutChange(dateStr);
        setSelecting("checkin");
        setTimeout(() => setOpen(false), 300);
      }
    }
  }

  function isDayDisabled(dateStr: string): boolean {
    if (dateStr < today) return true;
    if (blocked.has(dateStr)) return true;
    if (selecting === "checkout" && checkIn) {
      if (dateStr <= checkIn) return false; // Allow clicking to restart
      const cin = new Date(checkIn + "T00:00:00");
      const d = new Date(dateStr + "T00:00:00");
      const diffDays = Math.round((d.getTime() - cin.getTime()) / 86400000);
      if (diffDays < minNights) return true;
      // Check if any blocked date falls between checkIn and this date
      for (let i = 1; i < diffDays; i++) {
        const between = new Date(cin.getTime() + i * 86400000);
        if (blocked.has(toDateStr(between))) return true;
      }
    }
    return false;
  }

  function isInRange(dateStr: string): boolean {
    if (!checkIn) return false;
    const end = selecting === "checkout" && hoverDate ? hoverDate : checkOut;
    if (!end) return false;
    return dateStr > checkIn && dateStr < end;
  }

  function renderMonth(monthDate: Date) {
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();
    const total = daysInMonth(year, month);
    const firstDow = new Date(year, month, 1).getDay();
    const name = monthDate.toLocaleString("default", { month: "long", year: "numeric" });

    const cells: (number | null)[] = [];
    for (let i = 0; i < firstDow; i++) cells.push(null);
    for (let d = 1; d <= total; d++) cells.push(d);

    return (
      <div className="w-full">
        <p className="mb-3 text-center text-sm font-semibold text-gray-800">
          {name}
        </p>
        <div className="grid grid-cols-7 gap-0 text-center text-xs">
          {WEEKDAYS.map((wd) => (
            <div key={wd} className="py-1 font-medium text-gray-400">
              {wd}
            </div>
          ))}
          {cells.map((day, i) => {
            if (day === null) return <div key={`e-${i}`} />;
            const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const disabled = isDayDisabled(dateStr);
            const isCheckIn = dateStr === checkIn;
            const isCheckOut = dateStr === checkOut;
            const inRange = isInRange(dateStr);
            const isBlocked = blocked.has(dateStr);
            const isPast = dateStr < today;

            let cls = "relative mx-auto flex h-8 w-8 items-center justify-center rounded-full text-xs transition-colors ";
            if (isCheckIn || isCheckOut) {
              cls += "bg-[#4C6C4E] font-semibold text-white ";
            } else if (inRange) {
              cls += "bg-[#4C6C4E]/10 text-[#4C6C4E] ";
            } else if (disabled || isPast) {
              cls += isBlocked ? "text-gray-300 line-through " : "text-gray-300 ";
            } else {
              cls += "text-gray-700 hover:bg-[#4C6C4E]/10 cursor-pointer ";
            }

            return (
              <div
                key={dateStr}
                className={cls}
                onClick={() => !disabled && handleDayClick(dateStr)}
                onMouseEnter={() => !disabled && selecting === "checkout" && setHoverDate(dateStr)}
                onMouseLeave={() => setHoverDate(null)}
              >
                {day}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  const month2 = addMonths(baseMonth, 1);
  const checkInDisplay = checkIn
    ? new Date(checkIn + "T00:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
    : "Add date";
  const checkOutDisplay = checkOut
    ? new Date(checkOut + "T00:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
    : "Add date";

  return (
    <div className="relative">
      {/* Trigger inputs */}
      <div
        className="mb-4 cursor-pointer overflow-hidden rounded-xl border border-gray-200"
        onClick={() => setOpen(!open)}
      >
        <div className="grid grid-cols-2">
          <div className={`border-r border-gray-200 px-3 py-2.5 ${selecting === "checkin" && open ? "bg-gray-50" : ""}`}>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Check-in
            </p>
            <p className={`mt-0.5 flex items-center gap-1.5 text-sm ${checkIn ? "font-medium text-gray-900" : "italic text-gray-400"}`}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-3.5 w-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>
              {checkInDisplay}
            </p>
          </div>
          <div className={`px-3 py-2.5 ${selecting === "checkout" && open ? "bg-gray-50" : ""}`}>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Check-out
            </p>
            <p className={`mt-0.5 flex items-center gap-1.5 text-sm ${checkOut ? "font-medium text-gray-900" : "italic text-gray-400"}`}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-3.5 w-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>
              {checkOutDisplay}
            </p>
          </div>
        </div>
      </div>

      {/* Calendar dropdown */}
      {open && (
        <div className="absolute left-0 right-0 z-50 rounded-xl border border-gray-200 bg-white p-4 shadow-xl">
          {/* Navigation */}
          <div className="mb-4 flex items-center justify-between">
            <button
              onClick={() => setBaseMonth(addMonths(baseMonth, -1))}
              className="rounded-full p-1 text-gray-500 hover:bg-gray-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
            <button
              onClick={() => setBaseMonth(addMonths(baseMonth, 1))}
              className="rounded-full p-1 text-gray-500 hover:bg-gray-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>

          {/* Two-month grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {renderMonth(baseMonth)}
            {renderMonth(month2)}
          </div>

          {/* Minimum stay note */}
          {minNights > 1 && selecting === "checkout" && checkIn && (
            <p className="mt-3 text-center text-xs text-gray-500">
              Minimum stay: {minNights} nights
            </p>
          )}

          {/* Clear / close */}
          <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
            <button
              onClick={() => {
                onCheckInChange("");
                onCheckOutChange("");
                setSelecting("checkin");
              }}
              className="text-xs font-medium text-gray-500 underline hover:text-gray-700"
            >
              Clear dates
            </button>
            <button
              onClick={() => setOpen(false)}
              className="rounded-full bg-[#4C6C4E] px-4 py-1.5 text-xs font-medium text-white hover:bg-[#3d5a40]"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
