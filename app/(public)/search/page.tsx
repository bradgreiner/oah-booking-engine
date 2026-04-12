import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SearchContent from "@/components/SearchContent";

export default function SearchPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        <div className="border-b border-gray-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-6">
            <h1 className="font-[Georgia,serif] text-2xl font-bold text-[#1a1a1a]">
              Browse Homes
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Furnished rentals across Southern California
            </p>
          </div>
        </div>

        <Suspense
          fallback={
            <div className="mx-auto max-w-7xl px-4 py-6">
              <div className="grid gap-6 sm:grid-cols-2">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="animate-pulse rounded-xl bg-white shadow-sm"
                  >
                    <div className="aspect-[3/2] rounded-t-xl bg-gray-200" />
                    <div className="p-4">
                      <div className="h-5 w-3/4 rounded bg-gray-200" />
                      <div className="mt-2 h-4 w-1/2 rounded bg-gray-200" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          }
        >
          <SearchContent />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
