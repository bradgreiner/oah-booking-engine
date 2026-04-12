import Image from "next/image";
import BookingWidget from "@/components/BookingWidget";
import PropertyDescription from "@/components/PropertyDescription";
import PhotoPlaceholder from "@/components/PhotoPlaceholder";
import PropertyMap from "@/components/PropertyMap";
import type { UnifiedProperty } from "@/lib/property-adapter";

interface Props {
  property: UnifiedProperty;
}

export default function PropertyDetailContent({ property }: Props) {
  const amenities: string[] = property.amenities
    ? JSON.parse(property.amenities)
    : [];

  const defaultAmenities = [
    "High-speed Wi-Fi",
    "Fully furnished",
    "Dedicated support team",
    "Professional cleaning",
    "All utilities included",
  ];

  const displayAmenities = amenities.length > 0
    ? amenities
    : defaultAmenities;

  return (
    <>
      {/* Photo grid */}
      <div className="mx-auto max-w-7xl md:px-4 md:pt-6">
        <div className="grid h-[250px] grid-cols-1 gap-2 overflow-hidden md:h-[420px] md:grid-cols-4 md:grid-rows-2 md:rounded-xl">
          <div className="relative col-span-1 row-span-2 bg-gray-100 md:col-span-2">
            {property.images[0] ? (
              <Image
                src={property.images[0].url}
                alt={property.name}
                fill
                sizes="(max-width: 768px) 100vw, 60vw"
                className="object-cover"
                priority
              />
            ) : (
              <PhotoPlaceholder size="lg" />
            )}
            {property.images.length > 5 && (
              <button className="absolute bottom-4 left-4 rounded-lg bg-white/90 px-3 py-1.5 text-sm font-medium text-gray-800 shadow-sm backdrop-blur-sm">
                View all photos ({property.images.length})
              </button>
            )}
          </div>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="relative hidden bg-gray-100 md:block">
              {property.images[i] ? (
                <Image
                  src={property.images[i].url}
                  alt={`${property.name} ${i + 1}`}
                  fill
                  sizes="20vw"
                  className="object-cover"
                />
              ) : (
                <PhotoPlaceholder size="sm" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Trust badges */}
      <div className="mx-auto max-w-7xl px-4 pt-6">
        <div className="flex flex-col gap-3 rounded-lg border border-gray-100 bg-gray-50 px-4 py-3 text-xs text-gray-600 sm:flex-row sm:gap-6 sm:px-6 sm:py-4 sm:text-sm">
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5 text-[#4C6C4E]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
            <span>Managed by Open Air Homes</span>
          </div>
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5 text-[#4C6C4E]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
            <span>Licensed CA Brokerage</span>
          </div>
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5 text-[#C5A55A]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
            </svg>
            <span>4.89 stars on Airbnb &middot; 14 years hosting</span>
          </div>
        </div>
      </div>

      {/* Content + sidebar */}
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Left: details */}
          <div className="flex-1">
            {/* Breadcrumb */}
            <nav className="mb-4 text-sm text-gray-400">
              <a href="/search" className="hover:text-gray-600">Homes</a>
              {property.city && (
                <>
                  <span className="mx-1">/</span>
                  <a href={`/search?city=${encodeURIComponent(property.city)}`} className="hover:text-gray-600">{property.city}</a>
                </>
              )}
              <span className="mx-1">/</span>
              <span className="text-gray-600">{property.name}</span>
            </nav>

            <h1 className="font-[Georgia,serif] text-3xl font-bold text-[#1a1a1a]">
              {property.headline || property.name}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <span>{property.bedrooms} {property.bedrooms === 1 ? "Bed" : "Beds"}</span>
              <span className="text-gray-300">&middot;</span>
              <span>{property.bathrooms} {property.bathrooms === 1 ? "Bath" : "Baths"}</span>
              <span className="text-gray-300">&middot;</span>
              <span>{property.maxGuests} {property.maxGuests === 1 ? "Guest" : "Guests"}</span>
              {property.sqft && (
                <>
                  <span className="text-gray-300">&middot;</span>
                  <span>{property.sqft.toLocaleString()} sqft</span>
                </>
              )}
            </div>

            <hr className="my-8 border-gray-100" />

            {/* About this home */}
            {property.description && (
              <PropertyDescription description={property.description} />
            )}

            <hr className="my-8 border-gray-100" />

            {/* Amenities: Your stay includes */}
            <div className="mb-8">
              <h2 className="font-[Georgia,serif] text-xl font-semibold text-[#1a1a1a]">
                Your stay includes
              </h2>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {displayAmenities.map((amenity) => (
                  <div key={amenity} className="flex items-center gap-2 text-sm text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4 text-[#4C6C4E]">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    {amenity}
                  </div>
                ))}
              </div>
            </div>

            <hr className="my-8 border-gray-100" />

            {/* House rules */}
            <div className="mb-8">
              <h2 className="font-[Georgia,serif] text-xl font-semibold text-[#1a1a1a]">
                House rules
              </h2>
              <ul className="mt-4 space-y-2 text-sm text-gray-600">
                <li>No smoking</li>
                <li>No parties or events</li>
                <li>No pets unless pre-approved</li>
                <li>Quiet hours: 10:00 PM - 8:00 AM</li>
                <li>Maximum {property.maxGuests} guests</li>
              </ul>
            </div>

            <hr className="my-8 border-gray-100" />

            {/* Cancellation policy */}
            <div className="mb-8">
              <h2 className="font-[Georgia,serif] text-xl font-semibold text-[#1a1a1a]">
                Cancellation policy
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-gray-600">
                50% refund up to 1 week before check-in. No refund within 7
                days of check-in.
              </p>
            </div>

            <hr className="my-8 border-gray-100" />

            {/* Location */}
            <div>
              <h2 className="font-[Georgia,serif] text-xl font-semibold text-[#1a1a1a]">
                Location
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                {property.city ? `${property.city}, California` : "Southern California"}
              </p>
              <PropertyMap
                latitude={property.latitude}
                longitude={property.longitude}
                city={property.city}
              />
              {!property.latitude && !property.longitude && (
                <>
                  <p className="mt-1 text-sm text-gray-400">
                    Exact address provided after booking confirmation.
                  </p>
                  <div className="mt-4 flex h-48 items-center justify-center rounded-xl border border-gray-200 bg-gray-100 text-sm text-gray-400">
                    Map coming soon
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Right: booking widget (desktop) */}
          <div className="hidden w-full lg:block lg:w-[380px] lg:shrink-0">
            <div className="sticky top-6">
              <BookingWidget
                propertyId={property.id}
                baseRate={property.baseRate}
                cleaningFee={property.cleaningFee}
                petFee={property.petFee}
                totRate={property.totRate}
                maxGuests={property.maxGuests}
                minNights={property.minNights}
                maxNights={property.maxNights}
                weeklyDiscount={property.weeklyDiscount}
                monthlyDiscount={property.monthlyDiscount}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

