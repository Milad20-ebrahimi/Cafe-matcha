"use client";

import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";

import {
  updateCartQuantityAction,
  removeCartItemAction,
} from "@/actions/cart.action";

import { formatToman } from "@/lib/utils";

import type { CartItemDTO } from "@/types";


type Props = {
  item: CartItemDTO;
};


export function CartItemCard({
  item,
}: Props) {


  async function increaseQuantity() {

    await updateCartQuantityAction(
      item.id,
      item.quantity + 1
    );

  }



  async function decreaseQuantity() {

    if (item.quantity <= 1) {
      return;
    }


    await updateCartQuantityAction(
      item.id,
      item.quantity - 1
    );

  }



  async function removeItem() {

    await removeCartItemAction(
      item.id
    );

  }



  return (
    <div
      className="
        flex
        items-center
        gap-4
        rounded-2xl
        border
        border-forest/10
        bg-white
        p-4
      "
    >


      {/* Image */}

      <div
        className="
          relative
          size-24
          overflow-hidden
          rounded-xl
          bg-sage/10
        "
      >

        {item.product.image ? (

          <Image
            src={item.product.image}
            alt={item.product.name}
            fill
            sizes="96px"
            className="object-cover"
          />

        ) : (

          <div
            className="
              flex
              h-full
              items-center
              justify-center
              text-xs
              text-forest/30
            "
          >
            بدون تصویر
          </div>

        )}

      </div>




      {/* Info */}

      <div
        className="
          flex
          flex-1
          flex-col
          gap-2
        "
      >

        <h3
          className="
            font-medium
            text-forest
          "
        >
          {item.product.name}
        </h3>



        <span
          className="
            font-semibold
            text-forest
          "
        >
          {formatToman(item.product.price)}
        </span>




        <div
          className="
            flex
            items-center
            gap-3
          "
        >


          <button
            onClick={decreaseQuantity}
            className="
              flex
              size-8
              items-center
              justify-center
              rounded-full
              border
              border-forest/20
              transition
              hover:bg-sage/20
            "
          >

            <Minus
              className="size-4"
            />

          </button>





          <span
            className="
              min-w-6
              text-center
              font-medium
            "
          >
            {item.quantity}
          </span>





          <button
            onClick={increaseQuantity}
            className="
              flex
              size-8
              items-center
              justify-center
              rounded-full
              border
              border-forest/20
              transition
              hover:bg-sage/20
            "
          >

            <Plus
              className="size-4"
            />

          </button>


        </div>


      </div>





      {/* Remove */}

      <button
        onClick={removeItem}
        className="
          flex
          size-10
          items-center
          justify-center
          rounded-full
          text-red-500
          transition
          hover:bg-red-50
        "
      >

        <Trash2
          className="size-5"
        />

      </button>



    </div>
  );
}