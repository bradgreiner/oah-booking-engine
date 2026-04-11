"use client";

import { useRouter } from "next/navigation";
import PropertyForm from "@/components/PropertyForm";

export default function NewPropertyPage() {
  const router = useRouter();

  async function handleSubmit(data: Record<string, unknown>) {
    const res = await fetch("/api/properties", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error("Failed to create property");
    }

    router.push("/admin/properties");
  }

  return (
    <div>
      <h1 className="font-[Georgia,serif] text-2xl font-bold text-gray-900">
        Add New Property
      </h1>
      <p className="mt-1 text-sm text-gray-500">
        Fill in the details below to add a new rental property
      </p>

      <div className="mt-8">
        <PropertyForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
