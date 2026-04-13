export function cleanDescription(raw: string | null): string | null {
  if (!raw) return null;

  // Sections to strip (case-insensitive, everything after the header until the next section or end)
  const stripHeaders = [
    "OTHER IMPORTANT INFO",
    "OPEN AIR HOMES HOUSE RULES",
    "CANCELLATION POLICY",
    "DRE #",
    "Home-Sharing Permit",
  ];

  let cleaned = raw;

  // Remove everything after these headers (they mark the start of boilerplate)
  for (const header of stripHeaders) {
    const regex = new RegExp(
      `\\n*${header.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}[:\\s]?[\\s\\S]*`,
      "i"
    );
    cleaned = cleaned.replace(regex, "");
  }

  // Remove individual boilerplate lines
  const boilerplatePatterns = [
    /- By booking with us, you agree to sign our Rental Agreement\..*/gi,
    /- Please note that in the State of CA.*/gi,
    /- Pets and animals are not permitted.*/gi,
    /- Please note that this is a non-smoking property.*/gi,
    /- For any items left behind after check-out.*/gi,
    /- A minimum of \$25 will be charged per lost.*/gi,
    /- Quiet hours are from.*/gi,
    /- Guests are responsible for any damage.*/gi,
    /- Please dispose of all trash.*/gi,
    /- Any unregistered guests are not allowed.*/gi,
    /- Utilities are included up to.*/gi,
    /- For stays over 30 days, we offer optional mid-stay cleanings.*/gi,
    /DRE #\d+\s*-?\s*\d*/gi,
    /HSR\d{2}[\s-]*\d+/gi,
    /At Open Air Homes, we strive to give you such a great experience.*/gi,
    /PET FEES:.*(?:\n.*)*/gi,
    /Utility Usage:.*(?:\n.*)*/gi,
  ];

  for (const pattern of boilerplatePatterns) {
    cleaned = cleaned.replace(pattern, "");
  }

  // Clean up excessive whitespace
  cleaned = cleaned
    .replace(/\n{3,}/g, "\n\n") // collapse 3+ newlines to 2
    .replace(/^\s+|\s+$/g, "") // trim
    .replace(/\n\s*-\s*\n/g, "\n"); // remove orphaned dash lines

  return cleaned.length > 20 ? cleaned : null;
}
