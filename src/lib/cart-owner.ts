import { cookies } from "next/headers";
import type { CartOwner } from "@/types/cart";

export async function getCartOwner(): Promise<CartOwner | null> {
  const cookieStore = await cookies();

  const guestId = cookieStore.get("guest_id")?.value;

  if (!guestId) {
    return null;
  }

  return {
    type: "guest",
    guestId,
  };
}