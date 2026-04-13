const TESTIMONIALS = [
  {
    quote:
      "We saved over $1,800 on our 3-month Venice stay by booking direct. Same home, same team, way less fees.",
    name: "Sarah M.",
    location: "Venice Beach",
  },
  {
    quote:
      "The Open Air team was incredible. They handled everything from check-in to a maintenance issue at 10pm. Way better than any Airbnb experience.",
    name: "James R.",
    location: "Palm Springs",
  },
  {
    quote:
      "We've rented through OAH for two summers now. The monthly pricing is transparent and the homes are always spotless.",
    name: "The Nguyen Family",
    location: "Santa Monica",
  },
];

function StarIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-4 w-4 text-[#4C6C4E]"
    >
      <path
        fillRule="evenodd"
        d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export default function Testimonials() {
  return (
    <section className="bg-[#FAFAF8] py-16">
      <div className="mx-auto max-w-5xl px-4">
        <h2 className="text-center font-serif text-2xl font-normal text-[#1a1a1a] md:text-3xl">
          What our guests say
        </h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="rounded-xl bg-white p-6 shadow-sm"
            >
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} />
                ))}
              </div>
              <p className="mt-4 text-sm leading-relaxed text-gray-600 italic">
                &ldquo;{t.quote}&rdquo;
              </p>
              <p className="mt-4 text-xs font-medium text-gray-900">
                {t.name}, {t.location}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
