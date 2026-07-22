import type { carts, cartItems, products } from "@/db/schema";


export type CartItemDTO = {
  id: string;
  productId: string;
  quantity: number;

  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    image: string | null;
  };
};


export type CartDTO = {
  id: string;
  userId: string | null;
  guestId: string | null;

  items: CartItemDTO[];

  createdAt: Date;
  updatedAt: Date;
};



export function toCartItemDTO(
  item: typeof cartItems.$inferSelect,
  product: typeof products.$inferSelect
): CartItemDTO {

  return {
    id: item.id,
    productId: item.productId,
    quantity: item.quantity,

    product: {
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: Number(product.price),
      image:
        Array.isArray(product.images) && product.images.length > 0
          ? product.images[0]
          : null,
    },
  };
}
export function toCartDTO(
  cart: typeof carts.$inferSelect,
  items: CartItemDTO[]
): CartDTO {

  return {
    id: cart.id,

    userId: cart.userId,
    guestId: cart.guestId,

    items,

    createdAt: cart.createdAt,
    updatedAt: cart.updatedAt,
  };
}