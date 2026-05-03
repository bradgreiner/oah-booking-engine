import { getPropertyBySlug } from "@/lib/property-adapter";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const property = await getPropertyBySlug(params.slug);
  if (!property) {
    return new Response("Not found", { status: 404 });
  }

  return Response.redirect(
    new URL(`/homes/${property.stayTypePath}/${property.slug}`, request.url),
    308
  );
}
