import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="bg-[#1B2A4A] px-4 py-20 text-center text-white">
          <h1 className="text-4xl font-bold md:text-5xl">
            Premium LA Vacation Rentals
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-gray-300">
            Hand-picked homes for unforgettable stays in Los Angeles. Book
            directly and save.
          </p>
          <div className="mt-8">
            <a
              href="#properties"
              className="inline-block rounded bg-[#C9A84C] px-6 py-3 text-sm font-semibold text-[#1B2A4A] hover:bg-[#b8973f]"
            >
              Browse Properties
            </a>
          </div>
        </section>

        {/* Properties placeholder */}
        <section id="properties" className="mx-auto max-w-7xl px-4 py-16">
          <h2 className="text-2xl font-bold text-[#1B2A4A]">
            Our Properties
          </h2>
          <p className="mt-2 text-gray-600">
            Properties will appear here once added via the admin panel.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
