const STEPS = [
  {
    num: "01",
    title: "Browse & compare",
    desc: "Explore furnished homes across Southern California. Filter by location, budget, and length of stay.",
  },
  {
    num: "02",
    title: "Book direct",
    desc: "Skip the middleman. Book directly with us and save 10-15% compared to Airbnb and VRBO.",
  },
  {
    num: "03",
    title: "Move in",
    desc: "We handle everything — cleaning, linens, and support. Just bring your bags and settle in.",
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-5xl px-4 text-center">
        <h2 className="font-serif text-2xl font-bold text-[#1a1a1a] md:text-3xl">
          How it works
        </h2>
        <div className="mt-12 grid gap-10 md:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.num}>
              <span className="text-3xl font-bold text-[#4C6C4E]/30">
                {s.num}
              </span>
              <h3 className="mt-2 text-lg font-semibold text-[#1a1a1a]">
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
