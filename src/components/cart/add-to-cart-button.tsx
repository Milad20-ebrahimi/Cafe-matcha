"use client";

import { ShoppingBag } from "lucide-react";


export function AddToCartButton({
  productId,
  productName,
}: {
  productId: string;
  productName: string;
}) {


  return (
    <button
      type="button"
      onClick={() => {
        console.log("REAL BUTTON CLICK", productId, productName);
      }}
      className="
        absolute
        bottom-2.5
        left-2.5
        z-[999]
        flex
        size-10
        items-center
        justify-center
        rounded-full
        bg-forest
        text-cream
      "
    >
      <ShoppingBag className="size-4" />
    </button>
  );
}