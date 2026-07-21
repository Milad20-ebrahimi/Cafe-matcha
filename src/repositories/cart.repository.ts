import { db } from "@/db";
import { carts } from "@/db/schema";
import { eq } from "drizzle-orm";


// پیدا کردن سبد خرید کاربر لاگین شده
export async function findByUserId(userId: string) {
  const [cart] = await db
    .select()
    .from(carts)
    .where(eq(carts.userId, userId));

  return cart ?? null;
}


// پیدا کردن سبد خرید مهمان
export async function findByGuestId(guestId: string) {
  const [cart] = await db
    .select()
    .from(carts)
    .where(eq(carts.guestId, guestId));

  return cart ?? null;
}


// ساخت سبد خرید برای کاربر
export async function createUserCart(userId: string) {
  const [cart] = await db
    .insert(carts)
    .values({
      userId,
    })
    .returning();

  return cart;
}


// ساخت سبد خرید مهمان
export async function createGuestCart(guestId: string) {
  const [cart] = await db
    .insert(carts)
    .values({
      guestId,
    })
    .returning();

  return cart;
}