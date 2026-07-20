import type { Metadata } from "next";
import { Suspense } from "react";
import { Container } from "@/components/ui/container";
import { ProductCard } from "@/components/site/product-card";
import { ShopFilters } from "@/components/site/shop-filters";
import { EmptyState } from "@/components/ui/empty-state";
import { ProductGridSkeleton } from "@/components/ui/skeleton";
import { findAll as findProducts } from "@/repositories/product.repository";
import { findAll as findCategories } from "@/repositories/category.repository";
import { getSiteSettings } from "@/lib/settings";
import { SearchX } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "فروشگاه | کافه ماچا",
};

async function ShopResults({
  category,
  q,
  sort,
}: {
  category?: string;
  q?: string;
  sort?: string;
}) {
  let items = await findProducts ({ type: "shop", categorySlug: category });

  if (q) {
    const query = q.trim().toLowerCase();
    items = items.filter(
      (p) => p.name.toLowerCase().includes(query) || p.shortDescription.toLowerCase().includes(query),
    );
  }

  switch (sort) {
    case "cheapest":
      items = [...items].sort((a, b) => a.price - b.price);
      break;
    case "expensive":
      items = [...items].sort((a, b) => b.price - a.price);
      break;
    case "popular":
      items = [...items].sort((a, b) => b.rating - a.rating);
      break;
    default:
      break;
  }

  if (items.length === 0) {
    return (
      <EmptyState
        icon={<SearchX className="size-7" />}
        title="محصولی یافت نشد"
        description="با فیلترهای دیگری جستجو کنید یا دسته‌بندی را تغییر دهید."
      />
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3">
      {items.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string; sort?: string }>;
}) {
  const params = await searchParams;
  const categories = await findCategories("shop");

  return (
    <div className="pb-24">
      <section className="bg-forest py-16 text-cream">
        <Container>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-sage-light">فروشگاه</span>
          <h1 className="mt-3 font-serif text-4xl font-bold sm:text-5xl">محصولات کافه ماچا برای خانه شما</h1>
          <p className="mt-3 max-w-xl text-cream/70">
            پودر ماچای اصل، دانه قهوه تازه برشته و لوازم جانبی برای تجربه‌ای اصیل در منزل.
          </p>
        </Container>
      </section>

      <Container className="mt-10 flex flex-col gap-8 lg:flex-row lg:items-start">
        <ShopFilters categories={categories} />
        <div className="flex-1">
          <Suspense fallback={<ProductGridSkeleton />} key={JSON.stringify(params)}>
            <ShopResults category={params.category} q={params.q} sort={params.sort} />
          </Suspense>
        </div>
      </Container>
    </div>
  );
}
