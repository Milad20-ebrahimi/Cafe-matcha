"use client";

console.log("PRODUCT DETAIL RENDER");

import { useMemo, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";

import {
  Minus,
  Plus,
  ShoppingBag,
  Check,
  Truck,
  ShieldCheck,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Rating } from "@/components/ui/rating";
import { Button } from "@/components/ui/button";

import { formatToman, cn } from "@/lib/utils";

import { addProductToCartAction } from "@/actions/cart.action";

import type { ProductDTO } from "@/types";


export function ProductDetail({
  product,
}: {
  product: ProductDTO;
}) {


  const [activeImage, setActiveImage] = useState(0);

  const [variantId, setVariantId] =
    useState<string | null>(
      product.variants[0]?.id ?? null
    );

  const [qty, setQty] = useState(1);

  const [justAdded, setJustAdded] =
    useState(false);



  const activeVariant =
    product.variants.find(
      (v) => v.id === variantId
    ) ?? null;



  const price =
    product.price +
    (activeVariant?.priceDiff ?? 0);



  const stock =
    activeVariant
      ? activeVariant.stock
      : product.stock;



  const images =
    product.images.length > 0
      ? product.images
      : ["/images/hero-cafe.jpg"];



  const outOfStock =
    product.type === "shop" &&
    stock <= 0;



  const compareAt = useMemo(() => {

    if (!product.compareAtPrice)
      return null;


    return (
      product.compareAtPrice +
      (activeVariant?.priceDiff ?? 0)
    );

  }, [
    product.compareAtPrice,
    activeVariant,
  ]);





  async function handleAdd() {


    if (outOfStock) {

      toast.error(
        "این محصول موقتاً ناموجود است."
      );

      return;

    }



    try {


      const result =
        await addProductToCartAction({
          productId: product.id,
          quantity: qty,
        });



      console.log(
        "DATABASE CART RESULT:",
        result
      );



      toast.success(
        `«${product.name}» به سبد خرید اضافه شد.`
      );



      setJustAdded(true);



      setTimeout(() => {

        setJustAdded(false);

      }, 1800);



    } catch(error) {


      console.error(
        "ADD TO CART ERROR:",
        error
      );


      toast.error(
        "افزودن به سبد خرید ناموفق بود."
      );


    }

  }




  return (

    <div
      className="
        grid
        grid-cols-1
        gap-10
        lg:grid-cols-2
        lg:gap-16
      "
    >


      {/* Image */}

      <div
        className="
          flex
          flex-col
          gap-3
        "
      >


        <div
          className="
            relative
            aspect-square
            overflow-hidden
            rounded-2xl
            bg-sage/10
          "
        >

          <Image
            src={images[activeImage]}
            alt={product.name}
            fill
            sizes="
              (max-width:768px)
              100vw,
              50vw
            "
            className="object-cover"
            priority
          />

        </div>



        {images.length > 1 && (

          <div
            className="
              flex
              gap-2.5
            "
          >

            {images.map((img, i) => (

              <button

                key={img + i}

                onClick={() =>
                  setActiveImage(i)
                }

                className={cn(
                  "focus-ring relative size-16 overflow-hidden rounded-xl border-2",
                  activeImage === i
                    ? "border-amber"
                    : "border-transparent"
                )}

              >

                <Image
                  src={img}
                  alt=""
                  fill
                  sizes="64px"
                  className="object-cover"
                />

              </button>

            ))}

          </div>

        )}

      </div>





      {/* Info */}

      <div>


        {product.categoryName && (

          <span
            className="
              text-xs
              font-semibold
              text-amber-dark
            "
          >

            {product.categoryName}

          </span>

        )}




        <h1
          className="
            mt-2
            font-serif
            text-3xl
            font-bold
            text-forest
          "
        >

          {product.name}

        </h1>




        <div
          className="
            mt-3
            flex
            items-center
            gap-3
          "
        >

          <Rating
            value={product.rating}
          />


          <span
            className="
              text-sm
              text-forest/50
            "
          >

            ({product.rating.toFixed(1)} از ۵)

          </span>


        </div>





        <p
          className="
            mt-4
            leading-8
            text-forest/65
          "
        >

          {product.description ||
            product.shortDescription}

        </p>





        <div
          className="
            mt-6
            flex
            items-center
            gap-3
          "
        >

          <span
            className="
              font-serif
              text-3xl
              font-bold
              text-forest
            "
          >

            {formatToman(price)}

          </span>


          {compareAt &&
            compareAt > price && (

            <span
              className="
                text-forest/40
                line-through
              "
            >

              {formatToman(compareAt)}

            </span>

          )}



          {product.type === "shop" && (

            <Badge
              tone={
                stock > 0
                  ? "sage"
                  : "outline"
              }
            >

              {stock > 0
                ? `${stock} عدد موجود`
                : "ناموجود"}

            </Badge>

          )}

        </div>





        <div
          className="
            mt-6
            flex
            items-center
            gap-4
          "
        >


          <div
            className="
              flex
              items-center
              rounded-xl
              border
              border-forest/15
            "
          >

            <button
              onClick={() =>
                setQty(
                  q => Math.max(1,q-1)
                )
              }
              className="size-11"
            >

              <Minus className="size-4"/>

            </button>



            <span
              className="
                w-10
                text-center
              "
            >

              {qty}

            </span>



            <button
              onClick={() =>
                setQty(
                  q =>
                    Math.min(
                      stock || 99,
                      q+1
                    )
                )
              }
              className="size-11"
            >

              <Plus className="size-4"/>

            </button>


          </div>





          <Button
            size="lg"
            onClick={handleAdd}
            disabled={outOfStock}
            className="flex-1"
          >

            {justAdded ? (

              <>
                <Check className="size-4"/>
                افزوده شد
              </>

            ) : (

              <>
                <ShoppingBag className="size-4"/>
                افزودن به سبد خرید
              </>

            )}

          </Button>


        </div>





        <div
          className="
            mt-8
            border-t
            border-forest/10
            pt-6
            text-sm
            text-forest/60
          "
        >

          <div
            className="
              flex
              gap-2
            "
          >

            <Truck className="size-4"/>

            ارسال سریع محصول

          </div>



          <div
            className="
              mt-3
              flex
              gap-2
            "
          >

            <ShieldCheck className="size-4"/>

            ضمانت اصالت کالا

          </div>


        </div>


      </div>


    </div>

  );
}