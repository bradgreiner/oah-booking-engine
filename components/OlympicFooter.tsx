import Link from "next/link";

export default function OlympicFooter() {
  return (
    <footer className="border-t border-[#C5A55A]/20 bg-white py-8">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex flex-col items-center gap-4 text-center text-sm text-gray-500 md:flex-row md:justify-between md:text-left">
          <div>
            <p>
              &copy; 2026 Open Air Homes &middot; Licensed CA Brokerage &middot;
              DRE #02164159
            </p>
            <p className="mt-1 text-xs text-[#C5A55A]">
              Private collection &middot; Not listed on public platforms
            </p>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/about" className="hover:text-gray-700">About</Link>
            <Link href="mailto:brad@openairhomes.com" className="hover:text-gray-700">Contact</Link>
            <Link href="/privacy" className="hover:text-gray-700">Privacy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
