export default function SearchSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="animate-pulse rounded-xl bg-white shadow-sm">
          <div className="aspect-[3/2] rounded-t-xl bg-gray-200" />
          <div className="p-4">
            <div className="h-5 w-3/4 rounded bg-gray-200" />
            <div className="mt-2 h-4 w-1/2 rounded bg-gray-200" />
            <div className="mt-3 h-6 w-24 rounded bg-gray-200" />
          </div>
        </div>
      ))}
    </div>
  );
}
