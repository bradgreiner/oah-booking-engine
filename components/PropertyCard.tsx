import Link from "next/link";

interface PropertyCardProps {
  id: string;
  slug: string;
  name: string;
  headline?: string | null;
  neighborhood?: string | null;
  city?: string | null;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  baseRate: number;
  monthlyDiscount?: number;
  propertyType: string;
  isOlympic?: boolean;
  imageUrl?: string;
  createdAt?: string;
}

export default function PropertyCard({
  id,
  slug,
  name,
  headline,
  neighborhood,
  city,
  bedrooms,
  bathrooms,
  maxGuests,
  baseRate,
  monthlyDiscount,
  propertyType,
  isOlympic,
  imageUrl,
  createdAt,
}: PropertyCardProps) {
  const isNew =
    createdAt &&
    Date.now() - new Date(createdAt).getTime() < 14 * 24 * 60 * 60 * 1000;

  const monthlyRate =
    monthlyDiscount && monthlyDiscount > 0
      ? Math.round(baseRate * 30 * (1 - monthlyDiscount / 100))
      : null;

  return (
    <Link href={`/${id}`} className="group block">
      <div className="overflow-hidden rounded-xl bg-white shadow-sm transition hover:shadow-md">
        {/* Image */}
        <div className="relative aspect-[4/3] bg-gray-100">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={name}
              className="h-full w-full object-cover transition group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-gray-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1}
                stroke="currentColor"
                className="h-12 w-12"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21z"
                />
              </svg>
            </div>
          )}

          {/* New badge */}
          {isNew && (
            <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-700 shadow-sm">
              New
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Badges */}
          <div className="mb-2 flex flex-wrap gap-1.5">
            {(propertyType === "monthly" || propertyType === "both") && (
              <span className="rounded-full bg-[#4C6C4E]/10 px-3 py-1 text-xs font-medium text-[#4C6C4E]">
                MONTHLY
              </span>
            )}
            {(propertyType === "str" || propertyType === "both") && (
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                SHORT-TERM
              </span>
            )}
            {isOlympic && (
              <span className="rounded-full bg-[#C5A55A]/10 px-3 py-1 text-xs font-medium text-[#C5A55A]">
                OLYMPIC
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-base font-semibold text-[#1B2A4A]">
            {headline || name}
          </h3>

          {/* Location */}
          {(neighborhood || city) && (
            <p className="mt-0.5 text-sm text-gray-500">
              {[neighborhood, city].filter(Boolean).join(", ")}
            </p>
          )}

          {/* Stats */}
          <div className="mt-2 flex items-center gap-3 text-xs text-gray-500">
            <span>{bedrooms} {bedrooms === 1 ? "Bed" : "Beds"}</span>
            <span className="text-gray-300">&middot;</span>
            <span>{bathrooms} {bathrooms === 1 ? "Bath" : "Baths"}</span>
            <span className="text-gray-300">&middot;</span>
            <span>{maxGuests} {maxGuests === 1 ? "Guest" : "Guests"}</span>
          </div>

          {/* Price */}
          <div className="mt-3">
            {propertyType === "monthly" && monthlyRate ? (
              <p className="text-lg font-semibold text-[#1B2A4A]">
                ${monthlyRate.toLocaleString()}
                <span className="text-sm font-normal text-gray-500">/mo</span>
              </p>
            ) : (
              <p className="text-lg font-semibold text-[#1B2A4A]">
                ${baseRate.toLocaleString()}
                <span className="text-sm font-normal text-gray-500">
                  /night
                </span>
              </p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
