import Link from "next/link";

interface PropertyCardProps {
  slug: string;
  name: string;
  headline?: string | null;
  city?: string | null;
  state?: string | null;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  baseRate: number;
  imageUrl?: string;
}

export default function PropertyCard({
  slug,
  name,
  headline,
  city,
  state,
  bedrooms,
  bathrooms,
  maxGuests,
  baseRate,
  imageUrl,
}: PropertyCardProps) {
  return (
    <Link href={`/properties/${slug}`} className="group block">
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition hover:shadow-md">
        <div className="aspect-[4/3] bg-gray-100">
          {imageUrl && (
            <img
              src={imageUrl}
              alt={name}
              className="h-full w-full object-cover transition group-hover:scale-105"
            />
          )}
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-[#1B2A4A]">{name}</h3>
          {headline && (
            <p className="mt-1 text-sm text-gray-600">{headline}</p>
          )}
          {city && (
            <p className="mt-1 text-xs text-gray-500">
              {city}, {state}
            </p>
          )}
          <div className="mt-2 flex items-center gap-3 text-xs text-gray-500">
            <span>{bedrooms} bed</span>
            <span>{bathrooms} bath</span>
            <span>{maxGuests} guests</span>
          </div>
          <p className="mt-2 text-sm font-medium text-[#C9A84C]">
            From ${baseRate}/night
          </p>
        </div>
      </div>
    </Link>
  );
}
