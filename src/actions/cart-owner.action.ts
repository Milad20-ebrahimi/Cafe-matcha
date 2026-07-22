"use server";

import { cookies } from "next/headers";
import { randomUUID } from "crypto";


export async function initializeGuestCart() {

  const cookieStore = await cookies();


  const existing =
    cookieStore.get("guest_id")?.value;


  if (existing) {
    return existing;
  }


  const guestId = randomUUID();


  cookieStore.set(
    "guest_id",
    guestId,
    {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30,
    }
  );


  return guestId;
}