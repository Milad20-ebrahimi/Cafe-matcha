import {
  findByUserId,
  findByGuestId,
  createUserCart,
  createGuestCart,
} from "@/repositories/cart.repository";

import {
  findById as findProductById,
} from "@/repositories/product.repository";

import {
  findItem,
  create as createCartItem,
  updateQuantity,
  findByCartId,
} from "@/repositories/cart-item.repository";

import {
  toCartDTO,
  toCartItemDTO,
} from "@/mappers/cart.mapper";

import type { CartOwner } from "@/types/cart";

export async function getOrCreateCart(owner: CartOwner) {

  if (owner.type === "user") {

    const existing =
      await findByUserId(owner.userId);

    if (existing) return existing;


   return createUserCart(owner.userId);
  }


  const existing =
    await findByGuestId(owner.guestId);


  if (existing) return existing;


  return createGuestCart(owner.guestId);
}
export async function addToCart(params: {
  owner: CartOwner;
  productId: string;
  quantity: number;
}) {

  const {
    owner,
    productId,
    quantity,
  } = params;


  // 1. گرفتن یا ساخت Cart
  const cart = await getOrCreateCart(owner);


  // 2. پیدا کردن محصول
  const product = await findProductById(productId);


  if (!product) {
    throw new Error("Product not found");
  }


  // 3. فقط محصولات فروشگاه اجازه ورود به سبد دارند
  if (product.type !== "shop") {
    throw new Error(
      "Only shop products can be added to cart"
    );
  }


  // 4. بررسی فعال بودن محصول
  if (!product.isActive) {
    throw new Error(
      "Product is not available"
    );
  }


  // 5. بررسی وجود محصول در Cart
  const existingItem = await findItem(
    cart.id,
    productId
  );


  // 6. اگر وجود داشت quantity افزایش بده
  if (existingItem) {

    return updateQuantity(
      existingItem.id,
      existingItem.quantity + quantity
    );

  }


  // 7. اگر نبود آیتم جدید بساز
  return createCartItem({
    cartId: cart.id,
    productId,
    quantity,
  });

}
export async function getCart(owner: CartOwner) {

  const cart = await getOrCreateCart(owner);


  const rows = await findByCartId(cart.id);


  const items = rows
    .filter((row) => row.product)
    .map((row) =>
      toCartItemDTO(
        row.item,
        row.product!
      )
    );


  return toCartDTO(
    cart,
    items
  );
}