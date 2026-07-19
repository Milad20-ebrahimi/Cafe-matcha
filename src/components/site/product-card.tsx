"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Rating } from "@/components/ui/rating";
import { formatToman } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";
import type { ProductDTO } from "@/types";

export function ProductCard({ product }: { product: ProductDTO }) {
  const addItem = useCartStore((s) => s.addItem);
  const href = product.type === "menu" ? `/menu/${product.slug}` : `/shop/${product.slug}`;
  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;

  function handleQuickAdd(e: React.MouseEvent) {
    e.preventDefault();
    if (product.variants.length > 0) {
      window.location.href = href;
      return;
    }
    if (product.stock <= 0) {
      toast.error("این محصول موقتاً ناموجود است.");
      return;
    }
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: product.images[0] ?? null,
      price: product.price,
      variantId: null,
      variantLabel: null,
      quantity: 1,
      stock: product.stock,
    });
    toast.success(`«${product.name}» به سبد خرید اضافه شد.`);
  }

  return (
    <Link
      href={href}
      className="focus-ring group flex flex-col overflow-hidden rounded-2xl border border-forest/10 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-amber/30 hover:shadow-lg hover:shadow-forest/10"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-sage/10">
        {product.images[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-forest/20">بدون تصویر</div>
        )}
        <div className="absolute right-2.5 top-2.5 flex flex-col gap-1.5">
          {product.isFeatured && <Badge tone="amber">ویژه</Badge>}
          {hasDiscount && <Badge tone="forest">تخفیف</Badge>}
          {product.stock <= 0 && product.type === "shop" && <Badge tone="outline">ناموجود</Badge>}
        </div>
        <button
          onClick={handleQuickAdd}
          aria-label={`افزودن ${product.name} به سبد خرید`}
          className="focus-ring absolute bottom-2.5 left-2.5 flex size-10 items-center justify-center rounded-full bg-forest text-cream opacity-0 shadow-lg transition-all duration-300 group-hover:opacity-100 hover:bg-amber active:scale-90"
        >
          <ShoppingBag className="size-4" />
        </button>
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <span className="text-xs text-forest/50">{product.categoryName}</span>
        <h3 className="line-clamp-1 font-medium text-forest">{product.name}</h3>
        <Rating value={product.rating} />
        <div className="mt-auto flex items-center gap-2 pt-2">
          {hasDiscount && (
            <span className="text-xs text-forest/40 line-through">
              {formatToman(product.compareAtPrice!)}
            </span>
          )}
          <span className="font-semibold text-forest">{formatToman(product.price)}</span>
        </div>
      </div>
    </Link>
  );
}
