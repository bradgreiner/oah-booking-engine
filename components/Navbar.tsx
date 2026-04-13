"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 10);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

        {/* Desktop nav */}
        <div className="hidden items-center gap-6 md:flex">
          <Link
            href="/search"
            className="font-sans text-sm font-medium text-gray-700 hover:text-[#4C6C4E]"
          >
            Browse Homes
          </Link>
          <Link
            href="/olympics"
            className="font-sans text-sm font-medium text-gray-700 hover:text-[#4C6C4E]"
          >
            LA 2028
          </Link>
          <Link
            href="/list-your-home"
            className="rounded-full border border-[#4C6C4E] px-4 py-1.5 text-sm font-medium text-[#4C6C4E] transition-colors hover:bg-[#4C6C4E] hover:text-white"
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

      {/* Mobile slide menu */}
      <div
        className={`overflow-hidden transition-all duration-300 md:hidden ${
          menuOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
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
          <Link
            href="/olympics"
            className="block py-3 text-sm font-medium text-gray-600 hover:text-gray-900"
            onClick={() => setMenuOpen(false)}
          >
            LA 2028
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
