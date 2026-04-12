import Link from "next/link";
import Image from "next/image";

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
  weeklyDiscount?: number;
  monthlyDiscount?: number;
  minNights?: number;
  propertyType: string;
  isOlympic?: boolean;
  imageUrl?: string;
  createdAt?: string;
  linkPrefix?: string;
}

export default function PropertyCard({
  id,
  name,
  neighborhood,
  city,
  bedrooms,
  bathrooms,
  maxGuests,
  baseRate,
  weeklyDiscount,
  monthlyDiscount,
  minNights,
  propertyType,
  isOlympic,
  imageUrl,
  createdAt,
  linkPrefix = "",
}: PropertyCardProps) {
  const isNew =
    createdAt &&
    Date.now() - new Date(createdAt).getTime() < 30 * 24 * 60 * 60 * 1000;

  const isMonthly = propertyType === "monthly" || (minNights ?? 0) >= 30;
  const hasMonthlyDiscount = monthlyDiscount != null && monthlyDiscount > 0 && monthlyDiscount < 1;
  const hasWeeklyDiscount = weeklyDiscount != null && weeklyDiscount > 0 && weeklyDiscount < 1;

  // Monthly: baseRate * 30 * discount multiplier
  const monthlyRate = Math.round(baseRate * 30 * (hasMonthlyDiscount ? monthlyDiscount! : 1));
  // Weekly discounted nightly rate
  const weeklyNightlyRate = Math.round(baseRate * (hasWeeklyDiscount ? weeklyDiscount! : 1));

  return (
    <Link href={`${linkPrefix}/${id}`} className="group block">
      <div className="overflow-hidden rounded-xl bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
        {/* Image */}
        <div className="relative aspect-[3/2] bg-gradient-to-br from-gray-100 to-gray-200">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-gray-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1}
                stroke="currentColor"
                className="h-10 w-10"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z"
                />
              </svg>
            </div>
          )}

          {/* Badges overlay on image */}
          <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
            {(propertyType === "monthly" || propertyType === "both") && (
              <span className="rounded-full bg-[#4C6C4E] px-2.5 py-0.5 text-xs font-medium text-white shadow-sm">
                MONTHLY
              </span>
            )}
            {(propertyType === "str" || propertyType === "both") && (
              <span className="rounded-full bg-gray-800 px-2.5 py-0.5 text-xs font-medium text-white shadow-sm">
                SHORT-TERM
              </span>
            )}
            {isOlympic && (
              <span className="rounded-full bg-[#C5A55A] px-2.5 py-0.5 text-xs font-medium text-white shadow-sm">
                OLYMPIC
              </span>
            )}
            {isNew && (
              <span className="rounded-full bg-white px-2.5 py-0.5 text-xs font-medium text-gray-700 shadow-sm">
                NEW
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="truncate font-medium text-gray-900">{name}</h3>

          {city && (
            <p className="mt-0.5 text-sm text-gray-500">
              {[neighborhood, city].filter(Boolean).join(", ")}
            </p>
          )}

          <p className="mt-1 text-sm text-gray-500">
            {bedrooms} {bedrooms === 1 ? "Bed" : "Beds"} &middot;{" "}
            {bathrooms} {bathrooms === 1 ? "Bath" : "Baths"} &middot;{" "}
            {maxGuests} {maxGuests === 1 ? "Guest" : "Guests"}
          </p>

          <div className="mt-2">
            {isMonthly ? (
              <p className="text-lg font-semibold text-[#1a1a1a]">
                ${monthlyRate.toLocaleString()}
                <span className="text-sm font-normal text-gray-500">/mo</span>
              </p>
            ) : hasWeeklyDiscount ? (
              <p className="text-lg font-semibold text-[#1a1a1a]">
                ${weeklyNightlyRate.toLocaleString()}
                <span className="text-sm font-normal text-gray-500">/night</span>
              </p>
            ) : (
              <p className="text-lg font-semibold text-[#1a1a1a]">
                ${baseRate.toLocaleString()}
                <span className="text-sm font-normal text-gray-500">/night</span>
              </p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
