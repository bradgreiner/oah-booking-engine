import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const olympicVenues = [
  {
    name: "SoFi Stadium",
    sport: "Ceremonies / Football",
    lat: 33.9535,
    lng: -118.3392,
    description: "Opening & closing ceremonies and football matches",
  },
  {
    name: "LA Memorial Coliseum",
    sport: "Track & Field",
    lat: 34.0141,
    lng: -118.288,
    description: "Athletics and track & field events",
  },
  {
    name: "Crypto.com Arena",
    sport: "Basketball / Gymnastics",
    lat: 34.043,
    lng: -118.2673,
    description: "Basketball finals and artistic gymnastics",
  },
  {
    name: "Dedeaux Field (USC)",
    sport: "Swimming / Diving",
    lat: 34.0224,
    lng: -118.2879,
    description: "Aquatics center for swimming and diving",
  },
  {
    name: "Galen Center (USC)",
    sport: "Badminton",
    lat: 34.0243,
    lng: -118.2886,
    description: "Badminton competition venue",
  },
  {
    name: "Pauley Pavilion (UCLA)",
    sport: "Judo / Wrestling",
    lat: 34.0702,
    lng: -118.4468,
    description: "Combat sports venue",
  },
  {
    name: "Riviera Country Club",
    sport: "Golf",
    lat: 34.0497,
    lng: -118.5031,
    description: "Golf competition venue in Pacific Palisades",
  },
  {
    name: "Long Beach Marine Stadium",
    sport: "Rowing / Canoe Sprint",
    lat: 33.7635,
    lng: -118.1269,
    description: "Rowing and canoe sprint events",
  },
  {
    name: "Santa Monica Beach",
    sport: "Beach Volleyball / Triathlon Start",
    lat: 34.0094,
    lng: -118.497,
    description: "Beach volleyball and triathlon start on the iconic Santa Monica coastline",
  },
  {
    name: "Sepulveda Basin",
    sport: "Archery",
    lat: 34.1739,
    lng: -118.4784,
    description: "Archery competition in the San Fernando Valley",
  },
  {
    name: "Rose Bowl",
    sport: "Football / Rugby",
    lat: 34.1613,
    lng: -118.1676,
    description: "Football and rugby sevens in historic Pasadena venue",
  },
  {
    name: "Dignity Health Sports Park",
    sport: "Tennis / Cycling (Track)",
    lat: 33.8644,
    lng: -118.261,
    description: "Tennis and track cycling in Carson",
  },
  {
    name: "Trestles Beach",
    sport: "Surfing",
    lat: 33.3817,
    lng: -117.5883,
    description: "Olympic surfing competition in San Clemente",
  },
  {
    name: "Honda Center",
    sport: "Indoor Volleyball",
    lat: 33.8078,
    lng: -117.8765,
    description: "Indoor volleyball competition in Anaheim",
  },
  {
    name: "Venice Beach",
    sport: "Triathlon / Marathon Start",
    lat: 33.985,
    lng: -118.4695,
    description: "Triathlon and marathon start venue",
  },
];

const siteSettings = [
  { key: "olympics_password", value: "la2028" },
  { key: "site_name", value: "OAH Booking Engine" },
  { key: "contact_email", value: "info@oahbooking.com" },
];

async function main() {
  console.log("Seeding Olympic venues...");
  for (const venue of olympicVenues) {
    await prisma.olympicVenue.upsert({
      where: { id: venue.name },
      update: venue,
      create: venue,
    });
  }
  console.log(`Seeded ${olympicVenues.length} Olympic venues.`);

  console.log("Seeding site settings...");
  for (const setting of siteSettings) {
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    });
  }
  console.log(`Seeded ${siteSettings.length} site settings.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
