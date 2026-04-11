"use client";

import { useState } from "react";
import Link from "next/link";

interface PropertyData {
  id?: string;
  name: string;
  headline: string;
  description: string;
  neighborhood: string;
  address: string;
  city: string;
  state: string;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  sqft: string;
  propertyType: string;
  baseRate: string;
  weeklyDiscount: string;
  monthlyDiscount: string;
  cleaningFee: string;
  petFee: string;
  minNights: string;
  maxNights: string;
  totRate: string;
  isOlympic: boolean;
  olympicOnly: boolean;
  availableStart: string;
  availableEnd: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  amenities: string[];
  status: string;
}

const AMENITIES = [
  "Pool",
  "Hot Tub",
  "Outdoor Space",
  "Parking",
  "Pet Friendly",
  "Views",
  "Gym",
  "EV Charger",
  "WiFi",
  "Air Conditioning",
  "Washer/Dryer",
  "Kitchen",
  "BBQ Grill",
  "Fire Pit",
  "Beach Access",
  "Balcony",
];

const defaultData: PropertyData = {
  name: "",
  headline: "",
  description: "",
  neighborhood: "",
  address: "",
  city: "Los Angeles",
  state: "CA",
  bedrooms: 0,
  bathrooms: 0,
  maxGuests: 1,
  sqft: "",
  propertyType: "str",
  baseRate: "",
  weeklyDiscount: "0",
  monthlyDiscount: "0",
  cleaningFee: "",
  petFee: "0",
  minNights: "1",
  maxNights: "",
  totRate: "0.12",
  isOlympic: false,
  olympicOnly: false,
  availableStart: "",
  availableEnd: "",
  ownerName: "",
  ownerEmail: "",
  ownerPhone: "",
  amenities: [],
  status: "draft",
};

export default function PropertyForm({
  initialData,
  onSubmit,
}: {
  initialData?: Partial<PropertyData>;
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
}) {
  const [form, setForm] = useState<PropertyData>({
    ...defaultData,
    ...initialData,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function update(field: string, value: unknown) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function toggleAmenity(amenity: string) {
    setForm((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      await onSubmit({
        name: form.name,
        headline: form.headline,
        description: form.description,
        neighborhood: form.neighborhood,
        address: form.address,
        city: form.city,
        state: form.state,
        bedrooms: form.bedrooms,
        bathrooms: form.bathrooms,
        maxGuests: form.maxGuests,
        sqft: form.sqft,
        propertyType: form.propertyType,
        baseRate: form.baseRate,
        weeklyDiscount: form.weeklyDiscount,
        monthlyDiscount: form.monthlyDiscount,
        cleaningFee: form.cleaningFee,
        petFee: form.petFee,
        minNights: form.minNights,
        maxNights: form.maxNights,
        totRate: form.totRate,
        isOlympic: form.isOlympic,
        olympicOnly: form.olympicOnly,
        availableStart: form.availableStart,
        availableEnd: form.availableEnd,
        ownerName: form.ownerName,
        ownerEmail: form.ownerEmail,
        ownerPhone: form.ownerPhone,
        amenities: form.amenities,
        status: form.status,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save property");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Basic Information */}
      <section className="rounded-lg bg-white p-6 shadow-sm">
        <h2 className="font-[Georgia,serif] text-lg font-semibold text-gray-900">
          Basic Information
        </h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Property Name *
            </label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#4C6C4E] focus:outline-none focus:ring-1 focus:ring-[#4C6C4E]"
              placeholder="e.g. Venice Beach Bungalow"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Headline
            </label>
            <input
              type="text"
              value={form.headline}
              onChange={(e) => update("headline", e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#4C6C4E] focus:outline-none focus:ring-1 focus:ring-[#4C6C4E]"
              placeholder="Short marketing headline"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              rows={4}
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#4C6C4E] focus:outline-none focus:ring-1 focus:ring-[#4C6C4E]"
              placeholder="Describe the property..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Neighborhood
            </label>
            <input
              type="text"
              value={form.neighborhood}
              onChange={(e) => update("neighborhood", e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#4C6C4E] focus:outline-none focus:ring-1 focus:ring-[#4C6C4E]"
              placeholder="e.g. Venice, Silver Lake"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Full Address (internal)
            </label>
            <input
              type="text"
              value={form.address}
              onChange={(e) => update("address", e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#4C6C4E] focus:outline-none focus:ring-1 focus:ring-[#4C6C4E]"
              placeholder="123 Main St"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              City
            </label>
            <input
              type="text"
              value={form.city}
              onChange={(e) => update("city", e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#4C6C4E] focus:outline-none focus:ring-1 focus:ring-[#4C6C4E]"
              placeholder="Los Angeles"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              State
            </label>
            <input
              type="text"
              value={form.state}
              onChange={(e) => update("state", e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#4C6C4E] focus:outline-none focus:ring-1 focus:ring-[#4C6C4E]"
              placeholder="CA"
            />
          </div>
        </div>
      </section>

      {/* Property Details */}
      <section className="rounded-lg bg-white p-6 shadow-sm">
        <h2 className="font-[Georgia,serif] text-lg font-semibold text-gray-900">
          Property Details
        </h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Bedrooms
            </label>
            <input
              type="number"
              min="0"
              value={form.bedrooms}
              onChange={(e) => update("bedrooms", parseInt(e.target.value) || 0)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#4C6C4E] focus:outline-none focus:ring-1 focus:ring-[#4C6C4E]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Bathrooms
            </label>
            <input
              type="number"
              min="0"
              step="0.5"
              value={form.bathrooms}
              onChange={(e) =>
                update("bathrooms", parseFloat(e.target.value) || 0)
              }
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#4C6C4E] focus:outline-none focus:ring-1 focus:ring-[#4C6C4E]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Guest Capacity
            </label>
            <input
              type="number"
              min="1"
              value={form.maxGuests}
              onChange={(e) =>
                update("maxGuests", parseInt(e.target.value) || 1)
              }
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#4C6C4E] focus:outline-none focus:ring-1 focus:ring-[#4C6C4E]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Square Feet
            </label>
            <input
              type="number"
              min="0"
              value={form.sqft}
              onChange={(e) => update("sqft", e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#4C6C4E] focus:outline-none focus:ring-1 focus:ring-[#4C6C4E]"
              placeholder="Optional"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Property Type
            </label>
            <select
              value={form.propertyType}
              onChange={(e) => update("propertyType", e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#4C6C4E] focus:outline-none focus:ring-1 focus:ring-[#4C6C4E]"
            >
              <option value="str">STR (Short Term Rental)</option>
              <option value="monthly">Monthly</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              value={form.status}
              onChange={(e) => update("status", e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#4C6C4E] focus:outline-none focus:ring-1 focus:ring-[#4C6C4E]"
            >
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="reserved">Reserved</option>
              <option value="removed">Removed</option>
            </select>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="rounded-lg bg-white p-6 shadow-sm">
        <h2 className="font-[Georgia,serif] text-lg font-semibold text-gray-900">
          Pricing
        </h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nightly Rate ($)
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.baseRate}
              onChange={(e) => update("baseRate", e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#4C6C4E] focus:outline-none focus:ring-1 focus:ring-[#4C6C4E]"
              placeholder="0.00"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Weekly Discount (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={form.weeklyDiscount}
              onChange={(e) => update("weeklyDiscount", e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#4C6C4E] focus:outline-none focus:ring-1 focus:ring-[#4C6C4E]"
              placeholder="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Monthly Discount (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={form.monthlyDiscount}
              onChange={(e) => update("monthlyDiscount", e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#4C6C4E] focus:outline-none focus:ring-1 focus:ring-[#4C6C4E]"
              placeholder="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Cleaning Fee ($)
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.cleaningFee}
              onChange={(e) => update("cleaningFee", e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#4C6C4E] focus:outline-none focus:ring-1 focus:ring-[#4C6C4E]"
              placeholder="0.00"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Pet Fee ($)
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.petFee}
              onChange={(e) => update("petFee", e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#4C6C4E] focus:outline-none focus:ring-1 focus:ring-[#4C6C4E]"
              placeholder="0.00"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              TOT Rate
            </label>
            <input
              type="number"
              min="0"
              max="1"
              step="0.01"
              value={form.totRate}
              onChange={(e) => update("totRate", e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#4C6C4E] focus:outline-none focus:ring-1 focus:ring-[#4C6C4E]"
              placeholder="0.12"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Min Nights
            </label>
            <input
              type="number"
              min="1"
              value={form.minNights}
              onChange={(e) => update("minNights", e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#4C6C4E] focus:outline-none focus:ring-1 focus:ring-[#4C6C4E]"
              placeholder="1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Max Nights
            </label>
            <input
              type="number"
              min="1"
              value={form.maxNights}
              onChange={(e) => update("maxNights", e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#4C6C4E] focus:outline-none focus:ring-1 focus:ring-[#4C6C4E]"
              placeholder="Optional"
            />
          </div>
        </div>
      </section>

      {/* Olympic Settings */}
      <section className="rounded-lg bg-white p-6 shadow-sm">
        <h2 className="font-[Georgia,serif] text-lg font-semibold text-gray-900">
          Olympic Settings
        </h2>
        <div className="mt-4 space-y-4">
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.isOlympic}
                onChange={(e) => update("isOlympic", e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-[#4C6C4E] focus:ring-[#4C6C4E]"
              />
              <span className="text-sm font-medium text-gray-700">
                Olympic Property
              </span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.olympicOnly}
                onChange={(e) => update("olympicOnly", e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-[#4C6C4E] focus:ring-[#4C6C4E]"
              />
              <span className="text-sm font-medium text-gray-700">
                Olympic Only (not shown in main catalog)
              </span>
            </label>
          </div>
          {form.isOlympic && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Available Start Date
                </label>
                <input
                  type="date"
                  value={form.availableStart}
                  onChange={(e) => update("availableStart", e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#4C6C4E] focus:outline-none focus:ring-1 focus:ring-[#4C6C4E]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Available End Date
                </label>
                <input
                  type="date"
                  value={form.availableEnd}
                  onChange={(e) => update("availableEnd", e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#4C6C4E] focus:outline-none focus:ring-1 focus:ring-[#4C6C4E]"
                />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Homeowner Info */}
      <section className="rounded-lg bg-white p-6 shadow-sm">
        <h2 className="font-[Georgia,serif] text-lg font-semibold text-gray-900">
          Homeowner Information
        </h2>
        <p className="mt-1 text-xs text-gray-500">
          Internal only - not displayed to guests
        </p>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Owner Name
            </label>
            <input
              type="text"
              value={form.ownerName}
              onChange={(e) => update("ownerName", e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#4C6C4E] focus:outline-none focus:ring-1 focus:ring-[#4C6C4E]"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Owner Email
            </label>
            <input
              type="email"
              value={form.ownerEmail}
              onChange={(e) => update("ownerEmail", e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#4C6C4E] focus:outline-none focus:ring-1 focus:ring-[#4C6C4E]"
              placeholder="owner@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Owner Phone
            </label>
            <input
              type="tel"
              value={form.ownerPhone}
              onChange={(e) => update("ownerPhone", e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#4C6C4E] focus:outline-none focus:ring-1 focus:ring-[#4C6C4E]"
              placeholder="(555) 123-4567"
            />
          </div>
        </div>
      </section>

      {/* Amenities */}
      <section className="rounded-lg bg-white p-6 shadow-sm">
        <h2 className="font-[Georgia,serif] text-lg font-semibold text-gray-900">
          Amenities
        </h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {AMENITIES.map((amenity) => (
            <label key={amenity} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.amenities.includes(amenity)}
                onChange={() => toggleAmenity(amenity)}
                className="h-4 w-4 rounded border-gray-300 text-[#4C6C4E] focus:ring-[#4C6C4E]"
              />
              <span className="text-sm text-gray-700">{amenity}</span>
            </label>
          ))}
        </div>
      </section>

      {/* Photo Upload Placeholder */}
      <section className="rounded-lg bg-white p-6 shadow-sm">
        <h2 className="font-[Georgia,serif] text-lg font-semibold text-gray-900">
          Photos
        </h2>
        <div className="mt-4 flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-12">
          <div className="text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z"
              />
            </svg>
            <p className="mt-2 text-sm font-medium text-gray-600">
              Photo upload coming soon
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Drag and drop or click to upload property photos
            </p>
          </div>
        </div>
      </section>

      {/* Form Actions */}
      <div className="flex items-center justify-end gap-3">
        <Link
          href="/admin/properties"
          className="rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-[#4C6C4E] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#3d5a3f] disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Property"}
        </button>
      </div>
    </form>
  );
}
