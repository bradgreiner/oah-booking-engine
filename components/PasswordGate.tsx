"use client";

import { useState } from "react";

interface PasswordGateProps {
  onSuccess: () => void;
}

export default function PasswordGate({ onSuccess }: PasswordGateProps) {
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
      onSuccess();
    } else {
      setError("Incorrect password. Please try again.");
    }
    setLoading(false);
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <h2 className="text-2xl font-bold text-[#1B2A4A]">
          LA 2028 Olympic Rentals
        </h2>
        <p className="text-sm text-gray-600">
          Enter the access password to view Olympic rental properties.
        </p>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Access password"
          className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-[#C9A84C] focus:outline-none"
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-[#1B2A4A] px-4 py-2 text-sm font-medium text-white hover:bg-[#2a3d66] disabled:opacity-50"
        >
          {loading ? "Verifying..." : "Enter"}
        </button>
      </form>
    </div>
  );
}
