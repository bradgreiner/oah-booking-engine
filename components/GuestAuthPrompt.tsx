"use client";

import { useState } from "react";
import { useSession, signIn } from "next-auth/react";

interface GuestAuthPromptProps {
  onAutoFill?: (data: { firstName: string; lastName: string; email: string }) => void;
}

export default function GuestAuthPrompt({ onAutoFill }: GuestAuthPromptProps) {
  const { data: session, status } = useSession();
  const [dismissed, setDismissed] = useState(false);
  const [signingIn, setSigningIn] = useState(false);
  const [signInError, setSignInError] = useState("");

  // If signed in, auto-fill and show badge
  if (status === "authenticated" && session?.user) {
    const nameParts = (session.user.name || "").split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    // Call onAutoFill once
    if (onAutoFill && session.user.email) {
      setTimeout(() => {
        onAutoFill({ firstName, lastName, email: session.user?.email || "" });
      }, 0);
    }

    return (
      <div className="mb-4 flex items-center gap-2 rounded-lg border border-[#4C6C4E]/20 bg-[#4C6C4E]/5 px-4 py-3">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4 text-[#4C6C4E]">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="text-sm text-[#4C6C4E]">Signed in as {session.user.email}</span>
      </div>
    );
  }

  if (dismissed || status === "loading") return null;

  async function handleGoogleSignIn() {
    setSigningIn(true);
    setSignInError("");
    try {
      await signIn("google", { redirect: false });
    } catch {
      setSignInError("Sign-in unavailable. Continue as guest below.");
    } finally {
      setSigningIn(false);
    }
  }

  return (
    <div className="mb-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-700">Sign in for faster checkout</h3>
      <p className="mt-1 text-xs text-gray-500">Auto-fill your details and track your booking.</p>

      <button
        onClick={handleGoogleSignIn}
        disabled={signingIn}
        className="mt-3 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:opacity-50"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" xmlns="http://www.w3.org/2000/svg">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        {signingIn ? "Signing in..." : "Continue with Google"}
      </button>

      {signInError && <p className="mt-2 text-xs text-red-500">{signInError}</p>}

      <div className="mt-3 flex items-center gap-3">
        <div className="h-px flex-1 bg-gray-200" />
        <span className="text-xs text-gray-400">or</span>
        <div className="h-px flex-1 bg-gray-200" />
      </div>

      <button
        onClick={() => setDismissed(true)}
        className="mt-3 w-full cursor-pointer text-center text-sm text-[#4C6C4E] hover:underline"
      >
        Continue as guest
      </button>
    </div>
  );
}
