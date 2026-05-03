import { permanentRedirect, notFound } from "next/navigation";
import { getProperties } from "@/lib/property-adapter";

export const dynamic = "force-dynamic";

interface Props {
  params: { propertyId: string };
}

export default async function LegacyPropertyPage({ params }: Props) {
  if (!params.propertyId.startsWith("hw_")) notFound();

  const all = await getProperties();
  const property = all.find((p) => p.id === params.propertyId);
  if (!property) notFound();

  permanentRedirect(`/homes/${property.stayTypePath}/${property.slug}`);
}
