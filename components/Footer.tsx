import Link from "next/link";

interface FooterProps {
  showBadges?: boolean;
}

export default function Footer({ showBadges = true }: FooterProps) {
  return (
    <footer className="border-t border-gray-200 bg-white">
      {/* Trust badges row — public pages only */}
      {showBadges && (
        <div className="border-b border-gray-100 py-6">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-4 gap-y-1 px-4 text-xs text-gray-400">
            <span>Airbnb Superhost &middot; 4.9 Stars &middot; 14 Years</span>
            <span className="hidden sm:inline text-gray-300">|</span>
            <span>VRBO Premier Host</span>
            <span className="hidden sm:inline text-gray-300">|</span>
            <span>3,000+ Five-Star Reviews</span>
            <span className="hidden sm:inline text-gray-300">|</span>
            <span>$250M Assets Under Management</span>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="font-serif text-lg font-bold text-[#4C6C4E]">
              Open Air Homes
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Premium short-term and monthly rental management
            </p>
            <p className="mt-2 text-sm text-gray-400">
              reservations@openairhomes.com
            </p>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <Link href="/search" className="hover:text-gray-700">
              Browse Homes
            </Link>
            <Link href="#" className="hover:text-gray-700">
              About
            </Link>
            <Link href="#" className="hover:text-gray-700">
              Terms
            </Link>
            <Link href="#" className="hover:text-gray-700">
              Privacy
            </Link>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-100 pt-6 text-xs text-gray-400">
          <p>
            Open Air Homes is a service of OpenAiRE Brokerage Inc. CA DRE
            #02164159
          </p>
          <p className="mt-1">
            &copy; 2026 Open Air Homes, Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
