import AdminLayout from "@/components/AdminLayout";

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold text-[#1B2A4A]">Dashboard</h1>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-gray-200 p-6">
          <p className="text-sm text-gray-500">Properties</p>
          <p className="mt-1 text-3xl font-bold">0</p>
        </div>
        <div className="rounded-lg border border-gray-200 p-6">
          <p className="text-sm text-gray-500">Pending Bookings</p>
          <p className="mt-1 text-3xl font-bold">0</p>
        </div>
        <div className="rounded-lg border border-gray-200 p-6">
          <p className="text-sm text-gray-500">Revenue (MTD)</p>
          <p className="mt-1 text-3xl font-bold">$0</p>
        </div>
      </div>
    </AdminLayout>
  );
}
