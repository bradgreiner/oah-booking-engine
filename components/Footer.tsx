import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white py-8">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex flex-col items-center gap-4 text-center text-sm text-gray-500 md:flex-row md:justify-between md:text-left">
          <p>
            &copy; 2026 Open Air Homes &middot; Licensed CA Brokerage &middot;
            DRE #02164159
          </p>
          <div className="flex items-center gap-6">
            <Link href="#" className="hover:text-gray-700">
              About
            </Link>
            <Link href="#" className="hover:text-gray-700">
              Contact
            </Link>
            <Link href="#" className="hover:text-gray-700">
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
