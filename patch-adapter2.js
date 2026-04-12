const fs = require('fs');
let src = fs.readFileSync('lib/property-adapter.ts', 'utf8');

const oldBlock = `    const [listing, allListings] = await Promise.all([
      fetchListing(hostawayId),
      fetchListings(),
    ]);
    if (!listing) return null;
    const bulkMatch = allListings.find((l) => l.id === hostawayId);
    if (bulkMatch && (listing as any).listingImages == null && (bulkMatch as any).listingImages) {
      (listing as any).listingImages = (bulkMatch as any).listingImages;
    }
    return mapHostawayToUnified(listing);`;

const newBlock = `    const allListings = await fetchListings();
    const bulkMatch = allListings.find((l) => l.id === hostawayId);
    if (bulkMatch) return mapHostawayToUnified(bulkMatch);
    const listing = await fetchListing(hostawayId);
    if (!listing) return null;
    return mapHostawayToUnified(listing);`;

if (src.includes(oldBlock)) {
  src = src.replace(oldBlock, newBlock);
  fs.writeFileSync('lib/property-adapter.ts', src);
  console.log('Patched successfully');
} else {
  console.log('ERROR: target block not found');
}
