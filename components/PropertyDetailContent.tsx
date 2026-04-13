import BookingWidget from "@/components/BookingWidget";
import PropertyDescription from "@/components/PropertyDescription";
import PhotoGrid from "@/components/PhotoGrid";
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
      <PhotoGrid images={property.images} propertyName={property.name} />

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

            <h1 className="font-serif text-2xl font-normal leading-tight text-gray-900 mt-4 mb-3 sm:text-4xl md:text-5xl">
              {property.headline || property.name}
            </h1>

            {/* Beds / Baths / Guests */}
            <div className="mt-2 flex flex-wrap items-center gap-3 text-base text-gray-600">
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

            {/* Hosted-by line */}
            <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4 text-[#4C6C4E]">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
              <span>Hosted by Open Air Homes &middot; Superhost on Airbnb &middot; 14 years hosting</span>
            </div>

            {/* Inline trust badges */}
            <p className="mt-1.5 text-xs text-gray-400">
              Managed by OAH &middot; Licensed CA Brokerage &middot; 4.89 stars on Airbnb
            </p>

            <hr className="my-8 border-gray-100" />

            {/* About this home */}
            {property.description && (
              <PropertyDescription description={property.description} />
            )}

            <hr className="my-8 border-gray-100" />

            {/* Amenities */}
            <div className="mb-8">
              <h2 className="font-serif text-xl font-normal text-gray-900 md:text-2xl">
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
              <h2 className="font-serif text-xl font-normal text-gray-900 md:text-2xl">
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
              <h2 className="font-serif text-xl font-normal text-gray-900 md:text-2xl">
                Cancellation policy
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-gray-600">
                50% refund up to 1 week before check-in. No refund within 7
                days of check-in.
              </p>
            </div>

            <hr className="my-8 border-gray-100" />

            {/* Location */}
            <div className="mb-8">
              <h2 className="font-serif text-xl font-normal text-gray-900 md:text-2xl">
                Location
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                {property.city ? `${property.city}, California` : "Southern California"}
              </p>
              <PropertyMap
                latitude={property.latitude}
                longitude={property.longitude}
                city={property.city}
                propertyId={property.id}
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

            <hr className="my-8 border-gray-100" />

            {/* TODO: pull from listing_content table per property */}
            <div>
              <h2 className="font-serif text-xl font-normal text-gray-900 md:text-2xl">
                Things we love nearby
              </h2>
              <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {[
                  { emoji: "\uD83C\uDF55", name: "Gjusta", desc: "Venice Beach staple, 0.3 mi" },
                  { emoji: "\u2615", name: "Groundwork Coffee", desc: "Local roaster, 0.5 mi" },
                  { emoji: "\uD83C\uDFD6\uFE0F", name: "Venice Beach", desc: "Walk to the sand, 0.4 mi" },
                  { emoji: "\uD83D\uDED2", name: "Erewhon Venice", desc: "Organic groceries, 0.8 mi" },
                  { emoji: "\uD83C\uDF2E", name: "Gjelina", desc: "James Beard nominated, 0.2 mi" },
                  { emoji: "\uD83C\uDFCB\uFE0F", name: "Equinox West Hollywood", desc: "Full gym, 1.2 mi" },
                ].map((place) => (
                  <div key={place.name} className="flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-gray-50">
                    <span className="text-xl">{place.emoji}</span>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{place.name}</p>
                      <p className="text-xs text-gray-500">{place.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: booking widget (desktop) */}
          <div className="hidden w-full lg:block lg:w-[380px] lg:shrink-0">
            <div className="sticky top-6 rounded-2xl bg-[#FAFAF8]">
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
