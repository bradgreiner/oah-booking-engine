import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { fetchListings } from "@/lib/hostaway";

export const dynamic = "force-dynamic";

interface PlaceData {
  emoji: string;
  name: string;
  category: string;
  distance: string;
  note: string;
}

const VENICE_PLACES: PlaceData[] = [
  { emoji: "🍕", name: "Gjusta", category: "restaurant", distance: "0.3 mi", note: "Venice institution, bakery and deli" },
  { emoji: "🌮", name: "Gjelina", category: "restaurant", distance: "0.2 mi", note: "James Beard nominated" },
  { emoji: "☕", name: "Intelligentsia", category: "cafe", distance: "0.4 mi", note: "On Abbot Kinney" },
  { emoji: "🏖️", name: "Venice Beach", category: "activity", distance: "0.4 mi", note: "Walk to the sand" },
  { emoji: "🛒", name: "Whole Foods Venice", category: "grocery", distance: "0.5 mi", note: "Lincoln Blvd location" },
  { emoji: "🧘", name: "Venice Yoga", category: "fitness", distance: "0.3 mi", note: "Classes daily" },
];

const PALM_SPRINGS_PLACES: PlaceData[] = [
  { emoji: "🌴", name: "Palm Canyon Drive", category: "activity", distance: "1.2 mi", note: "Downtown shops and dining" },
  { emoji: "🍽️", name: "Workshop Kitchen + Bar", category: "restaurant", distance: "1.5 mi", note: "James Beard semifinalist" },
  { emoji: "☕", name: "Ernest Coffee", category: "cafe", distance: "1.0 mi", note: "Local favorite" },
  { emoji: "🏔️", name: "Indian Canyons", category: "activity", distance: "3.0 mi", note: "Hiking trails" },
  { emoji: "🛒", name: "Ralphs", category: "grocery", distance: "0.8 mi", note: "Full grocery store" },
  { emoji: "🏊", name: "Ace Hotel Pool", category: "activity", distance: "1.5 mi", note: "Day passes available" },
];

const MANHATTAN_BEACH_PLACES: PlaceData[] = [
  { emoji: "🏖️", name: "Manhattan Beach Pier", category: "activity", distance: "0.2 mi", note: "Iconic landmark" },
  { emoji: "🍣", name: "Fishing with Dynamite", category: "restaurant", distance: "0.3 mi", note: "Fresh seafood" },
  { emoji: "☕", name: "Manhattan Beach Creamery", category: "cafe", distance: "0.2 mi", note: "Downtown village" },
  { emoji: "🏃", name: "The Strand", category: "activity", distance: "0.1 mi", note: "Beachfront path" },
  { emoji: "🛒", name: "Trader Joe's", category: "grocery", distance: "0.5 mi", note: "On Sepulveda" },
  { emoji: "🏋️", name: "Bay Club", category: "fitness", distance: "0.4 mi", note: "Full gym and pool" },
];

const MALIBU_PLACES: PlaceData[] = [
  { emoji: "🏖️", name: "Carbon Beach", category: "activity", distance: "0.1 mi", note: "Billionaire's Beach" },
  { emoji: "🍽️", name: "Nobu Malibu", category: "restaurant", distance: "1.0 mi", note: "PCH landmark" },
  { emoji: "☕", name: "Malibu Farm", category: "cafe", distance: "2.0 mi", note: "On the pier" },
  { emoji: "🏔️", name: "Solstice Canyon", category: "activity", distance: "3.0 mi", note: "Easy scenic hike" },
  { emoji: "🛒", name: "Vintage Grocers", category: "grocery", distance: "1.5 mi", note: "Malibu Country Mart" },
  { emoji: "🏄", name: "Surfrider Beach", category: "activity", distance: "2.5 mi", note: "Classic surf spot" },
];

const TOPANGA_PLACES: PlaceData[] = [
  { emoji: "🥾", name: "Topanga State Park", category: "activity", distance: "1.0 mi", note: "World's largest wildland in a city" },
  { emoji: "🍽️", name: "Inn of the Seventh Ray", category: "restaurant", distance: "0.5 mi", note: "Canyon dining institution" },
  { emoji: "☕", name: "Topanga Living Cafe", category: "cafe", distance: "0.3 mi", note: "Community gathering spot" },
  { emoji: "🏖️", name: "Topanga Beach", category: "activity", distance: "2.5 mi", note: "Quiet PCH beach" },
  { emoji: "🛒", name: "Topanga General Store", category: "grocery", distance: "0.4 mi", note: "Canyon essentials" },
  { emoji: "🎨", name: "Topanga Canyon Gallery", category: "activity", distance: "0.3 mi", note: "Local art" },
];

const WEHO_PLACES: PlaceData[] = [
  { emoji: "🍽️", name: "Craig's", category: "restaurant", distance: "0.5 mi", note: "Celebrity favorite" },
  { emoji: "☕", name: "Alfred Coffee", category: "cafe", distance: "0.3 mi", note: "Melrose Place" },
  { emoji: "🛍️", name: "Melrose Ave Shopping", category: "activity", distance: "0.2 mi", note: "Boutiques and vintage" },
  { emoji: "🏋️", name: "Equinox West Hollywood", category: "fitness", distance: "0.4 mi", note: "Full gym" },
  { emoji: "🛒", name: "Erewhon", category: "grocery", distance: "0.6 mi", note: "Organic market" },
  { emoji: "🌳", name: "Runyon Canyon", category: "activity", distance: "1.5 mi", note: "Classic LA hike" },
];

const DTLA_PLACES: PlaceData[] = [
  { emoji: "🍜", name: "Grand Central Market", category: "restaurant", distance: "0.3 mi", note: "Food hall landmark" },
  { emoji: "☕", name: "Blue Bottle Coffee", category: "cafe", distance: "0.2 mi", note: "Arts District" },
  { emoji: "🎭", name: "The Broad", category: "activity", distance: "0.5 mi", note: "Free contemporary art museum" },
  { emoji: "🛒", name: "Whole Foods DTLA", category: "grocery", distance: "0.4 mi", note: "8th Street" },
  { emoji: "🏃", name: "LA Live", category: "activity", distance: "0.8 mi", note: "Entertainment district" },
  { emoji: "🌳", name: "Grand Park", category: "activity", distance: "0.4 mi", note: "Downtown green space" },
];

const GENERIC_LA_PLACES: PlaceData[] = [
  { emoji: "🍽️", name: "Local dining", category: "restaurant", distance: "0.5 mi", note: "Neighborhood restaurants" },
  { emoji: "☕", name: "Coffee shops", category: "cafe", distance: "0.3 mi", note: "Multiple options nearby" },
  { emoji: "🛒", name: "Grocery stores", category: "grocery", distance: "0.5 mi", note: "Full-service grocery" },
  { emoji: "🌳", name: "Local parks", category: "activity", distance: "0.5 mi", note: "Green spaces nearby" },
];

function getNeighborhood(name: string, city: string | null): string | null {
  const nameLC = (name || "").toLowerCase();
  const cityLC = (city || "").toLowerCase();

  if (/venice|marco|san juan|brooks|bungalow|rose|abbot|westminster/.test(nameLC)) return "venice";
  if (cityLC === "palm springs" || nameLC.includes("palm springs")) return "palm_springs";
  if (cityLC === "manhattan beach") return "manhattan_beach";
  if (cityLC === "malibu") return "malibu";
  if (cityLC === "topanga") return "topanga";
  if (cityLC === "west hollywood" || /weho|melrose|orlando|westbourne/.test(nameLC)) return "weho";
  if (/downtown|dtla|loft|skyline|higgins/.test(nameLC)) return "dtla";
  if (/laurel canyon|walnut dr/.test(nameLC)) return "weho"; // close enough
  if (/mar vista|mcconnell|lyceum|landau/.test(nameLC)) return "venice"; // close enough
  if (/sherman oaks|noble|magnolia|coldwater/.test(nameLC)) return "generic_la";

  // Fallback by city
  if (cityLC.includes("palm") || cityLC.includes("la quinta") || cityLC.includes("rancho mirage") || cityLC.includes("cathedral") || cityLC.includes("yucca")) return "palm_springs";
  if (cityLC.includes("los angeles") || cityLC.includes("santa monica")) return "venice";

  return null;
}

const NEIGHBORHOOD_DATA: Record<string, PlaceData[]> = {
  venice: VENICE_PLACES,
  palm_springs: PALM_SPRINGS_PLACES,
  manhattan_beach: MANHATTAN_BEACH_PLACES,
  malibu: MALIBU_PLACES,
  topanga: TOPANGA_PLACES,
  weho: WEHO_PLACES,
  dtla: DTLA_PLACES,
  generic_la: GENERIC_LA_PLACES,
};

export async function GET(request: NextRequest) {
  const secret = request.headers.get("x-admin-secret");
  if (!secret || secret !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const listings = await fetchListings();
    const seededNames: string[] = [];

    for (const listing of listings) {
      const neighborhood = getNeighborhood(listing.name, listing.city || null);
      if (!neighborhood) continue;

      const places = NEIGHBORHOOD_DATA[neighborhood];
      if (!places || places.length === 0) continue;

      // Delete existing nearby places for this listing
      await prisma.nearbyPlace.deleteMany({
        where: { listingId: listing.id },
      });

      // Insert new places
      await prisma.nearbyPlace.createMany({
        data: places.map((p) => ({
          listingId: listing.id,
          emoji: p.emoji,
          name: p.name,
          category: p.category,
          distance: p.distance,
          note: p.note,
        })),
      });

      seededNames.push(listing.name);
    }

    return NextResponse.json({
      seeded: seededNames.length,
      total: listings.length,
      listings: seededNames,
    });
  } catch (err) {
    console.error("Seed nearby places error:", err);
    return NextResponse.json({ error: "Seed failed" }, { status: 500 });
  }
}
