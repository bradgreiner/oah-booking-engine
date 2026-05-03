import { BIO_CONTENT } from "@/lib/listing-content";

interface Props {
  stayType: "monthly" | "str";
}

export default function ListingBio({ stayType }: Props) {
  const content = BIO_CONTENT[stayType];

  return (
    <section id="about-this-rental">
      <h2 className="font-serif text-xl font-normal text-gray-900 md:text-2xl">
        {content.heading}
      </h2>
      <div className="mt-4 space-y-4">
        {content.paragraphs.map((p, i) => (
          <p key={i} className="text-sm leading-relaxed text-gray-600">
            {p}
          </p>
        ))}
      </div>
    </section>
  );
}
