import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { addToCart } from "@/services/cart.service";

export async function POST(request: Request) {
  try {

    const body = await request.json();

    const cookieStore = await cookies();

    let guestId =
      cookieStore.get("guest_id")?.value;

    let shouldSetCookie = false;

    if (!guestId) {

      guestId = crypto.randomUUID();

      shouldSetCookie = true;

    }

    const item = await addToCart({
      owner: {
        type: "guest",
        guestId,
      },
      productId: body.productId,
      quantity: body.quantity ?? 1,
    });

    const response = NextResponse.json(
      {
        success: true,
        data: item,
      },
      {
        status: 200,
      }
    );

    if (shouldSetCookie) {

      response.cookies.set(
        "guest_id",
        guestId,
        {
          httpOnly: true,
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
          path: "/",
          maxAge: 60 * 60 * 24 * 30,
        }
      );

    }

    return response;

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to add item to cart",
      },
      {
        status: 500,
      }
    );

  }
}