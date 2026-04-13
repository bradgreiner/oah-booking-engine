const STEPS = [
  {
    num: "01",
    title: "Find your home",
    desc: "Browse 55+ furnished homes across LA and Palm Springs. Filter by location, length of stay, and budget.",
  },
  {
    num: "02",
    title: "Book direct and save",
    desc: "Skip Airbnb's 14% guest fee. Our 2% platform fee means you save hundreds or thousands on monthly stays.",
  },
  {
    num: "03",
    title: "Settle in with full support",
    desc: "Dedicated local teams handle cleaning, maintenance, and 24/7 guest support. Just bring your bags.",
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-5xl px-4 text-center">
        <h2 className="font-serif text-2xl font-normal text-[#1a1a1a] md:text-3xl">
          How it works
        </h2>
        <div className="mt-12 grid gap-10 md:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.num}>
              <span className="text-3xl font-bold text-[#4C6C4E]/30">
                {s.num}
              </span>
              <h3 className="mt-2 font-serif text-lg font-normal text-[#1a1a1a]">
                {s.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
