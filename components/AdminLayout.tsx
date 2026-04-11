import Link from "next/link";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-56 border-r border-gray-200 bg-[#1B2A4A] p-4 text-sm text-white">
        <h2 className="mb-6 text-lg font-bold">OAH Admin</h2>
        <nav className="space-y-2">
          <Link href="/admin" className="block rounded px-2 py-1 hover:bg-white/10">
            Dashboard
          </Link>
          <Link href="/admin/properties" className="block rounded px-2 py-1 hover:bg-white/10">
            Properties
          </Link>
          <Link href="/admin/bookings" className="block rounded px-2 py-1 hover:bg-white/10">
            Bookings
          </Link>
          <Link href="/admin/settings" className="block rounded px-2 py-1 hover:bg-white/10">
            Settings
          </Link>
        </nav>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
