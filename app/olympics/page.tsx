"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PasswordGate from "@/components/PasswordGate";

export default function OlympicsPage() {
  const [authenticated, setAuthenticated] = useState(false);

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-16">
        {authenticated ? (
          <div>
            <h1 className="text-3xl font-bold text-[#1B2A4A]">
              LA 2028 Olympic Rentals
            </h1>
            <p className="mt-4 text-gray-600">
              Olympic-designated properties will appear here.
            </p>
          </div>
        ) : (
          <PasswordGate onSuccess={() => setAuthenticated(true)} />
        )}
      </main>
      <Footer />
    </>
  );
}
