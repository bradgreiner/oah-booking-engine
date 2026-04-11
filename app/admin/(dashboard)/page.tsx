import { prisma } from "@/lib/prisma";

export default async function AdminDashboard() {
  const [totalProperties, olympicProperties, totalBookings, pendingBookings] =
    await Promise.all([
      prisma.property.count(),
      prisma.property.count({ where: { isOlympic: true } }),
      prisma.bookingRequest.count(),
      prisma.bookingRequest.count({ where: { status: "pending" } }),
    ]);

  const stats = [
    {
      label: "Total Properties",
      value: totalProperties,
      color: "text-[#4C6C4E]",
      bg: "bg-green-50",
    },
    {
      label: "Olympic Properties",
      value: olympicProperties,
      color: "text-[#C5A55A]",
      bg: "bg-amber-50",
    },
    {
      label: "Total Bookings",
      value: totalBookings,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Pending Bookings",
      value: pendingBookings,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
  ];

  return (
    <div>
      <h1 className="font-[Georgia,serif] text-2xl font-bold text-gray-900">
        Dashboard
      </h1>
      <p className="mt-1 text-sm text-gray-500">
        Overview of your properties and bookings
      </p>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg bg-white p-6 shadow-sm"
          >
            <p className="text-sm font-medium text-gray-500">{stat.label}</p>
            <p className={`mt-2 text-3xl font-bold ${stat.color}`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h2 className="font-[Georgia,serif] text-lg font-semibold text-gray-900">
            Quick Actions
          </h2>
          <div className="mt-4 space-y-3">
            <a
              href="/admin/properties/new"
              className="flex items-center gap-3 rounded-lg border border-gray-200 p-4 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#4C6C4E] text-white text-lg">
                +
              </span>
              Add New Property
            </a>
            <a
              href="/admin/properties"
              className="flex items-center gap-3 rounded-lg border border-gray-200 p-4 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </span>
              View All Properties
            </a>
            <a
              href="/admin/venues"
              className="flex items-center gap-3 rounded-lg border border-gray-200 p-4 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-[#C5A55A]">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
              </span>
              Olympic Venues
            </a>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h2 className="font-[Georgia,serif] text-lg font-semibold text-gray-900">
            Recent Activity
          </h2>
          <p className="mt-4 text-sm text-gray-500">
            No recent activity to display.
          </p>
        </div>
      </div>
    </div>
  );
}
