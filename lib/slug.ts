export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function buildPropertySlug(
  listing: { name?: string; externalListingName?: string; city?: string | null; id: number },
  takenSlugs: Set<string>
): string {
  const source = listing.externalListingName || listing.name || `home-${listing.id}`;
  let slug = slugify(source);

  if (!slug) slug = `home-${listing.id}`;

  if (!takenSlugs.has(slug)) {
    takenSlugs.add(slug);
    return slug;
  }

  if (listing.city) {
    const withCity = `${slug}-${slugify(listing.city)}`;
    if (!takenSlugs.has(withCity)) {
      takenSlugs.add(withCity);
      return withCity;
    }
  }

  const withId = `${slug}-${listing.id}`;
  takenSlugs.add(withId);
  return withId;
}
