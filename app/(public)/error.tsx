"use client";

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
      <h1 className="font-serif text-3xl text-gray-900">Something went wrong</h1>
      <p className="mt-3 text-sm text-gray-500">We encountered an error loading this page.</p>
      <button
        onClick={reset}
        className="mt-6 rounded-full bg-[#4C6C4E] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#3d5a40]"
      >
        Try again
      </button>
    </div>
  );
}
