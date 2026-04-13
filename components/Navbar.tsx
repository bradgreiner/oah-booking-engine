"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { trackEvent } from "@/lib/analytics";

const MARKET_OPTIONS = [
  { value: "Los Angeles", label: "Los Angeles" },
  { value: "Palm Springs", label: "Palm Springs" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [city, setCity] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  const today = new Date().toISOString().split("T")[0];

  // Show active search in pill
  const activeCity = searchParams.get("city") || "";
  const activeCheckIn = searchParams.get("checkIn") || "";
  const activeCheckOut = searchParams.get("checkOut") || "";

  function formatShortDate(dateStr: string): string {
    return new Date(dateStr + "T12:00:00").toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  }

  const pillText = activeCity
    ? activeCheckIn && activeCheckOut
      ? `${activeCity} · ${formatShortDate(activeCheckIn)} – ${formatShortDate(activeCheckOut)}`
      : activeCity
    : "Where are you going?";

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 10);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    }
    if (searchOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [searchOpen]);

  // Close on Escape
  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setSearchOpen(false);
        setMobileSearchOpen(false);
      }
    }
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  function handleSearch() {
    trackEvent("search_executed", { city, checkIn, checkOut });
    const params = new URLSearchParams();
    if (city) params.set("city", city);
    if (checkIn) params.set("checkIn", checkIn);
    if (checkOut) params.set("checkOut", checkOut);
    router.push(`/search?${params.toString()}`);
    setSearchOpen(false);
    setMobileSearchOpen(false);
    setMenuOpen(false);
  }

  const searchFields = (
    <div className="space-y-3">
      <div>
        <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-500">
          Where
        </label>
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-800 outline-none focus:border-[#4C6C4E] focus:ring-1 focus:ring-[#4C6C4E]"
        >
          <option value="">All locations</option>
          {MARKET_OPTIONS.map((m) => (
            <option key={m.value} value={m.value}>{m.label}</option>
          ))}
        </select>
      </div>
      <div className="flex gap-3">
        <div className="flex-1">
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-500">
            Check-in
          </label>
          <input
            type="date"
            value={checkIn}
            min={today}
            onChange={(e) => setCheckIn(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-800 outline-none focus:border-[#4C6C4E] focus:ring-1 focus:ring-[#4C6C4E]"
          />
        </div>
        <div className="flex-1">
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-500">
            Check-out
          </label>
          <input
            type="date"
            value={checkOut}
            min={checkIn || today}
            onChange={(e) => setCheckOut(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-800 outline-none focus:border-[#4C6C4E] focus:ring-1 focus:ring-[#4C6C4E]"
          />
        </div>
      </div>
      <button
        onClick={handleSearch}
        className="w-full rounded-lg bg-[#4C6C4E] py-2.5 text-sm font-medium text-white transition hover:bg-[#3d5a40]"
      >
        Search
      </button>
    </div>
  );

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-200 ${
        scrolled
          ? "bg-white/95 shadow-sm backdrop-blur-sm"
          : "bg-white border-b border-gray-100"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link
          href="/"
          className="font-serif text-xl font-normal text-[#4C6C4E]"
        >
          Open Air Homes
        </Link>

        {/* Desktop compact search pill */}
        <div className="relative hidden md:block" ref={dropdownRef}>
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-sm text-gray-500 transition hover:border-gray-300 hover:shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <span className="max-w-[200px] truncate">{pillText}</span>
          </button>

          {/* Search dropdown */}
          {searchOpen && (
            <div className="absolute left-1/2 top-full mt-2 w-[360px] -translate-x-1/2 rounded-xl bg-white p-4 shadow-xl ring-1 ring-gray-100">
              {searchFields}
            </div>
          )}
        </div>

        {/* Desktop nav */}
        <div className="hidden items-center gap-6 md:flex">
          <Link
            href="/search"
            className="font-sans text-sm font-medium text-gray-700 hover:text-[#4C6C4E]"
          >
            Browse Homes
          </Link>
          {session && (
            <Link
              href="/account"
              className="font-sans text-sm font-medium text-gray-700 hover:text-[#4C6C4E]"
            >
              My Bookings
            </Link>
          )}
          <Link
            href="/olympics"
            className="font-sans text-sm font-medium text-gray-700 hover:text-[#4C6C4E]"
          >
            LA 2028
          </Link>
          <Link
            href="/contact"
            className="font-sans text-sm font-medium text-gray-700 hover:text-[#4C6C4E]"
          >
            Contact
          </Link>
          <Link
            href="/list-your-home"
            className="rounded-full border border-[#4C6C4E] px-4 py-1.5 text-sm font-medium text-[#4C6C4E] transition-colors hover:bg-[#4C6C4E] hover:text-white"
          >
            List Your Home
          </Link>
        </div>

        {/* Mobile: search icon + hamburger */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={() => {
              setMobileSearchOpen(!mobileSearchOpen);
              setMenuOpen(false);
            }}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100"
            aria-label="Search"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
          </button>
          <button
            onClick={() => {
              setMenuOpen(!menuOpen);
              setMobileSearchOpen(false);
            }}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100"
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-6 w-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-6 w-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile search panel */}
      <div
        className={`overflow-hidden transition-all duration-300 md:hidden ${
          mobileSearchOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="border-t border-gray-100 px-4 pb-4 pt-3">
          {searchFields}
        </div>
      </div>

      {/* Mobile slide menu */}
      <div
        className={`overflow-hidden transition-all duration-300 md:hidden ${
          menuOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="border-t border-gray-100 px-4 pb-4">
          <Link
            href="/search"
            className="block py-3 text-sm font-medium text-gray-600 hover:text-gray-900"
            onClick={() => setMenuOpen(false)}
          >
            Browse Homes
          </Link>
          {session && (
            <Link
              href="/account"
              className="block py-3 text-sm font-medium text-gray-600 hover:text-gray-900"
              onClick={() => setMenuOpen(false)}
            >
              My Bookings
            </Link>
          )}
          <Link
            href="/olympics"
            className="block py-3 text-sm font-medium text-gray-600 hover:text-gray-900"
            onClick={() => setMenuOpen(false)}
          >
            LA 2028
          </Link>
          <Link
            href="/contact"
            className="block py-3 text-sm font-medium text-gray-600 hover:text-gray-900"
            onClick={() => setMenuOpen(false)}
          >
            Contact
          </Link>
          <Link
            href="/list-your-home"
            className="block py-3 text-sm font-medium text-gray-600 hover:text-gray-900"
            onClick={() => setMenuOpen(false)}
          >
            List Your Home
          </Link>
        </div>
      </div>
    </nav>
  );
}
