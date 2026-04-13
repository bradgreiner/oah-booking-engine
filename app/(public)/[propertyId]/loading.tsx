import Navbar from "@/components/Navbar";

export default function Loading() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">
        {/* Photo grid skeleton */}
        <div className="mx-auto max-w-7xl md:px-4 md:pt-6">
          <div className="grid h-[250px] grid-cols-1 gap-2 md:h-[420px] md:grid-cols-4 md:grid-rows-2 md:rounded-xl">
            <div className="col-span-1 row-span-2 animate-pulse bg-gray-200 md:col-span-2 md:rounded-l-xl" />
            {[...Array(4)].map((_, i) => (
              <div key={i} className="hidden animate-pulse bg-gray-200 md:block" />
            ))}
          </div>
        </div>
        {/* Content skeleton */}
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="flex flex-col gap-8 lg:flex-row">
            <div className="flex-1 space-y-4">
              <div className="h-10 w-3/4 rounded bg-gray-200" />
              <div className="h-5 w-1/2 rounded bg-gray-200" />
              <div className="h-4 w-1/3 rounded bg-gray-200" />
              <div className="mt-8 space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-4 w-full rounded bg-gray-100" />
                ))}
              </div>
            </div>
            <div className="hidden w-[380px] shrink-0 lg:block">
              <div className="h-[400px] animate-pulse rounded-2xl bg-gray-100" />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
