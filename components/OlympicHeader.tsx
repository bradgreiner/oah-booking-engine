"use client";

import Link from "next/link";
import { useState } from "react";

export default function OlympicHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="border-b border-[#4C6C4E]/20 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <div className="flex items-center gap-3">
          <Link href="/" className="font-serif text-xl font-bold text-[#4C6C4E]">
            Open Air Homes
          </Link>
          <span className="hidden text-gray-300 sm:inline">&middot;</span>
          <Link
            href="/olympics/browse"
            className="hidden font-serif text-sm font-semibold text-[#4C6C4E] sm:inline"
          >
            LA 2028
          </Link>
        </div>

        {/* Desktop nav */}
        <div className="hidden items-center gap-6 text-sm md:flex">
          <Link href="/olympics/browse" className="text-gray-600 hover:text-[#4C6C4E]">
            Browse Homes
          </Link>
          <Link href="/search" className="text-gray-600 hover:text-[#4C6C4E]">
            All Properties
          </Link>
        </div>

        {/* Hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 md:hidden"
          aria-label="Toggle menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-6 w-6">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            )}
          </svg>
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-gray-100 px-4 pb-4 md:hidden">
          <Link href="/olympics/browse" className="block py-3 text-sm text-gray-600" onClick={() => setMenuOpen(false)}>
            Browse Olympic Homes
          </Link>
          <Link href="/search" className="block py-3 text-sm text-gray-600" onClick={() => setMenuOpen(false)}>
            All Properties
          </Link>
        </div>
      )}
    </nav>
  );
}
