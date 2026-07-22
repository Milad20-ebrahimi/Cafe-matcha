import { db } from "@/db";
import { cartItems, products } from "@/db/schema";
import { eq, and } from "drizzle-orm";


// گرفتن تمام آیتم‌های یک سبد
export async function findByCartId(cartId: string) {
  return await db
    .select({
      item: cartItems,
      product: products,
    })
    .from(cartItems)
    .leftJoin(
      products,
      eq(cartItems.productId, products.id)
    )
    .where(eq(cartItems.cartId, cartId));
}


// پیدا کردن یک محصول خاص داخل سبد
export async function findItem(
  cartId: string,
  productId: string
) {
  const [item] = await db
    .select()
    .from(cartItems)
    .where(
      and(
        eq(cartItems.cartId, cartId),
        eq(cartItems.productId, productId)
      )
    );

  return item ?? null;
}


// اضافه کردن محصول به سبد
export async function create(data: {
  cartId: string;
  productId: string;
  quantity: number;
}) {
  const [item] = await db
    .insert(cartItems)
    .values(data)
    .returning();

  return item;
}


// تغییر تعداد
export async function updateQuantity(
  id: string,
  quantity: number
) {
  const [item] = await db
    .update(cartItems)
    .set({
      quantity,
      updatedAt: new Date(),
    })
    .where(eq(cartItems.id, id))
    .returning();

  return item ?? null;
}


// حذف آیتم
export async function remove(id: string) {
  const [item] = await db
    .delete(cartItems)
    .where(eq(cartItems.id, id))
    .returning();

  return item ?? null;
}
// پیدا کردن آیتم با id
export async function findById(id: string) {
  const [item] = await db
    .select()
    .from(cartItems)
    .where(eq(cartItems.id, id));

  return item ?? null;
}