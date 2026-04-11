import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookingWidget from "@/components/BookingWidget";
import { prisma } from "@/lib/prisma";

interface Props {
  params: { propertyId: string };
}

export default async function PropertyDetailPage({ params }: Props) {
  const property = await prisma.property.findUnique({
    where: { id: params.propertyId },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      pricingRules: { orderBy: { startDate: "asc" } },
    },
  });

  if (!property || property.status === "removed") {
    notFound();
  }

  const amenities: string[] = property.amenities
    ? JSON.parse(property.amenities)
    : [];

  const AMENITY_ICONS: Record<string, string> = {
    Pool: "M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z",
    "Hot Tub": "M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z",
    Parking: "M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12",
    "Pet Friendly": "M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H3.75",
    WiFi: "M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z",
    AC: "M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636",
    Kitchen: "M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z",
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">
        {/* Photo grid */}
        <div className="mx-auto max-w-7xl px-4 pt-6">
          <div className="grid h-[300px] grid-cols-1 gap-2 overflow-hidden rounded-xl md:h-[400px] md:grid-cols-4 md:grid-rows-2">
            {/* Main photo */}
            <div className="col-span-1 row-span-2 bg-gray-100 md:col-span-2">
              {property.images[0] ? (
                <img
                  src={property.images[0].url}
                  alt={property.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-gray-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1}
                    stroke="currentColor"
                    className="h-16 w-16"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21z"
                    />
                  </svg>
                </div>
              )}
            </div>

            {/* Secondary photos */}
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="hidden bg-gray-100 md:block">
                {property.images[i] ? (
                  <img
                    src={property.images[i].url}
                    alt={`${property.name} ${i + 1}`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-gray-200">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1}
                      stroke="currentColor"
                      className="h-8 w-8"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21z"
                      />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="flex flex-col gap-8 lg:flex-row">
            {/* Left: Property details */}
            <div className="flex-1">
              {/* Badges */}
              <div className="mb-3 flex flex-wrap gap-2">
                {(property.propertyType === "monthly" ||
                  property.propertyType === "both") && (
                  <span className="rounded-full bg-[#4C6C4E]/10 px-3 py-1 text-xs font-medium text-[#4C6C4E]">
                    MONTHLY
                  </span>
                )}
                {(property.propertyType === "str" ||
                  property.propertyType === "both") && (
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                    SHORT-TERM
                  </span>
                )}
                {property.isOlympic && (
                  <span className="rounded-full bg-[#C5A55A]/10 px-3 py-1 text-xs font-medium text-[#C5A55A]">
                    OLYMPIC
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="font-[Georgia,serif] text-3xl font-bold text-[#1B2A4A]">
                {property.headline || property.name}
              </h1>

              {/* Location */}
              {(property.neighborhood || property.city) && (
                <p className="mt-1 text-gray-500">
                  {[property.neighborhood, property.city]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              )}

              {/* Stats */}
              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1.5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-5 w-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                    />
                  </svg>
                  {property.bedrooms} {property.bedrooms === 1 ? "Bed" : "Beds"}
                </span>
                <span className="text-gray-300">&middot;</span>
                <span>
                  {property.bathrooms}{" "}
                  {property.bathrooms === 1 ? "Bath" : "Baths"}
                </span>
                <span className="text-gray-300">&middot;</span>
                <span>
                  {property.maxGuests}{" "}
                  {property.maxGuests === 1 ? "Guest" : "Guests"}
                </span>
                {property.sqft && (
                  <>
                    <span className="text-gray-300">&middot;</span>
                    <span>{property.sqft.toLocaleString()} sqft</span>
                  </>
                )}
              </div>

              {/* Divider */}
              <hr className="my-8 border-gray-100" />

              {/* Amenities */}
              {amenities.length > 0 && (
                <div className="mb-8">
                  <h2 className="font-[Georgia,serif] text-xl font-semibold text-[#1B2A4A]">
                    Amenities
                  </h2>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {amenities.map((amenity) => (
                      <span
                        key={amenity}
                        className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 px-4 py-2 text-sm text-gray-600"
                      >
                        {AMENITY_ICONS[amenity] ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="h-4 w-4"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d={AMENITY_ICONS[amenity]}
                            />
                          </svg>
                        ) : null}
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              {property.description && (
                <div>
                  <h2 className="font-[Georgia,serif] text-xl font-semibold text-[#1B2A4A]">
                    About this home
                  </h2>
                  <div className="mt-4 whitespace-pre-line text-gray-600 leading-relaxed">
                    {property.description}
                  </div>
                </div>
              )}
            </div>

            {/* Right: Booking widget */}
            <div className="w-full lg:w-[380px] lg:shrink-0">
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
                />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
