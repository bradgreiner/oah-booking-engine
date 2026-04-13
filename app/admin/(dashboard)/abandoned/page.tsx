"use client";

import { useEffect, useState } from "react";

interface Session {
  id: string;
  listingId: string;
  listingName: string | null;
  checkIn: string | null;
  checkOut: string | null;
  guestEmail: string | null;
  stepReached: string;
  imageUrl: string | null;
  emailSent: boolean;
  unsubscribed: boolean;
  createdAt: string;
}

const STEPS = ["widget", "request_form", "payment", "completed"];

const TABS = [
  { key: "all", label: "All" },
  { key: "not_emailed", label: "Not Emailed" },
  { key: "abandoned", label: "Abandoned" },
  { key: "completed", label: "Completed" },
] as const;

function StepIndicator({ stepReached }: { stepReached: string }) {
  const currentIdx = STEPS.indexOf(stepReached);
  return (
    <div className="flex items-center gap-1">
      {STEPS.map((step, i) => {
        let color = "bg-gray-200";
        if (i < currentIdx) color = "bg-[#4C6C4E]";
        else if (i === currentIdx && step !== "completed") color = "bg-red-400";
        else if (i === currentIdx && step === "completed") color = "bg-[#4C6C4E]";
        return (
          <div
            key={step}
            className={`h-2 w-2 rounded-full ${color}`}
            title={step}
          />
        );
      })}
    </div>
  );
}

export default function AdminAbandonedPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    fetchSessions();
  }, [activeTab]);

  async function fetchSessions() {
    setLoading(true);
    const params = activeTab !== "all" ? `?status=${activeTab}` : "";
    try {
      const res = await fetch(`/api/admin/sessions${params}`);
      if (res.ok) setSessions(await res.json());
    } catch { /* silently handle */ } finally {
      setLoading(false);
    }
  }

  function timeAgo(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return "just now";
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  }

  // Funnel metrics
  const total = sessions.length;
  const widgetCount = sessions.filter((s) => s.stepReached === "widget").length;
  const formCount = sessions.filter((s) => s.stepReached === "request_form").length;
  const paymentCount = sessions.filter((s) => s.stepReached === "payment").length;
  const completedCount = sessions.filter((s) => s.stepReached === "completed").length;
  const dropOffRate =
    total > 0 ? Math.round(((total - completedCount) / total) * 100) : 0;

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-gray-900">
        Abandoned Bookings
      </h1>
      <p className="mt-1 text-sm text-gray-500">
        Track where guests drop off in the booking flow
      </p>

      {/* Funnel metrics */}
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {[
          { label: "Widget clicks", value: widgetCount, color: "text-gray-600" },
          { label: "Reached form", value: formCount, color: "text-blue-600" },
          { label: "Reached payment", value: paymentCount, color: "text-amber-600" },
          { label: "Completed", value: completedCount, color: "text-[#4C6C4E]" },
          { label: "Total sessions", value: total, color: "text-gray-900" },
          { label: "Drop-off rate", value: `${dropOffRate}%`, color: "text-red-600" },
        ].map((m) => (
          <div
            key={m.label}
            className="rounded-lg border border-gray-100 bg-white p-4"
          >
            <p className="text-xs font-medium text-gray-500">{m.label}</p>
            <p className={`mt-1 text-2xl font-bold ${m.color}`}>{m.value}</p>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="mt-6 flex gap-2">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`rounded-full px-4 py-1.5 text-xs font-medium transition ${
              activeTab === tab.key
                ? "bg-[#4C6C4E] text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="mt-6 overflow-x-auto rounded-lg border border-gray-200 bg-white">
        {loading ? (
          <div className="p-8 text-center text-sm text-gray-500">
            Loading sessions...
          </div>
        ) : sessions.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-500">
            No sessions found
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Guest Email</th>
                <th className="px-4 py-3">Listing</th>
                <th className="px-4 py-3">Check-in</th>
                <th className="px-4 py-3">Check-out</th>
                <th className="px-4 py-3">Progress</th>
                <th className="px-4 py-3">Step</th>
                <th className="px-4 py-3">Email Sent</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {sessions.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-4 py-3 text-gray-500">
                    <div>
                      {new Date(s.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                    <div className="text-xs text-gray-500">
                      {timeAgo(s.createdAt)}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {s.guestEmail || "—"}
                  </td>
                  <td className="max-w-[200px] truncate px-4 py-3 font-medium text-gray-900">
                    {s.listingName || s.listingId}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {s.checkIn || "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {s.checkOut || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <StepIndicator stepReached={s.stepReached} />
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        s.stepReached === "completed"
                          ? "bg-green-50 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {s.stepReached}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {s.emailSent ? (
                      <span className="text-[#4C6C4E]">Yes</span>
                    ) : (
                      "No"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
