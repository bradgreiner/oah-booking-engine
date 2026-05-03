const NOISE_PREFIXES = [
  /^new[!\s\-—.]+/i,
  /^✨\s*/,
  /^★\s*/,
  /^⭐\s*/,
  /^🌟\s*/,
  /^🏖️?\s*/,
  /^🌴\s*/,
];

const LA_NEIGHBORHOODS = [
  "Manhattan Beach", "Santa Monica", "Venice", "Topanga", "Malibu",
  "West Hollywood", "Marina del Rey", "Mar Vista", "Studio City",
  "Hermosa Beach", "Redondo Beach", "Beverly Hills", "Culver City",
  "Pacific Palisades", "Brentwood", "Playa del Rey", "El Segundo",
  "Sherman Oaks",
];

const DESERT_CITIES = [
  "Palm Springs", "Palm Desert", "La Quinta", "Rancho Mirage",
  "Indio", "Yucca Valley", "Joshua Tree", "Cathedral City",
  "Desert Hot Springs", "Indian Wells", "Coachella",
];

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function cleanListingName(rawName: string): string {
  let name = (rawName || "").trim();

  let changed = true;
  while (changed) {
    changed = false;
    for (const re of NOISE_PREFIXES) {
      const after = name.replace(re, "");
      if (after !== name) {
        name = after.trim();
        changed = true;
      }
    }
  }

  const pipeIdx = name.indexOf("|");
  if (pipeIdx > 0) name = name.slice(0, pipeIdx).trim();

  const dashIdx = name.search(/\s[-—]\s/);
  if (dashIdx > 3) name = name.slice(0, dashIdx).trim();

  return name;
}

export function resolveDisplayCity(listing: {
  city?: string | null;
  name?: string | null;
  externalListingName?: string | null;
  address?: string | null;
  publicAddress?: string | null;
}): string {
  const rawCity = (listing.city || "").trim();

  if (LA_NEIGHBORHOODS.some((n) => n.toLowerCase() === rawCity.toLowerCase())) return rawCity;
  if (DESERT_CITIES.some((n) => n.toLowerCase() === rawCity.toLowerCase())) return rawCity;

  if (rawCity.toLowerCase() === "los angeles" || rawCity === "") {
    const haystack = [
      listing.externalListingName,
      listing.name,
      listing.address,
      listing.publicAddress,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    const sorted = [...LA_NEIGHBORHOODS].sort((a, b) => b.length - a.length);
    for (const n of sorted) {
      if (haystack.includes(n.toLowerCase())) return n;
    }

    return "Los Angeles";
  }

  return rawCity || "Los Angeles";
}

export function buildPropertySlug(
  listing: {
    name?: string;
    externalListingName?: string;
    city?: string | null;
    address?: string | null;
    publicAddress?: string | null;
    id: number;
  },
  takenSlugs: Set<string>
): string {
  const sourceName = listing.externalListingName || listing.name || `home-${listing.id}`;
  const cleanName = cleanListingName(sourceName);
  const nameSlug = slugify(cleanName) || `home-${listing.id}`;

  const city = resolveDisplayCity(listing);
  const citySlug = slugify(city);

  let slug = citySlug ? `${nameSlug}-${citySlug}` : nameSlug;

  if (!takenSlugs.has(slug)) {
    takenSlugs.add(slug);
    return slug;
  }

  const withId = `${slug}-${listing.id}`;
  takenSlugs.add(withId);
  return withId;
}
