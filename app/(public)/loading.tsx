import Navbar from "@/components/Navbar";

export default function Loading() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero skeleton */}
        <div className="relative min-h-[560px] animate-pulse bg-gray-200" />
        {/* Content skeleton */}
        <div className="mx-auto max-w-7xl px-4 py-16">
          <div className="h-8 w-48 rounded bg-gray-200" />
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-2xl bg-white shadow-sm">
                <div className="aspect-[4/3] rounded-t-2xl bg-gray-200" />
                <div className="p-4 space-y-2">
                  <div className="h-5 w-3/4 rounded bg-gray-200" />
                  <div className="h-4 w-1/2 rounded bg-gray-200" />
                  <div className="h-5 w-1/3 rounded bg-gray-200" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
