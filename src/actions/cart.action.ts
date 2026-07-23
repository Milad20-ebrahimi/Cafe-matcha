"use server";
console.log("CART ACTION FILE LOADED");

import { revalidatePath } from "next/cache";

import { getCartOwner } from "@/lib/cart-owner";

import {
  addToCart,
  updateCartItemQuantity,
} from "@/services/cart.service";

import {
  remove,
} from "@/repositories/cart-item.repository";



export async function addProductToCartAction(params: {
  productId: string;
  quantity?: number;
}) {

  console.log("SERVER ACTION RUNNING");


  const owner = await getCartOwner();


  console.log("OWNER:", owner);


  const result = await addToCart({
    owner,
    productId: params.productId,
    quantity: params.quantity ?? 1,
  });


  revalidatePath("/cart");


  return result;
}





export async function updateCartQuantityAction(
  itemId: string,
  quantity: number
) {

  await getCartOwner();


  const result =
    await updateCartItemQuantity(
      itemId,
      quantity
    );


  revalidatePath("/cart");


  return result;
}





export async function removeCartItemAction(
  itemId: string
) {

  await getCartOwner();


  const result =
    await remove(itemId);


  revalidatePath("/cart");


  return result;
}