import { permanentRedirect, notFound } from "next/navigation";
import { getSlugForId } from "@/lib/property-adapter";

export const dynamic = "force-dynamic";

interface Props {
  params: { propertyId: string };
}

export default async function LegacyPropertyPage({ params }: Props) {
  if (!params.propertyId.startsWith("hw_")) notFound();

  const slug = await getSlugForId(params.propertyId);
  if (!slug) notFound();

  permanentRedirect(`/homes/${slug}`);
}
