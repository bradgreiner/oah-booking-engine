import Navbar from "@/components/Navbar";

export default function Loading() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="mx-auto max-w-5xl px-4">
          <div className="h-4 w-24 rounded bg-gray-200" />
          <div className="mt-4 h-8 w-48 rounded bg-gray-200" />
          <div className="mt-6 flex flex-col gap-8 lg:flex-row">
            <div className="flex-1 space-y-6">
              <div className="h-40 animate-pulse rounded-xl bg-white shadow-sm" />
              <div className="h-80 animate-pulse rounded-xl bg-white shadow-sm" />
            </div>
            <div className="w-full lg:w-[340px] lg:shrink-0">
              <div className="h-60 animate-pulse rounded-xl bg-white shadow-sm" />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
