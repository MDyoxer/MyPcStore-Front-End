import { notFound } from "next/navigation";
import ProductDetails from "@/src/components/products/ProductDetails";
import { buildApiUrl } from "@/src/utils/baseApiUrl";
import { slugify } from "@/src/utils/slugify";
import type { Products } from "@/src/actions/products/get-all-products";

async function resolveProductId(slug: string): Promise<number | null> {
  const response = await fetch(buildApiUrl("/products/findAllProducts"), {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) return null;

  const data = (await response.json()) as Products[];
  if (!Array.isArray(data)) return null;

  const product = data.find((p) => slugify(p.nombre) === slug);
  return product ? product.id : null;
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const id = await resolveProductId(slug);

  if (id === null) notFound();

  return <ProductDetails id={id} />;
}
