import { prisma } from "@/lib/prisma";

export default async function VenuesPage() {
  const venues = await prisma.olympicVenue.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <div>
        <h1 className="font-serif text-2xl font-bold text-gray-900">
          Olympic Venues
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          LA 2028 Olympic venue locations &middot; {venues.length} venues
        </p>
      </div>

      <div className="mt-6 overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/80">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Venue Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Sport / Events
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Description
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Coordinates
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {venues.map((venue, i) => (
                <tr
                  key={venue.id}
                  className={`transition-colors hover:bg-gray-50 ${
                    i % 2 === 1 ? "bg-gray-50/40" : ""
                  }`}
                >
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {venue.name}
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-[#4C6C4E] ring-1 ring-[#4C6C4E]/20">
                      {venue.sport}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {venue.description || "-"}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-xs text-gray-400">
                    {venue.lat.toFixed(4)}, {venue.lng.toFixed(4)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
