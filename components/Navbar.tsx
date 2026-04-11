"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link
          href="/"
          className="font-[Georgia,serif] text-xl font-bold text-[#4C6C4E]"
        >
          Open Air Homes
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-6 text-sm md:flex">
          <Link
            href="/search"
            className="text-gray-600 hover:text-[#1B2A4A]"
          >
            Browse Homes
          </Link>
          <Link
            href="/olympics"
            className="text-gray-600 hover:text-[#1B2A4A]"
          >
            LA 2028
          </Link>
          <Link
            href="#"
            className="text-gray-600 hover:text-[#1B2A4A]"
          >
            List Your Home
          </Link>
        </div>

        {/* Hamburger menu button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 md:hidden"
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-gray-100 px-4 pb-4 md:hidden">
          <Link
            href="/search"
            className="block py-3 text-sm text-gray-600 hover:text-[#1B2A4A]"
            onClick={() => setMenuOpen(false)}
          >
            Browse Homes
          </Link>
          <Link
            href="/olympics"
            className="block py-3 text-sm text-gray-600 hover:text-[#1B2A4A]"
            onClick={() => setMenuOpen(false)}
          >
            LA 2028
          </Link>
          <Link
            href="#"
            className="block py-3 text-sm text-gray-600 hover:text-[#1B2A4A]"
            onClick={() => setMenuOpen(false)}
          >
            List Your Home
          </Link>
        </div>
      )}
    </nav>
  );
}
