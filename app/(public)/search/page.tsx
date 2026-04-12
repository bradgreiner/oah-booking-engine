import Image from "next/image";
import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SearchContent from "@/components/SearchContent";

export default function SearchPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        {/* Photo header */}
        <div className="relative h-[220px] overflow-hidden">
          <Image
            src="/images/homes/Washington_20.jpg"
            alt="Browse homes"
            fill
            className="object-cover"
            quality={85}
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <h1 className="font-serif text-4xl font-normal text-white">
              Browse Homes
            </h1>
            <p className="mt-2 text-base text-white/70">
              Furnished homes across Southern California
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
                    <div className="aspect-[4/3] rounded-t-xl bg-gray-200" />
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
