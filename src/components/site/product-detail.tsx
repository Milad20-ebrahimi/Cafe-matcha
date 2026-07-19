"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Minus, Plus, ShoppingBag, Check, Truck, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Rating } from "@/components/ui/rating";
import { Button } from "@/components/ui/button";
import { formatToman, cn } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";
import type { ProductDTO } from "@/types";

export function ProductDetail({ product }: { product: ProductDTO }) {
  const [activeImage, setActiveImage] = useState(0);
  const [variantId, setVariantId] = useState<string | null>(
    product.variants[0]?.id ?? null,
  );
  const [qty, setQty] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  const activeVariant = product.variants.find((v) => v.id === variantId) ?? null;
  const price = product.price + (activeVariant?.priceDiff ?? 0);
  const stock = activeVariant ? activeVariant.stock : product.stock;
  const images = product.images.length > 0 ? product.images : ["/images/hero-cafe.jpg"];

  const outOfStock = product.type === "shop" && stock <= 0;

  const compareAt = useMemo(() => {
    if (!product.compareAtPrice) return null;
    return product.compareAtPrice + (activeVariant?.priceDiff ?? 0);
  }, [product.compareAtPrice, activeVariant]);

  function handleAdd() {
    if (outOfStock) {
      toast.error("این محصول موقتاً ناموجود است.");
      return;
    }
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: images[0],
      price,
      variantId: activeVariant?.id ?? null,
      variantLabel: activeVariant?.label ?? null,
      quantity: qty,
      stock: stock || 999,
    });
    toast.success(`«${product.name}» به سبد خرید اضافه شد.`, {
      description: activeVariant ? `ویژگی: ${activeVariant.label} — تعداد: ${qty}` : `تعداد: ${qty}`,
    });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1800);
  }

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
      <div className="flex flex-col gap-3">
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-sage/10">
          <Image src={images[activeImage]} alt={product.name} fill className="object-cover" priority />
        </div>
        {images.length > 1 && (
          <div className="flex gap-2.5">
            {images.map((img, i) => (
              <button
                key={img + i}
                onClick={() => setActiveImage(i)}
                aria-label={`تصویر ${i + 1}`}
                className={cn(
                  "focus-ring relative size-16 shrink-0 overflow-hidden rounded-xl border-2",
                  activeImage === i ? "border-amber" : "border-transparent",
                )}
              >
                <Image src={img} alt="" fill className="object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div>
        {product.categoryName && (
          <span className="text-xs font-semibold uppercase tracking-wide text-amber-dark">
            {product.categoryName}
          </span>
        )}
        <h1 className="mt-2 font-serif text-3xl font-bold text-forest sm:text-4xl">{product.name}</h1>
        <div className="mt-3 flex items-center gap-3">
          <Rating value={product.rating} />
          <span className="text-sm text-forest/50">({product.rating.toFixed(1)} از ۵)</span>
        </div>
        <p className="mt-4 leading-8 text-forest/65">{product.description || product.shortDescription}</p>

        <div className="mt-6 flex items-center gap-3">
          <span className="font-serif text-3xl font-bold text-forest">{formatToman(price)}</span>
          {compareAt && compareAt > price && (
            <span className="text-base text-forest/40 line-through">{formatToman(compareAt)}</span>
          )}
          {product.type === "shop" && (
            <Badge tone={stock > 0 ? "sage" : "outline"}>{stock > 0 ? `${stock} عدد موجود` : "ناموجود"}</Badge>
          )}
        </div>

        {product.variants.length > 0 && (
          <div className="mt-6">
            <h3 className="mb-2.5 text-sm font-semibold text-forest">انتخاب ویژگی</h3>
            <div className="flex flex-wrap gap-2">
              {product.variants.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setVariantId(v.id)}
                  disabled={v.stock <= 0 && product.type === "shop"}
                  className={cn(
                    "focus-ring rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40",
                    variantId === v.id
                      ? "border-amber bg-amber/10 text-amber-dark"
                      : "border-forest/15 text-forest/70 hover:border-forest/30",
                  )}
                >
                  {v.label}
                  {v.priceDiff > 0 && ` (+${formatToman(v.priceDiff)})`}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 flex items-center gap-4">
          <div className="flex items-center rounded-xl border border-forest/15">
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              aria-label="کاهش تعداد"
              className="focus-ring flex size-11 items-center justify-center text-forest/70 transition-colors hover:text-amber-dark"
            >
              <Minus className="size-4" />
            </button>
            <span className="w-10 text-center text-sm font-semibold">{qty}</span>
            <button
              onClick={() => setQty((q) => Math.min(stock || 99, q + 1))}
              aria-label="افزایش تعداد"
              className="focus-ring flex size-11 items-center justify-center text-forest/70 transition-colors hover:text-amber-dark"
            >
              <Plus className="size-4" />
            </button>
          </div>
          <Button size="lg" onClick={handleAdd} disabled={outOfStock} className="flex-1">
            {justAdded ? (
              <>
                <Check className="size-4" /> افزوده شد
              </>
            ) : (
              <>
                <ShoppingBag className="size-4" />
                {outOfStock ? "ناموجود" : "افزودن به سبد خرید"}
              </>
            )}
          </Button>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-forest/10 pt-6 text-sm text-forest/60">
          <div className="flex items-center gap-2">
            <Truck className="size-4 text-amber-dark" />
            {product.type === "shop" ? "ارسال ۲ تا ۴ روز کاری به سراسر کشور" : "سرو تازه در محل کافه"}
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-4 text-amber-dark" />
            ضمانت اصالت و کیفیت کالا
          </div>
        </div>
      </div>
    </div>
  );
}
