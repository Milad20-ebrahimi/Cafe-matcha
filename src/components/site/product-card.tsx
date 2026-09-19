"use client";
import Image from "next/image";
import Link from "next/link";

import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { Badge } from "@/components/ui/badge";
import { Rating } from "@/components/ui/rating";
import { formatToman } from "@/lib/utils";

import type { ProductDTO } from "@/types";


export function ProductCard({
  product,
}: {
  product: ProductDTO;
}) {

  console.log("PRODUCT CARD RENDER", product.name);


  const href =
    product.type === "menu"
      ? `/menu/${product.slug}`
      : `/shop/${product.slug}`;


  const hasDiscount =
    product.compareAtPrice &&
    product.compareAtPrice > product.price;



  return (
    <div
      className="
        focus-ring
        group
        flex
        flex-col
        overflow-hidden
        rounded-2xl
        border
        border-forest/10
        bg-white
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-amber/30
        hover:shadow-lg
        hover:shadow-forest/10
      "
    >

      {/* Image */}
      <div
        className="
          relative
          aspect-square
          w-full
          overflow-hidden
          bg-sage/10
        "
      >

        {product.images[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width:768px) 50vw, 25vw"
            className="
              object-cover
              transition-transform
              duration-500
              group-hover:scale-105
            "
          />
        ) : (
          <div
            className="
              flex
              h-full
              items-center
              justify-center
              text-forest/20
            "
          >
            بدون تصویر
          </div>
        )}



        {/* Badges */}
        <div
          className="
            absolute
            right-2.5
            top-2.5
            flex
            flex-col
            gap-1.5
          "
        >

          {product.isFeatured && (
            <Badge tone="amber">
              ویژه
            </Badge>
          )}


          {hasDiscount && (
            <Badge tone="forest">
              تخفیف
            </Badge>
          )}


          {product.stock <= 0 &&
            product.type === "shop" && (
              <Badge tone="outline">
                ناموجود
              </Badge>
            )}

        </div>



        {/* Add Cart Button */}
        <AddToCartButton
          productId={product.id}
          productName={product.name}
        />


      </div>




      {/* Content */}
      <div
        className="
          flex
          flex-1
          flex-col
          gap-1.5
          p-4
        "
      >

        <span
          className="
            text-xs
            text-forest/50
          "
        >
          {product.categoryName}
        </span>



        <Link
          href={href}
          className="
            line-clamp-1
            font-medium
            text-forest
          "
        >
          {product.name}
        </Link>



        <Rating
          value={product.rating}
        />



        <div
          className="
            mt-auto
            flex
            items-center
            gap-2
            pt-2
          "
        >

          {hasDiscount && (
            <span
              className="
                text-xs
                text-forest/40
                line-through
              "
            >
              {formatToman(
                product.compareAtPrice!
              )}
            </span>
          )}



          <span
            className="
              font-semibold
              text-forest
            "
          >
            {formatToman(product.price)}
          </span>


        </div>

      </div>


    </div>
  );
}