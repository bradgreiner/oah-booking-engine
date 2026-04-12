import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white py-10">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="font-[Georgia,serif] text-lg font-bold text-[#4C6C4E]">
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
