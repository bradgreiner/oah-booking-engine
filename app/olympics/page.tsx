"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function OlympicsGatePage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/olympics/verify-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push("/olympics/browse");
    } else {
      setError("Invalid access code");
    }
    setLoading(false);
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#F5F3EF]">
      {/* Header */}
      <header className="border-b border-[#C5A55A]/20 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <Link href="/" className="font-[Georgia,serif] text-xl font-bold text-[#4C6C4E]">
            Open Air Homes
          </Link>
          <span className="rounded-full border border-[#C5A55A]/30 bg-[#C5A55A]/10 px-3 py-1 text-xs font-medium text-[#C5A55A]">
            LA 2028
          </span>
        </div>
      </header>

      {/* Gate */}
      <main className="flex flex-1 items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#C5A55A]/10">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-8 w-8 text-[#C5A55A]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </div>

          <h1 className="mt-6 font-[Georgia,serif] text-3xl font-bold text-[#1B2A4A]">
            LA 2028 Olympics
          </h1>
          <p className="mt-1 font-[Georgia,serif] text-lg text-[#C5A55A]">
            Private Home Collection
          </p>
          <p className="mx-auto mt-4 max-w-sm text-sm text-gray-500">
            Exclusive furnished homes for teams, delegations, and corporate
            groups. Not available on Airbnb or VRBO.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter access code"
              className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-center text-sm outline-none focus:border-[#C5A55A] focus:ring-1 focus:ring-[#C5A55A]"
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={loading || !password}
              className="w-full rounded-lg bg-[#4C6C4E] py-3 text-sm font-semibold text-white transition hover:bg-[#3d5a3f] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Access Collection"}
            </button>
          </form>

          <p className="mt-6 text-xs text-gray-400">
            Contact brad@openairhomes.com for access credentials
          </p>
        </div>
      </main>
    </div>
  );
}
