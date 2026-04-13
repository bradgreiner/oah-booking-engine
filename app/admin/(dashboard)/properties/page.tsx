"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Property {
  id: string;
  name: string;
  headline: string | null;
  neighborhood: string | null;
  city: string | null;
  bedrooms: number;
  bathrooms: number;
  propertyType: string;
  status: string;
  isOlympic: boolean;
  baseRate: number;
  images: { url: string; alt: string | null }[];
}

const tabs = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "draft", label: "Draft" },
  { key: "olympic", label: "Olympic Only" },
];

function typeLabel(t: string) {
  switch (t) {
    case "str":
      return "STR";
    case "monthly":
      return "Monthly";
    case "hybrid":
      return "Hybrid";
    default:
      return t;
  }
}

function statusBadge(status: string) {
  switch (status) {
    case "active":
      return "bg-green-50 text-green-700 ring-1 ring-green-600/20";
    case "draft":
      return "bg-gray-50 text-gray-600 ring-1 ring-gray-500/10";
    case "reserved":
      return "bg-blue-50 text-blue-700 ring-1 ring-blue-700/10";
    case "removed":
      return "bg-red-50 text-red-700 ring-1 ring-red-600/10";
    default:
      return "bg-gray-50 text-gray-600 ring-1 ring-gray-500/10";
  }
}

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchProperties();
  }, [activeTab]);

  async function fetchProperties() {
    setLoading(true);
    const params = new URLSearchParams();

    if (activeTab === "olympic") {
      params.set("isOlympic", "true");
    } else if (activeTab !== "all") {
      params.set("status", activeTab);
    }

    if (search) {
      params.set("search", search);
    }

    const res = await fetch(`/api/properties?${params}`);
    const data = await res.json();
    setProperties(data);
    setLoading(false);
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    fetchProperties();
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-gray-900">
            Properties
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your rental properties
          </p>
        </div>
        <Link
          href="/admin/properties/new"
          className="rounded-lg bg-[#4C6C4E] px-6 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#3d5a3f]"
        >
          + Add Property
        </Link>
      </div>

      {/* Filters */}
      <div className="mt-6 flex flex-wrap items-center gap-4">
        <div className="flex rounded-lg border border-gray-200 bg-white p-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`rounded-md px-3.5 py-1.5 text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? "bg-[#4C6C4E] text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSearch} className="flex-1">
          <div className="relative max-w-sm">
            <svg
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or neighborhood..."
              className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 focus:border-[#4C6C4E] focus:outline-none focus:ring-2 focus:ring-[#4C6C4E]/20"
            />
          </div>
        </form>
      </div>

      {/* Table */}
      <div className="mt-6 overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-sm text-gray-400">Loading properties...</p>
          </div>
        ) : properties.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
              <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
              </svg>
            </div>
            <p className="mt-3 text-sm font-medium text-gray-900">No properties found</p>
            <p className="mt-1 text-sm text-gray-400">Get started by adding your first property.</p>
            <Link
              href="/admin/properties/new"
              className="mt-4 rounded-lg bg-[#4C6C4E] px-4 py-2 text-sm font-medium text-white hover:bg-[#3d5a3f]"
            >
              + Add Property
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/80">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Photo
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Headline
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Neighborhood
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Beds/Baths
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Type
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Olympic
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Nightly Rate
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {properties.map((property, i) => (
                  <tr
                    key={property.id}
                    className={`transition-colors hover:bg-gray-50 ${
                      i % 2 === 1 ? "bg-gray-50/40" : ""
                    }`}
                  >
                    <td className="px-4 py-3">
                      {property.images[0] ? (
                        <img
                          src={property.images[0].url}
                          alt={property.images[0].alt || property.name}
                          className="h-10 w-14 rounded-md object-cover"
                        />
                      ) : (
                        <div className="flex h-10 w-14 items-center justify-center rounded-md bg-gray-100 text-[10px] font-medium text-gray-400">
                          No img
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/properties/${property.id}/edit`}
                        className="text-sm font-medium text-gray-900 hover:text-[#4C6C4E]"
                      >
                        {property.headline || property.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {property.neighborhood || property.city || "-"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {property.bedrooms}bd / {property.bathrooms}ba
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {typeLabel(property.propertyType)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium capitalize ${statusBadge(
                          property.status
                        )}`}
                      >
                        {property.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {property.isOlympic ? (
                        <span className="inline-flex rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-[#C5A55A] ring-1 ring-[#C5A55A]/20">
                          Olympic
                        </span>
                      ) : (
                        <span className="text-sm text-gray-300">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right text-sm font-medium text-gray-900">
                      ${property.baseRate.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/properties/${property.id}/edit`}
                        className="text-sm font-medium text-[#4C6C4E] hover:underline"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
