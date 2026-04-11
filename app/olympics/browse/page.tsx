"use client";

import OlympicHeader from "@/components/OlympicHeader";
import OlympicFooter from "@/components/OlympicFooter";
import OlympicBrowseContent from "@/components/OlympicBrowseContent";

export default function OlympicBrowsePage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#F5F3EF]">
      <OlympicHeader />
      <main className="flex-1">
        <OlympicBrowseContent />
      </main>
      <OlympicFooter />
    </div>
  );
}
