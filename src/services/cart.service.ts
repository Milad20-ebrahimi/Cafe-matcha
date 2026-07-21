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
  findById,
  findByCartId,
  create as createCartItem,
  updateQuantity,
  remove,
} from "@/repositories/cart-item.repository";

import {
  toCartDTO,
  toCartItemDTO,
} from "@/mappers/cart.mapper";

import type { CartOwner } from "@/types/cart";


// گرفتن یا ساخت Cart
export async function getOrCreateCart(
  owner: CartOwner
) {

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



// اضافه کردن محصول به Cart
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


  if (quantity < 1) {
    throw new Error("Invalid quantity");
  }


  const cart =
    await getOrCreateCart(owner);



  const product =
    await findProductById(productId);



  if (!product) {
    throw new Error("Product not found");
  }



  if (product.type !== "shop") {
    throw new Error(
      "Only shop products can be added to cart"
    );
  }



  if (!product.isActive) {
    throw new Error(
      "Product is not available"
    );
  }



  const existingItem =
    await findItem(
      cart.id,
      productId
    );



  if (existingItem) {

    return updateQuantity(
      existingItem.id,
      existingItem.quantity + quantity
    );

  }



  return createCartItem({
    cartId: cart.id,
    productId,
    quantity,
  });

}




// گرفتن Cart کامل
export async function getCart(
  owner: CartOwner
) {

  const cart =
    await getOrCreateCart(owner);



  const rows =
    await findByCartId(cart.id);



  const items =
    rows
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




// تغییر تعداد محصول
export async function updateCartItemQuantity(
  itemId: string,
  quantity: number
) {


  if (quantity < 1) {
    throw new Error(
      "Quantity must be at least 1"
    );
  }



  const item =
    await findById(itemId);



  if (!item) {
    throw new Error(
      "Cart item not found"
    );
  }



  return updateQuantity(
    item.id,
    quantity
  );

}





// حذف محصول از Cart
export async function removeFromCart(
  itemId: string
) {


  const item =
    await findById(itemId);



  if (!item) {
    throw new Error(
      "Cart item not found"
    );
  }



  return remove(item.id);

}