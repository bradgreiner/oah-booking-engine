import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="flex min-h-[60vh] flex-col items-center justify-center px-4">
        <h1 className="font-serif text-4xl text-gray-900">Page not found</h1>
        <p className="mt-3 text-gray-500">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
        <div className="mt-6 flex gap-3">
          <Link href="/" className="rounded-full bg-[#4C6C4E] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#3d5a40]">
            Go home
          </Link>
          <Link href="/search" className="rounded-full border border-[#4C6C4E] px-6 py-2.5 text-sm font-medium text-[#4C6C4E] hover:bg-[#4C6C4E] hover:text-white">
            Browse homes
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
