import Navbar from "@/components/Navbar";

export default function Loading() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        <div className="relative h-[220px] animate-pulse bg-gray-200" />
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="flex gap-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-10 w-24 rounded-full bg-gray-200" />
            ))}
          </div>
          <hr className="mt-4 border-gray-200" />
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse rounded-2xl bg-white shadow-sm">
                <div className="aspect-[4/3] rounded-t-2xl bg-gray-200" />
                <div className="p-4 space-y-2">
                  <div className="h-5 w-3/4 rounded bg-gray-200" />
                  <div className="h-4 w-1/2 rounded bg-gray-200" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
