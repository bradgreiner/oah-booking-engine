"use client";

import { Suspense } from "react";
import RequestFormContent from "@/components/RequestFormContent";

export default function RequestPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><p className="text-gray-400">Loading...</p></div>}>
      <RequestFormContent />
    </Suspense>
  );
}
