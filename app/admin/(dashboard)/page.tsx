import { prisma } from "@/lib/prisma";
import Link from "next/link";

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
      accent: "text-[#4C6C4E]",
    },
    {
      label: "Olympic Properties",
      value: olympicProperties,
      accent: "text-[#C5A55A]",
    },
    {
      label: "Total Bookings",
      value: totalBookings,
      accent: "text-blue-600",
    },
    {
      label: "Pending Bookings",
      value: pendingBookings,
      accent: "text-orange-600",
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

      {/* Stats Grid */}
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg border border-gray-100 bg-white p-6 shadow-sm"
          >
            <p className="text-sm font-medium text-gray-500">{stat.label}</p>
            <p className={`mt-2 text-3xl font-bold ${stat.accent}`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="font-[Georgia,serif] text-lg font-semibold text-gray-900">
            Quick Actions
          </h2>
          <div className="mt-4 space-y-3">
            <Link
              href="/admin/properties/new"
              className="flex items-center gap-3 rounded-lg border border-gray-200 p-4 text-sm font-medium text-gray-700 transition-colors hover:border-[#4C6C4E]/30 hover:bg-[#4C6C4E]/5"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#4C6C4E] text-white text-sm font-bold">
                +
              </span>
              Add New Property
            </Link>
            <Link
              href="/admin/properties"
              className="flex items-center gap-3 rounded-lg border border-gray-200 p-4 text-sm font-medium text-gray-700 transition-colors hover:border-blue-200 hover:bg-blue-50/50"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </span>
              View All Properties
            </Link>
            <Link
              href="/admin/venues"
              className="flex items-center gap-3 rounded-lg border border-gray-200 p-4 text-sm font-medium text-gray-700 transition-colors hover:border-amber-200 hover:bg-amber-50/50"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-[#C5A55A]">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
              </span>
              Olympic Venues
            </Link>
          </div>
        </div>

        <div className="rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="font-[Georgia,serif] text-lg font-semibold text-gray-900">
            Recent Activity
          </h2>
          <div className="mt-4 flex h-32 items-center justify-center rounded-lg bg-gray-50">
            <p className="text-sm text-gray-400">No recent activity</p>
          </div>
        </div>
      </div>
    </div>
  );
}
