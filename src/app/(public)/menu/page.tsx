import type { Metadata } from "next";
import { Container, SectionHeading } from "@/components/ui/container";
import { ProductCard } from "@/components/site/product-card";
import { EmptyState } from "@/components/ui/empty-state";
import { getCategories, getProducts } from "@/lib/queries";
import { Coffee } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "منوی کافه | کافه ماچا",
};

export default async function MenuPage() {
  const [categories, allProducts] = await Promise.all([
    getCategories("menu"),
    getProducts({ type: "menu" }),
  ]);

  return (
    <div className="pb-24">
      <section className="bg-forest py-16 text-cream">
        <Container>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-sage-light">منوی کافه</span>
          <h1 className="mt-3 font-serif text-4xl font-bold sm:text-5xl">طعم‌هایی برای هر لحظه</h1>
          <p className="mt-3 max-w-xl text-cream/70">
            منوی کامل کافه ماچا شامل نوشیدنی‌های ماچا، قهوه‌های تخصصی، دسرهای خانگی و صبحانه‌های کامل.
          </p>
        </Container>
      </section>

      <div className="sticky top-16 z-30 border-b border-forest/10 bg-cream/95 backdrop-blur-sm">
        <Container className="flex gap-2 overflow-x-auto py-3">
          {categories.map((cat) => (
            <a
              key={cat.id}
              href={`#${cat.slug}`}
              className="focus-ring shrink-0 rounded-full border border-forest/15 px-4 py-2 text-sm font-medium text-forest/70 transition-colors hover:border-amber hover:text-amber-dark"
            >
              {cat.name}
            </a>
          ))}
        </Container>
      </div>

      <Container className="mt-14 flex flex-col gap-16">
        {categories.map((cat) => {
          const items = allProducts.filter((p) => p.categoryId === cat.id);
          return (
            <section key={cat.id} id={cat.slug} className="scroll-mt-32">
              <SectionHeading title={cat.name} description={cat.description} />
              {items.length === 0 ? (
                <EmptyState
                  icon={<Coffee className="size-7" />}
                  title="آیتمی در این دسته موجود نیست"
                  description="به‌زودی آیتم‌های جدیدی به این بخش از منو اضافه می‌شود."
                />
              ) : (
                <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
                  {items.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              )}
            </section>
          );
        })}
      </Container>
    </div>
  );
}
