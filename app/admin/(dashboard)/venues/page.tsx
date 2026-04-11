import { prisma } from "@/lib/prisma";

export default async function VenuesPage() {
  const venues = await prisma.olympicVenue.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <div>
        <h1 className="font-[Georgia,serif] text-2xl font-bold text-gray-900">
          Olympic Venues
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          LA 2028 Olympic venue locations ({venues.length} venues)
        </p>
      </div>

      <div className="mt-6 overflow-hidden rounded-lg bg-white shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Venue Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Sport / Events
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Description
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                Coordinates
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {venues.map((venue, i) => (
              <tr
                key={venue.id}
                className={`${i % 2 === 1 ? "bg-gray-50/50" : ""}`}
              >
                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                  {venue.name}
                </td>
                <td className="px-4 py-3">
                  <span className="inline-block rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-[#C5A55A]">
                    {venue.sport}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">
                  {venue.description || "-"}
                </td>
                <td className="px-4 py-3 text-right text-sm text-gray-500">
                  {venue.lat.toFixed(4)}, {venue.lng.toFixed(4)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
