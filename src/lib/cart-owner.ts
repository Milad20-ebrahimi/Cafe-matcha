import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import type { CartOwner } from "@/types/cart";


export async function getCartOwner(): Promise<CartOwner> {

  const cookieStore = await cookies();


  const guestId =
    cookieStore.get("guest_id")?.value;


  // اگر کاربر guest_id ندارد
  // برو Route ساختن سبد مهمان
  if (!guestId) {
    redirect("/api/cart/init");
  }


  return {
    type: "guest",
    guestId,
  };

}