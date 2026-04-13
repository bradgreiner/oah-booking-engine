import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

function timeAgo(date: Date): string {
  const diff = Date.now() - date.getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return "just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default async function AdminDashboard() {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const [
    totalProperties,
    olympicProperties,
    totalBookings,
    pendingBookings,
    approvedThisMonth,
    totalLeads,
    newLeads,
    abandonedSessions,
    completedBookings,
    recentBookings,
  ] = await Promise.all([
    prisma.property.count(),
    prisma.property.count({ where: { isOlympic: true } }),
    prisma.bookingRequest.count(),
    prisma.bookingRequest.count({ where: { status: "pending" } }),
    prisma.bookingRequest.count({
      where: {
        status: "approved",
        createdAt: { gte: monthStart },
      },
    }),
    prisma.homeownerLead.count().catch(() => 0),
    prisma.homeownerLead.count({ where: { status: "new" } }).catch(() => 0),
    prisma.bookingSession
      .count({ where: { stepReached: { not: "completed" } } })
      .catch(() => 0),
    prisma.bookingSession
      .count({ where: { stepReached: "completed" } })
      .catch(() => 0),
    prisma.bookingRequest.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        property: { select: { name: true, headline: true } },
        guest: { select: { firstName: true, lastName: true } },
      },
    }),
  ]);

  const STATUS_STYLES: Record<string, string> = {
    pending: "bg-yellow-50 text-yellow-700",
    approved: "bg-green-50 text-green-700",
    declined: "bg-red-50 text-red-700",
  };

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-gray-900">
        Dashboard
      </h1>
      <p className="mt-1 text-sm text-gray-500">
        Overview of your properties and bookings
      </p>

      {/* Bookings stats */}
      <div className="mt-8">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
          Bookings
        </h2>
        <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-gray-100 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-gray-500">Pending</p>
            <p className="mt-1 text-3xl font-bold text-amber-600">
              {pendingBookings}
            </p>
          </div>
          <div className="rounded-lg border border-gray-100 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Approved this month
            </p>
            <p className="mt-1 text-3xl font-bold text-[#4C6C4E]">
              {approvedThisMonth}
            </p>
          </div>
          <div className="rounded-lg border border-gray-100 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-gray-500">Total bookings</p>
            <p className="mt-1 text-3xl font-bold text-gray-700">
              {totalBookings}
            </p>
          </div>
        </div>
      </div>

      {/* Pipeline stats */}
      <div className="mt-8">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
          Pipeline
        </h2>
        <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Link
            href="/admin/leads"
            className="rounded-lg border border-gray-100 bg-white p-5 shadow-sm transition hover:border-blue-200"
          >
            <p className="text-sm font-medium text-gray-500">New leads</p>
            <p className="mt-1 text-3xl font-bold text-blue-600">{newLeads}</p>
            <p className="mt-1 text-xs text-gray-400">
              {totalLeads} total leads
            </p>
          </Link>
          <Link
            href="/admin/abandoned"
            className="rounded-lg border border-gray-100 bg-white p-5 shadow-sm transition hover:border-red-200"
          >
            <p className="text-sm font-medium text-gray-500">
              Abandoned sessions
            </p>
            <p className="mt-1 text-3xl font-bold text-red-600">
              {abandonedSessions}
            </p>
            <p className="mt-1 text-xs text-gray-400">
              {completedBookings} completed
            </p>
          </Link>
          <div className="rounded-lg border border-gray-100 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-gray-500">Properties</p>
            <p className="mt-1 text-3xl font-bold text-[#4C6C4E]">
              {totalProperties}
            </p>
            <p className="mt-1 text-xs text-gray-400">
              {olympicProperties} Olympic
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Bookings */}
        <div className="rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-lg font-semibold text-gray-900">
              Recent Bookings
            </h2>
            <Link
              href="/admin/bookings"
              className="text-xs font-medium text-[#4C6C4E] hover:underline"
            >
              View all
            </Link>
          </div>
          {recentBookings.length > 0 ? (
            <div className="mt-4 space-y-3">
              {recentBookings.map((b) => (
                <Link
                  key={b.id}
                  href="/admin/bookings"
                  className="flex items-center justify-between rounded-lg border border-gray-100 p-3 transition hover:bg-gray-50"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-gray-900">
                      {b.guest.firstName} {b.guest.lastName}
                    </p>
                    <p className="truncate text-xs text-gray-500">
                      {b.property.headline || b.property.name}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${
                        STATUS_STYLES[b.status] || "bg-gray-50 text-gray-700"
                      }`}
                    >
                      {b.status}
                    </span>
                    <span className="whitespace-nowrap text-xs text-gray-400">
                      {timeAgo(b.createdAt)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="mt-4 flex h-32 items-center justify-center rounded-lg bg-gray-50">
              <p className="text-sm text-gray-500">No bookings yet</p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="font-serif text-lg font-semibold text-gray-900">
            Quick Actions
          </h2>
          <div className="mt-4 space-y-3">
            <Link
              href="/admin/bookings"
              className="flex items-center gap-3 rounded-lg border border-gray-200 p-4 text-sm font-medium text-gray-700 transition-colors hover:border-amber-200 hover:bg-amber-50/50"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </span>
              View Pending Bookings
              {pendingBookings > 0 && (
                <span className="ml-auto rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">
                  {pendingBookings}
                </span>
              )}
            </Link>
            <Link
              href="/admin/leads"
              className="flex items-center gap-3 rounded-lg border border-gray-200 p-4 text-sm font-medium text-gray-700 transition-colors hover:border-blue-200 hover:bg-blue-50/50"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
                  />
                </svg>
              </span>
              View New Leads
              {newLeads > 0 && (
                <span className="ml-auto rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700">
                  {newLeads}
                </span>
              )}
            </Link>
            <Link
              href="/admin/properties/new"
              className="flex items-center gap-3 rounded-lg border border-gray-200 p-4 text-sm font-medium text-gray-700 transition-colors hover:border-[#4C6C4E]/30 hover:bg-[#4C6C4E]/5"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#4C6C4E] text-sm font-bold text-white">
                +
              </span>
              Add New Property
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
