const AIRBNB_ITEMS = [
  "14% guest service fee",
  "Limited to Airbnb platform support",
  "Generic experience",
];

const OAH_ITEMS = [
  "2% platform fee (save up to 12% on every booking)",
  "Dedicated local team in LA and Palm Springs",
  "Same homes, same quality, direct relationship",
];

export default function WhyBookDirect() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-5xl px-4">
        <h2 className="text-center font-serif text-2xl font-normal text-[#1a1a1a] md:text-3xl">
          Why book direct?
        </h2>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {/* Airbnb column */}
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">
              Booking on Airbnb
            </h3>
            <ul className="mt-4 space-y-3">
              {AIRBNB_ITEMS.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-gray-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="mt-0.5 h-4 w-4 shrink-0 text-gray-300"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* OAH column */}
          <div className="rounded-xl border-2 border-[#4C6C4E]/20 bg-[#4C6C4E]/5 p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#4C6C4E]">
              Booking with Open Air Homes
            </h3>
            <ul className="mt-4 space-y-3">
              {OAH_ITEMS.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-gray-700">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="mt-0.5 h-4 w-4 shrink-0 text-[#4C6C4E]"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
