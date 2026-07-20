import { notFound } from "next/navigation";
import { Container, SectionHeading } from "@/components/ui/container";
import { ProductDetail } from "@/components/site/product-detail";
import { ProductCard } from "@/components/site/product-card";
import { findBySlug , findRelated  } from "@/repositories/product.repository";

export const dynamic = "force-dynamic";

export default async function ShopProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await findBySlug (slug);
  if (!product || product.type !== "shop") notFound();

  const related = await findRelated (product.categoryId, product.id, "shop");

  return (
    <div className="py-12 pb-24">
      <Container>
        <ProductDetail product={product} />
        {related.length > 0 && (
          <div className="mt-24">
            <SectionHeading title="محصولات مشابه" />
            <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
