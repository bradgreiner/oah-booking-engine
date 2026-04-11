import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-xl font-bold text-[#1B2A4A]">
          OAH Booking
        </Link>
        <div className="flex items-center gap-6 text-sm">
          <Link href="/" className="text-gray-600 hover:text-[#1B2A4A]">
            Properties
          </Link>
          <Link
            href="/olympics"
            className="text-gray-600 hover:text-[#1B2A4A]"
          >
            LA 2028
          </Link>
        </div>
      </div>
    </nav>
  );
}
