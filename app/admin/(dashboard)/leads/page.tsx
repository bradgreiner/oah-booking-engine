"use client";

import { useEffect, useState } from "react";

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  propertyAddress: string;
  city: string | null;
  message: string | null;
  source: string | null;
  status: string;
  createdAt: string;
}

const STATUS_STYLES: Record<string, string> = {
  new: "bg-blue-50 text-blue-700",
  contacted: "bg-yellow-50 text-yellow-700",
  qualified: "bg-green-50 text-green-700",
  disqualified: "bg-red-50 text-red-700",
};

const TABS = ["all", "new", "contacted", "qualified"] as const;

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetchLeads();
  }, [activeTab]);

  async function fetchLeads() {
    setLoading(true);
    const params = activeTab !== "all" ? `?status=${activeTab}` : "";
    try {
      const res = await fetch(`/api/admin/leads${params}`);
      if (res.ok) setLeads(await res.json());
    } catch { /* silently handle */ } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id: string, status: string) {
    try {
      const res = await fetch("/api/admin/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        setLeads((prev) =>
          prev.map((l) => (l.id === id ? { ...l, status } : l))
        );
      }
    } catch { /* silently handle */ }
  }

  function timeAgo(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return "just now";
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  }

  const counts = leads.reduce(
    (acc, l) => {
      acc[l.status] = (acc[l.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-gray-900">
        Homeowner Leads
      </h1>
      <p className="mt-1 text-sm text-gray-500">
        Leads from the List Your Home page
      </p>

      {/* Filter tabs */}
      <div className="mt-6 flex gap-2">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`rounded-full px-4 py-1.5 text-xs font-medium capitalize transition ${
              activeTab === tab
                ? "bg-[#4C6C4E] text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {tab}{" "}
            {tab === "all"
              ? `(${leads.length})`
              : counts[tab]
                ? `(${counts[tab]})`
                : ""}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="mt-6 overflow-x-auto rounded-lg border border-gray-200 bg-white">
        {loading ? (
          <div className="p-8 text-center text-sm text-gray-500">
            Loading leads...
          </div>
        ) : leads.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-500">
            No leads found
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Address</th>
                <th className="px-4 py-3">City</th>
                <th className="px-4 py-3">Source</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {leads.map((lead) => (
                <>
                  <tr
                    key={lead.id}
                    className="cursor-pointer transition-colors hover:bg-gray-50"
                    onClick={() =>
                      setExpandedId(expandedId === lead.id ? null : lead.id)
                    }
                  >
                    <td className="whitespace-nowrap px-4 py-3 text-gray-500">
                      <div>
                        {new Date(lead.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                      <div className="text-xs text-gray-500">
                        {timeAgo(lead.createdAt)}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {lead.name}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{lead.email}</td>
                    <td className="px-4 py-3 text-gray-600">{lead.phone}</td>
                    <td className="max-w-[200px] truncate px-4 py-3 text-gray-600">
                      {lead.propertyAddress}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {lead.city || "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {lead.source || "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                          STATUS_STYLES[lead.status] ||
                          "bg-gray-50 text-gray-700"
                        }`}
                      >
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={lead.status}
                        onChange={(e) => {
                          e.stopPropagation();
                          updateStatus(lead.id, e.target.value);
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="rounded border border-gray-200 bg-white px-2 py-1 text-xs outline-none focus:border-[#4C6C4E]"
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="qualified">Qualified</option>
                        <option value="disqualified">Disqualified</option>
                      </select>
                    </td>
                  </tr>
                  {expandedId === lead.id && lead.message && (
                    <tr key={`${lead.id}-expanded`}>
                      <td colSpan={9} className="bg-gray-50 px-4 py-3">
                        <p className="text-xs font-medium text-gray-500">
                          Message
                        </p>
                        <p className="mt-1 text-sm text-gray-700">
                          {lead.message}
                        </p>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
