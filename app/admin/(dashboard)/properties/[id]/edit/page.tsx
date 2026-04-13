"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import PropertyForm from "@/components/PropertyForm";

interface PropertyData {
  id: string;
  name: string;
  headline: string | null;
  description: string | null;
  neighborhood: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  sqft: number | null;
  propertyType: string;
  baseRate: number;
  weeklyDiscount: number;
  monthlyDiscount: number;
  cleaningFee: number;
  petFee: number;
  minNights: number;
  maxNights: number | null;
  totRate: number;
  isOlympic: boolean;
  olympicOnly: boolean;
  availableStart: string | null;
  availableEnd: string | null;
  ownerName: string | null;
  ownerEmail: string | null;
  ownerPhone: string | null;
  amenities: string | null;
  status: string;
}

export default function EditPropertyPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [property, setProperty] = useState<PropertyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function fetchProperty() {
      const res = await fetch(`/api/properties/${id}`);
      if (res.ok) {
        const data = await res.json();
        setProperty(data);
      }
      setLoading(false);
    }
    fetchProperty();
  }, [id]);

  async function handleSubmit(data: Record<string, unknown>) {
    const res = await fetch(`/api/properties/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error("Failed to update property");
    }

    router.push("/admin/properties");
  }

  async function handleDelete() {
    setDeleting(true);
    const res = await fetch(`/api/properties/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      router.push("/admin/properties");
    } else {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-gray-400">Loading property...</p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-sm font-medium text-gray-900">Property not found</p>
        <p className="mt-1 text-sm text-gray-400">
          This property may have been deleted.
        </p>
      </div>
    );
  }

  const amenities = property.amenities
    ? JSON.parse(property.amenities)
    : [];

  const initialData = {
    name: property.name,
    headline: property.headline || "",
    description: property.description || "",
    neighborhood: property.neighborhood || "",
    address: property.address || "",
    city: property.city || "",
    state: property.state || "",
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    maxGuests: property.maxGuests,
    sqft: property.sqft ? String(property.sqft) : "",
    propertyType: property.propertyType,
    baseRate: String(property.baseRate),
    weeklyDiscount: String(property.weeklyDiscount),
    monthlyDiscount: String(property.monthlyDiscount),
    cleaningFee: String(property.cleaningFee),
    petFee: String(property.petFee),
    minNights: String(property.minNights),
    maxNights: property.maxNights ? String(property.maxNights) : "",
    totRate: String(property.totRate),
    isOlympic: property.isOlympic,
    olympicOnly: property.olympicOnly,
    availableStart: property.availableStart
      ? property.availableStart.split("T")[0]
      : "",
    availableEnd: property.availableEnd
      ? property.availableEnd.split("T")[0]
      : "",
    ownerName: property.ownerName || "",
    ownerEmail: property.ownerEmail || "",
    ownerPhone: property.ownerPhone || "",
    amenities,
    status: property.status,
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-gray-900">
            Edit Property
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {property.headline || property.name}
          </p>
        </div>
        <button
          onClick={() => setShowDeleteModal(true)}
          className="rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 shadow-sm transition-colors hover:bg-red-50"
        >
          Delete Property
        </button>
      </div>

      <div className="mt-8">
        <PropertyForm initialData={initialData} onSubmit={handleSubmit} />
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-md rounded-lg border border-gray-100 bg-white p-6 shadow-xl">
            <h3 className="font-serif text-lg font-semibold text-gray-900">
              Delete Property
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Are you sure you want to delete &quot;{property.name}&quot;? This
              will set the property status to removed.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
