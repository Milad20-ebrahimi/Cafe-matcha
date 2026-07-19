"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useTransition } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CategoryDTO } from "@/types";

export function ShopFilters({ categories }: { categories: CategoryDTO[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [q, setQ] = useState(searchParams.get("q") ?? "");
  const [, startTransition] = useTransition();
  const [mobileOpen, setMobileOpen] = useState(false);

  const activeCategory = searchParams.get("category") ?? "";
  const activeSort = searchParams.get("sort") ?? "newest";

  function updateParams(next: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(next)) {
      if (value === null || value === "") params.delete(key);
      else params.set(key, value);
    }
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  }

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    updateParams({ q });
    setMobileOpen(false);
  }

  const content = (
    <div className="flex flex-col gap-6">
      <form onSubmit={submitSearch} className="relative">
        <Search className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-forest/35" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="جستجوی محصول..."
          className="focus-ring h-11 w-full rounded-xl border border-forest/15 bg-white pe-10 ps-3.5 text-sm placeholder:text-forest/35"
        />
      </form>

      <div>
        <h4 className="mb-3 text-sm font-semibold text-forest">دسته‌بندی</h4>
        <div className="flex flex-col gap-1">
          <button
            onClick={() => updateParams({ category: null })}
            className={cn(
              "focus-ring rounded-lg px-3 py-2 text-right text-sm transition-colors",
              !activeCategory ? "bg-forest text-cream" : "text-forest/70 hover:bg-forest/5",
            )}
          >
            همه محصولات
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => updateParams({ category: cat.slug })}
              className={cn(
                "focus-ring rounded-lg px-3 py-2 text-right text-sm transition-colors",
                activeCategory === cat.slug ? "bg-forest text-cream" : "text-forest/70 hover:bg-forest/5",
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="mb-3 text-sm font-semibold text-forest">مرتب‌سازی</h4>
        <select
          value={activeSort}
          onChange={(e) => updateParams({ sort: e.target.value })}
          className="focus-ring h-11 w-full rounded-xl border border-forest/15 bg-white px-3 text-sm"
        >
          <option value="newest">جدیدترین</option>
          <option value="cheapest">ارزان‌ترین</option>
          <option value="expensive">گران‌ترین</option>
          <option value="popular">محبوب‌ترین</option>
        </select>
      </div>
    </div>
  );

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="focus-ring mb-4 flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-forest/15 text-sm font-medium text-forest lg:hidden"
      >
        <SlidersHorizontal className="size-4" />
        فیلتر و مرتب‌سازی
      </button>
      <aside className="hidden w-64 shrink-0 lg:block">{content}</aside>
      {mobileOpen && (
        <div className="fixed inset-0 z-[90] flex lg:hidden">
          <div className="absolute inset-0 bg-forest-dark/50" onClick={() => setMobileOpen(false)} />
          <div className="relative mr-auto flex h-full w-80 max-w-[85vw] flex-col gap-6 overflow-y-auto bg-cream p-5 shadow-xl animate-fade-in-up">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-forest">فیلترها</h3>
              <button onClick={() => setMobileOpen(false)} className="focus-ring rounded-lg p-1.5 hover:bg-forest/5" aria-label="بستن">
                <X className="size-5" />
              </button>
            </div>
            {content}
          </div>
        </div>
      )}
    </>
  );
}
