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
      return "bg-green-100 text-green-700";
    case "draft":
      return "bg-gray-100 text-gray-600";
    case "reserved":
      return "bg-blue-100 text-blue-700";
    case "removed":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-600";
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-[Georgia,serif] text-2xl font-bold text-gray-900">
            Properties
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your rental properties
          </p>
        </div>
        <Link
          href="/admin/properties/new"
          className="rounded-lg bg-[#4C6C4E] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#3d5a3f]"
        >
          + Add Property
        </Link>
      </div>

      <div className="mt-6 flex items-center gap-4">
        <div className="flex gap-1 rounded-lg bg-white p-1 shadow-sm">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? "bg-[#4C6C4E] text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSearch} className="flex-1">
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or neighborhood..."
              className="w-full max-w-md rounded-lg border border-gray-300 bg-white px-4 py-2 pl-10 text-sm focus:border-[#4C6C4E] focus:outline-none focus:ring-1 focus:ring-[#4C6C4E]"
            />
            <svg
              className="absolute left-3 top-2.5 h-4 w-4 text-gray-400"
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
          </div>
        </form>
      </div>

      <div className="mt-6 overflow-hidden rounded-lg bg-white shadow-sm">
        {loading ? (
          <div className="p-12 text-center text-sm text-gray-500">
            Loading properties...
          </div>
        ) : properties.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-sm text-gray-500">No properties found.</p>
            <Link
              href="/admin/properties/new"
              className="mt-4 inline-block text-sm font-medium text-[#4C6C4E] hover:underline"
            >
              Add your first property
            </Link>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Photo
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Headline
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Neighborhood
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Beds/Baths
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Olympic
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                  Nightly Rate
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {properties.map((property, i) => (
                <tr
                  key={property.id}
                  className={`transition-colors hover:bg-gray-50 ${
                    i % 2 === 1 ? "bg-gray-50/50" : ""
                  }`}
                >
                  <td className="px-4 py-3">
                    {property.images[0] ? (
                      <img
                        src={property.images[0].url}
                        alt={property.images[0].alt || property.name}
                        className="h-10 w-14 rounded object-cover"
                      />
                    ) : (
                      <div className="flex h-10 w-14 items-center justify-center rounded bg-gray-100 text-xs text-gray-400">
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
                      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${statusBadge(
                        property.status
                      )}`}
                    >
                      {property.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {property.isOlympic ? (
                      <span className="inline-block rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-[#C5A55A]">
                        Olympic
                      </span>
                    ) : (
                      "-"
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
        )}
      </div>
    </div>
  );
}
