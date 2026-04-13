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
  city,
  bedrooms,
  bathrooms,
  maxGuests,
  baseRate,
  weeklyDiscount,
  monthlyDiscount,
  minNights,
  propertyType,
  imageUrl,
  createdAt,
  linkPrefix = "",
}: PropertyCardProps) {
  const isNew =
    createdAt &&
    Date.now() - new Date(createdAt).getTime() < 30 * 24 * 60 * 60 * 1000;

  const isMonthly = propertyType === "monthly" || (minNights ?? 0) >= 30;
  const hasValidMonthlyDiscount = monthlyDiscount != null && monthlyDiscount > 0 && monthlyDiscount < 1;

  // Monthly card: baseRate * 30. When baseRate is 0 (no PriceLabs data), show "Contact for pricing".
  const monthlyPrice = isMonthly && baseRate > 0
    ? Math.round(baseRate * 30 * (hasValidMonthlyDiscount ? monthlyDiscount! : 1))
    : null;

  return (
    <Link href={`${linkPrefix}/${id}`} className="group block">
      <div className="cursor-pointer overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:shadow-xl">
        {/* Image */}
        <div className="relative w-full overflow-hidden bg-gray-100" style={{ aspectRatio: "4/3" }}>
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
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

          {/* Single badge: only NEW */}
          {isNew && (
            <div className="absolute left-3 top-3">
              <span className="rounded-full bg-white px-2.5 py-0.5 text-xs font-medium text-gray-700 shadow-sm">
                NEW
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div>
          <h3 className="mt-3 line-clamp-2 px-3 text-[15px] font-medium leading-snug text-gray-900">
            {name}
          </h3>

          <p className="mt-1 px-3 text-sm text-gray-500">
            {city && <>{city} &middot; </>}
            {bedrooms} {bedrooms === 1 ? "Bed" : "Beds"} &middot;{" "}
            {bathrooms} {bathrooms === 1 ? "Bath" : "Baths"} &middot;{" "}
            {maxGuests} {maxGuests === 1 ? "Guest" : "Guests"}
          </p>

          <div className="mt-2 px-3 pb-3">
            {isMonthly ? (
              monthlyPrice !== null ? (
                <p className="text-lg font-bold text-gray-900">
                  ${monthlyPrice.toLocaleString()}
                  <span className="text-sm font-normal text-gray-500">/mo</span>
                </p>
              ) : (
                <p className="text-sm italic text-gray-400">Contact for pricing</p>
              )
            ) : baseRate > 0 ? (
              <p className="text-lg font-bold text-gray-900">
                ${Math.round(baseRate).toLocaleString()}
                <span className="text-sm font-normal text-gray-500">/night</span>
              </p>
            ) : (
              <p className="text-sm italic text-gray-400">Contact for pricing</p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
